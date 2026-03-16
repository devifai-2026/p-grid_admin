import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMessageSquare,
  FiSearch,
  FiRefreshCw,
  FiUser,
  FiHome,
  FiCalendar,
  FiMapPin,
  FiMail,
  FiChevronLeft,
  FiChevronRight,
  FiUserPlus,
} from "react-icons/fi";
import { apiCall } from "../../../../helpers/apicall/apiCall";
import { useAuth } from "../../../../context/AuthContext";

const COLORS = ["#EE2529", "#e5e7eb"];

const AssignedEnquiries = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(5);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1); // Reset to first page on search
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchInquiries = useCallback(() => {
    if (!user) return;
    setLoading(true);

    apiCall.get({
      route: `/sales/assigned-inquiries?page=${currentPage}&limit=${limit}&search=${debouncedSearch}`,
      onSuccess: (res) => {
        setLoading(false);
        if (res.success && res.data) {
          setInquiries(res.data);
          if (res.pagination) {
            setTotalPages(res.pagination.totalPages);
          }
        }
      },
      onError: (err) => {
        setLoading(false);
        console.error("Error fetching assigned inquiries:", err);
      },
    });
  }, [user, currentPage, limit, debouncedSearch]);

  useEffect(() => {
    fetchInquiries();
  }, [refreshKey, fetchInquiries]);

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 lg:p-8 space-y-8">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200">
              <FiUserPlus size={22} style={{ color: COLORS[0] }} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                Assigned Enquiries
              </h1>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest opacity-60">
                Tracking Active Dealer Engagements
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors" />
            <input
              type="text"
              placeholder="Search property, prospect or dealer..."
              className="pl-12 pr-6 py-3 rounded-2xl border-none bg-white shadow-xl shadow-slate-200/50 focus:ring-2 focus:ring-red-500/20 transition-all text-sm font-bold w-full md:w-80"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setRefreshKey((prev) => prev + 1)}
            className="p-3.5 rounded-2xl bg-white shadow-xl shadow-slate-200/50 hover:bg-slate-50 text-slate-500 hover:text-red-600 transition-all active:scale-95 group"
          >
            <FiRefreshCw
              size={20}
              className={
                loading
                  ? "animate-spin"
                  : "group-hover:rotate-180 transition-transform duration-500"
              }
            />
          </button>
        </div>
      </div>

      {/* Modern Table Layout */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Property Asset
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Prospect
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Requirement
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Assigned Dealer
                </th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Timeline
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {inquiries.map((item, idx) => {
                  const propertyImage = item.property?.media?.[0]?.fileUrl;

                  return (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-slate-100 overflow-hidden flex items-center justify-center text-slate-500 border border-slate-50 group-hover:shadow-lg transition-all duration-300">
                            {propertyImage ? (
                              <img
                                src={propertyImage}
                                alt="Property"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <FiHome size={24} />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-black text-slate-800 uppercase tracking-tight line-clamp-1">
                              {item.property?.propertyType || "Premium Listing"}
                            </p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1 mt-0.5">
                              <FiMapPin size={10} className="text-red-500" />
                              {item.property?.microMarket}, {item.property?.city}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-700">
                            {item.inquirer?.firstName} {item.inquirer?.lastName}
                          </p>
                          <p className="text-[11px] font-medium text-slate-400 lowercase">
                            {item.inquirer?.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-8 py-6 max-w-[200px]">
                        <p className="text-xs font-medium text-slate-500 line-clamp-2 italic">
                          "{item.inquiry || "No message provided"}"
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-600 border border-red-100 italic font-black text-xs">
                            {item.clientDealer?.firstName?.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-red-600">
                              {item.clientDealer?.firstName}{" "}
                              {item.clientDealer?.lastName}
                            </p>
                            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                              Client Dealer
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <FiCalendar size={14} className="text-slate-300" />
                            {new Date(
                              item.assignedAt || item.createdAt,
                            ).toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                            })}
                          </p>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>

        {inquiries.length === 0 && !loading && (
          <div className="py-24 text-center space-y-4">
            <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 mx-auto border border-dashed border-slate-200 mb-6">
              <FiMessageSquare size={40} />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                No Record Found
              </h3>
              <p className="text-sm text-slate-400 font-medium italic">
                {searchTerm
                  ? `No matches for "${searchTerm}"`
                  : "Everything is in the pending pool."}
              </p>
            </div>
          </div>
        )}

        {loading && inquiries.length === 0 && (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-4 border-red-500/20 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Synchronizing Records
            </p>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-8 py-6 border-t border-slate-50 flex items-center justify-between">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Page {currentPage} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1 || loading}
                className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-800 hover:border-slate-800 transition-all disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-400"
              >
                <FiChevronLeft size={18} />
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages || loading}
                className="p-2.5 rounded-xl border border-slate-200 text-slate-400 hover:text-slate-800 hover:border-slate-800 transition-all disabled:opacity-30 disabled:hover:border-slate-200 disabled:hover:text-slate-400"
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssignedEnquiries;
