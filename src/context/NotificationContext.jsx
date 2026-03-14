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
import { apiCall } from "../helpers/apicall/apiCall";
import { useAuth } from "./AuthContext";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    hasNextPage: false,
  });
  const { user } = useAuth();
  const playSoundRef = useRef(null);

  const formatTimeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

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

  // Fetch initial notifications
  const fetchNotifications = useCallback(
    (page = 1) => {
      if (!user?.userId) return;

      apiCall.get({
        route: `/admin/notifications?page=${page}&limit=10`,
        onSuccess: (res) => {
          if (res.success && res.data) {
            const formattedAlerts = res.data.map((n) => ({
              id: n.id,
              propertyId: n.propertyId,
              title: n.title ?? "Notification",
              message: n.notificationText,
              time: formatTimeAgo(n.createdAt),
              read: n.isRead,
              type: "info",
              createdAt: n.createdAt,
              data: n,
            }));

            setNotifications((prev) => {
              if (page === 1) return formattedAlerts;
              // Filter out duplicates just in case
              const existingIds = new Set(prev.map((n) => n.id));
              const newOnes = formattedAlerts.filter(
                (n) => !existingIds.has(n.id),
              );
              return [...prev, ...newOnes];
            });

            if (res.pagination) {
              setPagination(res.pagination);
            }
          }
        },
        onError: (err) => console.error("Error fetching notifications:", err),
      });
    },
    [user?.userId],
  );

  const loadMore = useCallback(() => {
    if (pagination.hasNextPage) {
      fetchNotifications(pagination.currentPage + 1);
    }
  }, [fetchNotifications, pagination]);

  // Setup socket listener
  useEffect(() => {
    if (user?.userId) {
      console.log("Setting up notification socket for user:", user.userId);
      setTimeout(() => {
        fetchNotifications();
      }, 1000);
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
        pagination,
        loadMore,
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
