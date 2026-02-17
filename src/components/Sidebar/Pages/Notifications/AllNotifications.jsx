import React, { useState } from "react";
import {
  FiBell,
  FiCheck,
  FiClock,
  FiTrash2,
  FiFilter,
  FiSearch,
  FiMoreVertical,
} from "react-icons/fi";

const AllNotifications = () => {
  const [filter, setFilter] = useState("all"); // 'all', 'unread', 'read'
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "New Inquiry Recieved",
      message: "John Doe has sent an inquiry for Property #1234.",
      time: "2 mins ago",
      read: false,
      type: "alert",
      date: "Today",
    },
    {
      id: 2,
      title: "Payment Successful",
      message: "Subscription renewal payment was successful.",
      time: "1 hour ago",
      read: false,
      type: "success",
      date: "Today",
    },
    {
      id: 3,
      title: "System Update",
      message: "System maintenance scheduled for tonight at 2 AM.",
      time: "5 hours ago",
      read: true,
      type: "info",
      date: "Today",
    },
    {
      id: 4,
      title: "New Property Listed",
      message: "A new property matching your criteria has been listed.",
      time: "Yesterday",
      read: true,
      type: "info",
      date: "Yesterday",
    },
    {
      id: 5,
      title: "Account Verified",
      message: "Your account documentation has been verified successfully.",
      time: "2 days ago",
      read: true,
      type: "success",
      date: "Earlier",
    },
  ]);

  // Filter notifications based on tab and search
  const filteredNotifications = notifications.filter((notification) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "unread"
        ? !notification.read
        : notification.read; // 'read' filter

    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const handleMarkAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleDelete = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all notifications?")) {
      setNotifications([]);
    }
  };

  const getIconColor = (type) => {
    switch (type) {
      case "alert":
        return "bg-red-100 text-red-600";
      case "success":
        return "bg-green-100 text-green-600";
      case "info":
        return "bg-blue-100 text-blue-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fade-in-up">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
            <FiBell className="text-[#EE2529]" />
            All Notifications
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Stay updated with your latest activities and alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleMarkAllRead}
            disabled={notifications.every((n) => n.read)}
            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mark all as read
          </button>
          <button
            onClick={handleClearAll}
            disabled={notifications.length === 0}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <FiTrash2 size={16} /> Clear all
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-lg w-full md:w-auto">
          {[
            { id: "all", label: "All" },
            { id: "unread", label: "Unread" },
            { id: "read", label: "Read" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all flex-1 md:flex-none ${
                filter === tab.id
                  ? "bg-white text-[#EE2529] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE2529] focus:border-transparent transaction-all"
          />
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`relative bg-white p-5 rounded-xl border transition-all duration-300 hover:shadow-md flex gap-4 ${
                !notification.read
                  ? "border-l-4 border-l-[#EE2529] border-y-gray-100 border-r-gray-100 bg-red-50/10"
                  : "border-gray-100"
              }`}
            >
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${getIconColor(
                  notification.type
                )}`}
              >
                {notification.type === "alert" ? (
                  <FiBell size={20} />
                ) : notification.type === "success" ? (
                  <FiCheck size={20} />
                ) : (
                  <FiClock size={20} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3
                    className={`text-base font-semibold ${
                      !notification.read ? "text-gray-900" : "text-gray-700"
                    }`}
                  >
                    {notification.title}
                  </h3>
                  <span className="text-xs text-gray-400 flex items-center gap-1 shrink-0 whitespace-nowrap">
                    <FiClock size={12} /> {notification.time}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-2">
                  {notification.message}
                </p>

                {/* Actions Row */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                  <span className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                    {notification.date}
                  </span>
                  <div className="flex items-center gap-3">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
                      >
                        <FiCheck size={14} /> Mark as read
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                      title="Delete notification"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBell className="text-gray-300 text-3xl" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              {searchQuery
                ? "No matching notifications found"
                : "You're all caught up!"}
            </h3>
            <p className="text-gray-500 text-sm">
              {searchQuery
                ? "Try adjusting your search or filters"
                : "New notifications will appear here when they arrive."}
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilter("all");
                }}
                className="mt-4 px-6 py-2 text-sm font-medium text-[#EE2529] bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllNotifications;
