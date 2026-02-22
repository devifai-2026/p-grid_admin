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
  FiMapPin,
  FiPhone,
  FiMail,
  FiCalendar,
  FiChevronDown,
  FiAlertCircle,
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
  const isPending = item.status === "pending";
  const isAutoAssigning = autoAssignLoading === (item.propertyId + item.inquirerId);
  const isCurrentAssigning = assigningId === (item.id || item.propertyId);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
      className="relative bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500"
    >
      {/* Visual Accent */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${isPending ? "bg-amber-400" : "bg-blue-500"}`} />

      {/* Main Content Container */}
      <div className="p-6 md:p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div className="flex gap-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl shadow-slate-200 group-hover:scale-110 transition-transform duration-500">
                <FiHome size={28} />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center text-white ${isPending ? "bg-amber-500" : "bg-blue-500"}`}>
                {isPending ? <FiAlertCircle size={10} /> : <FiCheckCircle size={10} />}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
                  {item.property?.propertyType || "Premium Asset"}
                </h3>
                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border ${
                  isPending 
                    ? "bg-amber-50 text-amber-600 border-amber-100" 
                    : "bg-blue-50 text-blue-600 border-blue-100"
                }`}>
                  {item.status}
                </span>
              </div>
              <p className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                <FiMapPin className="text-red-500" />
                {item.property?.microMarket || "Unknown Block"}, {item.property?.city || "Unknown City"}
              </p>
            </div>
          </div>

          {isManager && isPending && (
            <div className="flex items-center gap-2 self-start md:self-auto">
              <button
                onClick={() => handleAutoAssign(item.propertyId, item.inquirerId)}
                disabled={isAutoAssigning}
                className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50"
              >
                {isAutoAssigning ? (
                  <FiRefreshCw className="animate-spin" size={14} />
                ) : (
                  <FiLayers size={14} />
                )}
                <span>Smart Assign</span>
              </button>
              <button
                onClick={() => setAssigningId(isCurrentAssigning ? null : (item.id || item.propertyId))}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 border ${
                  isCurrentAssigning 
                    ? "bg-red-50 text-red-600 border-red-200" 
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                }`}
              >
                <FiUserPlus size={14} />
                <span>Manual</span>
              </button>
            </div>
          )}
        </div>

        {/* Assignment Interface */}
        <AnimatePresence>
          {isCurrentAssigning && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-3xl flex flex-col sm:flex-row items-center gap-4">
                <div className="flex-1 w-full relative group/select">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/select:text-red-500 transition-colors" />
                  <select
                    value={selectedExec}
                    onChange={(e) => setSelectedExec(e.target.value)}
                    className="w-full appearance-none pl-12 pr-10 py-4 rounded-2xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 text-[11px] font-black uppercase tracking-widest bg-white cursor-pointer transition-all"
                  >
                    <option value="">Choose Executive</option>
                    {executives.map((exec) => (
                      <option
                        key={exec.value || exec.userId || exec.id}
                        value={exec.value || exec.userId || exec.id}
                      >
                        {exec.label}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleAssign(item.propertyId, item.inquirerId)}
                    disabled={!selectedExec || assignLoading}
                    className="flex-1 sm:flex-none px-8 py-4 bg-red-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-red-700 shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {assignLoading ? <FiRefreshCw className="animate-spin" /> : <FiCheckCircle />}
                    Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* User Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 p-6 bg-slate-50 border border-slate-100 rounded-[2rem]">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <FiUser className="text-red-500" size={12} /> Prospect Identity
            </p>
            <p className="text-sm font-black text-slate-800 uppercase italic">
              {item.inquirer
                ? `${item.inquirer.firstName} ${item.inquirer.lastName}`
                : "Confidential Investor"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <FiMail className="text-red-500" size={12} /> Communication
            </p>
            <p className="text-xs font-bold text-slate-600 lowercase transition-colors hover:text-red-500 cursor-pointer">
              {item.inquirer?.email || "No email available"}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <FiCalendar className="text-red-500" size={12} /> Intent Date
            </p>
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-slate-600">
                {new Date(item.createdAt || Date.now()).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Message Content */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-2">
             <FiClock className="text-red-500" size={14} />
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inquiry Timeline</span>
          </div>
          
          <div className="space-y-3">
            {item.inquiries?.map((note, idx) => (
              <div
                key={idx}
                className="relative p-5 rounded-3xl bg-white border border-slate-100 shadow-sm group/note hover:border-red-100 transition-all duration-300"
              >
                <p className="text-slate-600 text-xs leading-relaxed font-bold">
                  {note.question}
                </p>
                <div className="mt-3 pt-3 border-t border-slate-50 flex justify-between items-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                    <FiClock size={10} />
                    {new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover/note:bg-red-50 group-hover/note:text-red-500 transition-all">
                    <FiUser size={12} />
                  </div>
                </div>
              </div>
            ))}

            {(!item.inquiries || item.inquiries.length === 0) && (
              <div className="py-12 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200 text-center">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-200 mx-auto mb-3 shadow-sm">
                  <FiLayers size={24} />
                </div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest italic">
                  Observation portal waiting for data
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default EnquiryCard;
