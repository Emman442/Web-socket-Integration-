import { logout, setOnlineUser, setUser } from "../redux/userSlice";

import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
} from "react";
import { useDispatch } from "react-redux";

import io from "socket.io-client";

export const SocketContext = createContext();

export const SocketProvider = ({ children}) => {
  const dispatch = useDispatch()
  const [isConnected, setConnected] = useState(false);

  const socketUrl = import.meta.env.VITE_SOCKET;

  const socket = useRef(null);

  useEffect(() => {
    if (!isConnected) {
      socket.current = io(socketUrl, {
        transports: ["websocket"],
        auth: {
          token: localStorage.getItem("token"),
        },
        withCredentials: true,
      });


      socket.current.on("error", (err) => {
        console.log("Socket Error:", err.message);
      });
    }

    return () => {
      if (socket.current && socket.current.connected) {
        socket.current.disconnect();
      }
    };
  }, [isConnected, socketUrl]);

  return (
  <SocketContext.Provider value={{socket: socket}}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
