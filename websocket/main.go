package main

import (
	"log"
	"net/http"

	"go.rampoo.io/websocket/handler"
	"go.rampoo.io/websocket/initializer"
	"go.rampoo.io/websocket/websocket"
)

func main() {
	rcl := initializer.Redis()

	hub := websocket.NewHub(rcl)
	go hub.Run()

	wshandler := handler.NewWSHandler(hub)

	http.HandleFunc("/api/websocket", wshandler.ServeWS)

	log.Println("http server started on :8080")

	err := http.ListenAndServe(":8080", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
