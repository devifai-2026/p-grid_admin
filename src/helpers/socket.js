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

  socket.on("property:note_pending_approval", (data) => {
    cb({ ...data, type: "info", title: "Note Pending" });
  });

  socket.on("property:note_added", (data) => {
    cb({ ...data, type: "success", title: "Note Added" });
  });

  socket.on("property:note_approved", (data) => {
    cb({ ...data, type: "success", title: "Note Accepted" });
  });

  socket.on("property:note_denied", (data) => {
    cb({ ...data, type: "warning", title: "Note Declined" });
  });

  socket.on("property:owner_note_added", (data) => {
    cb({ ...data, type: "info", title: "Client Note" });
  });

  socket.on("property:assigned", (data) => {
    cb({ ...data, type: "success", title: "Property Assigned" });
  });

  socket.on("property:unassigned", (data) => {
    cb({ ...data, type: "warning", title: "Property Unassigned" });
  });

  socket.on("property:verified", (data) => {
    cb({ ...data, type: "success", title: "Property Verified" });
  });
};
