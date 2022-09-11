package handler

import (
	"net/http"

	"go.rampoo.io/websocket/websocket"
)

type WebsocketHandler interface {
	ServeWS(w http.ResponseWriter, r *http.Request)
}

type websocketHandler struct {
	hub *websocket.Hub
}

func NewWSHandler(hub *websocket.Hub) WebsocketHandler {
	return &websocketHandler{hub}
}

func (h *websocketHandler) ServeWS(w http.ResponseWriter, r *http.Request) {
	websocket.ServeWs(h.hub, w, r)
}
