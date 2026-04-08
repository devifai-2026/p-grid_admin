import { useNavigate } from "react-router-dom";
import {
  FiX,
  FiCheck,
  FiClock,
  FiTrash2,
  FiPlusCircle,
  FiEdit,
  FiUserPlus,
  FiFileText,
  FiCheckCircle,
  FiXCircle,
  FiMessageSquare,
  FiBell,
} from "react-icons/fi";

const Notifications = ({
  notifications,
  onClose,
  onMarkAsRead,
  onDelete,
  onClearAll,
  pagination,
  onLoadMore,
  className = "",
}) => {
  const navigate = useNavigate();

  const getNotificationIcon = (title) => {
    const t = title?.toLowerCase() || "";
    if (t.includes("created") || t.includes("new property") || t.includes("registered") || t.includes("registration"))
      return <FiPlusCircle size={20} />;
    if (t.includes("updated")) return <FiEdit size={18} />;
    if (t.includes("assigned")) return <FiUserPlus size={18} />;
    if (t.includes("note pending")) return <FiFileText size={18} />;
    if (t.includes("note added") || t.includes("client note"))
      return <FiMessageSquare size={18} />;
    if (t.includes("note accepted") || t.includes("verified"))
      return <FiCheckCircle size={18} />;
    if (t.includes("note declined") || t.includes("unassigned"))
      return <FiXCircle size={18} />;
    if (t.includes("new broker"))
      return <FiUserPlus size={18} />;
    return <FiBell size={18} />;
  };

  const getIconColor = (title, type) => {
    const t = title?.toLowerCase() || "";
    if (t.includes("declined") || t.includes("unassigned"))
      return "bg-red-100 text-red-600";
    if (t.includes("accepted") || t.includes("verified") || t.includes("success"))
      return "bg-green-100 text-green-600";
    if (t.includes("pending")) return "bg-yellow-100 text-yellow-600";
    if (t.includes("updated")) return "bg-blue-100 text-blue-600";
    if (t.includes("created") || t.includes("assigned") || t.includes("new broker"))
      return "bg-indigo-100 text-indigo-600";
    return "bg-gray-100 text-gray-600";
  };
  return (
    <div
      className={`absolute w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-fade-in-down ${className}`}
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
          <>
            {notifications.map((notification) => {
              const propId =
                notification.data?.propertyId || notification.propertyId;
              return (
                <div
                  key={notification.id}
                  onClick={() => {
                    if (propId) {
                      navigate(`/property/property-details/${propId}`);
                      onClose();
                    }
                  }}
                  className={`flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-none group ${
                    propId ? "cursor-pointer" : ""
                  } ${!notification.read ? "bg-red-50/30" : ""}`}
                >
                  {/* Icon Container */}
                  <div
                    className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${getIconColor(
                      notification.title,
                      notification.type
                    )}`}
                  >
                    {getNotificationIcon(notification.title)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 text-left">
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
                    <div className="mt-1 space-y-1.5">
                      {notification.message.includes("\n") ? (
                        <>
                          <p className="text-[11px] font-bold text-gray-800 leading-snug">
                            {notification.message.split("\n")[0]}
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {notification.message
                              .split("\n")
                              .slice(1, 4)
                              .map((line, idx) => {
                                const parts = line.split(":");
                                if (parts.length < 2) return null;
                                const label = parts[0].replace("•", "").trim();
                                return (
                                  <div
                                    key={idx}
                                    className="px-2 py-0.5 bg-gray-50 border border-gray-100 rounded-md flex items-center gap-1"
                                  >
                                    <span className="text-[9px] text-[#EE2529] font-bold">
                                      {label}
                                    </span>
                                  </div>
                                );
                              })}
                            {notification.message.split("\n").length > 4 && (
                              <span className="text-[9px] text-gray-400 font-bold self-center">
                                +{notification.message.split("\n").length - 4}{" "}
                                more
                              </span>
                            )}
                          </div>
                        </>
                      ) : (
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                          {notification.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="shrink-0 flex items-center gap-1 self-center opacity-0 group-hover:opacity-100 transition-all">
                    {!notification.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onMarkAsRead(notification.id);
                        }}
                        className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-full"
                        title="Mark as read"
                      >
                        <FiCheck size={14} />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(notification.id);
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                      title="Delete"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
            {pagination?.hasNextPage && (
              <div className="p-3 text-center border-t border-gray-50 bg-gray-50/20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onLoadMore();
                  }}
                  className="text-xs font-bold text-[#EE2529] hover:text-[#C73834] transition-colors flex items-center justify-center gap-2 mx-auto py-1 px-4 rounded-full border border-red-100 hover:bg-red-50"
                >
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-gray-100 bg-gray-50/50">
        <button
          onClick={() => {
            onClose();
            navigate("/notifications");
          }}
          className="w-full py-2 text-xs font-medium text-gray-600 hover:text-[#EE2529] transition-colors text-center"
        >
          View All Notifications
        </button>
      </div>
    </div>
  );
};

export default Notifications;
