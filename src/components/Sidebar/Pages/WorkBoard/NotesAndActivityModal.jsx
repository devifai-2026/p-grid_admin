import React, { useState, useEffect, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import {
  FiX,
  FiSend,
  FiCheck,
  FiCheckCircle,
  FiXCircle,
  FiEdit3,
  FiAlertCircle,
  FiClock,
  FiEye,
  FiMessageSquare,
  FiLoader,
  FiRefreshCw,
} from "react-icons/fi";
import { useAuth } from "../../../../context/AuthContext";
import {
  fetchNotes,
  submitNote,
  approveNote,
  declineNote,
  editAndApproveNote,
} from "../../../../helpers/API/NotesAPI";
import { showSuccess, showError } from "../../../../helpers/swalHelper";

// ─── Role constants ────────────────────────────────────────────────────────────
const ROLES = {
  ADMIN: "Admin",
  SUPER_ADMIN: "Super Admin",
  SALES_MANAGER: "Sales Manager",
  DEALER: "Sales Executive - Client Dealer",
  PROPERTY_MANAGER: "Sales Executive - Property Manager",
};

// ─── Helpers ───────────────────────────────────────────────────────────────────
const isAdminRole = (role) =>
  role === ROLES.ADMIN || role === ROLES.SUPER_ADMIN;
const isDealerRole = (role) =>
  role === ROLES.DEALER || role === ROLES.PROPERTY_MANAGER;
const isManagerRole = (role) => role === ROLES.SALES_MANAGER;

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - d) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

// ─── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending: {
    label: "Pending Review",
    icon: <FiClock size={11} />,
    cls: "bg-amber-50 text-amber-600 border-amber-200",
    dot: "bg-amber-400",
  },
  approved: {
    label: "Approved",
    icon: <FiCheckCircle size={11} />,
    cls: "bg-emerald-50 text-emerald-600 border-emerald-200",
    dot: "bg-emerald-400",
  },
  denied: {
    label: "Declined",
    icon: <FiXCircle size={11} />,
    cls: "bg-red-50 text-red-500 border-red-200",
    dot: "bg-red-400",
  },
  edited_approved: {
    label: "Approved (Edited)",
    icon: <FiEdit3 size={11} />,
    cls: "bg-blue-50 text-blue-600 border-blue-200",
    dot: "bg-blue-400",
  },
};

