import React, { useState, useEffect, useCallback } from "react";
import { FaLeaf, FaEdit, FaSearch, FaFilter } from "react-icons/fa";
import {
  FiRefreshCw,
  FiMail,
  FiPhone,
  FiMapPin,
  FiUsers,
} from "react-icons/fi";
import { apiCall } from "../../../../../helpers/apicall/apiCall";
import { useUserStorage } from "../../../../../helpers/useUserStorage";

const CustomerGrid = ({ roleTitle, roleName }) => {
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const fetchCustomers = useCallback(() => {
    setLoading(true);
    // Fetch users filtered by roleName
    apiCall.get({
      route: `/get-client-users?roleName=${roleName}&limit=50`,
      onSuccess: (res) => {
        setLoading(false);
        console.log(`Fetched Data for ${roleName}:`, res);
        if (res.success) {
          // Normalize data to ensure it's always an array
          const users = Array.isArray(res.data) ? res.data : [];
          setCustomers(users);
        }
      },
      onError: (err) => {
        setLoading(false);
        console.error(`Error fetching ${roleName}s:`, err);
      },
    });
  }, [roleName]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers, refreshKey]);

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

      {loading && customers.length === 0 ? (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <div
              key={customer.userId || customer.id}
              onMouseEnter={() =>
                setHoveredCard(customer.userId || customer.id)
              }
              onMouseLeave={() => setHoveredCard(null)}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-100 hover:border-red-100"
            >
              {/* Card Header Background */}
              <div className="h-24 bg-gradient-to-r from-red-50 to-orange-50 relative">
                <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg p-2 text-slate-400 group-hover:text-red-500 transition-colors">
                  <FaEdit className="w-4 h-4" />
                </div>
              </div>

              {/* Profile Info */}
              <div className="px-6 pb-6 -mt-12 relative text-center">
                <div className="inline-block relative">
                  <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <img
                      src={
                        customer.profilePicture ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name || "User")}&background=random`
                      }
                      alt={customer.name}
                      className="w-full h-full rounded-xl object-cover"
                    />
                  </div>
                  <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>

                <div className="mt-4">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                    {customer.name ||
                      `${customer.firstName || ""} ${customer.lastName || ""}`.trim() ||
                      "Unknown User"}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="px-3 py-1 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider rounded-full border border-red-100">
                      {customer.role || roleName}
                    </span>
                  </div>
                </div>

                <div className="mt-6 space-y-3 text-left">
                  <div className="flex items-start gap-3 text-slate-600 hover:text-red-500 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0 group-hover:bg-red-50">
                      <FiMail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        Email Address
                      </p>
                      <p className="text-sm truncate">{customer.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-slate-600 hover:text-red-500 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0 group-hover:bg-red-50">
                      <FiPhone className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        Phone Number
                      </p>
                      <p className="text-sm">
                        {customer.mobileNumber || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 text-slate-600 hover:text-red-500 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0 group-hover:bg-red-50">
                      <FiMapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        Business Details
                      </p>
                      <p className="text-sm truncate">
                        {customer.reraNumber
                          ? `RERA: ${customer.reraNumber}`
                          : "Property Consultant"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 rounded-xl p-3 group-hover:bg-red-50/50 transition-colors">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      Properties
                    </p>
                    <p className="text-lg font-bold text-slate-900">
                      {customer.viewProperty || 0}
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 group-hover:bg-red-50/50 transition-colors">
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      Inv. Value
                    </p>
                    <p className="text-lg font-bold text-red-600">
                      ₹{customer.investProperty || "0"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerGrid;
