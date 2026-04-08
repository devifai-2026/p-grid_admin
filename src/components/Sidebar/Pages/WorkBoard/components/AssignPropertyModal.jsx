import React from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowRight,
  FiSearch,
  FiRefreshCw,
  FiUser,
  FiCheckCircle,
  FiX,
  FiInfo,
  FiMapPin,
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
  const content = (
    <AnimatePresence>
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-[99999] overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAssignModalOpen(false)}
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
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
            className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-[-10px_0_50px_rgba(0,0,0,0.1)] flex flex-col h-screen border-l border-slate-100"
          >
            {/* Header - Compact */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-slate-900 text-white relative overflow-hidden shrink-0"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 rotate-12 pointer-events-none">
                <FiUser size={100} />
              </div>

              <div className="relative z-10">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-500/10">
                    <FiUser size={20} className="text-white" />
                  </div>
                  <button
                    onClick={() => setIsAssignModalOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-xl transition-all"
                  >
                    <FiX size={20} />
                  </button>
                </div>

                <h2 className="text-xl font-black uppercase tracking-tighter leading-none">
                  {targetProperty?.salesId
                    ? "Re-Assign Property"
                    : "Assign Portfolio"}
                </h2>
                <p className="mt-1 text-slate-400 text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 leading-none">
                  <FiInfo className="text-red-500" />
                  Management Protocol active
                </p>
              </div>
            </motion.div>

            {/* Property Minimal Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mx-4 -mt-3 relative z-20 shrink-0"
            >
              <div className="bg-white rounded-2xl p-3 shadow-lg shadow-slate-200/50 border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                  {targetProperty?.media?.[0]?.fileUrl ? (
                    <img
                      src={targetProperty.media[0].fileUrl}
                      className="w-full h-full object-cover"
                      alt=""
                    />
                  ) : (
                    <FiMapPin className="text-slate-200" size={20} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-slate-800 uppercase truncate text-xs">
                    {targetProperty?.microMarket || "Asset Alpha"}
                  </h4>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[8px] font-black uppercase text-red-500 tracking-widest">
                      {targetProperty?.propertyType}
                    </span>
                    <span className="text-slate-200 w-[1px] h-2 bg-slate-200" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Search - Streamlined */}
            <div className="flex-1 flex flex-col min-h-0 bg-white">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="px-5 pt-6 pb-2"
              >
                <div className="relative">
                  <FiSearch
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    size={16}
                  />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search personnel..."
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] focus:ring-4 focus:ring-red-500/5 focus:bg-white focus:border-red-500 transition-all outline-none font-bold text-slate-600 placeholder:text-slate-300 placeholder:uppercase placeholder:tracking-widest"
                    value={userSearchTerm}
                    onChange={(e) => setUserSearchTerm(e.target.value)}
                  />
                  {searchingUsers && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <FiRefreshCw
                        className="text-red-500 animate-spin"
                        size={14}
                      />
                    </div>
                  )}
                </div>
              </motion.div>

              {/* List - Compact Rows */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.25 }}
                className="flex-1 overflow-y-auto px-5 pb-5 mt-2 custom-scrollbar"
              >
                <div className="flex items-center justify-between mb-4 sticky top-0 bg-white py-2 z-10 border-b border-slate-50">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    Available Directory
                  </p>
                  <span className="text-[8px] font-black text-white bg-slate-900 px-1.5 py-0.5 rounded-md">
                    {userSearchResults.length}
                  </span>
                </div>

                <div className="space-y-2">
                  {userSearchResults.length > 0 ? (
                    userSearchResults.map((userRes, idx) => {
                      const resId = userRes.userId || userRes.id;
                      const isSelected = targetProperty?.salesId === resId;

                      return (
                        <motion.button
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + idx * 0.02 }}
                          key={resId || idx}
                          disabled={assignPropertyLoading}
                          onClick={() =>
                            handleAssignProperty(
                              targetProperty.propertyId,
                              resId,
                            )
                          }
                          className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left group ${
                            isSelected
                              ? "bg-slate-900 border-slate-900 shadow-md"
                              : "bg-white border-slate-50 hover:border-red-500 hover:shadow-sm"
                          } ${assignPropertyLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-xs transition-all ${
                                isSelected
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
                                className={`font-black text-[11px] uppercase tracking-tight ${
                                  isSelected ? "text-white" : "text-slate-700"
                                }`}
                              >
                                {userRes.name ||
                                  `${userRes.firstName || ""} ${userRes.lastName || ""}`.trim() ||
                                  "Agent"}
                              </p>
                              {isSelected ? (
                                <p className="text-[8px] text-red-200 font-black uppercase tracking-widest">
                                  Currently Assigned
                                </p>
                              ) : (
                                <p className="text-[8px] text-slate-300 font-bold uppercase tracking-widest">
                                  Lead Exec • {userRes.email?.split("@")[0]}
                                </p>
                              )}
                            </div>
                          </div>
                          <div
                            className={`transition-all ${
                              isSelected
                                ? "opacity-100 scale-110"
                                : "opacity-0 group-hover:opacity-100 scale-100"
                            }`}
                          >
                            <FiCheckCircle
                              className={
                                isSelected ? "text-red-400" : "text-red-500"
                              }
                              size={16}
                            />
                          </div>
                        </motion.button>
                      );
                    })
                  ) : (
                    <div className="py-20 text-center animate-fadeIn">
                      <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mx-auto mb-4 border border-dashed border-slate-200">
                        <FiUser size={24} className="text-slate-300" />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                        {searchingUsers
                          ? "Locating Personnel..."
                          : "No Personnel Found"}
                      </p>
                      <p className="text-[8px] font-bold text-slate-300 uppercase mt-2">
                        {searchingUsers
                          ? "Synchronizing with Directory"
                          : "Try a different search term"}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Compact Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="p-5 bg-slate-50 border-t border-slate-100 shrink-0"
            >
              <div className="flex gap-3 items-center">
                <FiInfo className="text-red-500 shrink-0" size={14} />
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                  Assignment re-routes leads to the selected agent immediately.
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
};

export default AssignPropertyModal;
