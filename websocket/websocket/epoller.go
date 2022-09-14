package websocket

import (
	"log"
	"net"
	"reflect"
	"sync"
	"syscall"

	"golang.org/x/sys/unix"
)

type Epoll struct {
	fd      int
	clients map[int]*Client
	lock    *sync.RWMutex
}

func NewEpoll() (*Epoll, error) {
	fd, err := unix.EpollCreate1(0)
	if err != nil {
		return nil, err
	}
	return &Epoll{
		fd:      fd,
		lock:    &sync.RWMutex{},
		clients: make(map[int]*Client),
	}, nil
}

func (e *Epoll) Add(client *Client) error {
	// Extract file descriptor associated with the connection
	fd := websocketFD(client.conn)
	err := unix.EpollCtl(e.fd, syscall.EPOLL_CTL_ADD, fd, &unix.EpollEvent{Events: unix.POLLIN | unix.POLLHUP, Fd: int32(fd)})
	if err != nil {
		client.conn.Close()
		return err
	}

	e.lock.Lock()
	defer e.lock.Unlock()

	e.clients[fd] = client

	log.Printf("Total number of clients: %v", len(e.clients))

	return nil
}

func (e *Epoll) Remove(client *Client) error {
	fd := websocketFD(client.conn)

	err := unix.EpollCtl(e.fd, syscall.EPOLL_CTL_DEL, fd, nil)
	if err != nil {
		client.conn.Close()
		return err
	}

	e.lock.Lock()
	defer e.lock.Unlock()

	delete(e.clients, fd)

	log.Printf("Total number of clients: %v", len(e.clients))

	return nil
}

func (e *Epoll) Wait() ([]*Client, error) {
	events := make([]unix.EpollEvent, 100)

	n, err := unix.EpollWait(e.fd, events, 100)
	if err != nil && err != unix.EINTR {
		return nil, err
	}

	e.lock.RLock()
	defer e.lock.RUnlock()

	var clients []*Client
	for i := 0; i < n; i++ {
		client := e.clients[int(events[i].Fd)]
		clients = append(clients, client)
	}
	return clients, nil
}

func websocketFD(conn net.Conn) int {
	tcpConn := reflect.Indirect(reflect.ValueOf(conn)).FieldByName("conn")
	fdVal := tcpConn.FieldByName("fd")
	pfdVal := reflect.Indirect(fdVal).FieldByName("pfd")

	return int(pfdVal.FieldByName("Sysfd").Int())
}
