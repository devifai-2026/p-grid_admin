import React, { useState, useEffect, useCallback } from "react";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiArrowUp,
  FiArrowDown,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { apiCall } from "../../../../helpers/apicall/apiCall";
import { showError, showSuccess, confirmAction } from "../../../../helpers/swalHelper";

// Admin Advanced Settings → Enquiry Pipeline Stages.
// Add / edit / reorder / activate-deactivate / delete the stages an enquiry
// moves through. Mirrors extraaedge-admin's Stage configuration.
const PRESET_COLORS = [
  "#64748B", "#2563EB", "#EA580C", "#7C3AED", "#16A34A", "#DC2626", "#0891B2", "#CA8A04",
];

const EnquiryStages = () => {
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // null = closed; {} = new; {id,...} = editing
  const [editing, setEditing] = useState(null);

  const fetchStages = useCallback(() => {
    setLoading(true);
    apiCall.get({
      route: "/inquiry-stages",
      params: { all: "true" },
      onSuccess: (res) => {
        setLoading(false);
        if (res.success) setStages(res.data || []);
      },
      onError: (err) => {
        setLoading(false);
        console.error("Error fetching stages:", err);
      },
    });
  }, []);

  useEffect(() => {
    fetchStages();
  }, [fetchStages]);

  const openNew = () =>
    setEditing({ name: "", color: PRESET_COLORS[0], isTerminal: false, score: "" });
  const openEdit = (s) =>
    setEditing({ id: s.id, name: s.name, color: s.color || PRESET_COLORS[0], isTerminal: s.isTerminal, isSystem: s.isSystem, score: s.score ?? "" });

  const save = () => {
    if (!editing.name.trim()) {
      showError("Stage name is required");
      return;
    }
    // Score is required and must be a non-negative whole number.
    const scoreStr = String(editing.score).trim();
    if (scoreStr === "") {
      showError("Score is required");
      return;
    }
    const scoreNum = Number(scoreStr);
    if (!Number.isInteger(scoreNum) || scoreNum < 0) {
      showError("Score must be a whole number of 0 or more");
      return;
    }
    setSaving(true);
    const payload = {
      name: editing.name.trim(),
      color: editing.color,
      isTerminal: editing.isTerminal,
      score: scoreNum,
    };
    const done = (res, failMsg) => {
      setSaving(false);
      if (res.success) {
        setEditing(null);
        fetchStages();
      } else showError(res.message || failMsg);
    };
    if (editing.id) {
      apiCall.put({
        route: `/inquiry-stages/${editing.id}`,
        payload,
        onSuccess: (res) => done(res, "Failed to update stage"),
        onError: (e) => { setSaving(false); showError(e?.data?.message || e?.message || "Failed to update stage"); },
      });
    } else {
      apiCall.post({
        route: "/inquiry-stages",
        payload,
        onSuccess: (res) => done(res, "Failed to create stage"),
        onError: (e) => { setSaving(false); showError(e?.data?.message || e?.message || "Failed to create stage"); },
      });
    }
  };

  const toggleActive = (s) => {
    apiCall.put({
      route: `/inquiry-stages/${s.id}`,
      payload: { isActive: !s.isActive },
      onSuccess: (res) => res.success && fetchStages(),
      onError: (e) => showError(e?.data?.message || e?.message || "Failed to update stage"),
    });
  };

  const move = (index, dir) => {
    const next = [...stages];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setStages(next); // optimistic
    apiCall.put({
      route: "/inquiry-stages/reorder",
      payload: { order: next.map((s) => s.id) },
      onSuccess: (res) => res.success && setStages(res.data || next),
      onError: (e) => { showError(e?.data?.message || e?.message || "Failed to reorder"); fetchStages(); },
    });
  };

  const remove = async (s) => {
    if (s.isSystem) {
      showError("Default stages can't be deleted — deactivate them instead.");
      return;
    }
    const ok = await confirmAction("Delete stage?", `Delete "${s.name}"? This can't be undone.`, "Yes, delete");
    if (!ok) return;
    apiCall.delete({
      route: `/inquiry-stages/${s.id}`,
      onSuccess: (res) => {
        if (res.success) { showSuccess("Stage deleted"); fetchStages(); }
        else showError(res.message || "Failed to delete");
      },
      onError: (e) => showError(e?.data?.message || e?.message || "Failed to delete stage"),
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-slate-800">Enquiry Pipeline Stages</h1>
        <button
          onClick={openNew}
          className="px-4 py-2 bg-[#EE2529] hover:bg-[#d31f23] text-white rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
        >
          <FiPlus size={16} /> Add Stage
        </button>
      </div>
      <p className="text-slate-500 text-sm mb-6">
        Define the stages an enquiry moves through. Drag-free reorder with the arrows;
        default stages can be deactivated but not deleted.
      </p>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-400 text-sm">Loading stages…</div>
        ) : stages.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-sm">No stages configured yet.</div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {stages.map((s, i) => (
              <li
                key={s.id}
                className={`flex items-center gap-3 px-4 py-3 ${!s.isActive ? "opacity-50" : ""}`}
              >
                <div className="flex flex-col">
                  <button
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="text-slate-300 hover:text-slate-600 disabled:opacity-30"
                  >
                    <FiArrowUp size={14} />
                  </button>
                  <button
                    onClick={() => move(i, 1)}
                    disabled={i === stages.length - 1}
                    className="text-slate-300 hover:text-slate-600 disabled:opacity-30"
                  >
                    <FiArrowDown size={14} />
                  </button>
                </div>
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: s.color || "#94a3b8" }}
                />
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-slate-800">{s.name}</span>
                  <span className="ml-2 text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {s.score ?? 0} pts
                  </span>
                  {s.isTerminal && (
                    <span className="ml-2 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                      Terminal
                    </span>
                  )}
                  {s.isSystem && (
                    <span className="ml-2 text-[10px] font-bold uppercase tracking-wide text-blue-400">
                      Default
                    </span>
                  )}
                </div>
                <button
                  onClick={() => toggleActive(s)}
                  className={`text-[11px] font-bold uppercase tracking-wide px-2 py-1 rounded ${
                    s.isActive ? "text-green-600 bg-green-50" : "text-slate-400 bg-slate-100"
                  }`}
                >
                  {s.isActive ? "Active" : "Inactive"}
                </button>
                <button onClick={() => openEdit(s)} className="p-2 text-slate-400 hover:text-blue-600">
                  <FiEdit2 size={15} />
                </button>
                {!s.isSystem && (
                  <button onClick={() => remove(s)} className="p-2 text-slate-400 hover:text-red-600">
                    <FiTrash2 size={15} />
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add / Edit dialog */}
      {editing && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">
                {editing.id ? "Edit Stage" : "New Stage"}
              </h3>
              <button onClick={() => setEditing(null)} className="text-slate-400 hover:text-slate-700">
                <FiX size={20} />
              </button>
            </div>

            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Stage Name</label>
            <input
              value={editing.name}
              onChange={(e) => setEditing((p) => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Site Visit Scheduled"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529]/20 focus:border-[#EE2529]"
              autoFocus
            />

            <label className="block text-xs font-bold text-slate-500 uppercase mt-4 mb-2">Colour</label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setEditing((p) => ({ ...p, color: c }))}
                  className={`w-7 h-7 rounded-full border-2 ${editing.color === c ? "border-slate-800" : "border-transparent"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>

            <label className="block text-xs font-bold text-slate-500 uppercase mt-4 mb-1">
              Score <span className="text-[#EE2529]">*</span>
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={editing.score}
              onChange={(e) => setEditing((p) => ({ ...p, score: e.target.value }))}
              placeholder="e.g. 10"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#EE2529]/20 focus:border-[#EE2529]"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Points an enquiry earns when it reaches this stage.
            </p>

            <label className="flex items-center gap-2 mt-4 cursor-pointer">
              <input
                type="checkbox"
                checked={!!editing.isTerminal}
                onChange={(e) => setEditing((p) => ({ ...p, isTerminal: e.target.checked }))}
                className="w-4 h-4 accent-[#EE2529]"
              />
              <span className="text-sm text-slate-600">
                Terminal stage (ends the pipeline — e.g. Converted / Lost)
              </span>
            </label>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditing(null)}
                className="flex-1 py-2.5 text-slate-500 font-semibold text-sm hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={saving}
                className="flex-1 py-2.5 bg-[#EE2529] hover:bg-[#d31f23] text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {saving ? "Saving…" : (<><FiCheck size={16} /> {editing.id ? "Update" : "Create"}</>)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnquiryStages;
