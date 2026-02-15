import React, { useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiUser,
  FiEdit2,
  FiTrash2,
  FiX,
  FiPlus,
} from "react-icons/fi";
import { useUserStorage } from "../../../../helpers/useUserStorage";

const Users = () => {
  const { user: currentUser } = useUserStorage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingId, setEditingId] = useState(null);

  // Form State
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "Sales Executive",
    salesManager: "", // Only required for Admin/Super Admin
  });

  // Dummy Sales Managers data
  const salesManagers = [
    { id: 101, name: "Sales Manager 1" },
    { id: 102, name: "Sales Manager 2" },
    { id: 103, name: "Sales Manager 3" },
  ];

  // Dummy Users Data
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Admin",
      salesManager: "Sales Manager 1",
      status: "Active",
      lastActive: "2 min ago",
      avatar: "https://i.pravatar.cc/150?u=1",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "Sales Executive",
      status: "Active",
      lastActive: "1 hour ago",
      avatar: "https://i.pravatar.cc/150?u=2",
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert.j@example.com",
      role: "Sales Executive",
      status: "Inactive",
      lastActive: "2 days ago",
      avatar: "https://i.pravatar.cc/150?u=3",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.d@example.com",
      role: "Sales Executive",
      status: "Active",
      lastActive: "5 mins ago",
      avatar: "https://i.pravatar.cc/150?u=4",
    },
    {
      id: 5,
      name: "Michael Wilson",
      email: "m.wilson@example.com",
      role: "Sales Executive",
      status: "Banned",
      lastActive: "1 week ago",
      avatar: "https://i.pravatar.cc/150?u=5",
    },
    {
      id: 6,
      name: "Sarah Brown",
      email: "sarah.b@example.com",
      role: "Admin",
      salesManager: "Sales Manager 2",
      status: "Active",
      lastActive: "Just now",
      avatar: "https://i.pravatar.cc/150?u=6",
    },
  ]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "All" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700 border-green-200";
      case "Inactive":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "Banned":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "Admin":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "Sales Executive":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewUser({ ...newUser, [name]: value });
  };

  const checkNeedsSalesManager = () => {
    const role = currentUser?.role || "";
    // Check if the current user is Admin or Super Admin (case insensitive check just to be safe)
    return ["Admin", "Super Admin"].includes(
      role.charAt(0).toUpperCase() + role.slice(1),
    );
  };

  const isSalesManager = () => {
    const role = currentUser?.role || "";
    return role === "Sales Manager";
  };

  const openAddModal = () => {
    setEditingId(null);
    setNewUser({
      name: "",
      email: "",
      role: "Sales Executive",
      salesManager: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingId(user.id);
    setNewUser({
      name: user.name,
      email: user.email,
      role: user.role,
      salesManager: user.salesManager || "",
    });
    setIsModalOpen(true);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();

    // Logic validation
    const needsSalesManager = checkNeedsSalesManager();
    if (needsSalesManager && !newUser.salesManager) {
      alert("Please select a Sales Manager");
      return;
    }

    if (editingId) {
      // Update existing user
      setUsers(
        users.map((u) => (u.id === editingId ? { ...u, ...newUser } : u)),
      );
    } else {
      // Add new user
      const userToAdd = {
        id: users.length + 1,
        ...newUser,
        status: "Active",
        lastActive: "Just now",
        avatar: `https://i.pravatar.cc/150?u=${users.length + 1}`,
      };
      setUsers([userToAdd, ...users]);
    }

    setNewUser({
      name: "",
      email: "",
      role: "Sales Executive",
      salesManager: "",
    });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const needsSalesManager = checkNeedsSalesManager();

  return (
    <div className="p-6 space-y-6 relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Users</h1>
          <p className="text-slate-500 mt-1">
            Manage platform users and their roles
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
        >
          <FiUser className="w-4 h-4" />
          Add New User
        </button>
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
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 min-w-[150px]">
            <FiFilter className="text-slate-500 w-4 h-4" />
            <select
              className="bg-transparent border-none outline-none text-sm text-slate-700 w-full cursor-pointer"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
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
                {["Admin", "Super Admin"].includes(currentUser?.role) && (
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Assigned To
                  </th>
                )}
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Last Active
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {user.name}
                          </p>
                          <p className="text-xs text-slate-500">{user.email}</p>
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
                    </td>
                    {["Admin", "Super Admin"].includes(currentUser?.role) && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {user.salesManager ? user.salesManager : "-"}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          user.status,
                        )}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-500">
                        {user.lastActive}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openEditModal(user)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
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

      {/* Pagination (Visual Only) */}
      <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
        <p>
          Showing {filteredUsers.length} of {users.length} users
        </p>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
            disabled
          >
            Previous
          </button>
          <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
            1
          </button>
          <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">
            2
          </button>
          <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">
            3
          </button>
          <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">
            Next
          </button>
        </div>
      </div>

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
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newUser.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={newUser.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                >
                  <option value="Sales Executive">Sales Executive</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              {needsSalesManager && (
                <div className="animate-fade-in">
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Assign Sales Manager <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="salesManager"
                    value={newUser.salesManager}
                    onChange={handleInputChange}
                    required={needsSalesManager}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
                  >
                    <option value="">Select Sales Manager</option>
                    {salesManagers.map((sm) => (
                      <option key={sm.id} value={sm.name}>
                        {sm.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-slate-500 mt-1">
                    Required for Admin/Super Admin
                  </p>
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
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors shadow-sm"
                >
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
