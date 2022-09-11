import { useState } from 'react';
import Router from 'next/router';
import useRequest from '../../hooks/use-request';
import WebSocket from 'ws';

const Chat = () => {
    let wsconn;
    // still not working
    wsconn = new WebSocket("ws://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/websocket");
    
    wsconn.onclose = function (e) {
      console.log("Connection closed.");
    };
  
    wsconn.onmessage = function (e) {
      console.log('received: %s', e);
    };

    const [text, setText] = useState('');
    const [messages, setMessages] = useState([]);

    const onSubmit = async (event) =>{
      event.preventDefault();
      
      if (!wsconn) {
        return;
      }

      if (!text) {
          return;
      }

      wsconn.send(text);

      setText('');
      return;
    };

    return (
    <form onSubmit={onSubmit}>
      <h1>Chat</h1>
      <div className="form-group">
        <label>Text</label>
        <input value={text} onChange={e => setText(e.target.value)} className="form-control" />
      </div>
      <button className="btn btn-primary">Send</button>
    </form>
  );
};

export default Chat;