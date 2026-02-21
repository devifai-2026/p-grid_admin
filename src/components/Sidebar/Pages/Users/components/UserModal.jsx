import React from "react";
import { FiX, FiUser } from "react-icons/fi";

const UserModal = ({
  isOpen,
  onClose,
  editingId,
  formData,
  handleInputChange,
  handleSaveUser,
  actionLoading,
  isAdminOrSuperAdmin,
  isSalesManager,
  salesManagers,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-800">
            {editingId ? "Edit User" : "Add New User"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-red-500 transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSaveUser} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
              placeholder="john.doe@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mobile Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              required
              maxLength={10}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
              placeholder="9876543210"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              name="roleName"
              value={formData.roleName}
              onChange={handleInputChange}
              disabled={!!editingId} // Locked for Sales Manager OR if editing existing user
              className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm ${isSalesManager || !!editingId ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
            >
              <option value="Admin">Admin</option>
              <option value="Sales Manager">Sales Manager</option>
              <option value="Sales Executive - Client Dealer">
                Sales Executive(Client Dealer)
              </option>
              <option value="Sales Executive - Property Manager">
                Sales Executive(Property Manager)
              </option>
            </select>
            {editingId && (
              <p className="text-[10px] text-slate-400 mt-1">
                Role cannot be changed after creation.
              </p>
            )}
          </div>

          {/* Conditional Sales Manager Field: Only for Admin creating/editing Sales Exec */}
          {isAdminOrSuperAdmin &&
            formData.roleName.startsWith("Sales Executive") && (
              <div className="animate-fade-in">
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Assign Sales Manager <span className="text-red-500">*</span>
                </label>
                <select
                  name="salesManagerId"
                  value={formData.salesManagerId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                >
                  <option value="">Select Sales Manager</option>
                  {salesManagers.map((sm) => (
                    <option
                      key={
                        sm.value ||
                        sm.userId ||
                        sm.user_id ||
                        sm.id ||
                        Math.random()
                      }
                      value={sm.value || sm.userId || sm.user_id || sm.id || ""}
                    >
                      {sm.label ||
                        sm.name ||
                        `${sm.firstName || ""} ${sm.lastName || ""}`.trim() ||
                        "Manager"}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">
                  Required: Sales Executives must report to a Sales Manager.
                </p>
              </div>
            )}

          {/* UX Hint for Sales Managers */}
          {isSalesManager &&
            formData.roleName.startsWith("Sales Executive") && (
              <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded-lg flex items-start gap-2">
                <FiUser className="w-4 h-4 mt-0.5 shrink-0" />
                <p>
                  This Sales Executive will be automatically assigned to you.
                </p>
              </div>
            )}

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="flex-1 px-4 py-2 bg-[#EE2529] text-white rounded-lg font-medium hover:bg-[#d31f23] transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {actionLoading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {editingId ? "Update User" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
