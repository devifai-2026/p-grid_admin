import React, { useState, useEffect, useCallback } from "react";
import { FiDownload, FiChevronDown, FiChevronUp, FiRefreshCw } from "react-icons/fi";
import { apiCall } from "../../../../helpers/apicall/apiCall";
import { showError } from "../../../../helpers/swalHelper";

// Enquiry Report — every enquiry with property, inquirer, assigned dealer,
// current stage, score, and expandable stage-transfer history. Filter by date
// range and stage; export to CSV. Mirrors extraaedge's Lead Report.
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "—";

const EnquiryReport = () => {
  const [rows, setRows] = useState([]);
  const [counts, setCounts] = useState({ enquiries: 0, transfers: 0 });
  const [loading, setLoading] = useState(false);
  const [stages, setStages] = useState([]);
  const [expanded, setExpanded] = useState(null);

  const [filters, setFilters] = useState({ fromDate: "", toDate: "", stageId: "" });

  useEffect(() => {
    apiCall.get({
      route: "/inquiry-stages",
      onSuccess: (res) => res.success && setStages(res.data || []),
      onError: () => {},
    });
  }, []);

  const fetchReport = useCallback(() => {
    setLoading(true);
    const params = { limit: 200 };
    if (filters.fromDate) params.fromDate = filters.fromDate;
    if (filters.toDate) params.toDate = filters.toDate;
    if (filters.stageId) params.stageId = filters.stageId;
    apiCall.get({
      route: "/reports/enquiries",
      params,
      onSuccess: (res) => {
        setLoading(false);
        if (res.success) {
          setRows(res.data || []);
          if (res.counts) setCounts(res.counts);
        }
      },
      onError: (err) => {
        setLoading(false);
        showError(err?.data?.message || err?.message || "Failed to load report");
      },
    });
  }, [filters]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const exportCsv = () => {
    const header = [
      "Enquiry",
      "Property",
      "Location",
      "Inquirer",
      "Email",
      "Assigned Dealer",
      "Manager",
      "Current Stage",
      "Score",
      "Created",
      "Stage Changes",
    ];
    const lines = rows.map((r) => {
      const property = r.property?.propertyType || "";
      const loc = [r.property?.microMarket, r.property?.city].filter(Boolean).join(", ");
      const inquirer = `${r.inquirer?.firstName || ""} ${r.inquirer?.lastName || ""}`.trim();
      const dealer = r.clientDealer
        ? `${r.clientDealer.firstName || ""} ${r.clientDealer.lastName || ""}`.trim()
        : "";
      const manager = r.manager
        ? `${r.manager.firstName || ""} ${r.manager.lastName || ""}`.trim()
        : "";
      return [
        r.inquiry || "",
        property,
        loc,
        inquirer,
        r.inquirer?.email || "",
        dealer,
        manager,
        r.stage?.name || "",
        r.score ?? 0,
        fmtDate(r.createdAt),
        r.transferCount ?? 0,
      ];
    });
    const csv = [header, ...lines]
      .map((row) => row.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `enquiry-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-slate-800">Enquiry Report</h1>
        <button
          onClick={exportCsv}
          disabled={rows.length === 0}
          className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
        >
          <FiDownload size={15} /> Export CSV
        </button>
      </div>
      <p className="text-slate-500 text-sm mb-5">
        Every enquiry with its current stage, score and full stage-change history.
      </p>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-3 mb-5 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">From</label>
          <input
            type="date"
            value={filters.fromDate}
            onChange={(e) => setFilters((f) => ({ ...f, fromDate: e.target.value }))}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">To</label>
          <input
            type="date"
            value={filters.toDate}
            onChange={(e) => setFilters((f) => ({ ...f, toDate: e.target.value }))}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Stage</label>
          <select
            value={filters.stageId}
            onChange={(e) => setFilters((f) => ({ ...f, stageId: e.target.value }))}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white min-w-[160px]"
          >
            <option value="">All stages</option>
            {stages.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setFilters({ fromDate: "", toDate: "", stageId: "" })}
          className="px-3 py-2 text-sm text-slate-500 hover:text-slate-800"
        >
          Clear
        </button>
        <button
          onClick={fetchReport}
          className="px-3 py-2 text-sm text-[#EE2529] flex items-center gap-1.5 ml-auto"
        >
          <FiRefreshCw size={14} /> Refresh
        </button>
      </div>

      <p className="text-xs font-bold text-slate-500 mb-3">
        {counts.enquiries} enquir{counts.enquiries === 1 ? "y" : "ies"} · {counts.transfers} stage change{counts.transfers === 1 ? "" : "s"}
      </p>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                {["Enquiry", "Inquirer", "Assigned Dealer", "Stage", "Score", "Created", ""].map((h, i) => (
                  <th key={i} className="px-5 py-3 text-[10px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-slate-400 text-sm">Loading…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-slate-400 text-sm">No enquiries match the filters.</td></tr>
              ) : (
                rows.map((r) => (
                  <React.Fragment key={r.id}>
                    <tr className="hover:bg-slate-50/50">
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-800">
                          {r.property?.propertyType || "Property"}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {[r.property?.microMarket, r.property?.city].filter(Boolean).join(", ")}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-700">{r.inquirer?.firstName} {r.inquirer?.lastName}</p>
                        <p className="text-[11px] text-slate-400">{r.inquirer?.email}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm text-slate-700">
                          {r.clientDealer ? `${r.clientDealer.firstName} ${r.clientDealer.lastName}` : "—"}
                        </p>
                        {r.manager && (
                          <p className="text-[11px] text-slate-400">
                            Mgr: {r.manager.firstName} {r.manager.lastName}
                          </p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {r.stage ? (
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase text-white" style={{ backgroundColor: r.stage.color || "#0f172a" }}>
                            {r.stage.name}
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-400">No stage</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-700">
                          {r.score ?? 0} pts
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">{fmtDate(r.createdAt)}</td>
                      <td className="px-5 py-4 text-right">
                        {r.transferCount > 0 && (
                          <button
                            onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                            className="text-slate-400 hover:text-slate-700 inline-flex items-center gap-1 text-[11px] font-bold"
                          >
                            {r.transferCount} {expanded === r.id ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                          </button>
                        )}
                      </td>
                    </tr>
                    {expanded === r.id && (
                      <tr className="bg-slate-50/60">
                        <td colSpan={7} className="px-5 py-4">
                          <p className="text-[10px] font-black text-slate-400 uppercase mb-2">Stage History</p>
                          <ul className="space-y-2">
                            {(r.statusHistory || [])
                              .slice()
                              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                              .map((h) => (
                                <li key={h.id} className="flex items-start gap-2 text-sm">
                                  <span className="w-2 h-2 rounded-full mt-1.5" style={{ backgroundColor: h.stage?.color || "#94a3b8" }} />
                                  <div>
                                    <span className="font-semibold text-slate-700">{h.stageName || h.stage?.name}</span>
                                    {h.note && <span className="text-slate-500"> — {h.note}</span>}
                                    <span className="text-[11px] text-slate-400 ml-2">
                                      {h.changedByUser ? `${h.changedByUser.firstName} ${h.changedByUser.lastName} · ` : ""}
                                      {new Date(h.createdAt).toLocaleString("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                                    </span>
                                  </div>
                                </li>
                              ))}
                          </ul>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EnquiryReport;
