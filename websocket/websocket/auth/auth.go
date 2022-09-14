package auth

import (
	"context"
	"errors"

	"github.com/go-redis/redis/v8"
	"go.rampoo.io/websocket/entity"
)

var (
	ErrUnauthenticated = errors.New("Unauthenticated")
)

type Authentication interface {
	Attempt(ctx context.Context, wskey string) (entity.User, error)
}

type authentication struct {
	redisClient *redis.Client
}

func NewAuthentication(redisClient *redis.Client) Authentication {
	return &authentication{redisClient}
}

func (a *authentication) Attempt(ctx context.Context, wskey string) (entity.User, error) {
	var user entity.User
	err := a.redisClient.Get(ctx, wskey).Scan(&user)
	if err != nil {
		return user, ErrUnauthenticated
	}
	return user, nil
}
