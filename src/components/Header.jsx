import React, { useState, useRef, useEffect } from "react";
import {
  FiMenu,
  FiSearch,
  FiMoon,
  FiMaximize2,
  FiBell,
  FiSettings,
  FiUser,
  FiCalendar,
  FiHelpCircle,
  FiLock,
  FiLogOut,
} from "react-icons/fi";
import { useNavigate, Link } from "react-router-dom";
import { useAuthApi } from "../helpers/API/Auth/authAPIs";
import { apiCall } from "../helpers/apicall/apiCall";
import { useNotifications } from "../context/NotificationContext";
import Notifications from "./Notifications/Notifications";

const Header = ({ toggleSidebar, onLogout }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { notifications, setNotifications, unreadCount, deleteNotification } =
    useNotifications();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userName, setUserName] = useState("Admin");
  const [userRole, setUserRole] = useState("Staff");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const { logout } = useAuthApi();

  const fetchNotifications = async () => {
    try {
      apiCall.get({
        route: "/admin/notifications",
        params: { limit: 10 },
        onSuccess: (res) => {
          if (res.success) {
            const mapped = res.data.map((n) => ({
              id: n.id,
              title: n.notificationText.includes("property")
                ? "Property Update"
                : "Notification",
              message: n.notificationText,
              time: formatTimeAgo(n.createdAt),
              read: n.isRead,
              type: n.notificationText.toLowerCase().includes("added")
                ? "success"
                : "info",
              createdAt: n.createdAt,
            }));

            // Sync with context - only add if they don't exist yet (to respect real-time arrivals)
            setNotifications((prev) => {
              const existingIds = new Set(prev.map((p) => p.id));
              const uniqueNew = mapped.filter((m) => !existingIds.has(m.id));
              return [...prev, ...uniqueNew]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 50);
            });
          }
        },
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

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

  // Load user data and notifications
  useEffect(() => {
    fetchNotifications();

    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.name) setUserName(user.name);
        if (user.role) setUserRole(user.role);
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    setIsProfileOpen(false);
    // Call the logout API from our auth hook
    logout(onLogout);
  };

  const getInitials = (name) => {
    if (!name) return "AD";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleMarkAsRead = async (id) => {
    try {
      apiCall.patch({
        route: `/admin/notifications/${id}/read`,
        onSuccess: (res) => {
          if (res.success) {
            setNotifications((prev) =>
              prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
            );
          }
        },
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleClearAll = async () => {
    try {
      apiCall.delete({
        route: "/admin/notifications/clear-all",
        onSuccess: (res) => {
          if (res.success) {
            setNotifications([]);
          }
        },
      });
    } catch (error) {
      console.error("Error clearing all notifications:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      apiCall.delete({
        route: `/admin/notifications/${id}`,
        onSuccess: (res) => {
          if (res.success) {
            deleteNotification(id);
          }
        },
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Left Section - Menu & Search */}
        <div className="flex items-center gap-6 flex-1">
          {/* Menu Button */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-700"
          >
            <FiMenu size={24} />
          </button>

          {/* Search Bar */}
          {/* <div className="relative hidden md:block max-w-xs flex-1">
            <FiSearch
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EE2529] focus:bg-white transition"
            />
          </div> */}
        </div>

        {/* Right Section - Icons & Profile */}
        <div className="flex items-center gap-2 md:gap-6">
          {/* Dark Mode Button */}
          {/* <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-700"
            title="Toggle Dark Mode"
          >
            <FiMoon size={20} />
          </button> */}

          {/* Fullscreen Button */}
          {/* <button
            className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-700 hidden md:block"
            title="Fullscreen"
          >
            <FiMaximize2 size={20} />
          </button> */}

          {/* Notifications Button */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-700 relative"
              title="Notifications"
            >
              <FiBell size={20} />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <Notifications
                notifications={notifications}
                onClose={() => setIsNotificationsOpen(false)}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
                onClearAll={handleClearAll}
                className="right-0 mt-2 top-full"
              />
            )}
          </div>

          {/* Settings Button */}
          {/* <button
            className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-700 hidden md:block"
            title="Settings"
          >
            <FiSettings size={20} />
          </button> */}

          {/* Profile Avatar with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 hover:bg-gray-100 rounded-lg px-2 py-1 transition group"
            >
              <div className="hidden md:flex flex-col items-end mr-1">
                <span className="text-sm font-bold text-gray-800 leading-none mb-1">
                  {userName}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100 text-[#EE2529] rounded-full uppercase tracking-wider">
                  {userRole}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-[#EE2529] to-[#C73834] text-white font-bold text-sm border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                {getInitials(userName)}
              </div>
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-lg font-bold text-gray-800">
                    Welcome {userName}!
                  </p>
                </div>

                {/* Dropdown Menu Items */}
                <div className="py-1">
                  <Link
                    to="/profile"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50"
                  >
                    <FiUser className="w-5 h-5" />
                    <span>My Profile</span>
                  </Link>
                  {/* 
                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50"
                  >
                    <FiCalendar className="w-5 h-5" />
                    <span>Pricing</span>
                  </a>

                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50"
                  >
                    <FiHelpCircle className="w-5 h-5" />
                    <span>Help</span>
                  </a>

                  <a
                    href="#"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50"
                  >
                    <FiLock className="w-5 h-5" />
                    <span>Lock screen</span>
                  </a> */}

                  <div className="border-t border-gray-100 my-2"></div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50"
                  >
                    <FiLogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
