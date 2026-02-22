import React from "react";
import { FiMessageSquare } from "react-icons/fi";
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
    <section className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <h2 className="flex items-center gap-3 text-lg font-black text-slate-800 uppercase tracking-tight">
          <FiMessageSquare className="text-red-500" />
          Recent Enquiries
          <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full ml-1">
            {filteredInquiries.length}
          </span>
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading && inquiries.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-100">
            <div className="w-10 h-10 border-4 border-red-500/20 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Loading Enquiries...
            </p>
          </div>
        ) : filteredInquiries.length > 0 ? (
          filteredInquiries
            .slice(0, 5)
            .map((item, index) => (
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
            ))
        ) : (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-sm">
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              No pending enquiries
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default EnquirySection;
