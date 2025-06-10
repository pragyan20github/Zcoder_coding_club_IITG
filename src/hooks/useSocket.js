import { useEffect, useRef } from "react";
import io from "socket.io-client";

export const useSocket = (serverUrl = "http://localhost:3001") => {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io(serverUrl, {
      transports: ["websocket", "polling"],
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [serverUrl]);

  return socketRef.current;
};
