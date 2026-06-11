import { io } from "socket.io-client";
import { BASE_URL } from "../environments";

// Remove /api/v1 from BASE_URL to get the root server URL
const SOCKET_URL = BASE_URL.replace("/api/v1", "");

let socket;

// Read the user's access token from localStorage so the socket handshake
// can authenticate (backend now requires an auth token after the IDOR fix).
const getAccessToken = () => {
  try {
    const stored = JSON.parse(localStorage.getItem("user"));
    return stored?.accessToken || stored?.token || localStorage.getItem("accessToken") || null;
  } catch {
    return localStorage.getItem("accessToken") || null;
  }
};

export const initiateSocketConnection = (userId) => {
  if (socket) return socket;

  const token = getAccessToken();

  socket = io(SOCKET_URL, {
    transports: ["websocket", "polling"],
    withCredentials: true,
    auth: { token },
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

// Map of notification socket events to their toast metadata.
const NOTIFICATION_EVENTS = [
  ["property:created", { type: "success", title: "New Property" }],
  ["inquiry:received", { type: "info", title: "New Inquiry" }],
  ["inquiry:assigned", { type: "success", title: "Inquiry Assigned" }],
  ["property:note_pending_approval", { type: "info", title: "Note Pending" }],
  ["property:note_added", { type: "success", title: "Note Added" }],
  ["property:note_approved", { type: "success", title: "Note Accepted" }],
  ["property:note_denied", { type: "warning", title: "Note Declined" }],
  ["property:owner_note_added", { type: "info", title: "Client Note" }],
  ["property:assigned", { type: "success", title: "Property Assigned" }],
  ["property:unassigned", { type: "warning", title: "Property Unassigned" }],
  ["property:updated", { type: "info", title: "Property Updated" }],
  ["property:verified", { type: "success", title: "Property Verified" }],
  ["broker:registered", { type: "success", title: "New Broker" }],
];

export const subscribeToNotifications = (cb) => {
  if (!socket) return;

  // Remove any existing listeners first so re-running this never stacks duplicates.
  unsubscribeFromNotifications();

  NOTIFICATION_EVENTS.forEach(([event, meta]) => {
    socket.on(event, (data) => {
      cb({ ...data, ...meta });
    });
  });
};

export const unsubscribeFromNotifications = () => {
  if (!socket) return;
  NOTIFICATION_EVENTS.forEach(([event]) => {
    socket.off(event);
  });
};
