import React from "react";
import { FiMessageSquare, FiTrendingUp } from "react-icons/fi";
import EnquiryCard from "../../Enquiry/components/EnquiryCard";

const EnquirySection = ({
  showEnquiries,
  loading,
  inquiries,
  filteredInquiries,
  isAdminOrManager,
  autoAssignLoading,
  handleAutoAssignInquiry,
  assigningId,
  setAssigningId,
  selectedExec,
  setSelectedExec,
  executives,
  handleAssignInquiry,
  assignInquiryLoading,
}) => {
  if (!showEnquiries) return null;

  return (
    <section className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-red-500">
            <FiMessageSquare size={20} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tighter">
              Active Enquiries
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <FiTrendingUp className="text-emerald-500" />
              Live Lead Stream
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="bg-slate-900 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
            {filteredInquiries.length} Volume
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {loading && inquiries.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-20 text-center border border-slate-100 shadow-sm border-dashed">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-red-500/10 border-t-red-600 rounded-2xl animate-spin" />
              <div className="absolute inset-2 border-4 border-slate-100 border-b-slate-300 rounded-xl animate-spin-slow" />
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
              Synchronizing lead database...
            </p>
          </div>
        ) : filteredInquiries.length > 0 ? (
          <div className="space-y-6">
            {filteredInquiries.slice(0, 5).map((item, index) => (
              <EnquiryCard
                key={item.id || item.propertyId}
                item={item}
                index={index}
                isManager={isAdminOrManager}
                autoAssignLoading={autoAssignLoading}
                handleAutoAssign={handleAutoAssignInquiry}
                assigningId={assigningId}
                setAssigningId={setAssigningId}
                selectedExec={selectedExec}
                setSelectedExec={setSelectedExec}
                executives={executives}
                handleAssign={handleAssignInquiry}
                assignLoading={assignInquiryLoading}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] p-16 text-center border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 mx-auto mb-4 border border-slate-100">
              <FiMessageSquare size={32} />
            </div>
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-tight mb-1">
              Quiet on the front
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              No pending leads requiring attention
            </p>
          </div>
        )}
      </div>

      {filteredInquiries.length > 5 && (
        <div className="text-center pt-2">
          <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors border-b border-slate-200 pb-1">
            View all {filteredInquiries.length} enquiries
          </button>
        </div>
      )}
    </section>
  );
};

export default EnquirySection;
