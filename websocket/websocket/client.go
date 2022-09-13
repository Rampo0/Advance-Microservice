package websocket

import (
	"log"
	"net"
	"net/http"

	"github.com/gobwas/ws"
)

type Client struct {
	hub *Hub

	conn net.Conn
}

func ServeWs(hub *Hub, w http.ResponseWriter, r *http.Request) {
	conn, _, _, err := ws.UpgradeHTTP(r, w)
	if err != nil {
		log.Println(err)
		return
	}

	client := &Client{hub: hub, conn: conn}
	client.hub.register <- client
}
