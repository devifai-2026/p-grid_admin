import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  FiSearch,
  FiFilter,
  FiPlus,
  FiGrid,
  FiList,
  FiEye,
  FiMessageSquare,
  FiUserPlus,
  FiCheckCircle,
  FiMapPin,
  FiClock,
  FiActivity,
  FiTag,
  FiMoreVertical,
  FiTrendingUp,
  FiCheck,
  FiX,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import {
  showSuccess,
  showError,
  confirmAction,
  showToast,
} from "../../../../helpers/swalHelper";
import { apiCall } from "../../../../helpers/apicall/apiCall";
import { useUserStorage } from "../../../../helpers/useUserStorage";
import NotesAndActivityModal from "./NotesAndActivityModal";
import AssignPropertyModal from "./components/AssignPropertyModal";

const ExecutiveWorkBoard = () => {
  const navigate = useNavigate();
  const { user } = useUserStorage();
  const [viewMode, setViewMode] = useState("card"); // 'card' or 'table'
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [properties, setProperties] = useState([]);
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [selectedPropertyForNotes, setSelectedPropertyForNotes] =
    useState(null);

  // --- Assignment Modal States ---
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [targetProperty, setTargetProperty] = useState(null);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [searchingUsers, setSearchingUsers] = useState(false);
  const [assignPropertyLoading, setAssignPropertyLoading] = useState(false);

  const fetchProperties = () => {
    setLoading(true);
    apiCall.get({
      route: "/properties/assigned",
      onSuccess: (res) => {
        setLoading(false);
        if (res.success) {
          setProperties(res.data || []);
        }
      },
      onError: (err) => {
        setLoading(false);
        console.error("Error fetching properties:", err);
      },
    });
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const searchUsers = useCallback(async (term) => {
    setSearchingUsers(true);
    const params = {
      roleName: "Sales Executive - Property Manager",
      limit: 100,
    };

    if (term) {
      params.search = term;
      params.q = term;
      params.query = term;
    }

    apiCall.get({
      route: "/admin/users",
      params,
      onSuccess: (res) => {
        setSearchingUsers(false);
        if (res.success && res.data) {
          let results = Array.isArray(res.data) ? res.data : [];
          if (term) {
            const tokens = term
              .toLowerCase()
              .trim()
              .split(/\s+/)
              .filter(Boolean);
            results = results.filter((u) => {
              const fullName =
                `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
              const name = (u.name || "").toLowerCase();
              const email = (u.email || "").toLowerCase();
              return tokens.every(
                (t) =>
                  fullName.includes(t) || name.includes(t) || email.includes(t),
              );
            });
          }
          setUserSearchResults(results);
        }
      },
      onError: () => {
        setSearchingUsers(false);
        console.error("User search failed");
      },
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (userSearchTerm) {
        searchUsers(userSearchTerm);
      } else {
        searchUsers("");
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [userSearchTerm, searchUsers]);

  const openAssignModal = (prop) => {
    setTargetProperty(prop);
    setIsAssignModalOpen(true);
    setUserSearchTerm("");
    searchUsers("");
  };

  const handleAssignProperty = (propertyId, userId) => {
    if (!userId) return;
    if (targetProperty?.salesId === userId) return;
    setAssignPropertyLoading(true);
    apiCall.put({
      route: `/admin/properties/${propertyId}/assign`,
      payload: { userId },
      onSuccess: () => {
        setAssignPropertyLoading(false);
        setIsAssignModalOpen(false);
        fetchProperties();
        showSuccess("Property reassigned successfully!");
      },
      onError: (err) => {
        setAssignPropertyLoading(false);
        showError(err.message || "Failed to reassign property");
      },
    });
  };

  // Compute Real counts for KPIs and Pills
  const counts = useMemo(() => {
    const userAlreadyVerified = (p) =>
      p.verificationLogs?.some((log) => log.userId === user?.userId);
    // Under Review = the LAST (most recent) note is still pending admin approval
    const lastNoteIsPending = (p) => {
      if (!p.managerNotes?.length) return false;
      const sorted = [...p.managerNotes].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      return sorted[0].status === "pending";
    };

    return {
      total: properties.length,
      yetToVerify: properties.filter(
        (p) =>
          p.isVerified === "pending" ||
          (p.isVerified === "partial" && !userAlreadyVerified(p)),
      ).length,
      // Under Review = most recent note is awaiting admin approval
      underReview: properties.filter((p) => lastNoteIsPending(p)).length,
      hasNotes: properties.filter((p) => p.managerNotes?.length > 0).length,
      ownerUpdates: properties.filter((p) => p.updatedByRole === "Owner")
        .length,
      unread: properties.filter((p) => p.hasUnreadNotes).length,
    };
  }, [properties, user]);

  const filteredProperties = useMemo(() => {
    const userAlreadyVerified = (p) =>
      p.verificationLogs?.some((log) => log.userId === user?.userId);
    // Under Review = the LAST (most recent) note is still pending admin approval
    const lastNoteIsPending = (p) => {
      if (!p.managerNotes?.length) return false;
      const sorted = [...p.managerNotes].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      return sorted[0].status === "pending";
    };

    return properties.filter((p) => {
      const matchesSearch = (
        p.propertyId +
        (p.propertyType || "") +
        (p.city || "") +
        (p.microMarket || "")
      )
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      let matchesTab = true;
      if (activeFilter === "yet-to-verify") {
        matchesTab =
          p.isVerified === "pending" ||
          (p.isVerified === "partial" && !userAlreadyVerified(p));
      } else if (activeFilter === "under-review") {
        // Under Review = most recent note is pending admin approval
        matchesTab = lastNoteIsPending(p);
      } else if (activeFilter === "has-notes") {
        matchesTab = p.managerNotes?.length > 0;
      } else if (activeFilter === "owner-updates") {
        matchesTab = p.updatedByRole === "Owner";
      }

      return matchesSearch && matchesTab;
    });
  }, [properties, searchTerm, activeFilter, user]);

  const handleVerify = async (e, id) => {
    e.stopPropagation();
    const confirmed = await confirmAction(
      "Verify Property",
      "Are you sure you want to verify this property?",
      "Yes, Verify",
    );
    if (confirmed) {
      apiCall.post({
        route: `/admin/properties/${id}/verify`,
        onSuccess: (res) => {
          if (res.success) {
            showSuccess("Property Verified Successfully");
            fetchProperties();
          } else {
            showError("Failed to verify property");
          }
        },
        onError: (err) => {
          showError(err.message || "Failed to verify property");
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 space-y-8 pb-20 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Property Work Board
          </h1>
          <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm shadow-red-200 text-nowrap">
            Sales Executive
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search properties by ID, address or owner..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl w-full md:w-80 text-sm focus:ring-2 focus:ring-red-500/20 focus:border-red-500 outline-none shadow-sm transition-all"
            />
          </div>
        </div>
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "TOTAL ASSIGNED",
            value: counts.total,
            sub: "Total assigned for you",
            color: "border-red-500",
            icon: <FiActivity />,
          },
          {
            label: "YET TO VERIFY",
            value: counts.yetToVerify,
            sub: "Needs your attention",
            color: "border-yellow-500",
            icon: <FiClock />,
          },
          {
            label: "UNDER REVIEW",
            value: counts.underReview,
            sub: "Waiting for Admin Approval",
            color: "border-blue-500",
            icon: <FiCheckCircle />,
          },
          {
            label: "NOTES GIVEN",
            value: counts.hasNotes,
            sub: "Updates from team",
            color: "border-green-500",
            icon: <FiMessageSquare />,
          },
        ].map((kpi, idx) => (
          <div
            key={idx}
            className={`bg-white p-6 rounded-2xl border-t-4 ${kpi.color} shadow-sm hover:shadow-md transition-all`}
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {kpi.label}
              </span>
              <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                {kpi.icon}
              </div>
            </div>
            <div className="text-3xl font-black text-slate-800 mb-2">
              {kpi.value}
            </div>
            <div className="text-xs font-bold text-green-500 flex items-center gap-1">
              <FiTrendingUp className="w-3 h-3" /> {kpi.sub}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {[
          {
            id: "all",
            label: "All Projects",
            count: counts.total,
            color: "bg-slate-900",
          },
          {
            id: "yet-to-verify",
            label: "Yet to Verify",
            count: counts.yetToVerify,
            color: "bg-red-600",
          },
          {
            id: "under-review",
            label: "Under Review",
            count: counts.underReview,
            color: "bg-blue-600",
          },
          {
            id: "has-notes",
            label: "Has Notes",
            count: counts.hasNotes,
            color: "bg-orange-600",
          },
          {
            id: "owner-updates",
            label: "Owner Updates",
            count: counts.ownerUpdates,
            color: "bg-emerald-600",
          },
        ].map((pill) => (
          <button
            key={pill.id}
            onClick={() => setActiveFilter(pill.id)}
            className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all shadow-sm ${
              activeFilter === pill.id
                ? `${pill.color} text-white ring-4 ring-${pill.id === "all" ? "slate" : "red"}-100`
                : "bg-white text-slate-500 border border-slate-100 hover:bg-slate-50"
            }`}
          >
            {pill.label} ({pill.count})
          </button>
        ))}
      </div>

      {/* Main Pipeline Section */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-900 text-white rounded-xl">
              <FiTag />
            </div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">
              Property Pipeline
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white border border-slate-200 rounded-xl p-1 flex shadow-sm">
              <button
                onClick={() => setViewMode("card")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === "card" ? "bg-red-600 text-white shadow-md shadow-red-200" : "text-slate-400"}`}
              >
                <FiGrid /> Card View
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === "table" ? "bg-red-600 text-white shadow-md shadow-red-200" : "text-slate-400"}`}
              >
                <FiList /> Table View
              </button>
            </div>
            <button
              onClick={() => navigate("/property/add-property")}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-red-200 transition-all active:scale-95"
            >
              <FiPlus /> Onboard New Property
            </button>
          </div>
        </div>

        {/* List Content */}
        {viewMode === "card" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {filteredProperties.length > 0 ? (
              filteredProperties.map((p, idx) => {
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-100 hover:shadow-md transition-all relative overflow-hidden"
                  >
                    <div className="flex justify-between items-center mb-5">
                      <div className="flex gap-2">
                        {/* Under Review badge: LAST (most recent) note is pending admin approval */}
                        {(() => {
                          if (!p.managerNotes?.length) return null;
                          const lastNote = [...p.managerNotes].sort(
                            (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                          )[0];
                          return lastNote.status === "pending" ? (
                            <span className="bg-blue-500 text-white shadow-md shadow-blue-500/20 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
                              ⏳ Under Review
                            </span>
                          ) : null;
                        })()}
                        {p.updatedByRole === "Owner" ? (
                          <span className="bg-[#e05252] text-white shadow-md shadow-red-500/20 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
                            <span role="img" aria-label="megaphone">
                              📢
                            </span>{" "}
                            Owner Update
                          </span>
                        ) : (
                          p.managerNotes?.length > 0 &&
                          (() => {
                            const lastNote = [...p.managerNotes].sort(
                              (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                            )[0];
                            return lastNote.status !== "pending";
                          })() && (
                            <span className="bg-orange-500 text-white shadow-md shadow-orange-500/20 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1">
                              <span role="img" aria-label="memo">
                                📝
                              </span>{" "}
                              Notes Added
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-[22px] font-bold text-slate-800 mb-2 truncate">
                        {p.propertyType || "Property"} Space -{" "}
                        {p.microMarket || "Location"}
                      </h4>
                      <div className="flex items-center gap-2 text-slate-400">
                        <span className="text-[#e05252] flex-shrink-0 text-sm">
                          📍
                        </span>
                        <p className="text-[15px] font-medium truncate text-slate-500">
                          {p.address || `${p.city || ""}, ${p.state || ""}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-5 border-t border-slate-100/60">
                      <button
                        onClick={() => {
                          setSelectedPropertyForNotes(p);
                          setIsNotesModalOpen(true);
                        }}
                        className="text-sm font-semibold text-slate-600 flex items-center gap-2 border border-slate-200 bg-white px-5 py-2.5 rounded-full hover:bg-slate-50 transition-all shadow-sm"
                      >
                        <span role="img" aria-label="memo">
                          📝
                        </span>{" "}
                        View Notes
                      </button>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openAssignModal(p);
                          }}
                          className="px-5 py-2.5 bg-[#FFF4E5] text-[#E67E22] rounded-full text-sm font-semibold hover:bg-[#FFE8CC] transition-all"
                        >
                          Reassign
                        </button>
                        {(!p.isVerified ||
                          p.isVerified === "false" ||
                          p.isVerified === "pending") && (
                          <button
                            onClick={(e) => handleVerify(e, p.propertyId)}
                            className="px-5 py-2.5 bg-[#E8F5E9] text-[#2E7D32] rounded-full text-sm font-semibold hover:bg-[#D4EED6] transition-all"
                          >
                            Verify
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-20 text-center bg-white rounded-3xl border-2 border-dashed border-slate-100">
                <FiActivity className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest">
                  No matching properties found
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Table View */
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 p-2">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-50 uppercase">
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 tracking-widest">
                      Property Name
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 tracking-widest">
                      Address
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 tracking-widest">
                      Status
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 tracking-widest">
                      Notes
                    </th>
                    <th className="px-6 py-5 text-[10px] font-black text-slate-400 tracking-widest">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredProperties.map((p, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-6 py-5">
                        <span className="text-sm font-black text-slate-700 uppercase tracking-tight">
                          {p.propertyType || "Lakeside Villa"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs font-bold text-slate-400 italic">
                          {p.city || "Beverly Hills, CA"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        {p.isVerified === "completed" ||
                        p.isVerified === "verified" ? (
                          <span className="px-3 py-1 bg-green-50 text-green-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                            Verified
                          </span>
                        ) : p.isVerified === "partial" ? (
                          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                            Under Review
                          </span>
                        ) : (
                          <span className="px-3 py-1 bg-yellow-50 text-yellow-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                            Yet to Verify
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className="text-xs font-bold text-slate-500 cursor-pointer hover:text-red-500 transition-colors flex items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPropertyForNotes(p);
                            setIsNotesModalOpen(true);
                          }}
                        >
                          <FiMessageSquare />
                          {p.managerNotes?.length > 0
                            ? `${p.managerNotes.length} Notes`
                            : "No notes"}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(
                                `/property/property-details/${p.propertyId}`,
                              );
                            }}
                            className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all title='View'"
                          >
                            <FiEye size={14} />
                          </button>
                          {p.isVerified !== "completed" &&
                            !p.verificationLogs?.some(
                              (log) => log.userId === user?.userId,
                            ) && (
                            <button
                              onClick={(e) => handleVerify(e, p.propertyId)}
                              className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-all flex items-center gap-1 font-bold"
                            >
                              <FiCheck size={14} /> Verify
                            </button>
                          )}
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

      {/* Floating Action Button for Mobile */}
      <button
        onClick={() => navigate("/property/add-property")}
        className="md:hidden fixed bottom-24 right-6 w-14 h-14 bg-red-600 text-white rounded-full shadow-2xl flex items-center justify-center z-50 animate-bounce"
      >
        <FiPlus size={24} />
      </button>

      {/* Modal */}
      <NotesAndActivityModal
        isOpen={isNotesModalOpen}
        onClose={() => {
          setIsNotesModalOpen(false);
          setSelectedPropertyForNotes(null);
        }}
        property={selectedPropertyForNotes}
        onNoteAdded={fetchProperties}
      />

      <AssignPropertyModal
        isAssignModalOpen={isAssignModalOpen}
        setIsAssignModalOpen={setIsAssignModalOpen}
        targetProperty={targetProperty}
        userSearchTerm={userSearchTerm}
        setUserSearchTerm={setUserSearchTerm}
        searchingUsers={searchingUsers}
        userSearchResults={userSearchResults}
        assignPropertyLoading={assignPropertyLoading}
        handleAssignProperty={handleAssignProperty}
      />
    </div>
  );
};

export default ExecutiveWorkBoard;
