import React from "react";
import { motion } from "framer-motion";
import { FiMessageSquare, FiSearch, FiRefreshCw } from "react-icons/fi";

const EnquiryHeader = ({ searchTerm, setSearchTerm, loading, onRefresh }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <div className="space-y-0.5">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-200">
            <FiMessageSquare size={18} />
          </div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight uppercase">
            Property Enquiries
          </h1>
        </div>
        <p className="text-xs text-slate-500 font-medium italic pl-1">
          Manage and respond to investor queries.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative group flex-1 sm:flex-none">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-red-500 transition-colors size-4" />
          <input
            type="text"
            placeholder="Filter enquiries..."
            className="pl-10 pr-4 py-2.5 rounded-xl border border-white bg-white shadow-lg shadow-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm font-bold w-full sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={onRefresh}
          className="p-3 rounded-xl bg-white border border-white shadow-lg shadow-slate-100 hover:shadow-red-50 text-slate-500 hover:text-red-600 transition-all group active:scale-95"
          title="Refresh"
        >
          <FiRefreshCw
            size={18}
            className={`${loading ? "animate-spin" : "group-hover:rotate-180"} transition-transform duration-500`}
          />
        </button>
      </div>
    </motion.div>
  );
};

export default EnquiryHeader;