// ─── Role Avatar ───────────────────────────────────────────────────────────────
const RoleAvatar = ({ role, name }) => {
  const avatarConfig = {
    [ROLES.ADMIN]: { bg: "bg-purple-600", label: "A" },
    [ROLES.SUPER_ADMIN]: { bg: "bg-indigo-700", label: "SA" },
    [ROLES.SALES_MANAGER]: { bg: "bg-blue-600", label: "SM" },
    [ROLES.DEALER]: { bg: "bg-red-500", label: "CD" },
    [ROLES.PROPERTY_MANAGER]: { bg: "bg-slate-600", label: "PM" },
  };
  const cfg = avatarConfig[role] || { bg: "bg-slate-500", label: "?" };
  return (
    <div
      className={`w-9 h-9 rounded-full ${cfg.bg} flex items-center justify-center text-white text-[11px] font-black shrink-0 shadow-sm`}
      title={name || role}
    >
      {getInitials(name) || cfg.label}
    </div>
  );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${cfg.cls}`}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
};

// ─── Single Note Card ─────────────────────────────────────────────────────────
const NoteCard = ({ note, userRole, onAction, currentUserId }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedMsg, setEditedMsg] = useState(
    note.editedMessage || note.note || note.message || "",
  );
  const [declineReason, setDeclineReason] = useState("");
  const [showDeclineInput, setShowDeclineInput] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);

  const canAdmin = isAdminRole(userRole);
  const showAdminActions = canAdmin && note.status === "pending";

  const handleApprove = () => {
    setActionLoading("approve");
    approveNote({
      noteId: note.noteId || note.id,
      salesExecutiveId: note.senderId,
      onSuccess: (res) => {
        setActionLoading(null);
        if (res.success) {
          showSuccess("Note approved and sent to client!");
          onAction();
        } else {
          showError(res.message || "Failed to approve note");
        }
      },
      onError: (err) => {
        setActionLoading(null);
        showError(
          err?.data?.message || err?.message || "Failed to approve note",
        );
      },
    });
  };

  const handleDecline = () => {
    if (!declineReason.trim()) {
      showError("Please provide a reason for declining.");
      return;
    }
    setActionLoading("decline");
    declineNote({
      noteId: note.noteId || note.id,
      salesExecutiveId: note.senderId,
      onSuccess: (res) => {
        setActionLoading(null);
        if (res.success) {
          showSuccess("Note denied.");
          setShowDeclineInput(false);
          onAction();
        } else {
          showError(res.message || "Failed to decline note");
        }
      },
      onError: (err) => {
        setActionLoading(null);
        showError(
          err?.data?.message || err?.message || "Failed to decline note",
        );
      },
    });
  };

  const handleEditApprove = () => {
    if (!editedMsg.trim()) {
      showError("Note message cannot be empty.");
      return;
    }
    setActionLoading("edit-approve");
    editAndApproveNote({
      noteId: note.noteId || note.id,
      salesExecutiveId: note.senderId,
      message: editedMsg,
      onSuccess: (res) => {
        setActionLoading(null);
        if (res.success) {
          showSuccess("Note edited and approved!");
          setEditMode(false);
          onAction();
        } else {
          showError(res.message || "Failed to edit & approve");
        }
      },
      onError: (err) => {
        setActionLoading(null);
        showError(
          err?.data?.message || err?.message || "Failed to edit & approve note",
        );
      },
    });
  };

  const isMyNote = note.senderId === currentUserId;
  const cfg = STATUS_CONFIG[note.status] || STATUS_CONFIG.pending;

  return (
    <div
      className={`relative rounded-[20px] border transition-all ${
        note.isOwnerNote
          ? "border-violet-100 bg-violet-50/20"
          : note.status === "denied"
            ? "border-red-100 bg-red-50/30"
            : note.status === "approved" || note.status === "edited_approved"
              ? "border-emerald-100 bg-emerald-50/20"
              : "border-amber-100 bg-amber-50/20"
      } p-4`}
    >
      {/* Header row */}
      <div className="flex items-start gap-3 mb-3">
        <RoleAvatar role={note.senderRole} name={note.senderName} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-black text-slate-800 text-sm truncate">
              {note.senderName || "Unknown"}
            </span>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
              {note.senderRole || "Staff"}
            </span>
            {isMyNote && (
              <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
                You
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            {note.isOwnerNote ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border bg-violet-50 text-violet-600 border-violet-200">
                <FiMessageSquare size={11} />
                Client Note
              </span>
            ) : (
              <StatusBadge status={note.status} />
            )}
            <span className="text-[11px] text-slate-400 font-medium">
              {formatTime(note.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Note message body */}
      {note.isEdited ? (
        <div className="space-y-2">
          {/* Show original (struck through) */}
          <div className="bg-white rounded-xl p-3 border border-slate-100">
            <p className="text-[11px] text-slate-400 font-semibold mb-1 uppercase tracking-wider">
              Original
            </p>
            <p className="text-slate-400 text-sm line-through leading-relaxed">
              {note.note || note.message}
            </p>
          </div>
          {/* Show edited */}
          <div className="bg-white rounded-xl p-3 border border-emerald-100">
            <p className="text-[11px] text-emerald-500 font-semibold mb-1 uppercase tracking-wider">
              Edited & Approved
            </p>
            <p className="text-slate-700 text-sm leading-relaxed">
              {note.editedMessage || note.note}
            </p>
          </div>
          {note.adminName && (
            <p className="text-[11px] text-slate-400 font-medium">
              Approved by{" "}
              <span className="text-slate-600 font-bold">{note.adminName}</span>{" "}
              · {formatTime(note.updatedAt)}
            </p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-3 border border-slate-100/80">
          <p className="text-slate-700 text-sm leading-relaxed">
            {note.note || note.message}
          </p>
        </div>
      )}

      {/* Decline reason */}
      {note.status === "denied" && note.declineReason && (
        <div className="mt-2 bg-red-50 rounded-xl p-3 border border-red-100">
          <p className="text-[11px] text-red-500 font-bold mb-0.5 uppercase tracking-wider">
            Decline Reason
          </p>
          <p className="text-red-600 text-sm">{note.declineReason}</p>
          {note.adminName && (
            <p className="text-[11px] text-red-400 mt-1">
              by {note.adminName} · {formatTime(note.updatedAt)}
            </p>
          )}
        </div>
      )}

      {/* ── Admin action area ── */}
      {showAdminActions && (
        <div className="mt-4 space-y-3">
          <hr className="border-slate-100" />

          {/* Edit mode */}
          {editMode ? (
            <div className="space-y-3">
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1">
                <FiEdit3 size={11} /> Edit note before approving
              </p>
              <textarea
                className="w-full bg-white border border-blue-200 rounded-xl p-3 text-sm text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none transition-all"
                rows={3}
                value={editedMsg}
                onChange={(e) => setEditedMsg(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleEditApprove}
                  disabled={!!actionLoading}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-full text-[13px] font-bold transition-all disabled:opacity-60"
                >
                  {actionLoading === "edit-approve" ? (
                    <FiLoader className="animate-spin" size={14} />
                  ) : (
                    <FiCheckCircle size={14} />
                  )}
                  Approve with Edit
                </button>
                <button
                  onClick={() => {
                    setEditMode(false);
                    setEditedMsg(note.message);
                  }}
                  disabled={!!actionLoading}
                  className="px-4 py-2.5 rounded-full text-[13px] font-bold text-slate-500 border border-slate-200 hover:bg-slate-50 transition-all disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : showDeclineInput ? (
            <div className="space-y-3">
              <p className="text-[11px] text-red-500 font-bold uppercase tracking-wider flex items-center gap-1">
                <FiXCircle size={11} /> Reason for declining
              </p>
              <textarea
                className="w-full bg-white border border-red-200 rounded-xl p-3 text-sm text-slate-700 outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 resize-none transition-all"
                rows={2}
                placeholder="Tell the dealer why this note is being declined…"
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleDecline}
                  disabled={!!actionLoading}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-full text-[13px] font-bold transition-all disabled:opacity-60"
                >
                  {actionLoading === "decline" ? (
                    <FiLoader className="animate-spin" size={14} />
                  ) : (
                    <FiXCircle size={14} />
                  )}
                  Confirm Decline
                </button>
                <button
                  onClick={() => {
                    setShowDeclineInput(false);
                    setDeclineReason("");
                  }}
                  disabled={!!actionLoading}
                  className="px-4 py-2.5 rounded-full text-[13px] font-bold text-slate-500 border border-slate-200 hover:bg-slate-50 transition-all disabled:opacity-60"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // Default: 3 action buttons
            <div className="flex flex-wrap gap-2">
              {/* Approve */}
              <button
                onClick={handleApprove}
                disabled={!!actionLoading}
                className="flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-full text-[12px] font-bold transition-all shadow-sm shadow-emerald-200 disabled:opacity-60"
              >
                {actionLoading === "approve" ? (
                  <FiLoader className="animate-spin" size={13} />
                ) : (
                  <FiCheck size={13} />
                )}
                Approve
              </button>

              {/* Edit & Approve */}
              <button
                onClick={() => setEditMode(true)}
                disabled={!!actionLoading}
                className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-[12px] font-bold transition-all shadow-sm shadow-blue-200 disabled:opacity-60"
              >
                <FiEdit3 size={13} />
                Edit & Approve
              </button>

              {/* Decline */}
              <button
                onClick={() => setShowDeclineInput(true)}
                disabled={!!actionLoading}
                className="flex items-center gap-1.5 bg-white hover:bg-red-50 text-red-500 border border-red-200 px-4 py-2 rounded-full text-[12px] font-bold transition-all disabled:opacity-60"
              >
                <FiXCircle size={13} />
                Decline
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Empty State ───────────────────────────────────────────────────────────────
const EmptyNotes = ({ canWrite }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
      <FiMessageSquare className="text-slate-300" size={28} />
    </div>
    <p className="text-slate-500 font-bold text-sm mb-1">No notes yet</p>
    <p className="text-slate-400 text-xs max-w-[220px] leading-relaxed mb-6">
      {canWrite
        ? "Write a note below. It will be reviewed by an admin before reaching the client."
        : "No notes have been submitted for this property yet."}
    </p>
    <button
      onClick={() => window.location.reload()}
      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-500 text-[11px] font-black uppercase transition-all"
    >
      Refresh Dashboard
    </button>
  </div>
);

// ─── Main Modal ────────────────────────────────────────────────────────────────
const NotesAndActivityModal = ({ isOpen, onClose, property }) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  const userRole = user?.role || "";
  const currentUserId = user?.userId || user?.id || user?._id;
  const canWrite = isDealerRole(userRole) || isAdminRole(userRole);
  const isAdmin = isAdminRole(userRole);
  const isManager = isManagerRole(userRole);
  const isReadOnly = isManager; // Sales Manager = read-only
  const isPropertyManager = userRole === ROLES.PROPERTY_MANAGER;

  const propertyId = property?.propertyId || property?._id;

  const loadNotes = useCallback(() => {
    if (!propertyId) return;
    setLoadingNotes(true);
    fetchNotes({
      propertyId,
      onSuccess: (res) => {
        setLoadingNotes(false);
        if (res.success) {
          const received = res.data;
          const finalArray = Array.isArray(received)
            ? received
            : received?.notes || received?.managerNotes || [];
          const sorted = [...finalArray].sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
          setNotes(sorted);
        } else {
          setNotes([]);
        }
      },
      onError: (err) => {
        setLoadingNotes(false);
        console.error("Failed to fetch notes:", err);
      },
    });
  }, [propertyId]);

  useEffect(() => {
    if (isOpen && propertyId) {
      loadNotes();
      setNewNote("");
      setActiveTab("all");
    }
  }, [isOpen, propertyId, loadNotes]);

  useEffect(() => {
    if (notes.length) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [notes]);

  const handleSubmit = () => {
    if (!newNote.trim()) return;
    setSubmitting(true);
    submitNote({
      propertyId,
      message: newNote.trim(),
      onSuccess: (res) => {
        setSubmitting(false);
        if (res.success) {
          showSuccess("Note submitted for admin review! ✅");
          setNewNote("");
          loadNotes();
        } else {
          showError(res.message || "Failed to submit note");
        }
      },
      onError: (err) => {
        setSubmitting(false);
        showError(
          err?.data?.message || err?.message || "Failed to submit note",
        );
      },
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  // ── Tab filtering ──────────────────────────────────────────────────────────
  const filteredNotes = notes.filter((n) => {
    if (activeTab === "all") return true;
    return n.status === activeTab;
  });

  const tabCounts = {
    all: notes.length,
    pending: notes.filter((n) => n.status === "pending").length,
    approved: notes.filter(
      (n) => n.status === "approved" || n.status === "edited_approved",
    ).length,
    denied: notes.filter((n) => n.status === "denied").length,
  };

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-[28px] w-full max-w-2xl max-h-[92vh] m-4 flex flex-col shadow-2xl relative overflow-hidden animate-fade-in">
        {/* ── Gradient accent ── */}
        <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-slate-50 to-white pointer-events-none rounded-t-[28px]" />

        {/* ── Header ── */}
        <div className="relative flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 z-10 shrink-0">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center shadow-sm">
                <FiMessageSquare className="text-white" size={15} />
              </div>
              <h2 className="text-[20px] font-black text-slate-800 tracking-tight">
                Notes & Activity
              </h2>
            </div>
            {property && (
              <p className="text-xs text-slate-400 font-semibold ml-10">
                {property.propertyType || "Property"} ·{" "}
                {property.microMarket || property.city || "—"} (ID: {propertyId}
                )
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Refresh */}
            <button
              onClick={loadNotes}
              disabled={loadingNotes}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
              title="Refresh notes"
            >
              <FiRefreshCw
                size={16}
                className={loadingNotes ? "animate-spin" : ""}
              />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* ── Role badge + info ── */}
        <div className="relative z-10 px-6 py-3 border-b border-slate-50 shrink-0 flex items-center gap-3">
          <span
            className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full ${
              isAdmin
                ? "bg-purple-100 text-purple-700"
                : isManager
                  ? "bg-blue-100 text-blue-700"
                  : canWrite
                    ? "bg-red-100 text-red-700"
                    : "bg-slate-100 text-slate-600"
            }`}
          >
            {userRole || "Viewer"}
          </span>

          {isReadOnly && (
            <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
              <FiEye size={12} /> View only
            </span>
          )}
          {canWrite && (
            <span className="flex items-center gap-1 text-[11px] text-amber-500 font-medium">
              <FiAlertCircle size={12} /> Notes need admin approval before
              reaching client
            </span>
          )}
          {isAdmin && (
            <span className="flex items-center gap-1 text-[11px] text-purple-500 font-medium">
              <FiCheckCircle size={12} /> You can approve, edit & approve, or
              decline notes
            </span>
          )}
        </div>

        {/* ── Tabs ── */}
        <div className="px-6 pt-3 pb-0 flex gap-1.5 shrink-0 border-b border-slate-50">
          {[
            { id: "all", label: "All" },
            { id: "pending", label: "Pending" },
            { id: "approved", label: "Approved" },
            { id: "denied", label: "Declined" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-t-xl text-[11px] font-black uppercase tracking-wider transition-all border-b-2 ${
                activeTab === tab.id
                  ? "border-slate-800 text-slate-800 bg-slate-50"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab.label}
              {tabCounts[tab.id] > 0 && (
                <span
                  className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] ${
                    activeTab === tab.id
                      ? "bg-slate-800 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {tab.id === "approved"
                    ? tabCounts.approved
                    : tabCounts[tab.id]}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Notes list ── */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3 custom-scrollbar">
          {loadingNotes ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <div className="w-10 h-10 border-[3px] border-slate-200 border-t-slate-700 rounded-full animate-spin" />
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                Loading notes…
              </p>
            </div>
          ) : filteredNotes.length === 0 ? (
            <EmptyNotes canWrite={canWrite} />
          ) : (
            filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                userRole={userRole}
                currentUserId={currentUserId}
                onAction={loadNotes}
              />
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* ── Compose area (only dealers) ── */}
        {canWrite && !isReadOnly && !(isPropertyManager && notes.length > 0 && notes[notes.length - 1]?.senderId === currentUserId) && (
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <FiEdit3 size={12} className="text-slate-400" />
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Write a Note
              </p>
            </div>
            <div className="flex gap-3 items-end">
              <textarea
                ref={textareaRef}
                className="flex-1 bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 resize-none transition-all placeholder:text-slate-300"
                rows={2}
                placeholder="Write your note to the client… (Ctrl+Enter to send)"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={submitting}
              />
              <button
                onClick={handleSubmit}
                disabled={!newNote.trim() || submitting}
                className="w-12 h-12 rounded-2xl bg-slate-900 hover:bg-slate-700 text-white flex items-center justify-center shrink-0 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md active:scale-95"
                title="Submit for review (Ctrl+Enter)"
              >
                {submitting ? (
                  <FiLoader size={18} className="animate-spin" />
                ) : (
                  <FiSend size={18} />
                )}
              </button>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 font-medium">
              {isAdmin
                ? "🛡️ Your note as Admin will be automatically approved."
                : "🛡️ This note will be reviewed by an Admin before it reaches the client."}
            </p>
          </div>
        )}

        {/* ── Admin view info strip ── */}
        {isAdmin && notes.filter((n) => n.status === "pending").length > 0 && (
          <div className="px-6 py-3 border-t border-amber-100 bg-amber-50/60 shrink-0">
            <p className="text-[11px] text-amber-600 font-bold flex items-center gap-2">
              <FiAlertCircle size={13} />
              {notes.filter((n) => n.status === "pending").length} note(s)
              awaiting your review
            </p>
          </div>
        )}

        {/* ── Read-only strip for manager ── */}
        {isManager && (
          <div className="px-6 py-3 border-t border-blue-100 bg-blue-50/50 shrink-0">
            <p className="text-[11px] text-blue-500 font-bold flex items-center gap-2">
              <FiEye size={13} />
              You have read-only access to this notes thread.
            </p>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default NotesAndActivityModal;
