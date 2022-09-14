package main

import (
	"fmt"
	"log"
	"net/http"
	"syscall"

	"go.rampoo.io/websocket/handler"
	"go.rampoo.io/websocket/initializer"
	"go.rampoo.io/websocket/websocket"
)

func main() {
	// Increase resources limitations
	var rLimit syscall.Rlimit
	if err := syscall.Getrlimit(syscall.RLIMIT_NOFILE, &rLimit); err != nil {
		panic(err)
	}
	// rLimit.Max = 1000000
	rLimit.Cur = rLimit.Max
	fmt.Println(rLimit.Cur)
	if err := syscall.Setrlimit(syscall.RLIMIT_NOFILE, &rLimit); err != nil {
		panic(err)
	}

	// Enable pprof hooks
	go func() {
		if err := http.ListenAndServe("localhost:6060", nil); err != nil {
			log.Fatalf("pprof failed: %v", err)
		}
	}()

	rcl := initializer.Redis()

	hub, err := websocket.NewHub(rcl)

	if err != nil {
		log.Fatal(err)
	}

	go hub.Run()

	wshandler := handler.NewWSHandler(hub)

	http.HandleFunc("/api/websocket", wshandler.ServeWS)

	log.Println("http server started on :8080")

	err = http.ListenAndServe("0.0.0.0:8080", nil)
	if err != nil {
		log.Fatal("ListenAndServe: ", err)
	}
}
