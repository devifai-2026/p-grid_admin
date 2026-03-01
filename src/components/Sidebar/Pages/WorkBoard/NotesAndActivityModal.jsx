import React from "react";
import { FiX } from "react-icons/fi";

const NotesAndActivityModal = ({ isOpen, onClose, property }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in p-4">
      {/* Modal Container */}
      <div className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden animate-slide-up">
        {/* Subtle top decoration */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-red-50/50 to-white pointer-events-none" />

        {/* Header */}
        <div className="relative flex items-center justify-between p-6 pb-4 border-b border-gray-100/60 z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-[22px] font-black text-slate-800 flex items-center gap-2">
              <span role="img" aria-label="memo">
                📝
              </span>{" "}
              Notes & Activity
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-all font-bold"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 z-10 relative custom-scrollbar">
          {/* Timeline Section */}
          <div className="relative pl-12">
            {/* Timeline Line */}
            <div className="absolute top-6 bottom-0 left-[22px] w-[2px] bg-gradient-to-b from-red-200 via-blue-200 to-transparent" />

            {/* SE Item */}
            <div className="relative mb-10">
              {/* Circle */}
              <div className="absolute -left-[46px] -top-1 w-11 h-11 rounded-full bg-[#f05030] flex items-center justify-center text-white font-black text-[15px] shadow-lg shadow-red-500/20 z-10">
                SE
              </div>
              <div className="bg-[#F8F9FA] rounded-[24px] p-5 shadow-sm border border-slate-100/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-[15px]">
                      John (Sales Executive)
                    </span>
                    <span className="bg-[#FEECEC] text-[#e05252] px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide">
                      Sales
                    </span>
                  </div>
                  <span className="text-slate-400 text-[13px] font-medium">
                    2 hours ago
                  </span>
                </div>
                <p className="text-slate-700 text-[14px] leading-relaxed mb-4">
                  Found discrepancy in property documents. Square footage
                  doesn't match city records. Requesting verification.
                </p>
                <span className="bg-[#FFF4E5] text-[#E67E22] px-3 py-1.5 rounded-lg text-[12px] font-bold inline-block">
                  Pending Manager Review
                </span>
              </div>
            </div>

            {/* MGR Item */}
            <div className="relative mb-10">
              {/* Circle */}
              <div className="absolute -left-[46px] -top-1 w-11 h-11 rounded-full bg-[#0073E6] flex items-center justify-center text-white font-black text-[15px] shadow-lg shadow-blue-500/20 z-10">
                MGR
              </div>
              <div className="bg-[#F8F9FA] rounded-[24px] p-5 shadow-sm border border-slate-100/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800 text-[15px]">
                      Sarah (Manager)
                    </span>
                    <span className="bg-[#FEECEC] text-[#e05252] px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide">
                      Manager
                    </span>
                  </div>
                  <span className="text-slate-400 text-[13px] font-medium">
                    1 hour ago
                  </span>
                </div>

                <div className="bg-white rounded-[16px] p-4 border border-slate-100 shadow-sm mt-3">
                  <p className="text-slate-400 text-[13px] line-through leading-relaxed pb-3 border-b border-dashed border-slate-200">
                    Original: Found discrepancy in property documents. Square
                    footage doesn't match city records. Requesting verification.
                  </p>
                  <p className="text-[#2E7D32] text-[13px] leading-relaxed pt-3 font-medium">
                    Edited: Document mismatch detected: Property square footage
                    (2,500 sq ft) differs from city record (2,350 sq ft). Please
                    verify and provide updated survey.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Manager Review Required Box */}
          <div className="bg-[#FFFAFA] border border-[#ffdbdb] rounded-[24px] p-6 shadow-sm">
            <h4 className="text-[#e05252] font-black text-[16px] flex items-center gap-2 mb-1">
              🔧 Manager Review Required
            </h4>
            <p className="text-slate-500 text-[13px] mb-4 font-medium">
              Note from Sales Executive requires your review and approval
            </p>
            <textarea
              className="w-full bg-white border border-slate-200 rounded-[16px] p-4 text-[14px] text-slate-700 outline-none focus:border-[#e05252] focus:ring-2 focus:ring-red-100 resize-none transition-all mb-4 z-20 relative"
              rows={3}
              defaultValue="Document mismatch detected: Property square footage (2,500 sq ft) differs from city record (2,350 sq ft). Please verify and provide updated survey."
            />
            <div className="flex flex-wrap items-center gap-3">
              <button className="bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-6 py-2.5 rounded-full text-[14px] font-bold transition-all shadow-sm">
                Send to Manager
              </button>
              <button className="border border-[#e05252] text-[#e05252] hover:bg-red-50 bg-white px-6 py-2.5 rounded-full text-[14px] font-bold transition-all">
                ✕ Discard Changes
              </button>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Add New Note Box */}
          <div className="pb-4">
            <h4 className="text-slate-800 font-black text-[16px] flex items-center gap-2 mb-3">
              ✍️ Add New Note
            </h4>
            <textarea
              className="w-full bg-white border border-slate-200 rounded-[16px] p-4 text-[14px] outline-none focus:border-[#e05252] focus:ring-2 focus:ring-red-100 resize-none transition-all mb-4"
              rows={3}
              placeholder="Write your note... (Will be reviewed by manager before sending to owner)"
            />
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="bg-white border border-slate-200 text-slate-600 px-6 py-2.5 rounded-full text-[14px] font-bold hover:bg-slate-50 transition-all"
              >
                Cancel
              </button>
              <button className="bg-[#f05030] hover:bg-[#d94225] text-white px-6 py-2.5 rounded-full text-[14px] font-bold transition-all shadow-md shadow-red-500/20">
                Submit for Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesAndActivityModal;
