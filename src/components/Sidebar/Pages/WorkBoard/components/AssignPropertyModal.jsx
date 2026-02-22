import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowRight,
  FiSearch,
  FiRefreshCw,
  FiUser,
  FiCheckCircle,
} from "react-icons/fi";

const AssignPropertyModal = ({
  isAssignModalOpen,
  setIsAssignModalOpen,
  targetProperty,
  userSearchTerm,
  setUserSearchTerm,
  searchingUsers,
  userSearchResults,
  assignPropertyLoading,
  handleAssignProperty,
}) => {
  return (
    <AnimatePresence>
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAssignModalOpen(false)}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden"
          >
            {/* Modal Header */}
            <div className="p-8 bg-slate-50 border-b border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">
                    {targetProperty?.salesId
                      ? "Reassign Property"
                      : "Assign Property"}
                  </h2>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                    {targetProperty?.microMarket || "New Property Location"}
                  </p>
                </div>
                <button
                  onClick={() => setIsAssignModalOpen(false)}
                  className="p-2 hover:bg-white rounded-xl text-slate-400 transition-colors"
                >
                  <FiArrowRight className="rotate-180" size={24} />
                </button>
              </div>

              {/* Search Box */}
              <div className="relative mt-6">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search sales agents by name..."
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-red-500/10 transition-all outline-none font-bold text-slate-700"
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                />
                {searchingUsers && (
                  <FiRefreshCw className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 animate-spin" />
                )}
              </div>
            </div>

            {/* Modal Body / Results */}
            <div className="max-h-[350px] overflow-y-auto p-4 space-y-2">
              {userSearchResults.length > 0 ? (
                userSearchResults.map((userRes) => (
                  <button
                    key={userRes.userId}
                    disabled={assignPropertyLoading}
                    onClick={() =>
                      handleAssignProperty(
                        targetProperty.propertyId,
                        userRes.userId,
                      )
                    }
                    className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all text-left group ${
                      targetProperty?.salesId === userRes.userId
                        ? "bg-slate-900 border-slate-900"
                        : "hover:bg-slate-50 border-transparent hover:border-slate-100"
                    } ${assignPropertyLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all ${
                          targetProperty?.salesId === userRes.userId
                            ? "bg-white/10 text-white"
                            : "bg-slate-100 text-slate-400 group-hover:bg-red-500 group-hover:text-white"
                        }`}
                      >
                        {(userRes.firstName || userRes.name || "A")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                      <div>
                        <p
                          className={`font-black text-xs uppercase ${
                            targetProperty?.salesId === userRes.userId
                              ? "text-white"
                              : "text-slate-800"
                          }`}
                        >
                          {userRes.name ||
                            `${userRes.firstName || ""} ${userRes.lastName || ""}`.trim() ||
                            "Agent"}
                        </p>
                        {targetProperty?.salesId === userRes.userId && (
                          <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mt-0.5">
                            Currently Assigned
                          </p>
                        )}
                      </div>
                    </div>
                    <div
                      className={`p-2 transition-opacity ${
                        targetProperty?.salesId === userRes.userId
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      <FiCheckCircle
                        className={
                          targetProperty?.salesId === userRes.userId
                            ? "text-white"
                            : "text-emerald-500"
                        }
                        size={20}
                      />
                    </div>
                  </button>
                ))
              ) : !searchingUsers ? (
                <div className="py-12 text-center text-slate-400">
                  <FiUser size={40} className="mx-auto mb-3 opacity-20" />
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    {userSearchTerm ? "No agents found" : "No agents available"}
                  </p>
                </div>
              ) : null}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AssignPropertyModal;
