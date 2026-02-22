import React from "react";
import { FiActivity, FiSearch, FiRefreshCw } from "react-icons/fi";

const WorkBoardHeader = ({ searchTerm, setSearchTerm, loading, onRefresh }) => {
  return (
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
          onClick={onRefresh}
          className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-500 hover:text-red-500 hover:border-red-100 hover:bg-red-50 transition-all shadow-sm"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} />
        </button>
      </div>
    </div>
  );
};

export default WorkBoardHeader;
