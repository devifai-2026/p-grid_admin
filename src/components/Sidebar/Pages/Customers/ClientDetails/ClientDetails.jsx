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
  FiClock,
  FiArrowRight,
  FiExternalLink,
} from "react-icons/fi";
import { apiCall } from "../../../../../helpers/apicall/apiCall";
import { MdVerified } from "react-icons/md";

const ClientDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [client, setClient] = useState(null);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      apiCall.get({
        route: `/admin/users/${id}`,
        onSuccess: (res) => {
          if (res.success) {
            setClient(res.data);
            fetchClientProperties(res.data.userId);
          }
        },
        onError: (err) => {
          console.error("Error fetching client details:", err);
          setLoading(false);
        },
      });
    }
  }, [id]);

  const toggleUserStatus = () => {
    if (!client) return;
    const userId = client.userId;
    const newStatus = !client.isActive;

    apiCall.put({
      route: `/admin/users/${userId}`,
      payload: { isActive: newStatus },
      onSuccess: (res) => {
        if (res.success) {
          setClient((prev) => ({ ...prev, isActive: newStatus }));
        }
      },
      onError: (err) => {
        console.error("Error toggling user status:", err);
      },
    });
  };

  const fetchClientProperties = (userId) => {
    apiCall.get({
      route: `/admin/properties?userId=${userId}`,
      onSuccess: (res) => {
        if (res.success) {
          setProperties(res.data || []);
        }
        setLoading(false);
      },
      onError: (err) => {
        console.error("Error fetching client properties:", err);
        setLoading(false);
      },
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <div className="w-10 h-10 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm text-slate-400 font-medium uppercase tracking-widest animate-pulse">
          Loading Data...
        </p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 p-6 text-center">
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-2 mx-auto">
          <FiUser size={32} className="text-slate-200" />
        </div>
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-widest">
          Profile Not Found
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-slate-900 text-white text-xs rounded-lg font-bold uppercase tracking-widest hover:bg-slate-800 transition shadow-lg shadow-slate-200"
        >
          Return to List
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen p-4 md:p-6 lg:p-10">
      <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center hover:bg-white rounded-lg transition-all text-slate-400 shadow-sm border border-slate-100 bg-white/80 active:scale-95"
            >
              <FiArrowLeft size={16} md={18} />
            </button>
            <div>
              <h1 className="text-sm md:text-lg font-black text-slate-900 uppercase tracking-widest leading-none mb-1">
                Client Dashboard
              </h1>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                Administrative Console
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={toggleUserStatus}
              className={`px-3 py-1.5 border text-[10px] md:text-xs font-bold rounded-full uppercase tracking-widest flex items-center gap-2 transition-all ${
                client.isActive
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-100"
                  : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-100"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  client.isActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                }`}
              />
              {client.isActive ? "Active Account" : "Inactive Account"}
            </button>
          </div>
        </div>

        {/* Client Profile Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-50/30 rounded-full blur-3xl -mr-32 -mt-32" />

          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden shadow-2xl border-4 border-white shrink-0 bg-slate-100 ring-1 ring-slate-100">
              <img
                src={
                  client.brokerProfile?.profilePhoto ||
                  client.profilePicture ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(client.firstName + " " + client.lastName)}&background=ef4444&color=fff&size=512`
                }
                className="w-full h-full object-cover"
                alt=""
              />
            </div>

            <div className="flex-1 space-y-6 text-center md:text-left">
              <div>
                <h2 className="text-2xl md:text-4xl font-black text-slate-900 uppercase tracking-tight mb-2">
                  {client.firstName} {client.lastName}
                </h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <span className="px-3 py-1 bg-red-500 text-white rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest shadow-md shadow-red-100">
                    {client.roles?.[0]?.roleName || "Client"}
                  </span>
                  <span className="hidden sm:inline w-1 h-1 bg-slate-200 rounded-full" />
                  <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                    ID: {client.userId.slice(-8).toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    icon: FiMail,
                    label: "Official Email",
                    value: client.email,
                  },
                  {
                    icon: FiPhone,
                    label: "Contact Number",
                    value: client.mobileNumber,
                  },
                  {
                    icon: FiBriefcase,
                    label: "RERA Registration",
                    value: client.reraNumber || "Not Registered",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col md:flex-row items-center md:items-start gap-3 p-4 rounded-2xl bg-slate-50/50 border border-transparent hover:border-slate-100 hover:bg-white transition-all group cursor-default"
                  >
                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform ring-1 ring-slate-100">
                      <item.icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                        {item.label}
                      </p>
                      <p className="text-sm font-bold text-slate-700 truncate capitalize">
                        {item.value.toLowerCase()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            {
              label: "Assets",
              value: properties.length,
              icon: FiHome,
              color: "blue",
            },
            {
              label: "Verified",
              value: properties.filter((p) => p.isVerified === "completed")
                .length,
              icon: MdVerified,
              color: "emerald",
            },
            {
              label: "Market",
              value: "Premium",
              icon: FiActivity,
              color: "amber",
            },
            {
              label: "Stability",
              value: "Strong",
              icon: FiClock,
              color: "red",
            },
          ].map((stat, idx) => {
            const colorMap = {
              blue: "bg-blue-50 text-blue-600 border-blue-100",
              emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
              amber: "bg-amber-50 text-amber-600 border-amber-100",
              red: "bg-red-50 text-red-600 border-red-100",
            };
            return (
              <div
                key={idx}
                className="bg-white p-4 md:p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-lg transition-all duration-300"
              >
                <div
                  className={`w-10 h-10 md:w-11 md:h-11 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 border ${colorMap[stat.color]}`}
                >
                  <stat.icon size={18} md={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1 truncate">
                    {stat.label}
                  </p>
                  <h3 className="text-sm md:text-base font-black text-slate-800 truncate">
                    {stat.value}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* Asset Portfolio */}
        <section className="space-y-4 md:space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs md:text-lg font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
              <span className="w-1.5 h-4 md:w-2 md:h-6 bg-red-500 rounded-full" />
              Portfolio Holdings
            </h3>
            <span className="text-[9px] md:text-xs font-black text-red-600 bg-red-50 px-3 py-1 md:px-4 md:py-1.5 rounded-full border border-red-100 uppercase tracking-widest">
              {properties.length} Total Assets
            </span>
          </div>

          <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto min-h-[300px] md:min-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[9px] md:text-xs font-black uppercase tracking-widest text-slate-400">
                    <th className="px-4 py-4 md:px-8 md:py-6">
                      Asset Definition
                    </th>
                    <th className="px-4 py-4 md:px-8 md:py-6">Yield & Value</th>
                    <th className="px-4 py-4 md:px-8 md:py-6 hidden md:table-cell">
                      Coordinates
                    </th>
                    <th className="px-4 py-4 md:px-8 md:py-6">Compliance</th>
                    <th className="px-4 py-4 md:px-8 md:py-6 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {properties.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-8 py-24 md:py-32 text-center text-slate-400"
                      >
                        <FiHome
                          size={40}
                          className="mx-auto mb-4 opacity-10 md:size-48"
                        />
                        <p className="text-xs font-bold uppercase tracking-[0.2em]">
                          No Assets Found
                        </p>
                      </td>
                    </tr>
                  ) : (
                    properties.map((prop) => (
                      <tr
                        key={prop.propertyId}
                        className="group hover:bg-slate-50/80 transition-all duration-300 cursor-pointer"
                        onClick={() =>
                          navigate(
                            `/property/property-details/${prop.propertyId}`,
                          )
                        }
                      >
                        <td className="px-4 py-3 md:px-8 md:py-4">
                          <div className="flex items-center gap-3 md:gap-5">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-slate-100 overflow-hidden shadow-sm group-hover:scale-105 transition-transform border border-slate-100 shrink-0">
                              {prop.media?.[0]?.fileUrl ? (
                                <img
                                  src={prop.media[0].fileUrl}
                                  className="w-full h-full object-cover"
                                  alt=""
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-200 bg-slate-50">
                                  <FiHome size={18} md={22} />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="font-black text-slate-800 text-xs md:text-sm truncate uppercase tracking-tight">
                                {prop.microMarket || "Unspecified"}
                              </p>
                              <p className="text-[9px] md:text-xs font-bold text-red-500 mt-0.5 md:mt-1 uppercase tracking-widest">
                                {prop.propertyType}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 md:px-8 md:py-5">
                          <div className="space-y-1 md:space-y-1.5">
                            <div className="flex items-center gap-1.5 text-[10px] md:text-sm font-bold">
                              <span className="text-slate-300 text-[8px] md:text-[10px] uppercase font-black">
                                Yield
                              </span>
                              <span className="text-emerald-600">
                                {prop.grossRentalYield || "0.0"}%
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] md:text-sm font-bold">
                              <span className="text-slate-300 text-[8px] md:text-[10px] uppercase font-black">
                                Value
                              </span>
                              <span className="text-slate-800">
                                ₹{prop.sellingPrice || "0"}Cr
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 md:px-8 md:py-5 hidden md:table-cell">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                            <FiMapPin size={16} className="text-red-400" />
                            <span className="truncate max-w-[180px]">
                              {prop.city}, {prop.state}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 md:px-8 md:py-5">
                          <span
                            className={`inline-flex px-2 py-0.5 md:px-3 md:py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                              prop.isVerified === "completed"
                                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                : "bg-amber-50 text-amber-600 border-amber-100"
                            }`}
                          >
                            {prop.isVerified === "completed"
                              ? "Verified"
                              : "Pending"}
                          </span>
                        </td>
                        <td className="px-4 py-3 md:px-8 md:py-4 text-right whitespace-nowrap">
                          <div className="w-8 h-8 md:w-9 md:h-9 inline-flex items-center justify-center rounded-lg md:rounded-xl text-slate-300 bg-slate-50 group-hover:text-red-600 group-hover:bg-red-50 group-hover:border-red-100 border border-transparent transition-all shadow-sm">
                            <FiExternalLink size={16} md={18} />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ClientDetails;
