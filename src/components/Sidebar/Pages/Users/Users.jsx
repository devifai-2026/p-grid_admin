import React, { useState, useEffect } from "react";
import {
  FiSearch,
  FiFilter,
  FiUser,
  FiEdit2,
  FiTrash2,
  FiX,
  FiPlus,
  FiRefreshCw,
} from "react-icons/fi";
import { useUserStorage } from "../../../../helpers/useUserStorage";
import { apiCall } from "../../../../helpers/apicall/apiCall";

const Users = () => {
  const { user: currentUser } = useUserStorage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [editingId, setEditingId] = useState(null);

  // Data State
  const [users, setUsers] = useState([]);
  const [salesManagers, setSalesManagers] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    roleName: "Sales Executive",
    salesManagerId: "",
  });

  // --- Permissions Check ---
  const userRole = currentUser?.role || "";
  const isAdminOrSuperAdmin = ["Admin", "Super Admin"].includes(userRole);
  const isSalesManager = userRole === "Sales Manager";
  // Sales Executive can only view, no management actions
  const canManageUsers = isAdminOrSuperAdmin || isSalesManager;

  // --- API Calls ---

  // 1. Fetch Users
  useEffect(() => {
    const fetchUsers = () => {
      setLoading(true);
      const queryParams = [`page=${pagination.currentPage}`, `limit=10`];
      
      // Filter by role if selected
      if (selectedRole !== "All") {
        queryParams.push(`roleName=${selectedRole}`);
      }

      apiCall.get({
        route: `/admin/users?${queryParams.join("&")}`,
        onSuccess: (res) => {
          setLoading(false);
          if (res.success) {
            setUsers(res.data || []);
            if (res.pagination) {
              setPagination(res.pagination);
            }
          }
        },
        onError: (err) => {
          setLoading(false);
          console.error("Error fetching users:", err);
          // Don't alert on initial load failure to keep UI clean, just log
        },
      });
    };

    fetchUsers();
  }, [pagination.currentPage, selectedRole, refreshKey]);

  // 2. Fetch Sales Managers (Only for Admin/Super Admin when modal opens or component mounts)
  useEffect(() => {
    if (isAdminOrSuperAdmin) {
      apiCall.get({
        route: "/admin/sales-managers",
        onSuccess: (res) => {
          if (res.success) {
            // The API returns [{ value: 'uuid', label: 'Name', ... }]
            setSalesManagers(res.data || []);
          }
        },
        onError: (err) => {
          console.error("Error fetching sales managers:", err);
        },
      });
    }
  }, [isAdminOrSuperAdmin]);

  // --- Handlers ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      mobileNumber: "",
      // Sales Manager can only create Sales Executives
      roleName: isSalesManager ? "Sales Executive" : "Sales Executive",
      salesManagerId: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingId(user.userId);
    
    // Split name since backend returns full name string in list view
    const nameParts = (user.name || "").split(" ");
    const fName = nameParts[0] || "";
    const lName = nameParts.slice(1).join(" ") || "";

    setFormData({
      firstName: fName,
      lastName: lName,
      email: user.email,
      mobileNumber: user.mobileNumber,
      roleName: user.role,
      salesManagerId: user.salesManagerId || "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      apiCall.delete({
        route: `/admin/users/${userId}`,
        onSuccess: () => {
          setRefreshKey((prev) => prev + 1);
        },
        onError: (err) => {
          alert(err.message || "Failed to delete user");
        },
      });
    }
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    setActionLoading(true);

    // Validation: Admin creating Sales Exec MUST assign manager
    if (
      isAdminOrSuperAdmin &&
      formData.roleName === "Sales Executive" &&
      !formData.salesManagerId
    ) {
      alert("Please select a Sales Manager for the Sales Executive.");
      setActionLoading(false);
      return;
    }

    const payload = {
      ...formData,
    };

    if (editingId) {
      // Update User
      apiCall.put({
        route: `/admin/users/${editingId}`,
        payload,
        onSuccess: (res) => {
          setActionLoading(false);
          if (res.success) {
            setIsModalOpen(false);
            setEditingId(null);
            setRefreshKey((prev) => prev + 1);
          }
        },
        onError: (err) => {
          setActionLoading(false);
          alert(err.message || "Failed to update user");
        },
      });
    } else {
      // Create User
      // Note: Sales Manager creating Sales Exec -> backend assigns manager automatically
      apiCall.post({
        route: "/admin/users",
        payload,
        onSuccess: (res) => {
          setActionLoading(false);
          if (res.success) {
            setIsModalOpen(false);
            setRefreshKey((prev) => prev + 1);
          }
        },
        onError: (err) => {
          setActionLoading(false);
          alert(err.message || "Failed to create user");
        },
      });
    }
  };

  // --- Filtering & Helper ---

  const getStatusColor = (isActive) => {
    return isActive
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-red-100 text-red-700 border-red-200";
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
      case "Super Admin":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Sales Manager":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Sales Executive":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Frontend Search (Fallback since backend might not support full text search on this endpoint yet)
  // We filter the ALREADY FETCHED page of users. 
  // Ideally backend should handle search.
  const filteredUsers = users.filter((u) =>
    (u.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 relative animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Users</h1>
          <p className="text-slate-500 mt-1">
            Manage platform users and their roles
          </p>
        </div>
        {canManageUsers && (
          <button
            onClick={openAddModal}
            className="px-4 py-2 bg-[#EE2529] hover:bg-[#d31f23] text-white rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
          >
            <FiUser className="w-4 h-4" />
            Add New User
          </button>
        )}
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={() => setRefreshKey(prev => prev + 1)}
            className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors"
            title="Refresh List"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
          </button>
          
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 min-w-[150px]">
            <FiFilter className="text-slate-500 w-4 h-4" />
            <select
              className="bg-transparent border-none outline-none text-sm text-slate-700 w-full cursor-pointer"
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                setPagination((prev) => ({ ...prev, currentPage: 1 }));
              }}
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Sales Manager">Sales Manager</option>
              <option value="Sales Executive">Sales Executive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Created At
                </th>
                {canManageUsers && (
                  <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading && filteredUsers.length === 0 ? (
                <tr>
                   <td colSpan={canManageUsers ? 5 : 4} className="px-6 py-12 text-center">
                     <div className="flex justify-center items-center gap-2 text-slate-500">
                       <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                       Loading users...
                     </div>
                   </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.userId}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
                          {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-500">{user.email}</p>
                          <p className="text-[10px] text-slate-400">{user.mobileNumber}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleColor(
                          user.role,
                        )}`}
                      >
                        {user.role}
                      </span>
                      {user.salesManagerId && (
                         <div className="text-[10px] text-slate-400 mt-1">
                           Manager Assigned
                         </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          user.isActive,
                        )}`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                    </td>
                    {canManageUsers && (
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          {user.userId !== currentUser.userId && (
                            <button
                                onClick={() => handleDeleteUser(user.userId)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete"
                            >
                                <FiTrash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={canManageUsers ? 5 : 4}
                    className="px-6 py-12 text-center text-slate-500"
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        <FiUser className="w-6 h-6 text-slate-400" />
                      </div>
                      <p>No users found matching your criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
          <p>
            Showing Page {pagination.currentPage} of {pagination.totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!pagination.hasPrevPage}
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
            >
              Previous
            </button>
            <button 
              className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!pagination.hasNextPage}
              onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">
                {editingId ? "Edit User" : "Add New User"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
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
                  disabled={isSalesManager} // Sales Manager locked to Sales Executive
                  className={`w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm ${isSalesManager ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}`}
                >
                  <option value="Sales Executive">Sales Executive</option>
                  {isAdminOrSuperAdmin && (
                    <>
                      <option value="Sales Manager">Sales Manager</option>
                      <option value="Admin">Admin</option>
                    </>
                  )}
                </select>
              </div>

              {/* Conditional Sales Manager Field: Only for Admin creating Sales Exec */}
              {isAdminOrSuperAdmin && formData.roleName === "Sales Executive" && (
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
                      <option key={sm.value} value={sm.value}>
                        {sm.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">
                    Required: Sales Executives must report to a Sales Manager.
                  </p>
                </div>
              )}

              {/* UX Hint for Sales Managers */}
              {isSalesManager && formData.roleName === "Sales Executive" && (
                 <div className="p-3 bg-blue-50 text-blue-700 text-sm rounded-lg flex items-start gap-2">
                    <FiUser className="w-4 h-4 mt-0.5 shrink-0" />
                    <p>This Sales Executive will be automatically assigned to you.</p>
                 </div>
              )}

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 bg-[#EE2529] text-white rounded-lg font-medium hover:bg-[#d31f23] transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                >
                  {actionLoading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  {editingId ? "Update User" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
