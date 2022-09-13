package websocket

import (
	"context"
	"log"

	"github.com/go-redis/redis/v8"
	"github.com/gobwas/ws"
	"github.com/gobwas/ws/wsutil"
)

type Hub struct {
	clients     map[*Client]bool
	redisClient *redis.Client
	epoller     *Epoll

	broadcast  chan *broadcast
	register   chan *Client
	unregister chan *Client
}

type broadcast struct {
	op  ws.OpCode
	msg []byte
}

func NewHub(redisClient *redis.Client) (*Hub, error) {
	epoller, err := NewEpoll()

	if err != nil {
		return nil, err
	}

	return &Hub{
		clients:     make(map[*Client]bool),
		redisClient: redisClient,
		epoller:     epoller,
		broadcast:   make(chan *broadcast),
		register:    make(chan *Client),
		unregister:  make(chan *Client),
	}, nil
}

func (h *Hub) Run() {
	go func() {
		ctx := context.Background()

		subscriber := h.redisClient.Subscribe(ctx, string(ChannelInboundMessage))

		for {
			msg, err := subscriber.ReceiveMessage(ctx)
			if err != nil {
				panic(err)
			}

			h.broadcast <- &broadcast{
				op:  ws.OpText,
				msg: []byte(msg.Payload),
			}
		}
	}()

	go func() {
		for {
			clients, err := h.epoller.Wait()
			if err != nil {
				log.Printf("Failed to epoll wait %v", err)
				continue
			}

			for _, client := range clients {
				if client == nil {
					break
				}

				msg, _, err := wsutil.ReadClientData(client.conn)

				if err != nil {
					h.unregister <- client
					break
				}

				h.redisClient.Publish(context.Background(), string(ChannelInboundMessage), string(msg))
			}
		}
	}()

	go func() {
		for {
			select {
			case client := <-h.register:
				err := h.epoller.Add(client)
				if err != nil {
					log.Printf("Failed to add epoller %v", err)
					break
				}

				h.clients[client] = true
			case client := <-h.unregister:
				if _, ok := h.clients[client]; ok {
					delete(h.clients, client)

					err := h.epoller.Remove(client)
					if err != nil {
						log.Printf("Failed to remove %v", err)
					}
				}
			case broadcast := <-h.broadcast:
				for client := range h.clients {
					err := wsutil.WriteServerMessage(client.conn, broadcast.op, broadcast.msg)
					if err != nil {
						h.unregister <- client
						log.Printf("Failed to write %v", err)
					}
				}
			}
		}
	}()
}
