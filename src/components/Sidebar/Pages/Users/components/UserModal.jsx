import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiUser, FiInfo, FiCheckCircle, FiShield } from "react-icons/fi";

const UserModal = ({
  isOpen,
  onClose,
  editingId,
  formData,
  handleInputChange,
  handleSaveUser,
  actionLoading,
  isAdminOrSuperAdmin,
  isSalesManager,
  salesManagers,
}) => {
  const content = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />

          {/* Sidebar Panel */}
          <motion.div
            initial={{ x: "100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{
              type: "spring",
              damping: 35,
              stiffness: 400,
              opacity: { duration: 0.2 },
            }}
            className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-[-10px_0_50px_rgba(0,0,0,0.15)] flex flex-col h-screen border-l border-slate-100"
          >
            {/* Header - Compact & Premium */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-slate-900 text-white relative overflow-hidden shrink-0"
            >
              <div className="relative z-10 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
                      Infrastructure Management
                    </span>
                  </div>
                  <h2 className="text-xl font-black uppercase tracking-tighter leading-none">
                    {editingId ? "Edit User" : "Add New User"}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-xl transition-all text-slate-400 hover:text-white"
                >
                  <FiX size={20} />
                </button>
              </div>

              {/* Decorative Background Element */}
              <div className="absolute -right-4 -bottom-4 opacity-10 rotate-12">
                <FiShield size={100} />
              </div>
            </motion.div>

            {/* Form Content */}
            <form
              onSubmit={handleSaveUser}
              className="flex-1 overflow-y-auto custom-scrollbar flex flex-col"
            >
              <div className="p-6 space-y-6">
                {/* ID Badge for Edits */}
                {editingId && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg w-fit"
                  >
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                      User ID:
                    </span>
                    <span className="text-[10px] font-black text-slate-800 uppercase leading-none">
                      {editingId.slice(-8)}
                    </span>
                  </motion.div>
                )}

                {/* Personal Info Section */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <FiUser className="text-red-500" /> User Details
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-red-500 transition-all text-sm font-bold"
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase ml-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-red-500 transition-all text-sm font-bold"
                        placeholder="Doe"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-red-500 transition-all text-sm font-bold"
                      placeholder="john.doe@example.com"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-1">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      required
                      maxLength={10}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-red-500 transition-all text-sm font-bold"
                      placeholder="9876543210"
                    />
                  </div>
                </motion.div>

                {/* Role & Permissions Section */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                  className="space-y-4"
                >
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <FiShield className="text-red-500" /> Role Information
                  </p>

                  <div className="space-y-1">
                    <select
                      name="roleName"
                      value={formData.roleName}
                      onChange={handleInputChange}
                      disabled={!!editingId}
                      className={`w-full px-4 py-3 bg-slate-900 text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-red-500/10 border-0 transition-all text-xs font-black uppercase tracking-widest shadow-lg ${!!editingId ? "opacity-70 cursor-not-allowed" : ""}`}
                    >
                      <option value="Admin">Admin</option>
                      <option value="Sales Manager">Sales Manager</option>
                      <option value="Sales Executive - Client Dealer">
                        Sales Executive(Client Dealer)
                      </option>
                      <option value="Sales Executive - Property Manager">
                        Sales Executive(Property Manager)
                      </option>
                    </select>
                    {editingId && (
                      <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest mt-2 ml-1 flex items-center gap-1">
                        <FiInfo size={10} className="text-red-500" /> Role
                        cannot be changed after creation.
                      </p>
                    )}
                  </div>

                  {/* Hierarchy Logic */}
                  {isAdminOrSuperAdmin &&
                    formData.roleName.startsWith("Sales Executive") && (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 bg-red-50 border border-red-100 rounded-xl space-y-3"
                      >
                        <label className="text-[10px] font-black text-red-600 uppercase">
                          Reporting Structure
                        </label>
                        <select
                          name="salesManagerId"
                          value={formData.salesManagerId}
                          onChange={handleInputChange}
                          required
                          className="w-full px-3 py-2 bg-white border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500/20 text-xs font-bold"
                        >
                          <option value="">Assign Sales Manager</option>
                          {salesManagers.map((sm) => (
                            <option
                              key={sm.value || sm.userId || sm.id}
                              value={sm.value || sm.userId || sm.id}
                            >
                              {sm.label ||
                                sm.name ||
                                `${sm.firstName} ${sm.lastName}`}
                            </option>
                          ))}
                        </select>
                      </motion.div>
                    )}

                  {isSalesManager &&
                    formData.roleName.startsWith("Sales Executive") && (
                      <div className="p-4 bg-slate-900 rounded-xl flex items-start gap-3 border border-slate-800 shadow-md">
                        <div className="p-1.5 bg-red-500 rounded-lg">
                          <FiCheckCircle className="text-white" size={12} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[10px] font-black text-white uppercase tracking-tight">
                            Direct Assignment
                          </p>
                          <p className="text-[9px] text-slate-400 font-bold leading-tight mt-1">
                            Personnel will be deployed under your direct command
                            structure.
                          </p>
                        </div>
                      </div>
                    )}
                </motion.div>
              </div>

              {/* Action Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-auto p-6 bg-slate-50 border-t border-slate-100 flex flex-col gap-3"
              >
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-black uppercase tracking-widest text-[11px] hover:bg-red-600 transition-all shadow-[0_10px_30px_-10px_rgba(15,23,42,0.3)] hover:shadow-[0_10px_30px_-10px_rgba(220,38,38,0.4)] disabled:opacity-70 flex justify-center items-center gap-3 active:scale-95"
                >
                  {actionLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <> {editingId ? "Update User" : "Create User"}</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-3 text-slate-500 font-black uppercase tracking-widest text-[9px] hover:text-slate-800 transition-all"
                >
                  Cancel
                </button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
};

export default UserModal;
