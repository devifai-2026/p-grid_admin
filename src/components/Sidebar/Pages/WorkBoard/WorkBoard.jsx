import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import {
  FiMessageSquare,
  FiHome,
  FiUser,
  FiSearch,
  FiRefreshCw,
  FiFilter,
  FiChevronRight,
  FiMapPin,
  FiPhone,
  FiMail,
  FiCalendar,
  FiCheckCircle,
  FiArrowRight,
  FiPieChart,
  FiActivity,
} from "react-icons/fi";
import {
  MdVerified,
  MdAssignment,
  MdAutorenew,
  MdKeyboardArrowDown,
} from "react-icons/md";
import { apiCall } from "../../../../helpers/apicall/apiCall";
import { useAuth } from "../../../../context/AuthContext";
import EnquiryCard from "../Enquiry/components/EnquiryCard";

const WorkBoard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  // Enquiry States
  const [inquiries, setInquiries] = useState([]);
  const [executives, setExecutives] = useState([]);
  const [assigningId, setAssigningId] = useState(null);
  const [selectedExec, setSelectedExec] = useState("");
  const [assignInquiryLoading, setAssignInquiryLoading] = useState(false);
  const [autoAssignLoading, setAutoAssignLoading] = useState(null);

  // Property States
  const [properties, setProperties] = useState([]);
  const [viewType, setViewType] = useState("all"); // all, assigned, unassigned
  const [assignPropertyLoading, setAssignPropertyLoading] = useState(false);

  // Role Permissions
  const isAdminOrManager = useMemo(
    () => ["Admin", "Super Admin", "Sales Manager"].includes(user?.role),
    [user?.role],
  );

  const isClientDealer = user?.role === "Sales Executive - Client Dealer";
  const isPropertyManager = user?.role === "Sales Executive - Property Manager";

  const showEnquiries = isAdminOrManager || isClientDealer;
  const showProperties = isAdminOrManager || isPropertyManager;

  // --- Fetch Data ---

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Fetch Enquiries if role allows
      if (showEnquiries) {
        const enquiryEndpoint = isAdminOrManager
          ? "/admin/pending-inquiries"
          : "/sales/assigned-inquiries";

        apiCall.get({
          route: enquiryEndpoint,
          onSuccess: (res) => {
            if (res.success && res.data) setInquiries(res.data);
          },
        });

        if (isAdminOrManager) {
          apiCall.get({
            route:
              "/admin/sales-related-active-users/Sales Executive - Client Dealer",
            onSuccess: (res) => {
              if (res.success && res.data) {
                // Ensure each has a 'label' for EnquiryCard compatibility
                const mapped = res.data.map((exec) => ({
                  ...exec,
                  label: exec.label || `${exec.firstName} ${exec.lastName}`,
                }));
                setExecutives(mapped);
              }
            },
          });
        }
      }

      // Fetch Properties if role allows
      if (showProperties) {
        const propertyEndpoint = isPropertyManager
          ? "/properties/assigned"
          : "/properties?limit=50";

        apiCall.get({
          route: propertyEndpoint,
          onSuccess: (res) => {
            if (res.success && res.data) setProperties(res.data);
          },
        });
      }
    } catch (err) {
      console.error("Error fetching board data:", err);
    } finally {
      setLoading(false);
    }
  }, [
    user,
    isAdminOrManager,
    isClientDealer,
    isPropertyManager,
    showEnquiries,
    showProperties,
  ]);

  // --- Assignment Modal States & Handlers ---
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [targetProperty, setTargetProperty] = useState(null);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [searchingUsers, setSearchingUsers] = useState(false);

  const searchUsers = useCallback(async (term) => {
    setSearchingUsers(true);
    const params = {
      roleName: "Sales Executive - Property Manager",
      limit: 10,
    };
    if (term) {
      params.search = term;
    }

    apiCall.get({
      route: "/admin/users",
      params,
      onSuccess: (res) => {
        setSearchingUsers(false);
        if (res.success && res.data) {
          setUserSearchResults(res.data);
        }
      },
      onError: () => setSearchingUsers(false),
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchUsers(userSearchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [userSearchTerm, searchUsers]);

  const openAssignModal = (prop) => {
    setTargetProperty(prop);
    setIsAssignModalOpen(true);
    setUserSearchTerm("");
    searchUsers("");
  };

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]);

  // --- Enquiry Handlers ---
  const handleAssignInquiry = (propertyId, inquirerId) => {
    if (!selectedExec) return;
    setAssignInquiryLoading(true);
    apiCall.post({
      route: "/admin/inquiries/assign",
      payload: { propertyId, inquirerId, assignedTo: selectedExec },
      onSuccess: () => {
        setAssignInquiryLoading(false);
        setAssigningId(null);
        setSelectedExec("");
        setRefreshKey((prev) => prev + 1);
      },
      onError: (err) => {
        setAssignInquiryLoading(false);
        alert(err.message || "Failed to assign inquiry");
      },
    });
  };

  const handleAutoAssignInquiry = (propertyId, inquirerId) => {
    setAutoAssignLoading(propertyId + inquirerId);
    apiCall.post({
      route: "/admin/inquiries/auto-assign",
      payload: { propertyId, inquirerId },
      onSuccess: () => {
        setAutoAssignLoading(null);
        setRefreshKey((prev) => prev + 1);
      },
      onError: (err) => {
        setAutoAssignLoading(null);
        alert(err.message || "Failed to auto-assign inquiry");
      },
    });
  };

  // --- Property Handlers ---
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
        setRefreshKey((prev) => prev + 1);
        alert("Property assigned successfully!");
      },
      onError: (err) => {
        setAssignPropertyLoading(false);
        alert(err.message || "Failed to assign property");
      },
    });
  };

  // --- Filtering ---
  const filteredInquiries = inquiries.filter((item) => {
    const search = searchTerm.toLowerCase();
    return (
      (item.property?.microMarket || "").toLowerCase().includes(search) ||
      (item.inquirer?.firstName || "").toLowerCase().includes(search) ||
      (item.propertyId || "").toLowerCase().includes(search)
    );
  });

  const filteredProperties = properties.filter((prop) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      (prop.microMarket || "").toLowerCase().includes(search) ||
      (prop.propertyId || "").toLowerCase().includes(search) ||
      (prop.city || "").toLowerCase().includes(search);

    if (viewType === "assigned") return matchesSearch && !!prop.salesId;
    if (viewType === "unassigned") return matchesSearch && !prop.salesId;
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8 space-y-8 pb-20">
      {/* Dynamic Board Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-red-200">
            <FiActivity size={28} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter leading-none mb-2">
              Work Hub <span className="text-red-500">.</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Live Operational Dashboard
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" />
            <input
              type="text"
              placeholder="Search enquiries or properties..."
              className="pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-red-500/10 w-full md:w-72 transition-all outline-none font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setRefreshKey((prev) => prev + 1)}
            className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-500 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all shadow-sm"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* --- ENQUIRY SECTION (TOP) --- */}
      {showEnquiries && (
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="flex items-center gap-3 text-lg font-black text-slate-800 uppercase tracking-tight">
              <FiMessageSquare className="text-red-500" />
              Recent Enquiries
              <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-1">
                {filteredInquiries.length}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {loading && inquiries.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
                <div className="w-10 h-10 border-4 border-red-500/20 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                  Loading Enquiries...
                </p>
              </div>
            ) : filteredInquiries.length > 0 ? (
              filteredInquiries
                .slice(0, 5)
                .map((item, index) => (
                  <EnquiryCard
                    key={item.id || item.propertyId}
                    item={item}
                    index={index}
                    isManager={isAdminOrManager}
                    autoAssignLoading={autoAssignLoading}
                    handleAutoAssign={handleAutoAssignInquiry}
                    assigningId={assigningId}
                    setAssigningId={setAssigningId}
                    selectedExec={selectedExec}
                    setSelectedExec={setSelectedExec}
                    executives={executives}
                    handleAssign={handleAssignInquiry}
                    assignLoading={assignInquiryLoading}
                  />
                ))
            ) : (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-sm">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                  No pending enquiries
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* --- PROPERTY SECTION --- */}
      {showProperties && (
        <section className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-2">
            <h2 className="flex items-center gap-3 text-lg font-black text-slate-800 uppercase tracking-tight">
              <FiHome className="text-red-500" />
              {isPropertyManager
                ? "Your Assigned Properties"
                : "Property Board"}
              <span className="bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-1">
                {filteredProperties.length}
              </span>
            </h2>

            {isAdminOrManager && (
              <div className="flex bg-white p-1 rounded-xl border border-slate-100 shadow-sm self-start">
                {["all", "assigned", "unassigned"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setViewType(type)}
                    className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${
                      viewType === type
                        ? "bg-slate-900 text-white shadow-lg"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden text-[10px]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 font-black uppercase tracking-widest text-slate-400">
                    <th className="px-6 py-5">Property Info</th>
                    <th className="px-6 py-5">Financials</th>
                    <th className="px-6 py-5">Location</th>
                    <th className="px-6 py-5">Status</th>
                    {isAdminOrManager && (
                      <th className="px-6 py-5">Assigned To</th>
                    )}
                    <th className="px-6 py-5 text-right whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <AnimatePresence>
                    {filteredProperties.map((prop, idx) => (
                      <motion.tr
                        key={prop.propertyId}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group hover:bg-slate-50/80 transition-all duration-200"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden relative group-hover:shadow-md transition-all">
                              {prop.media?.[0]?.fileUrl ? (
                                <img
                                  src={prop.media[0].fileUrl}
                                  className="w-full h-full object-cover"
                                  alt=""
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                  <FiHome size={20} />
                                </div>
                              )}
                            </div>
                            <div className="max-w-[150px]">
                              <p className="font-black text-slate-800 text-[11px] truncate uppercase">
                                {prop.microMarket || "Premium Block"}
                              </p>
                              <p className="font-bold text-red-500 mt-0.5">
                                {prop.propertyType}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-slate-600">
                              <span className="text-slate-400">Yield:</span>
                              <span className="text-emerald-600">
                                {prop.grossRentalYield || 0}%
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 font-bold text-slate-600">
                              <span className="text-slate-400">Price:</span>
                              <span>₹{prop.sellingPrice || 0}Cr</span>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 font-bold text-slate-600">
                            <FiMapPin className="text-red-500 opacity-50" />
                            <span className="truncate max-w-[120px]">
                              {prop.city}, {prop.state}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-0.5 rounded-lg font-black uppercase tracking-tighter shadow-sm border ${
                              prop.isVerified === "completed"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : "bg-orange-50 text-orange-600 border-orange-100"
                            }`}
                          >
                            {prop.isVerified || "Pending"}
                          </span>
                        </td>

                        {isAdminOrManager && (
                          <td className="px-6 py-4">
                            <div
                              className={`flex items-center gap-2 p-1.5 rounded-xl border transition-all cursor-pointer ${
                                prop.salesAgent
                                  ? "bg-indigo-50/30 border-indigo-100 hover:bg-indigo-50"
                                  : "bg-slate-50 border-slate-100 hover:border-red-200"
                              }`}
                              onClick={() => openAssignModal(prop)}
                            >
                              <div
                                className={`w-6 h-6 rounded-lg flex items-center justify-center font-black ${
                                  prop.salesAgent
                                    ? "bg-indigo-500 text-white"
                                    : "bg-slate-200 text-slate-400"
                                }`}
                              >
                                {(
                                  prop.salesAgent?.firstName ||
                                  prop.salesAgent?.name
                                )
                                  ?.charAt(0)
                                  ?.toUpperCase() || <FiUser size={12} />}
                              </div>
                              <span
                                className={`font-black uppercase tracking-tight ${
                                  prop.salesAgent
                                    ? "text-indigo-600"
                                    : "text-slate-400"
                                }`}
                              >
                                {prop.salesAgent
                                  ? prop.salesAgent.name ||
                                    `${prop.salesAgent.firstName || ""} ${prop.salesAgent.lastName || ""}`.trim() ||
                                    "Agent"
                                  : "UNASSIGNED"}
                              </span>
                            </div>
                          </td>
                        )}

                        <td className="px-6 py-4 text-right">
                          <button
                            className="p-2 border border-slate-100 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all group-hover:scale-110 active:scale-90"
                            title="View Details"
                            onClick={() =>
                              (window.location.href = `/property/property-details/${prop.propertyId}`)
                            }
                          >
                            <FiArrowRight size={16} />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>

              {filteredProperties.length === 0 && !loading && (
                <div className="p-20 text-center text-slate-400 font-black uppercase tracking-widest text-xs">
                  No properties found matching criteria
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* --- ANALYTICS OVERVIEW (FOOTER) --- */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          {
            label: "Board Efficiency",
            value: "94.2%",
            icon: FiPieChart,
            color: "text-blue-500",
            bg: "bg-blue-50",
          },
          {
            label: "Open Enquiries",
            value: inquiries.length,
            icon: FiMessageSquare,
            color: "text-red-500",
            bg: "bg-red-50",
          },
          {
            label: "Managed Properties",
            value: properties.length,
            icon: FiHome,
            color: "text-indigo-500",
            bg: "bg-indigo-50",
          },
          {
            label: "Response Time",
            value: "2.4h",
            icon: FiActivity,
            color: "text-emerald-500",
            bg: "bg-emerald-50",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5"
          >
            <div
              className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}
            >
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none mb-1">
                {stat.label}
              </p>
              <h3 className="text-xl font-black text-slate-800 leading-none">
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </section>

      {/* --- ASSIGNMENT MODAL --- */}
      <AnimatePresence>
        {isAssignModalOpen &&
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsAssignModalOpen(false)}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden"
              >
                {/* Modal Header */}
                <div className="p-8 bg-slate-50 border-b border-slate-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
                        {targetProperty?.salesId
                          ? "Reassign Property"
                          : "Assign Property"}
                      </h2>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                        {targetProperty?.microMarket || "New Property Location"}
                      </p>
                    </div>
                    <button
                      onClick={() => setIsAssignModalOpen(false)}
                      className="p-2 hover:bg-white rounded-xl text-slate-400 transition-colors"
                    >
                      <FiArrowRight className="rotate-180" size={24} />
                    </button>
                  </div>

                  {/* Search Box */}
                  <div className="relative mt-6">
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      autoFocus
                      placeholder="Search sales agents by name..."
                      className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-red-500/10 transition-all outline-none font-bold text-slate-700"
                      value={userSearchTerm}
                      onChange={(e) => setUserSearchTerm(e.target.value)}
                    />
                    {searchingUsers && (
                      <FiRefreshCw className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 animate-spin" />
                    )}
                  </div>
                </div>

                {/* Modal Body / Results */}
                <div className="max-h-[350px] overflow-y-auto p-4 space-y-2">
                  {userSearchResults.length > 0 ? (
                    userSearchResults.map((userRes) => (
                      <button
                        key={userRes.userId}
                        //   disabled={assignPropertyLoading}
                        onClick={() =>
                          handleAssignProperty(
                            targetProperty.propertyId,
                            userRes.userId,
                          )
                        }
                        className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left group ${
                          targetProperty?.salesId === userRes.userId
                            ? "bg-slate-900 border-slate-900"
                            : "hover:bg-slate-50 border-transparent hover:border-slate-100"
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all ${
                              targetProperty?.salesId === userRes.userId
                                ? "bg-white/10 text-white"
                                : "bg-slate-100 text-slate-400 group-hover:bg-red-500 group-hover:text-white"
                            }`}
                          >
                            {(userRes.firstName || userRes.name || "A")
                              .charAt(0)
                              .toUpperCase()}
                          </div>
                          <div>
                            <p
                              className={`font-black text-xs uppercase ${
                                targetProperty?.salesId === userRes.userId
                                  ? "text-white"
                                  : "text-slate-800"
                              }`}
                            >
                              {userRes.name ||
                                `${userRes.firstName || ""} ${userRes.lastName || ""}`.trim() ||
                                "Agent"}
                            </p>
                            {targetProperty?.salesId === userRes.userId && (
                              <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-0.5">
                                Currently Assigned
                              </p>
                            )}
                          </div>
                        </div>
                        <div
                          className={`p-2 transition-opacity ${
                            targetProperty?.salesId === userRes.userId
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100"
                          }`}
                        >
                          <FiCheckCircle
                            className={
                              targetProperty?.salesId === userRes.userId
                                ? "text-white"
                                : "text-emerald-500"
                            }
                            size={20}
                          />
                        </div>
                      </button>
                    ))
                  ) : !searchingUsers ? (
                    <div className="py-12 text-center text-slate-400">
                      <FiUser size={40} className="mx-auto mb-3 opacity-20" />
                      <p className="text-[10px] font-black uppercase tracking-widest">
                        {userSearchTerm
                          ? "No agents found"
                          : "No agents available"}
                      </p>
                    </div>
                  ) : null}
                </div>
              </motion.div>
            </div>
          }
      </AnimatePresence>
    </div>
  );
};

export default WorkBoard;
