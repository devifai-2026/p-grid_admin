import React from "react";
import { FiUser, FiPlus } from "react-icons/fi";

const UserHeader = ({ canManageUsers, onAddClick }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Users</h1>
        <p className="text-slate-500 mt-1">
          Manage platform users and their roles
        </p>
      </div>
      {canManageUsers && (
        <button
          onClick={onAddClick}
          className="px-4 py-2 bg-[#EE2529] hover:bg-[#d31f23] text-white rounded-lg font-medium transition-colors shadow-sm flex items-center gap-2"
        >
          <FiPlus className="w-4 h-4" />
          Add New User
        </button>
      )}
    </div>
  );
};

export default UserHeader;
