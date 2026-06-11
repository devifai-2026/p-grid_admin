import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiMail,
  FiPhone,
  FiUser,
  FiMapPin,
  FiBriefcase,
  FiHome,
  FiActivity,
  FiCheckCircle,
  FiExternalLink,
} from "react-icons/fi";
import { apiCall } from "../../../../../helpers/apicall/apiCall";
import { formatPrice } from "../../../../../helpers/formatPrice";

const AgentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("about");
  const [loading, setLoading] = useState(Boolean(id));
  const [agent, setAgent] = useState(null);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    if (!id) return;

    // A Sales Executive's portfolio is the set of properties assigned to them.
    const fetchAssignedProperties = (userId) => {
      apiCall.get({
        route: `/properties?salesId=${userId}`,
        onSuccess: (res) => {
          if (res.success) setProperties(res.data || []);
          setLoading(false);
        },
        onError: (err) => {
          console.error("Error fetching assigned properties:", err);
          setLoading(false);
        },
      });
    };

    apiCall.get({
      route: `/admin/users/${id}`,
      onSuccess: (res) => {
        if (res.success && res.data) {
          setAgent(res.data);
          fetchAssignedProperties(res.data.userId);
        } else {
          setLoading(false);
        }
      },
      onError: (err) => {
        console.error("Error fetching agent details:", err);
        setLoading(false);
      },
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="w-10 h-10 border-2 border-[#EE2529] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-400 font-medium uppercase tracking-widest animate-pulse">
          Loading Data...
        </p>
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gradient-to-b from-slate-50 to-slate-100 p-6 text-center">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-2 mx-auto">
          <FiUser size={32} className="text-slate-200" />
        </div>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
          Agent Not Found
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-[#EE2529] text-white text-xs rounded-lg font-bold uppercase tracking-widest hover:bg-[#D32F2F] transition shadow-lg shadow-red-200"
        >
          Go Back
        </button>
      </div>
    );
  }

  const fullName =
    `${agent.firstName || ""} ${agent.lastName || ""}`.trim() || "Unknown Agent";
  const role = agent.roles?.[0]?.roleName || "Sales Executive";
  const firstName = agent.firstName || "this agent";

  const verifiedCount = properties.filter(
    (p) => p.isVerified === "completed" || p.isVerified === "verified",
  ).length;

  const stats = [
    { label: "Assigned Listings", value: properties.length, color: "#10b981" },
    { label: "Verified", value: verifiedCount, color: "#3b82f6" },
    {
      label: "Pending",
      value: properties.length - verifiedCount,
      color: "#f59e0b",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="relative h-48 bg-gradient-to-r from-slate-800 to-[#EE2529] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20"></div>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 w-9 h-9 flex items-center justify-center bg-white/90 hover:bg-white rounded-lg transition-all text-slate-700 shadow-sm active:scale-95 z-10"
        >
          <FiArrowLeft size={18} />
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        {/* Agent Header Card */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200 -mt-20 relative z-10 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <img
              src={
                agent.brokerProfile?.profilePhoto ||
                agent.profilePicture ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  fullName,
                )}&background=EE2529&color=fff&size=512`
              }
              alt={fullName}
              className="w-24 h-24 md:w-28 md:h-28 rounded-full object-cover border-4 border-red-100 bg-slate-100"
            />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
                {fullName}
              </h1>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-[#EE2529] text-white rounded-full text-xs font-bold uppercase tracking-widest">
                  {role}
                </span>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    agent.isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {agent.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center justify-center md:justify-start gap-2 text-slate-700">
                  <FiMail className="text-[#EE2529] flex-shrink-0" />
                  <span className="break-all">{agent.email || "N/A"}</span>
                </div>
                <div className="flex items-center justify-center md:justify-start gap-2 text-slate-700">
                  <FiPhone className="text-[#EE2529] flex-shrink-0" />
                  <span>{agent.mobileNumber || "N/A"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mb-8">
          <div className="border-b border-slate-200 flex">
            <button
              onClick={() => setActiveTab("about")}
              className={`flex-1 md:flex-none px-4 md:px-8 py-4 font-semibold transition-colors text-center ${
                activeTab === "about"
                  ? "text-[#EE2529] border-b-2 border-[#EE2529]"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              About {firstName}
            </button>
            <button
              onClick={() => setActiveTab("properties")}
              className={`flex-1 md:flex-none px-4 md:px-8 py-4 font-semibold transition-colors text-center ${
                activeTab === "properties"
                  ? "text-[#EE2529] border-b-2 border-[#EE2529]"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Properties ({properties.length})
            </button>
          </div>

          <div className="p-6 md:p-8">
            {activeTab === "about" && (
              <div className="space-y-8">
                {/* Identity details */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-4">
                    Agent Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { icon: FiMail, label: "Email", value: agent.email },
                      {
                        icon: FiPhone,
                        label: "Phone",
                        value: agent.mobileNumber,
                      },
                      {
                        icon: FiBriefcase,
                        label: "Role",
                        value: role,
                      },
                      {
                        icon: FiMapPin,
                        label: "Locality",
                        value: agent.brokerProfile?.locality,
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100"
                      >
                        <div className="w-10 h-10 rounded-lg bg-white shadow-sm flex items-center justify-center text-[#EE2529] flex-shrink-0">
                          <item.icon size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-slate-500 font-medium mb-1">
                            {item.label}
                          </p>
                          <p className="text-sm font-semibold text-slate-800 break-all">
                            {item.value || "N/A"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Real portfolio stats */}
                <div>
                  <h4 className="font-bold text-slate-900 mb-6">
                    Portfolio Overview
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {stats.map((stat, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col items-center p-6 rounded-xl bg-slate-50 border border-slate-100"
                      >
                        <p
                          className="text-3xl font-bold"
                          style={{ color: stat.color }}
                        >
                          {stat.value}
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "properties" && (
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-6">
                  Assigned Properties
                </h3>
                {properties.length === 0 ? (
                  <div className="py-20 text-center text-slate-400">
                    <FiHome size={40} className="mx-auto mb-4 opacity-20" />
                    <p className="text-sm font-bold uppercase tracking-widest">
                      No Properties Assigned
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((prop) => (
                      <div
                        key={prop.propertyId}
                        onClick={() =>
                          navigate(
                            `/property/property-details/${prop.propertyId}`,
                          )
                        }
                        className="rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-shadow cursor-pointer group"
                      >
                        <div className="relative h-48 overflow-hidden bg-slate-100">
                          {prop.media?.[0]?.fileUrl ? (
                            <img
                              src={prop.media[0].fileUrl}
                              alt={prop.microMarket || "Property"}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                              <FiHome size={36} />
                            </div>
                          )}
                          <div className="absolute top-3 right-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                                prop.isVerified === "completed" ||
                                prop.isVerified === "verified"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {(prop.isVerified === "completed" ||
                                prop.isVerified === "verified") && (
                                <FiCheckCircle className="w-3 h-3" />
                              )}
                              {prop.isVerified === "completed" ||
                              prop.isVerified === "verified"
                                ? "Verified"
                                : "Pending"}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-slate-900 truncate">
                              {prop.microMarket || "Unspecified"}
                            </h4>
                            <span className="text-xs font-bold text-[#EE2529] bg-red-50 px-2 py-1 rounded whitespace-nowrap">
                              {prop.propertyType || "N/A"}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 flex items-center gap-1 mb-3">
                            <FiMapPin size={14} />{" "}
                            {[prop.city, prop.state]
                              .filter(Boolean)
                              .join(", ") || "N/A"}
                          </p>
                          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                            <span className="text-slate-600">
                              Value:{" "}
                              <span className="font-semibold text-slate-900">
                                {formatPrice(prop.sellingPrice)}
                              </span>
                            </span>
                            <FiExternalLink className="w-4 h-4 text-slate-400 group-hover:text-[#EE2529]" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetails;
