package initializer

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/go-redis/redis/v8"
)

func Redis() *redis.Client {
	addr := os.Getenv("REDIS_ADDR")

	if addr == "" {
		addr = fmt.Sprintf("%v:%v", "localhost", "6379")
	}

	opts := &redis.Options{
		Addr: addr,
	}
	client := redis.NewClient(opts)

	err := client.Ping(context.TODO()).Err()
	if err != nil {
		log.Fatalf("redis error: %s", err)
	}
	return client
}
