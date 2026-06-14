import React, { useState, useEffect, useCallback } from "react";
import { FiDownload, FiRefreshCw, FiMail, FiPhone, FiUser } from "react-icons/fi";
import { apiCall } from "../../../../helpers/apicall/apiCall";
import { showError, showSuccess } from "../../../../helpers/swalHelper";

// Contact Leads — "Contact Us" form submissions from the consumer site.
// Admin-only. Filter by status, update status, export to CSV.
const fmtDateTime = (d) =>
  d
    ? new Date(d).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

const ROLE_LABELS = {
  investor: "Investor",
  "property-owner": "Property Owner",
  developer: "Developer",
  broker: "Broker",
  other: "Other",
};

const STATUS_STYLES = {
  open: "bg-blue-100 text-blue-700",
  in_progress: "bg-amber-100 text-amber-700",
  resolved: "bg-green-100 text-green-700",
};

const ContactLeads = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchLeads = useCallback(() => {
    setLoading(true);
    const params = { limit: 200 };
    if (statusFilter) params.status = statusFilter;
    apiCall.get({
      route: "/admin/contact-leads",
      params,
      onSuccess: (res) => {
        setLoading(false);
        if (res.success) setRows(res.data || []);
      },
      onError: (err) => {
        setLoading(false);
        showError(err?.data?.message || err?.message || "Failed to load contact leads");
      },
    });
  }, [statusFilter]);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  const updateStatus = (leadId, status) => {
    setUpdatingId(leadId);
    apiCall.patch({
      route: `/admin/contact-leads/${leadId}`,
      payload: { status },
      onSuccess: (res) => {
        setUpdatingId(null);
        if (res.success) {
          showSuccess("Status updated");
          setRows((prev) =>
            prev.map((r) => (r.leadId === leadId ? { ...r, status } : r)),
          );
        }
      },
      onError: (err) => {
        setUpdatingId(null);
        showError(err?.data?.message || err?.message || "Failed to update status");
      },
    });
  };

  const exportCsv = () => {
    const header = ["Name", "Email", "Phone", "Role", "Message", "Status", "Received"];
    const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const lines = rows.map((r) =>
      [
        r.name,
        r.email,
        r.phone || "",
        ROLE_LABELS[r.role] || r.role || "",
        r.message,
        r.status,
        fmtDateTime(r.createdAt),
      ]
        .map(escape)
        .join(","),
    );
    const csv = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contact-leads.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
            Contact Leads
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            "Contact Us" submissions from the website.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-red-500/20"
          >
            <option value="">All statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <button
            onClick={fetchLeads}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 text-sm font-bold hover:bg-slate-50 transition"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} size={14} /> Refresh
          </button>
          <button
            onClick={exportCsv}
            disabled={!rows.length}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition disabled:opacity-50"
          >
            <FiDownload size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <FiRefreshCw className="animate-spin mx-auto text-red-500 mb-3" size={28} />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Loading leads...
            </p>
          </div>
        ) : rows.length === 0 ? (
          <div className="py-20 text-center">
            <FiMail className="mx-auto text-slate-200 mb-3" size={40} />
            <p className="text-sm font-bold text-slate-500">
              {statusFilter
                ? `No ${statusFilter.replace("_", " ")} leads.`
                : "No contact leads yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-[11px] uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3 font-bold">Contact</th>
                  <th className="px-4 py-3 font-bold">Role</th>
                  <th className="px-4 py-3 font-bold">Message</th>
                  <th className="px-4 py-3 font-bold">Received</th>
                  <th className="px-4 py-3 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.leadId} className="border-t border-slate-50 hover:bg-slate-50/50">
                    <td className="px-4 py-3 align-top">
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        <FiUser size={12} className="text-red-500" /> {r.name}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                        <FiMail size={11} /> {r.email}
                      </div>
                      {r.phone && (
                        <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <FiPhone size={11} /> {r.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <span className="text-xs font-semibold text-slate-600">
                        {ROLE_LABELS[r.role] || r.role || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top max-w-md">
                      <p className="text-slate-600 whitespace-pre-wrap">{r.message}</p>
                    </td>
                    <td className="px-4 py-3 align-top whitespace-nowrap text-xs text-slate-500">
                      {fmtDateTime(r.createdAt)}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <select
                        value={r.status}
                        disabled={updatingId === r.leadId}
                        onChange={(e) => updateStatus(r.leadId, e.target.value)}
                        className={`text-[11px] font-black uppercase tracking-wider px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none ${
                          STATUS_STYLES[r.status] || "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactLeads;
