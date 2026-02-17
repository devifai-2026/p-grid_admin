import React from "react";
import { FiSearch, FiFilter, FiRefreshCw } from "react-icons/fi";

const UserFilters = ({
  searchTerm,
  setSearchTerm,
  selectedRole,
  setSelectedRole,
  loading,
  onRefresh,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="relative w-full md:w-96">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search users by name or email..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <button
          onClick={onRefresh}
          className="p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors"
          title="Refresh List"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} />
        </button>

        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-50 min-w-[150px]">
          <FiFilter className="text-slate-500 w-4 h-4" />
          <select
            className="bg-transparent border-none outline-none text-sm text-slate-700 w-full cursor-pointer"
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
            }}
          >
            <option value="All">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Sales Manager">Sales Manager</option>
            <option value="Sales Executive">Sales Executive</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default UserFilters;
