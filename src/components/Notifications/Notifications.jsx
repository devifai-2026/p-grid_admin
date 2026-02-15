import React from "react";
import { FiX, FiCheck, FiClock, FiTrash2 } from "react-icons/fi";

const Notifications = ({
  notifications,
  onClose,
  onMarkAsRead,
  onClearAll,
  className = "",
}) => {
  return (
    <div
      className={`absolute w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <h3 className="font-bold text-gray-800">Notifications</h3>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors px-2 py-1 rounded-md hover:bg-red-50 flex items-center gap-1"
            >
              <FiTrash2 size={12} /> Clear all
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX size={16} />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-[70vh] overflow-y-auto custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center text-gray-400">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-3">
              <FiClock size={24} className="opacity-50" />
            </div>
            <p className="text-sm">No new notifications</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none group ${
                !notification.read ? "bg-red-50/30" : ""
              }`}
            >
              {/* Icon/Avatar Placeholder */}
              <div
                className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  notification.type === "alert"
                    ? "bg-red-100 text-red-600"
                    : notification.type === "success"
                      ? "bg-green-100 text-green-600"
                      : "bg-blue-100 text-blue-600"
                }`}
              >
                {notification.icon || <FiClock size={18} />}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <p
                    className={`text-sm font-medium truncate ${
                      !notification.read ? "text-gray-900" : "text-gray-600"
                    }`}
                  >
                    {notification.title}
                  </p>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap mt-0.5">
                    {notification.time}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                  {notification.message}
                </p>
              </div>

              {/* Actions */}
              {!notification.read && (
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  className="shrink-0 p-1.5 self-center text-blue-500 hover:bg-blue-50 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                  title="Mark as read"
                >
                  <FiCheck size={14} />
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="p-2 border-t border-gray-100 bg-gray-50/50">
          <button className="w-full py-2 text-xs font-medium text-gray-600 hover:text-[#EE2529] transition-colors text-center">
            View All Notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default Notifications;
