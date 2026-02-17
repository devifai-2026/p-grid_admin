import React from "react";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const UserTableRow = ({
  user,
  currentUser,
  canManageUsers,
  onEdit,
  onDelete,
  getRoleColor,
  getStatusColor,
}) => {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold border border-slate-200">
            {user.name ? user.name.charAt(0).toUpperCase() : "?"}
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800">{user.name}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
            <p className="text-[10px] text-slate-400">{user.mobileNumber}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleColor(
            user.role,
          )}`}
        >
          {user.role}
        </span>
        {user.salesManagerId && (
          <div className="text-[10px] text-slate-400 mt-1">
            Manager Assigned
          </div>
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
            user.isActive,
          )}`}
        >
          {user.isActive ? "Active" : "Inactive"}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
      </td>
      {canManageUsers && (
        <td className="px-6 py-4 whitespace-nowrap text-right">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => onEdit(user)}
              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit"
            >
              <FiEdit2 className="w-4 h-4" />
            </button>
            {user.userId !== currentUser?.userId &&
              user.role !== "Super Admin" && (
                <button
                  onClick={() => onDelete(user.userId)}
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              )}
          </div>
        </td>
      )}
    </tr>
  );
};

export default UserTableRow;
