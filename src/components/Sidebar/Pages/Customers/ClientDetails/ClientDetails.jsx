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
      // Fetch user details and their properties
      // Using /admin/users/:userId if it supports includes, or a custom endpoint
      // For now, let's assume we use /admin/users/:id and then fetch properties separately if needed
      // Actually, let's try to get all in one if possible, or sequential
      apiCall.get({
        route: `/admin/users/${id}`,
        onSuccess: (res) => {
          if (res.success) {
            setClient(res.data);
            // After getting client, fetch their properties
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

  const fetchClientProperties = (userId) => {
    // Determine which field to filter properties by (ownerId or brokerId)
    // For simplicity, we can fetch all and filter or use a specific endpoint
    // Assuming backend has /admin/properties?ownerId=... or similar
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
        <div className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-500 font-black uppercase tracking-widest animate-pulse">
          Retrieving Client Profile...
        </p>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50">
        <FiUser size={48} className="text-slate-300" />
        <p className="text-slate-500 font-bold uppercase tracking-widest">
          Client Profile Not Found
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-2 bg-slate-900 text-white rounded-lg font-bold uppercase tracking-wider hover:bg-slate-800 transition"
        >
          Return to List
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white rounded-xl transition-all text-slate-600 shadow-sm border border-slate-100"
            >
              <FiArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight leading-none mb-1">
                Client Profile
              </h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FiActivity className="text-emerald-500" /> Administrative View
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black rounded-full uppercase tracking-widest">
              Active Relationship
            </span>
          </div>
        </div>

        {/* Client Identity Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <FiUser size={200} />
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
            <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-lg border-4 border-white shrink-0">
              <img
                src={
                  client.profilePicture ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(client.firstName + " " + client.lastName)}&background=random&size=128`
                }
                className="w-full h-full object-cover"
                alt=""
              />
            </div>

            <div className="flex-1 space-y-6">
              <div>
                <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-1">
                  {client.firstName} {client.lastName}
                </h2>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-[10px] font-black uppercase tracking-widest">
                    {client.roles?.[0]?.roleName || "Client"}
                  </span>
                  <span className="text-slate-300 w-[1px] h-3 bg-slate-200" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    UID: {client.userId.slice(-8)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-red-50 group-hover:text-red-500 transition-all">
                    <FiMail />
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                      Contact Email
                    </p>
                    <p className="text-xs font-bold text-slate-700">
                      {client.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-red-50 group-hover:text-red-500 transition-all">
                    <FiPhone />
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                      Mobile Access
                    </p>
                    <p className="text-xs font-bold text-slate-700">
                      {client.mobileNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-red-50 group-hover:text-red-500 transition-all">
                    <FiBriefcase />
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                      RERA Registration
                    </p>
                    <p className="text-xs font-bold text-slate-700">
                      {client.reraNumber || "Not Provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
              <FiHome size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none mb-1">
                Total Assets
              </p>
              <h3 className="text-xl font-black text-slate-800 leading-none">
                {properties.length}
              </h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center">
              <MdVerified size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none mb-1">
                Verified
              </p>
              <h3 className="text-xl font-black text-slate-800 leading-none">
                {properties.filter((p) => p.isVerified === "completed").length}
              </h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
              <FiActivity size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none mb-1">
                Market Activity
              </p>
              <h3 className="text-xl font-black text-slate-800 leading-none">
                High
              </h3>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center">
              <FiClock size={24} />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-none mb-1">
                Relationship
              </p>
              <h3 className="text-xl font-black text-slate-800 leading-none">
                6 Mo+
              </h3>
            </div>
          </div>
        </div>

        {/* Properties Table */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
              <FiHome className="text-red-500" /> Listed Properties
            </h3>
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
                    <th className="px-6 py-5 text-right whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {properties.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-20 text-center">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-4 border border-dashed border-slate-200">
                          <FiHome size={20} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                          No properties listed by this client
                        </p>
                      </td>
                    </tr>
                  ) : (
                    properties.map((prop, idx) => (
                      <tr
                        key={prop.propertyId}
                        className="group hover:bg-slate-50/80 transition-all duration-200"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden relative transition-all">
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
                                {prop.microMarket || "Asset Alpha"}
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
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={() =>
                              navigate(
                                `/property/property-details/${prop.propertyId}`,
                              )
                            }
                            className="p-2 border border-slate-100 rounded-xl text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all group-hover:scale-110 active:scale-90"
                          >
                            <FiArrowRight size={16} />
                          </button>
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
