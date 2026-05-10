import { WEBSOCKET_URL } from "../utils/constants";
import { IWebsocketMessage } from "../utils/types";
import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";


type SocketContextType = {
  socket: WebSocket | null;
  isConnected: boolean;
  sendMessage: (payload: IWebsocketMessage) => void;
  lastMessage: IWebsocketMessage | null;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  sendMessage: () => { }, // No-op default
  lastMessage: null,
});

export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<IWebsocketMessage | null>(null);

  // Send function that checks connection before sending
  const sendMessage = useCallback((payload: IWebsocketMessage) => {
    if (!socket || socket.readyState !== WebSocket.OPEN || !isConnected) {
      console.error("Unable to send message, websocket not connected");
      return;
    }

    socket.send(JSON.stringify(payload));
    console.log("Websocket message send successfully!")
  }, [socket, isConnected]);


  // Track retry attempts and timeout
  // Equal Jitter 
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 5;
  const baseDelay = 2000; // Start with 2 second

  const connect = useCallback(() => {
    // Check if already connected or not else we have disconnect -> connect -> disconnect...
    if (isConnected) {
      return
    }
    // Clear any existing timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    console.log(`Connecting to WebSocket... (attempt ${retryCountRef.current + 1})`);

    const ws = new WebSocket(`${WEBSOCKET_URL}/ws`);

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      setSocket(ws);
      retryCountRef.current = 0; // Reset retry count on success
    };

    ws.onmessage = (event) => {
      try {
        const payload: IWebsocketMessage = JSON.parse(event.data);
        console.log("WebSocket message received:", payload);
        setLastMessage(payload);
      } catch (err) {
        console.error("Failed to parse websocket message:", err);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
      setSocket(null);

      // Attempt reconnect if not at max retries
      if (retryCountRef.current < maxRetries) {
        const base = Math.min(baseDelay * Math.pow(2, retryCountRef.current), 30000);
        const delay = (base / 2) + Math.random() * (base / 2)
        console.log(`Reconnecting in ${delay}ms...`);

        reconnectTimeoutRef.current = setTimeout(() => {
          retryCountRef.current += 1;
          connect(); // call connect again
        }, delay);
      } else {
        console.error("Max reconnection attempts reached");
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      // Error usually triggers onclose right after, so let onclose handle reconnect
    };

  }, [isConnected]);


  // Initial connection
  useEffect(() => {
    connect();

    // Cleanup on unmount
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      // Close socket if connected
      if (socket?.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [connect]);


  return (
    <SocketContext.Provider value={{ socket, isConnected, sendMessage, lastMessage }}>
      {children}
    </SocketContext.Provider>
  );
}
