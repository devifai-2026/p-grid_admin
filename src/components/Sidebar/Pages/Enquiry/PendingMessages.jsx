import React, { useState, useEffect, useCallback } from "react";
import { FiCheck, FiSlash, FiRefreshCw, FiMessageSquare, FiMapPin } from "react-icons/fi";
import { apiCall } from "../../../../helpers/apicall/apiCall";
import { showError, showSuccess } from "../../../../helpers/swalHelper";

// Admin/Manager queue of enquiry messages from Client Dealers awaiting approval
// before the client sees them. Approve or decline inline.
const PendingMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchPending = useCallback(() => {
    setLoading(true);
    apiCall.get({
      route: "/inquiry-messages/pending",
      onSuccess: (res) => {
        setLoading(false);
        if (res.success) setMessages(res.data || []);
      },
      onError: (err) => {
        setLoading(false);
        showError(err?.data?.message || err?.message || "Failed to load pending messages");
      },
    });
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const review = (messageId, action) => {
    apiCall.put({
      route: `/inquiry-messages/${messageId}/review`,
      payload: { action },
      onSuccess: (res) => {
        if (res.success) {
          showSuccess(`Message ${action}d`);
          setMessages((prev) => prev.filter((m) => m.id !== messageId));
        } else showError(res.message || "Failed");
      },
      onError: (e) => showError(e?.data?.message || e?.message || "Failed"),
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-slate-800">Pending Message Approvals</h1>
        <button onClick={fetchPending} className="text-[#EE2529] flex items-center gap-1.5 text-sm">
          <FiRefreshCw size={14} /> Refresh
        </button>
      </div>
      <p className="text-slate-500 text-sm mb-6">
        Dealer messages awaiting your approval before the client can see them.
      </p>

      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-10 text-center text-slate-400 text-sm">
          Loading…
        </div>
      ) : messages.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-slate-200 p-12 text-center">
          <FiMessageSquare className="mx-auto text-slate-300 mb-3" size={36} />
          <p className="text-slate-400 text-sm font-medium">No messages awaiting approval.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div key={m.id} className="bg-white rounded-xl border border-slate-200 p-5">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {m.sender ? `${m.sender.firstName} ${m.sender.lastName}` : "Dealer"}
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1">
                    <FiMapPin size={10} className="text-red-500" />
                    {m.inquiry?.property?.propertyType} ·{" "}
                    {m.inquiry?.property?.city} · for{" "}
                    {m.inquiry?.inquirer?.firstName} {m.inquiry?.inquirer?.lastName}
                  </p>
                </div>
                <span className="text-[10px] text-slate-400">
                  {new Date(m.createdAt).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-sm text-slate-700 bg-slate-50 rounded-lg p-3 mb-3">{m.message}</p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => review(m.id, "decline")}
                  className="flex items-center gap-1.5 px-4 py-2 text-red-600 border border-red-200 rounded-lg text-xs font-bold hover:bg-red-50"
                >
                  <FiSlash size={13} /> Decline
                </button>
                <button
                  onClick={() => review(m.id, "approve")}
                  className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700"
                >
                  <FiCheck size={13} /> Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingMessages;
