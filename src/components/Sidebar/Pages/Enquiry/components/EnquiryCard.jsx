import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHome,
  FiRefreshCw,
  FiLayers,
  FiUserPlus,
  FiUser,
  FiClock,
  FiCheckCircle,
  FiChevronRight,
} from "react-icons/fi";

const EnquiryCard = ({
  item,
  index,
  isManager,
  autoAssignLoading,
  handleAutoAssign,
  assigningId,
  setAssigningId,
  selectedExec,
  setSelectedExec,
  executives,
  handleAssign,
  assignLoading,
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-2xl md:rounded-3xl shadow-xl shadow-slate-100 border border-white overflow-hidden group hover:shadow-red-50 transition-all duration-300"
    >
      {/* Card Header Strip */}
      <div className="px-5 py-4 bg-slate-50/50 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-red-400 flex items-center justify-center text-white shadow-md shadow-red-100 group-hover:rotate-6 transition-transform">
            <FiHome size={18} />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-black text-slate-800 uppercase tracking-tighter">
              {item.property?.propertyType || "Enquiry"} in{" "}
              {item.property?.city}
            </h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest ${
                  item.status === "pending"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {item.status}
              </span>
            </div>
          </div>
        </div>

        {isManager && item.status === "pending" && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAutoAssign(item.propertyId, item.inquirerId)}
              disabled={autoAssignLoading === item.propertyId + item.inquirerId}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all active:scale-95 disabled:opacity-50"
            >
              {autoAssignLoading === item.propertyId + item.inquirerId ? (
                <FiRefreshCw className="animate-spin size-3" />
              ) : (
                <FiLayers size={14} />
              )}
              <span className="hidden sm:inline">Auto-Assign</span>
            </button>
            <button
              onClick={() => setAssigningId(item.id || item.propertyId)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-md shadow-red-100 active:scale-95"
            >
              <FiUserPlus size={14} />
              <span className="hidden sm:inline">Assign</span>
            </button>
          </div>
        )}
      </div>

      {/* Assignment Dropdown UI */}
      <AnimatePresence>
        {assigningId === (item.id || item.propertyId) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-red-50/20 border-b border-red-100"
          >
            <div className="p-5 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-3">
              <div className="flex-1 w-full relative">
                <select
                  value={selectedExec}
                  onChange={(e) => setSelectedExec(e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-2.5 rounded-xl border border-red-100 focus:outline-none focus:border-red-500 text-[10px] font-black uppercase tracking-widest bg-white cursor-pointer"
                >
                  <option value="">Select Sales Agent</option>
                  {executives.map((exec) => (
                    <option
                      key={exec.value || exec.userId || exec.id}
                      value={exec.value || exec.userId || exec.id}
                    >
                      {exec.label}
                    </option>
                  ))}
                </select>
                <FiChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500 rotate-90 pointer-events-none" />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={() => handleAssign(item.propertyId, item.inquirerId)}
                  disabled={!selectedExec || assignLoading}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-700 shadow-md shadow-red-200 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  {assignLoading ? (
                    <FiRefreshCw className="animate-spin size-3" />
                  ) : (
                    <FiCheckCircle size={14} />
                  )}
                  Confirm
                </button>
                <button
                  onClick={() => {
                    setAssigningId(null);
                    setSelectedExec("");
                  }}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-white text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest border border-slate-200 hover:bg-slate-50 transition-all active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Queries Section */}
      <div className="p-4 md:p-6 space-y-4">
        {item.inquiries?.map((note, idx) => (
          <div
            key={idx}
            className="flex gap-3 md:gap-4 p-4 rounded-xl md:rounded-2xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:shadow-lg hover:shadow-slate-100 transition-all group/note"
          >
            <div className="flex-shrink-0 relative">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-300 border border-slate-100 shadow-sm group-hover/note:text-red-500 group-hover/note:scale-110 transition-all">
                <FiUser size={18} />
              </div>
              {idx === 0 && (
                <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-600 rounded-full border-2 border-white"></div>
              )}
            </div>

            <div className="flex-1 space-y-1.5">
              <div className="flex justify-between items-center">
                <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight italic">
                  {item.inquirer
                    ? `${item.inquirer.firstName} ${item.inquirer.lastName}`
                    : "Investor"}
                </p>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <FiClock size={10} />
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="relative">
                <p className="text-slate-600 text-xs leading-relaxed font-medium">
                  {note.question}
                </p>
              </div>
            </div>
          </div>
        ))}

        {(!item.inquiries || item.inquiries.length === 0) && (
          <div className="py-6 text-center space-y-2">
            <FiLayers size={30} className="text-slate-200 mx-auto" />
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">
              No message content found
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EnquiryCard;
