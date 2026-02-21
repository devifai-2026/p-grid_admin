import { io } from "socket.io-client";
import { BASE_URL } from "../environments";

// Remove /api/v1 from BASE_URL to get the root server URL
const SOCKET_URL = BASE_URL.replace("/api/v1", "");

let socket;

export const initiateSocketConnection = (userId) => {
  if (socket) return socket;
  
  socket = io(SOCKET_URL, {
    transports: ["websocket", "polling"],
    withCredentials: true,
    query: { userId }
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  console.log("Initiating socket connection to:", SOCKET_URL, "for user:", userId);
  return socket;
};

export const disconnectSocket = () => {
  console.log("Disconnecting socket...");
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

export const subscribeToNotifications = (cb) => {
  if (!socket) return;
  
  // Listen for various property and inquiry events
  socket.on("property:created", (data) => {
    cb({ ...data, type: "success", title: "New Property" });
  });

  socket.on("inquiry:received", (data) => {
    cb({ ...data, type: "info", title: "New Inquiry" });
  });
  
  socket.on("inquiry:assigned", (data) => {
    cb({ ...data, type: "success", title: "Inquiry Assigned" });
  });
};
