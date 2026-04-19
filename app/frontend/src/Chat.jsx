import { useEffect, useState, useRef } from "react";
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState("");
  const clientRef = useRef(null);
  const knownMessageIdsRef = useRef(new Set());

  const generateClientMessageId = () =>
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const addMessageIfNew = (message) => {
    const messageId = message.clientMessageId;

    if (messageId && knownMessageIdsRef.current.has(messageId)) {
      return;
    }

    if (messageId) {
      knownMessageIdsRef.current.add(messageId);
    }

    setMessages((prev) => [...prev, message]);
  };

  useEffect(() => {
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      reconnectDelay: 5000,
      splitLargeFrames: true,
      maxWebSocketChunkSize: 8 * 1024,

      onConnect: () => {
        console.log("Connected ✅");

        client.subscribe("/topic/messages", (msg) => {
          const data = JSON.parse(msg.body);
          addMessageIfNew(data);
        });
      },

      onStompError: (frame) => {
        console.error("STOMP error:", frame);
        alert("Failed to deliver message. Please try a smaller media file.");
      },

      onWebSocketClose: () => {
        console.warn("WebSocket disconnected");
      },
    });

    client.activate();
    clientRef.current = client;

    return () => client.deactivate();
  }, []);

  const publishMessage = (payload) => {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      alert("Enter username first");
      return false;
    }

    if (!clientRef.current || !clientRef.current.connected) {
      alert("Chat is not connected yet. Please wait a moment and try again.");
      return false;
    }

    const clientMessageId = generateClientMessageId();
    const message = {
      sender: trimmedUsername,
      clientMessageId,
      ...payload,
    };

    addMessageIfNew(message);

    try {
      clientRef.current.publish({
        destination: "/app/chat",
        body: JSON.stringify(message),
      });
      return true;
    } catch (error) {
      console.error(error);
      knownMessageIdsRef.current.delete(clientMessageId);
      setMessages((prev) =>
        prev.filter((item) => item.clientMessageId !== clientMessageId)
      );
      alert("Could not send message. Please try again.");
      return false;
    }
  };

  const sendTextMessage = (text) => {
    const trimmedText = text.trim();
    if (!trimmedText) {
      return false;
    }

    return publishMessage({
      type: "TEXT",
      content: trimmedText,
    });
  };

  const sendImageMessage = (mediaData, mediaMimeType) => {
    if (!mediaData || !mediaMimeType) {
      return false;
    }

    return publishMessage({
      type: "IMAGE",
      content: "",
      mediaData,
      mediaMimeType,
    });
  };

  const sendVoiceMessage = (mediaData, mediaMimeType) => {
    if (!mediaData || !mediaMimeType) {
      return false;
    }

    return publishMessage({
      type: "VOICE",
      content: "",
      mediaData,
      mediaMimeType,
    });
  };

  return (
    <div className="chat-box">
      <input
        className="username"
        placeholder="Enter name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <MessageList messages={messages} />
      <MessageInput
        sendTextMessage={sendTextMessage}
        sendImageMessage={sendImageMessage}
        sendVoiceMessage={sendVoiceMessage}
      />
    </div>
  );
}

export default Chat;
