import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  initiateSocketConnection,
  disconnectSocket,
  subscribeToNotifications,
} from "../helpers/socket";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();
  const playSoundRef = useRef(null);

  useEffect(() => {
    playSoundRef.current = () => {
      try {
        const audio = new Audio(
          "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
        );
        audio.play();
      } catch (e) {
        console.error("Audio play failed:", e);
      }
    };
  }, []);

  const addNotification = useCallback((newNotif) => {
    if (playSoundRef.current) playSoundRef.current();

    setNotifications((prev) =>
      [
        {
          id: Date.now(),
          title: newNotif.title,
          message: newNotif.message,
          time: "just now",
          read: false,
          type: newNotif.type || "info",
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ].slice(0, 50),
    );
  }, []);

  useEffect(() => {
    setUnreadCount(notifications.filter((n) => !n.read).length);
  }, [notifications]);

  // Setup socket listener
  useEffect(() => {
    if (user?.userId) {
      console.log("Setting up notification socket for user:", user.userId);
      initiateSocketConnection(user.userId);
      subscribeToNotifications(addNotification);
    } else {
      // If user logs out or userId becomes null, disconnect the socket
      disconnectSocket();
    }

    return () => {
      // Disconnect if the provider unmounts or user logs out
      disconnectSocket();
    };
  }, [user?.userId, addNotification]);

  const deleteNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications,
        unreadCount,
        addNotification,
        deleteNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
};
