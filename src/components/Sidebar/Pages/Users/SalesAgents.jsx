import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { FaLeaf, FaSearch } from "react-icons/fa";
import {
  FiRefreshCw,
  FiMail,
  FiPhone,
  FiMapPin,
  FiUsers,
  FiArrowRight,
} from "react-icons/fi";
import { apiCall } from "../../../../helpers/apicall/apiCall";
import { useAuth } from "../../../../context/AuthContext";

const SalesAgents = () => {
  const { user: currentUser } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [statusLoadingId, setStatusLoadingId] = useState(null);

  const fetchAgents = useCallback(async () => {
    setLoading(true);

    // Determine which roles to fetch based on URL
    let roles = [];
    const path = location.pathname;

    if (path.includes("property-dealer")) {
      roles = ["Sales Executive - Property Manager"];
    } else if (path.includes("client-dealer")) {
      roles = ["Sales Executive - Client Dealer"];
    } else {
      roles = [
        "Sales Executive - Client Dealer",
        "Sales Executive - Property Manager",
      ];
    }

    try {
      const results = await Promise.all(
        roles.map(
          (role) =>
            new Promise((resolve, reject) => {
              apiCall.get({
                route: "/admin/users",
                params: { roleName: role, limit: 100, isActive: "all" },
                onSuccess: (res) => resolve(res.success ? res.data : []),
                onError: (err) => reject(err),
              });
            }),
        ),
      );

      const combinedAgents = results.flat();
      setAgents(combinedAgents);
    } catch (err) {
      console.error("Error fetching sales agents:", err);
    } finally {
      setLoading(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents, refreshKey]);

  const toggleUserStatus = (e, agent) => {
    e.stopPropagation();
    const userId = agent.userId || agent.id;
    if (!userId) return;

    if (userId === currentUser?.userId) {
      alert("You cannot deactivate your own account.");
      return;
    }

    setStatusLoadingId(userId);
    const newStatus = !agent.isActive;

    apiCall.put({
      route: `/admin/users/${userId}`,
      payload: { isActive: newStatus },
      onSuccess: (res) => {
        if (res.success) {
          setAgents((prev) =>
            prev.map((a) => {
              const currentId = a.userId || a.id;
              return currentId === userId ? { ...a, isActive: newStatus } : a;
            }),
          );
        }
        setStatusLoadingId(null);
      },
      onError: (err) => {
        console.error("Error toggling user status:", err);
        const msg =
          err?.data?.message ||
          err?.message ||
          "Failed to update user status.";
        alert(msg);
        setStatusLoadingId(null);
      },
    });
  };

  const filteredAgents = agents.filter((agent) => {
    const name = (agent.name || "").toLowerCase();
    const firstName = (agent.firstName || "").toLowerCase();
    const lastName = (agent.lastName || "").toLowerCase();
    const email = (agent.email || "").toLowerCase();

    return (
      name.includes(searchTerm.toLowerCase()) ||
      firstName.includes(searchTerm.toLowerCase()) ||
      lastName.includes(searchTerm.toLowerCase()) ||
      email.includes(searchTerm.toLowerCase())
    );
  });

  const getPageInfo = () => {
    const path = location.pathname;
    if (path.includes("property-dealer")) {
      return {
        title: "Property Managers",
        subtitle: "Showing all Field Agents & Property Managers",
      };
    }
    if (path.includes("client-dealer")) {
      return {
        title: "Client Dealers",
        subtitle: "Showing all Client Acquisition & Dealers",
      };
    }
    return {
      title: "Sales Team",
      subtitle: "Showing all Field Agents and Client Dealers",
    };
  };

  const pageInfo = getPageInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {pageInfo.title} ({filteredAgents.length})
          </h1>
          <p className="text-slate-600 flex items-center gap-2">
            <FaLeaf className="text-emerald-500" />
            {pageInfo.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search agents..."
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
            Fetching agents...
          </p>
        </div>
      ) : filteredAgents.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-20 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiUsers className="w-10 h-10 text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            No Agents Found
          </h2>
          <p className="text-slate-500 max-w-xs mx-auto">
            {searchTerm
              ? `No results matching "${searchTerm}"`
              : "There are currently no registered sales agents in the system."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                    Agent Info
                  </th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest hidden md:table-cell">
                    Contact Details
                  </th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest hidden lg:table-cell">
                    Business / Location
                  </th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                    Specific Role
                  </th>
                  <th className="px-6 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredAgents.map((agent) => (
                  <tr
                    key={agent.userId || agent.id}
                    className="group hover:bg-slate-50/80 transition-all duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative flex-shrink-0">
                          <img
                            src={
                              agent.profilePicture ||
                              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                agent.name ||
                                  `${agent.firstName || "U"} ${agent.lastName || ""}`,
                              )}&background=random`
                            }
                            alt={agent.name}
                            className="w-11 h-11 rounded-xl object-cover shadow-sm ring-2 ring-white group-hover:ring-red-50 transition-all border border-slate-100"
                          />
                           <div
                            className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 border-2 border-white rounded-full ${
                              agent.isActive !== false ? "bg-emerald-500" : "bg-slate-400"
                            }`}
                          ></div>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">
                            {agent.name ||
                              `${agent.firstName || ""} ${agent.lastName || ""}`.trim() ||
                              "Unknown Agent"}
                          </p>
                          <p className="text-xs text-slate-400 font-medium">
                            ID:{" "}
                            {(agent.userId || agent.id || "N/A").slice(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-slate-600">
                          <FiMail className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs font-medium truncate max-w-[200px]">
                            {agent.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600">
                          <FiPhone className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs font-medium">
                            {agent.mobileNumber || "—"}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                          <FiMapPin className="w-4 h-4 text-red-500" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-700">
                            {agent.microMarket || "Primary Market"}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {agent.city || "Field Agent"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                          agent.role?.includes("Client")
                            ? "bg-blue-50 text-blue-600 border-blue-100"
                            : "bg-purple-50 text-purple-600 border-purple-100"
                        }`}
                      >
                        {agent.role}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {(() => {
                          const agId = agent.userId || agent.id;
                          const isToggleLoading = statusLoadingId === agId;

                          return (
                            <button
                              onClick={(e) => toggleUserStatus(e, agent)}
                              disabled={isToggleLoading || agId === currentUser?.userId}
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full transition-all duration-300 border ${
                                isToggleLoading || agId === currentUser?.userId
                                  ? "bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed opacity-70"
                                  : agent.isActive !== false
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100"
                                    : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100"
                              }`}
                              title={
                                isToggleLoading
                                  ? ""
                                  : `Click to mark as ${agent.isActive !== false ? "Inactive" : "Active"}`
                              }
                            >
                              {isToggleLoading ? (
                                <FiRefreshCw className="w-2.5 h-2.5 animate-spin" />
                              ) : (
                                <div
                                  className={`w-1.5 h-1.5 rounded-full ${
                                    agent.isActive !== false
                                      ? "bg-emerald-500 animate-pulse"
                                      : "bg-slate-400"
                                  }`}
                                ></div>
                              )}
                              <span className="text-[10px] font-bold uppercase tracking-wider">
                                {isToggleLoading
                                  ? "UPDATING"
                                  : agent.isActive !== false
                                    ? "ACTIVE"
                                    : "INACTIVE"}
                              </span>
                            </button>
                          );
                        })()}

                        <button
                          onClick={() => {
                            const id = agent.userId || agent.id;
                            // Add a special flag or handle in ClientDetails if needed
                            window.location.href = `/client-details/${id}`;
                          }}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="View Profile"
                        >
                          <FiArrowRight size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesAgents;
