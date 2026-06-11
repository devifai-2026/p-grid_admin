import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaLeaf,
  FaSearch,
  FaPhone,
} from "react-icons/fa";
import { MdLocationOn, MdEmail, MdChatBubbleOutline } from "react-icons/md";
import { FiRefreshCw, FiUsers } from "react-icons/fi";
import { apiCall } from "../../../../../helpers/apicall/apiCall";

const GridView = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchCustomers = useCallback(() => {
    apiCall.get({
      route: `/get-client-users?limit=50&isActive=all`,
      onSuccess: (res) => {
        if (res.success) {
          setCustomers(Array.isArray(res.data) ? res.data : []);
        }
      },
      onError: (err) => {
        console.error("Error fetching client users:", err);
      },
      setLoading,
    });
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers, refreshKey]);

  const filteredCustomers = customers.filter((c) => {
    const term = searchTerm.toLowerCase();
    const name = (
      c.name || `${c.firstName || ""} ${c.lastName || ""}`
    ).toLowerCase();
    const email = (c.email || "").toLowerCase();
    return name.includes(term) || email.includes(term);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-2 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Clients ({filteredCustomers.length})
          </h1>
          <p className="text-slate-600 flex items-center gap-2">
            <FaLeaf className="w-4 h-4 text-emerald-500" />
            Connect with registered owners, brokers and investors
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search clients..."
              className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-[#EE2529] transition-all w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setRefreshKey((p) => p + 1)}
            className="p-2 rounded-lg border border-slate-200 hover:bg-white transition-all text-slate-600 shadow-sm"
            title="Refresh"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-red-500/20 border-t-[#EE2529] rounded-full animate-spin"></div>
          <p className="mt-4 text-slate-500 animate-pulse">Fetching clients...</p>
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-20 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiUsers className="w-10 h-10 text-slate-300" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            No Clients Found
          </h2>
          <p className="text-slate-500 max-w-xs mx-auto">
            {searchTerm
              ? `No results matching "${searchTerm}"`
              : "There are currently no registered clients in the system."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredCustomers.map((customer) => {
            const id = customer.userId || customer.id;
            const fullName =
              customer.name ||
              `${customer.firstName || ""} ${customer.lastName || ""}`.trim() ||
              "Unknown User";
            const role =
              customer.role || customer.roles?.[0]?.roleName || "Client";
            const broker = customer.brokerProfile;
            return (
              <div
                key={id}
                onClick={() => navigate(`/client-details/${id}`)}
                className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-slate-200 cursor-pointer"
              >
                {/* Header */}
                <div className="h-24 bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100 relative" />

                {/* Profile */}
                <div className="px-6 pb-6">
                  <div className="flex justify-center -mt-12 mb-4">
                    <div className="relative">
                      <img
                        src={
                          broker?.profilePhoto ||
                          customer.profilePhoto ||
                          customer.profilePicture ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            fullName,
                          )}&background=EE2529&color=fff`
                        }
                        alt={fullName}
                        className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover bg-slate-100"
                      />
                      <div
                        className={`absolute bottom-1 right-1 w-6 h-6 rounded-full border-2 border-white ${
                          customer.isActive ? "bg-emerald-500" : "bg-slate-400"
                        }`}
                      ></div>
                    </div>
                  </div>

                  {/* Name + Role */}
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-bold text-slate-900 mb-1 truncate">
                      {fullName}
                    </h3>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white bg-[#EE2529]">
                      {role}
                    </span>
                  </div>

                  {/* Contact */}
                  <div className="space-y-2 mb-4 text-sm text-slate-600 border-b border-slate-100 pb-4">
                    <div className="flex items-start gap-2">
                      <MdEmail className="text-slate-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-600 break-all">
                        {customer.email || "N/A"}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <FaPhone className="text-slate-500 mt-0.5 flex-shrink-0" />
                      <span className="text-slate-600">
                        {customer.mobileNumber || "N/A"}
                      </span>
                    </div>
                    {(broker?.locality || broker?.companyName) && (
                      <div className="flex items-start gap-2">
                        <MdLocationOn className="text-slate-500 mt-0.5 flex-shrink-0" />
                        <span className="text-slate-600 truncate">
                          {broker?.companyName || broker?.locality}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Action */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/client-details/${id}`);
                    }}
                    className="w-full bg-[#EE2529] hover:bg-[#D32F2F] text-white font-semibold py-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    <MdChatBubbleOutline className="w-4 h-4" />
                    View Profile
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default GridView;
