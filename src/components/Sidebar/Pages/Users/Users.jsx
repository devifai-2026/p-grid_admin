import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useUserStorage } from "../../../../helpers/useUserStorage";
import { apiCall } from "../../../../helpers/apicall/apiCall";
import { showWarning, showError, confirmAction } from "../../../../helpers/swalHelper";


// Sub-components
import UserHeader from "./components/UserHeader";
import UserFilters from "./components/UserFilters";
import UserTable from "./components/UserTable";
import UserModal from "./components/UserModal";

const Users = () => {
  const location = useLocation();
  const { user: currentUser } = useUserStorage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");

  // Handle pre-selected role from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const roleParam = params.get("roleName");
    if (roleParam) {
      setSelectedRole(roleParam);
      // Reset to page 1 when role changes via URL
      setPagination((prev) => ({ ...prev, currentPage: 1 }));
    }
  }, [location.search]);
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
    roleName: "Sales Executive - Client Dealer",
    salesManagerId: "",
  });

  // --- Permissions Check ---
  const userRole = currentUser?.role || "";
  const isAdminOrSuperAdmin = ["Admin", "Super Admin"].includes(userRole);
  const isSalesManager = userRole === "Sales Manager";
  const canManageUsers = isAdminOrSuperAdmin || isSalesManager;

  // --- API Calls ---

  // 1. Fetch Users
  const fetchUsers = useCallback(() => {
    setLoading(true);
    const params = {
      page: pagination.currentPage,
      limit: 10,
    };

    // Filter by role if selected
    if (selectedRole !== "All") {
      params.roleName = selectedRole;
    }

    apiCall.get({
      route: "/admin/users",
      params,
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
      },
    });
  }, [pagination.currentPage, selectedRole]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchUsers, refreshKey]);

  // 2. Fetch Sales Managers
  useEffect(() => {
    if (isAdminOrSuperAdmin) {
      const timer = setTimeout(() => {
        apiCall.get({
          route: "/admin/sales-related-active-users/Sales Manager",
          onSuccess: (res) => {
            if (res.success) {
              setSalesManagers(res.data || []);
            }
          },
          onError: (err) => {
            console.error("Error fetching sales managers:", err);
          },
        });
      }, 500);
      return () => clearTimeout(timer);
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
      roleName: "Sales Executive - Client Dealer",
      salesManagerId: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setEditingId(user.userId);

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

  const handleDeleteUser = async (userId) => {
    const userToDelete = users.find((u) => u.userId === userId);
    if (userToDelete?.role === "Super Admin") {
      showWarning("Super Admin accounts cannot be deleted.");
      return;
    }

    const isConfirmed = await confirmAction(
      "Are you sure?",
      "You are about to delete this user!",
      "Yes, delete it!"
    );

    if (isConfirmed) {
      apiCall.delete({
        route: `/admin/users/${userId}`,
        onSuccess: () => {
          // Explicitly trigger refetch
          setRefreshKey((prev) => prev + 1);
          // Manually remove from state for immediate UI feedback
          setUsers((prev) => prev.filter((u) => u.userId !== userId));
        },
        onError: (err) => {
          showError(err.message || "Failed to delete user");
        },
      });
    }
  };


  const handleSaveUser = (e) => {
    e.preventDefault();
    setActionLoading(true);

    if (
      isAdminOrSuperAdmin &&
      formData.roleName.startsWith("Sales Executive") &&
      !formData.salesManagerId
    ) {
      showWarning("Please select a Sales Manager for the Sales Executive.");
      setActionLoading(false);
      return;
    }


    const payload = { ...formData };

    // If a Sales Manager is adding a Sales Executive, automatically assign themselves as the manager
    if (isSalesManager && formData.roleName.startsWith("Sales Executive")) {
      payload.salesManagerId = currentUser?.userId;
    }

    if (editingId) {
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
          showError(err.message || "Failed to update user");
        },

      });
    } else {
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
          showError(err.message || "Failed to create user");
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
    if (!role) return "bg-gray-100 text-gray-700";
    if (role.includes("Admin"))
      return "bg-purple-100 text-purple-700 border-purple-200";
    if (role.includes("Sales Manager"))
      return "bg-orange-100 text-orange-700 border-orange-200";
    if (role.includes("Sales Executive"))
      return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-gray-100 text-gray-700";
  };

  const filteredUsers = users.filter(
    (u) =>
      (u.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="p-6 space-y-6 relative animate-fade-in-up">
      <UserHeader canManageUsers={canManageUsers} onAddClick={openAddModal} />

      <UserFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedRole={selectedRole}
        setSelectedRole={(role) => {
          setSelectedRole(role);
          setPagination((prev) => ({ ...prev, currentPage: 1 }));
        }}
        loading={loading}
        onRefresh={() => setRefreshKey((prev) => prev + 1)}
      />

      <UserTable
        users={filteredUsers}
        loading={loading}
        canManageUsers={canManageUsers}
        currentUser={currentUser}
        onEdit={openEditModal}
        onDelete={handleDeleteUser}
        getRoleColor={getRoleColor}
        getStatusColor={getStatusColor}
      />

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
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: prev.currentPage - 1,
                }))
              }
            >
              Previous
            </button>
            <button
              className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!pagination.hasNextPage}
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: prev.currentPage + 1,
                }))
              }
            >
              Next
            </button>
          </div>
        </div>
      )}

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingId={editingId}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSaveUser={handleSaveUser}
        actionLoading={actionLoading}
        isAdminOrSuperAdmin={isAdminOrSuperAdmin}
        isSalesManager={isSalesManager}
        salesManagers={salesManagers}
        refetch={() => setRefreshKey((prev) => prev + 1)}
      />
    </div>
  );
};

export default Users;
