package websocket

import (
	"context"

	"github.com/go-redis/redis/v8"
)

type Hub struct {
	// Registered clients.
	clients map[*Client]bool

	// Redis client
	rcl *redis.Client

	// Inbound messages from the clients.
	broadcast chan []byte

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client
}

func NewHub(rcl *redis.Client) *Hub {
	return &Hub{
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
		rcl:        rcl,
	}
}

func (h *Hub) Run() {
	subscriber := h.rcl.Subscribe(context.TODO(), "read-message")
	go func() {
		for {
			msg, err := subscriber.ReceiveMessage(context.TODO())
			if err != nil {
				panic(err)
			}
			h.broadcast <- []byte(msg.Payload)
		}
	}()

	go func() {
		for {
			select {
			case client := <-h.register:
				h.clients[client] = true
			case client := <-h.unregister:
				if _, ok := h.clients[client]; ok {
					delete(h.clients, client)
					close(client.send)
				}
			case message := <-h.broadcast:
				for client := range h.clients {
					select {
					case client.send <- message:
					default:
						close(client.send)
						delete(h.clients, client)
					}
				}
			}
		}
	}()
}
