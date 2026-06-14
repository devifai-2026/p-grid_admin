import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { FiX, FiClock, FiCheck } from "react-icons/fi";
import { apiCall } from "../../../../helpers/apicall/apiCall";
import { showError, showSuccess } from "../../../../helpers/swalHelper";

// Update an enquiry's pipeline stage (with an optional note) and view its
// stage-change timeline. Stages come from the admin-configured list.
const InquiryStageModal = ({ isOpen, inquiry, stages, onClose, onUpdated }) => {
  const [stageId, setStageId] = useState("");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const inquiryId = inquiry?.id;

  const fetchHistory = useCallback(() => {
    if (!inquiryId) return;
    setHistoryLoading(true);
    apiCall.get({
      route: `/inquiries/${inquiryId}/history`,
      onSuccess: (res) => {
        setHistoryLoading(false);
        if (res.success) setHistory(res.data || []);
      },
      onError: () => setHistoryLoading(false),
    });
  }, [inquiryId]);

  useEffect(() => {
    if (isOpen && inquiry) {
      setStageId(inquiry.stageId || inquiry.stage?.id || "");
      setNote("");
      fetchHistory();
    }
  }, [isOpen, inquiry, fetchHistory]);

  const save = () => {
    if (!stageId) {
      showError("Please select a stage");
      return;
    }
    setSaving(true);
    apiCall.put({
      route: `/inquiries/${inquiryId}/stage`,
      payload: { stageId, note: note.trim() || undefined },
      onSuccess: (res) => {
        setSaving(false);
        if (res.success) {
          showSuccess("Enquiry stage updated");
          setNote("");
          fetchHistory();
          onUpdated?.();
        } else showError(res.message || "Failed to update stage");
      },
      onError: (e) => {
        setSaving(false);
        showError(e?.data?.message || e?.message || "Failed to update stage");
      },
    });
  };

  if (!isOpen || !inquiry) return null;

  const content = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Enquiry Status</h3>
            <p className="text-xs text-slate-400">
              {inquiry.inquirer?.firstName} {inquiry.inquirer?.lastName} ·{" "}
              {inquiry.property?.propertyType} in {inquiry.property?.city}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <FiX size={20} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto">
          {/* Stage picker */}
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
            Move to stage
          </label>
          <div className="flex flex-wrap gap-2 mb-4">
            {stages.map((s) => (
              <button
                key={s.id}
                onClick={() => setStageId(s.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  stageId === s.id
                    ? "text-white border-transparent"
                    : "bg-white text-slate-600 border-slate-200 hover:border-slate-400"
                }`}
                style={stageId === s.id ? { backgroundColor: s.color || "#0f172a" } : {}}
              >
                {s.name}
              </button>
            ))}
          </div>

          {/* Note */}
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">
            Note (optional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note about this update…"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529]/20 focus:border-[#EE2529] min-h-[80px] resize-none"
          />

          <button
            onClick={save}
            disabled={saving}
            className="w-full mt-4 py-2.5 bg-[#EE2529] hover:bg-[#d31f23] text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving ? "Saving…" : (<><FiCheck size={16} /> Update Stage</>)}
          </button>

          {/* Timeline */}
          <div className="mt-6">
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
              <FiClock size={13} /> Timeline
            </h4>
            {historyLoading ? (
              <p className="text-sm text-slate-400">Loading…</p>
            ) : history.length === 0 ? (
              <p className="text-sm text-slate-400">No stage changes yet.</p>
            ) : (
              <ul className="space-y-3">
                {history.map((h) => (
                  <li key={h.id} className="flex gap-3">
                    <span
                      className="w-2.5 h-2.5 rounded-full mt-1.5 shrink-0"
                      style={{ backgroundColor: h.stage?.color || "#94a3b8" }}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-700">
                        {h.stageName || h.stage?.name}
                      </p>
                      {h.note && (
                        <p className="text-xs text-slate-500 mt-0.5">{h.note}</p>
                      )}
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {h.changedByUser
                          ? `${h.changedByUser.firstName} ${h.changedByUser.lastName} · `
                          : ""}
                        {new Date(h.createdAt).toLocaleString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

export default InquiryStageModal;
