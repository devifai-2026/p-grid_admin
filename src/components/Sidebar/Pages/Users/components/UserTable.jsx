import React from "react";
import { FiUser } from "react-icons/fi";
import UserTableRow from "./UserTableRow";

const UserTable = ({
  users,
  loading,
  canManageUsers,
  currentUser,
  onEdit,
  onDelete,
  getRoleColor,
  getStatusColor,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Created At
              </th>
              {canManageUsers && (
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {loading && users.length === 0 ? (
              <tr>
                <td
                  colSpan={canManageUsers ? 5 : 4}
                  className="px-6 py-12 text-center"
                >
                  <div className="flex justify-center items-center gap-2 text-slate-500">
                    <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                    Loading users...
                  </div>
                </td>
              </tr>
            ) : users.length > 0 ? (
              users.map((user) => (
                <UserTableRow
                  key={user.userId}
                  user={user}
                  currentUser={currentUser}
                  canManageUsers={canManageUsers}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  getRoleColor={getRoleColor}
                  getStatusColor={getStatusColor}
                />
              ))
            ) : (
              <tr>
                <td
                  colSpan={canManageUsers ? 5 : 4}
                  className="px-6 py-12 text-center text-slate-500"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                      <FiUser className="w-6 h-6 text-slate-400" />
                    </div>
                    <p>No users found matching your criteria</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
