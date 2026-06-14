import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { FiX, FiSend, FiCheck, FiSlash, FiClock } from "react-icons/fi";
import { apiCall } from "../../../../helpers/apicall/apiCall";
import { showError, showSuccess } from "../../../../helpers/swalHelper";
import { useAuth } from "../../../../context/AuthContext";

// Enquiry conversation thread (admin/dealer side). Dealer posts a message
// (pending admin approval); inquirer replies appear directly; admins can
// approve/decline pending dealer messages.
const StatusPill = ({ status }) => {
  const map = {
    pending: { label: "Pending Approval", cls: "bg-amber-100 text-amber-700" },
    approved: { label: "Approved", cls: "bg-green-100 text-green-700" },
    denied: { label: "Declined", cls: "bg-red-100 text-red-700" },
  };
  const c = map[status] || map.approved;
  return (
    <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${c.cls}`}>
      {c.label}
    </span>
  );
};

const InquiryMessagesModal = ({ isOpen, inquiry, onClose }) => {
  const { user } = useAuth();
  const isAdmin = ["Admin", "Super Admin", "Sales Manager"].includes(user?.role);
  const inquiryId = inquiry?.id;

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const fetchMessages = useCallback(() => {
    if (!inquiryId) return;
    setLoading(true);
    apiCall.get({
      route: `/inquiries/${inquiryId}/messages`,
      onSuccess: (res) => {
        setLoading(false);
        if (res.success) setMessages(res.data || []);
      },
      onError: () => setLoading(false),
    });
  }, [inquiryId]);

  useEffect(() => {
    if (isOpen) {
      setText("");
      fetchMessages();
    }
  }, [isOpen, fetchMessages]);

  const send = () => {
    if (!text.trim()) return;
    setSending(true);
    apiCall.post({
      route: `/inquiries/${inquiryId}/messages`,
      payload: { message: text.trim() },
      onSuccess: (res) => {
        setSending(false);
        if (res.success) {
          setText("");
          fetchMessages();
        } else showError(res.message || "Failed to send");
      },
      onError: (e) => {
        setSending(false);
        showError(e?.data?.message || e?.message || "Failed to send");
      },
    });
  };

  const review = (messageId, action) => {
    apiCall.put({
      route: `/inquiry-messages/${messageId}/review`,
      payload: { action },
      onSuccess: (res) => {
        if (res.success) {
          showSuccess(`Message ${action}d`);
          fetchMessages();
        } else showError(res.message || "Failed");
      },
      onError: (e) => showError(e?.data?.message || e?.message || "Failed"),
    });
  };

  if (!isOpen || !inquiry) return null;

  const content = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Enquiry Conversation</h3>
            <p className="text-xs text-slate-400">
              {inquiry.inquirer?.firstName} {inquiry.inquirer?.lastName} ·{" "}
              {inquiry.property?.propertyType} in {inquiry.property?.city}
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <FiX size={20} />
          </button>
        </div>

        {/* Thread */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {loading ? (
            <p className="text-sm text-slate-400 text-center py-6">Loading…</p>
          ) : messages.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">No messages yet.</p>
          ) : (
            messages.map((m) => {
              const fromDealer = m.senderType === "dealer";
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${fromDealer ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                      fromDealer
                        ? "bg-slate-900 text-white rounded-br-sm"
                        : "bg-slate-100 text-slate-700 rounded-bl-sm"
                    }`}
                  >
                    {m.displayMessage || m.message}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-400">
                      {m.sender ? `${m.sender.firstName} ${m.sender.lastName}` : fromDealer ? "Dealer" : "Client"} ·{" "}
                      {new Date(m.createdAt).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {fromDealer && <StatusPill status={m.status} />}
                  </div>
                  {/* Admin approve/decline for pending dealer messages */}
                  {isAdmin && fromDealer && m.status === "pending" && (
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => review(m.id, "approve")}
                        className="flex items-center gap-1 text-[10px] font-bold text-green-600 hover:underline"
                      >
                        <FiCheck size={12} /> Approve
                      </button>
                      <button
                        onClick={() => review(m.id, "decline")}
                        className="flex items-center gap-1 text-[10px] font-bold text-red-600 hover:underline"
                      >
                        <FiSlash size={12} /> Decline
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Composer */}
        <div className="p-4 border-t border-slate-100">
          {!isAdmin && (
            <p className="text-[11px] text-slate-400 mb-2 flex items-center gap-1.5">
              <FiClock size={11} /> Your message needs admin approval before the client sees it.
            </p>
          )}
          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Type a message…"
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529]/20 focus:border-[#EE2529]"
            />
            <button
              onClick={send}
              disabled={sending || !text.trim()}
              className="px-4 bg-[#EE2529] hover:bg-[#d31f23] text-white rounded-xl disabled:opacity-50 flex items-center"
            >
              <FiSend size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

export default InquiryMessagesModal;
