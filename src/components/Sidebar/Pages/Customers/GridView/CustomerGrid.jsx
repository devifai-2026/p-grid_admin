import React, { useState, useEffect, useCallback } from "react";
import { FaLeaf, FaSearch, FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import {
  FiRefreshCw,
  FiMail,
  FiPhone,
  FiMapPin,
  FiUsers,
  FiTrash2,
  FiAlertTriangle,
} from "react-icons/fi";
import { apiCall } from "../../../../../helpers/apicall/apiCall";
import { useUserStorage } from "../../../../../helpers/useUserStorage";
import { useAuth } from "../../../../../context/AuthContext";

const CustomerGrid = ({ roleTitle, roleName }) => {
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [statusLoadingId, setStatusLoadingId] = useState(null);
  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null); // holds the customer object to delete
  const fetchCustomers = useCallback(() => {
    // Fetch users filtered by roleName
    apiCall.get({
      route: `/get-client-users?roleName=${roleName}&limit=50&isActive=all`,
      onSuccess: (res) => {
        if (res.success) {
          // Normalize data to ensure it's always an array
          const users = Array.isArray(res.data) ? res.data : [];
          console.log(res)
          setCustomers(users);
        }
      },
      onError: (err) => {
        console.error(`Error fetching ${roleName}s:`, err);
      },
      setLoading,
    });
  }, [roleName]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers, refreshKey]);

  const toggleUserStatus = (e, customer) => {
    e.stopPropagation(); // Prevent navigation to details page
    const userId = customer.userId || customer.id;
    if (!userId) return;

    if (userId === currentUser?.userId) {
      alert("You cannot deactivate your own account.");
      return;
    }

    setStatusLoadingId(userId);
    const newStatus = !customer.isActive;

    apiCall.put({
      route: `/admin/users/${userId}`,
      payload: { isActive: newStatus },
      onSuccess: (res) => {
        if (res.success) {
          setCustomers((prev) =>
            prev.map((c) => {
              const currentId = c.userId || c.id;
              return currentId === userId ? { ...c, isActive: newStatus } : c;
            }),
          );
        }
        setStatusLoadingId(null);
      },
      onError: (err) => {
        console.error("Error toggling user status:", err);
        setStatusLoadingId(null);
      },
    });
  };

  const deleteUser = (customer) => {
    const userId = customer.userId || customer.id;
    if (!userId) return;
    setDeleteLoadingId(userId);
    setConfirmDelete(null);
    apiCall.delete({
      route: `/admin/users/${userId}`,
      onSuccess: (res) => {
        if (res.success) {
          setCustomers((prev) =>
            prev.filter((c) => (c.userId || c.id) !== userId)
          );
        }
        setDeleteLoadingId(null);
      },
      onError: (err) => {
        console.error("Error deleting user:", err);
        const msg =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to delete user.";
        alert(msg);
        setDeleteLoadingId(null);
      },
    });
  };

  const filteredCustomers = customers.filter((customer) => {
    const name = (customer.name || "").toLowerCase();
    const firstName = (customer.firstName || "").toLowerCase();
    const lastName = (customer.lastName || "").toLowerCase();
    const email = (customer.email || "").toLowerCase();

    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      firstName.includes(searchTerm.toLowerCase()) ||
      lastName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {roleTitle} ({filteredCustomers.length})
          </h1>
          <p className="text-slate-600 flex items-center gap-2">
            <FaLeaf className="text-emerald-500" />
            Showing all registered{" "}
            {roleName === "Investor"
              ? "investors"
              : roleName.toLowerCase() + "s"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={`Search ${roleTitle.toLowerCase()}...`}
              className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setRefreshKey((prev) => prev + 1)}
            className="p-2 rounded-lg border border-slate-200 hover:bg-white transition-all text-slate-600 shadow-sm"
            title="Refresh"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 animate-pulse">
            Fetching {roleName}s...
          </p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-20 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiUsers className="w-10 h-10 text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            No {roleTitle} Found
          </h2>
          <p className="text-slate-500 max-w-xs mx-auto">
            {searchTerm
              ? `No results matching "${searchTerm}"`
              : `There are currently no registered ${roleTitle.toLowerCase()} in the system.`}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                    User Info
                  </th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest hidden md:table-cell">
                    Contact Details
                  </th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest hidden lg:table-cell">
                    Business / Location
                  </th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                    Role
                  </th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredCustomers.map((customer) => (
                  <tr
                    key={customer.userId || customer.id}
                    onClick={() =>
                      navigate(
                        `/client-details/${customer.userId || customer.id}`,
                      )
                    }
                    className="group hover:bg-slate-50/80 transition-all duration-200 cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative flex-shrink-0">
                          <img
                            src={
                              customer.profilePicture ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                customer.name ||
                                  `${customer.firstName || "U"} ${customer.lastName || ""}`,
                              )}&background=random`
                            }
                            alt={customer.name}
                            className="w-11 h-11 rounded-xl object-cover shadow-sm ring-2 ring-white group-hover:ring-red-50 transition-all border border-slate-100"
                          />
                          <div
                            className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-white rounded-full ${
                              customer.isActive ? "bg-emerald-500" : "bg-slate-400"
                            }`}
                          ></div>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">
                            {customer.name ||
                              `${customer.firstName || ""} ${customer.lastName || ""}`.trim() ||
                              "Unknown User"}
                          </p>
                          <p className="text-xs text-slate-400 font-medium">
                            ID:{" "}
                            {(customer.userId || customer.id || "N/A").slice(
                              0,
                              8,
                            )}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-slate-600">
                          <FiMail className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs font-medium truncate max-w-[200px]">
                            {customer.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <FiPhone className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs font-medium">
                            {customer.mobileNumber || "—"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                          <FiMapPin className="w-4 h-4 text-orange-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-700">
                            {customer.reraNumber || "Micro Market"}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {customer.microMarket || "Noida/NCR"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-100">
                        {customer.role || roleName}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {(() => {
                        const custId = customer.userId || customer.id;
                        const isToggleLoading = statusLoadingId === custId;
                        const isDeleteLoading = deleteLoadingId === custId;

                        return (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={(e) => toggleUserStatus(e, customer)}
                              disabled={isToggleLoading || custId === currentUser?.userId}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-all duration-300 border ${
                                isToggleLoading || custId === currentUser?.userId
                                  ? "bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed opacity-70"
                                  : customer.isActive
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100"
                                    : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100"
                              }`}
                              title={
                                isToggleLoading
                                  ? ""
                                  : `Click to mark as ${customer.isActive ? "Inactive" : "Active"}`
                              }
                            >
                              {isToggleLoading ? (
                                <FiRefreshCw className="w-2.5 h-2.5 animate-spin" />
                              ) : (
                                <div
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    customer.isActive
                                      ? "bg-emerald-500 animate-pulse"
                                      : "bg-slate-400"
                                  }`}
                                ></div>
                              )}
                              <span className="text-[10px] font-bold uppercase tracking-wider">
                                {isToggleLoading
                                  ? "UPDATING"
                                  : customer.isActive
                                    ? "ACTIVE"
                                    : "INACTIVE"}
                              </span>
                            </button>

                            {/* Delete button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmDelete(customer);
                              }}
                              disabled={isDeleteLoading}
                              className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all"
                              title="Delete user"
                            >
                              {isDeleteLoading ? (
                                <FiRefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : (
                                <FiTrash2 className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        );
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                <FiAlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete User</h3>
                <p className="text-xs text-slate-500 mt-0.5">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-bold text-slate-900">
                {confirmDelete.name ||
                  `${confirmDelete.firstName || ""} ${confirmDelete.lastName || ""}`.trim() ||
                  "this user"}
              </span>?
              Their account will be permanently deactivated.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteUser(confirmDelete)}
                className="flex-1 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all shadow-sm shadow-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerGrid;
