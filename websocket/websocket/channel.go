package websocket

type Channel string

const (
	ChannelInboundMessage Channel = "inbound-message"
	ChannelChatMessage            = "chat-message"
)
