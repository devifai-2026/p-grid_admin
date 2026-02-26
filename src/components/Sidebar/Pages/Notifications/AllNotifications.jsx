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
import { useNavigate } from "react-router-dom";
import { apiCall } from "../../../../helpers/apicall/apiCall";
import { confirmAction } from "../../../../helpers/swalHelper";
import { useNotifications } from "../../../../context/NotificationContext";


const AllNotifications = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all"); // 'all', 'unread', 'read'
  const [searchQuery, setSearchQuery] = useState("");
  const {
    notifications,
    setNotifications,
    deleteNotification,
    pagination,
    loadMore,
  } = useNotifications();
  const [loading, setLoading] = useState(false);

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

  // Filter notifications based on tab and search
  const filteredNotifications = notifications.filter((notification) => {
    const matchesFilter =
      filter === "all"
        ? true
        : filter === "unread"
          ? !notification.read
          : notification.read;

    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

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

  const handleMarkAllRead = async () => {
    try {
      apiCall.patch({
        route: "/admin/notifications/read-all",
        onSuccess: (res) => {
          if (res.success) {
            setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
          }
        },
      });
    } catch (error) {
      console.error("Error marking all read:", error);
    }
  };

  const handleClearAll = async () => {
    const isConfirmed = await confirmAction(
      "Clear All Notifications?",
      "Are you sure you want to clear all notifications?",
      "Yes, clear all!"
    );
    if (isConfirmed) {
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
        console.error("Error clearing notifications:", error);
      }
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
    <div className="p-0 sm:p-4 max-w-6xl mx-auto space-y-4 animate-fade-in-up h-full pb-10">
      {/* Header Section */}
      <div className="bg-white p-4 sm:p-6 sm:rounded-2xl border-b sm:border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <FiBell className="text-[#EE2529]" size={20} />
            </div>
            Notifications
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">
            Browse and manage your latest activity updates.
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleMarkAllRead}
            disabled={notifications.every((n) => n.read)}
            className="flex-1 sm:flex-none px-4 py-2 text-xs sm:text-sm font-semibold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-all disabled:opacity-40"
          >
            Mark all read
          </button>
          <button
            onClick={handleClearAll}
            disabled={notifications.length === 0}
            className="flex-1 sm:flex-none px-4 py-2 text-xs sm:text-sm font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
          >
            <FiTrash2 size={14} /> Clear list
          </button>
        </div>
      </div>

      {/* Filters & Search - Sticky for better UX */}
      <div className="sticky top-0 z-10 bg-gray-50/80 backdrop-blur-md py-2 px-4 sm:px-0">
        <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3">
          {/* Tabs */}
          <div className="flex bg-gray-50 p-1 rounded-xl w-full sm:w-auto">
            {[
              { id: "all", label: "All" },
              { id: "unread", label: "Unread" },
              { id: "read", label: "Read" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex-1 sm:flex-none ${
                  filter === tab.id
                    ? "bg-white text-[#EE2529] shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Filter by content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#EE2529]/20 focus:bg-white transition-all outline-none"
            />
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="px-4 sm:px-0 space-y-3">
        {filteredNotifications.length > 0 ? (
          <>
            {filteredNotifications.map((notification) => {
              const propId =
                notification.data?.propertyId || notification.propertyId;
              return (
                <div
                  key={notification.id}
                  onClick={() => {
                    if (propId) {
                      navigate(`/property/property-details/${propId}`);
                    }
                  }}
                  className={`group relative bg-white p-4 sm:p-5 rounded-2xl border transition-all duration-300 hover:shadow-lg hover:border-red-100 flex gap-4 ${
                    propId ? "cursor-pointer" : ""
                  } ${
                    !notification.read
                      ? "border-l-4 border-l-[#EE2529] border-y-gray-50 border-r-gray-50"
                      : "border-gray-100 opacity-80"
                  }`}
                >
                  {/* Unread Indicator Dot */}
                  {!notification.read && (
                    <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-[#EE2529] rounded-full animate-pulse shadow-sm shadow-red-200" />
                  )}

                  {/* Icon Container */}
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${getIconColor(
                      notification.type,
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

                  {/* Content Area */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3
                        className={`text-sm sm:text-base font-bold truncate leading-none ${
                          !notification.read ? "text-gray-900" : "text-gray-600"
                        }`}
                      >
                        {notification.title}
                      </h3>
                    </div>

                    <p className="text-gray-500 text-xs sm:text-sm mt-1.5 line-clamp-2 leading-relaxed font-medium">
                      {notification.message}
                    </p>

                    {/* Status & Actions */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3 text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1">
                          <FiClock size={12} />{" "}
                          {formatTimeAgo(notification.createdAt)}
                        </span>
                        {notification.time && <span>•</span>}
                        <span>{notification.date}</span>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!notification.read && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkAsRead(notification.id);
                            }}
                            className="px-3 py-1.5 text-[10px] font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
                          >
                            Read
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification.id);
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Remove"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {pagination?.hasNextPage && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={loadMore}
                  className="px-8 py-3 bg-white border border-red-100 text-[#EE2529] font-bold rounded-xl hover:bg-red-50 hover:shadow-md transition-all flex items-center gap-2 group"
                >
                  Load More
                  <FiClock className="group-hover:rotate-12 transition-transform" />
                </button>
              </div>
            )}
          </>
        ) : (
          /* Enhanced Empty State */
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiBell className="text-gray-200 text-4xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {searchQuery ? "No results found" : "Peace and quiet!"}
            </h3>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">
              {searchQuery
                ? "Try searching for something else or clearing your filters."
                : "Your notification inbox is currently empty. We'll let you know when something happens."}
            </p>
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilter("all");
                }}
                className="mt-6 px-8 py-3 text-sm font-bold text-[#EE2529] bg-red-50 rounded-xl hover:bg-red-100 transition-all"
              >
                Reset Search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AllNotifications;
