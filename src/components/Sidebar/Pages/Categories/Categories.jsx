import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  FiRefreshCw,
  FiPlus,
  FiEdit2,
  FiImage,
  FiUploadCloud,
  FiX,
} from "react-icons/fi";
import { apiCall } from "../../../../helpers/apicall/apiCall";
import { showError, showSuccess } from "../../../../helpers/swalHelper";

// Explore-Categories — homepage category cards (image + title + filter value).
// Admin can Add and Edit only (no delete by design). Max 1 image per card;
// uploading a new image replaces the old one.

const emptyForm = { title: "", value: "", sortOrder: "", isActive: true };

const Categories = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Modal state. editing === null → closed; a row → edit; {} → add-new.
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const fetchCategories = useCallback(() => {
    setLoading(true);
    apiCall.get({
      route: "/admin/categories",
      onSuccess: (res) => {
        setLoading(false);
        if (res.success) setRows(res.data || []);
      },
      onError: (err) => {
        setLoading(false);
        showError(
          err?.data?.message || err?.message || "Failed to load categories"
        );
      },
    });
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const openAdd = () => {
    setEditing({});
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      title: row.title || "",
      value: row.value || "",
      sortOrder: row.sortOrder ?? "",
      isActive: row.isActive !== false,
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const closeModal = () => {
    setEditing(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const onPickImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showError("Please choose an image file.");
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      showError("Title is required.");
      return;
    }
    const isEdit = editing && editing.categoryId;
    // Require an image when creating a brand-new category with no existing image.
    if (!isEdit && !imageFile) {
      showError("Please upload an image for the new category.");
      return;
    }

    const fd = new FormData();
    fd.append("title", form.title.trim());
    fd.append("value", (form.value || form.title).trim());
    fd.append("sortOrder", String(form.sortOrder === "" ? 0 : form.sortOrder));
    fd.append("isActive", String(!!form.isActive));
    if (imageFile) fd.append("files", imageFile); // single image (replace-only)

    setSaving(true);
    const done = (msg) => {
      setSaving(false);
      showSuccess(msg);
      closeModal();
      fetchCategories();
    };
    const fail = (err) => {
      setSaving(false);
      showError(err?.data?.message || err?.message || "Failed to save category");
    };

    if (isEdit) {
      apiCall.put({
        route: `/admin/categories/${editing.categoryId}`,
        payload: fd,
        onSuccess: (res) =>
          res.success ? done("Category updated") : fail(res),
        onError: fail,
      });
    } else {
      apiCall.post({
        route: "/admin/categories",
        payload: fd,
        onSuccess: (res) =>
          res.success ? done("Category created") : fail(res),
        onError: fail,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
            Explore Categories
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Homepage category cards. Add or edit — image, title & filter value.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={fetchCategories}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 text-sm font-bold hover:bg-slate-50 transition"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} size={14} />{" "}
            Refresh
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition"
          >
            <FiPlus size={16} /> Add Category
          </button>
        </div>
      </div>

      {/* Grid of cards */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 md:p-6">
        {loading ? (
          <div className="py-20 text-center">
            <FiRefreshCw
              className="animate-spin mx-auto text-red-500 mb-3"
              size={28}
            />
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Loading categories...
            </p>
          </div>
        ) : rows.length === 0 ? (
          <div className="py-20 text-center">
            <FiImage className="mx-auto text-slate-200 mb-3" size={40} />
            <p className="text-sm font-bold text-slate-500">
              No categories yet. Click "Add Category".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {rows.map((row) => (
              <div
                key={row.categoryId}
                className="rounded-xl border border-slate-100 overflow-hidden bg-white shadow-sm hover:shadow-md transition group"
              >
                <div className="relative h-40 bg-slate-100">
                  {row.imageUrl ? (
                    <img
                      src={row.imageUrl}
                      alt={row.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                      <FiImage size={32} />
                      <span className="text-[10px] font-bold uppercase tracking-wider mt-1">
                        No image
                      </span>
                    </div>
                  )}
                  <span className="absolute top-2 left-2 bg-black/50 text-white text-sm font-bold px-2 py-0.5 rounded">
                    {row.title}
                  </span>
                  {row.isActive === false && (
                    <span className="absolute top-2 right-2 bg-slate-700 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                      Hidden
                    </span>
                  )}
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                      Filter
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {row.value}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Order: {row.sortOrder ?? 0}
                    </p>
                  </div>
                  <button
                    onClick={() => openEdit(row)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition"
                  >
                    <FiEdit2 size={13} /> Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-800">
                {editing.categoryId ? "Edit Category" : "Add Category"}
              </h2>
              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-600"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Image uploader (max 1, replace-only) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Image {editing.categoryId ? "(upload to replace)" : "*"}
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative h-44 rounded-xl border-2 border-dashed border-slate-200 hover:border-red-300 cursor-pointer overflow-hidden flex items-center justify-center bg-slate-50 transition"
                >
                  {imagePreview || editing.imageUrl ? (
                    <img
                      src={imagePreview || editing.imageUrl}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-slate-400">
                      <FiUploadCloud size={30} />
                      <span className="text-xs font-bold mt-1">
                        Click to upload
                      </span>
                    </div>
                  )}
                  {(imagePreview || editing.imageUrl) && (
                    <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1">
                      <FiUploadCloud size={11} /> Change
                    </span>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onPickImage}
                  className="hidden"
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="e.g. Residential"
                  maxLength={80}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
              </div>

              {/* Filter value */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Filter value (propertyType)
                </label>
                <input
                  type="text"
                  value={form.value}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, value: e.target.value }))
                  }
                  placeholder="Defaults to title if left empty"
                  maxLength={80}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  The "Explore" button filters properties by this value.
                </p>
              </div>

              {/* Sort order + active */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                    Sort order
                  </label>
                  <input
                    type="number"
                    value={form.sortOrder}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, sortOrder: e.target.value }))
                    }
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  />
                </div>
                <label className="flex items-center gap-2 mt-6 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, isActive: e.target.checked }))
                    }
                    className="w-4 h-4 accent-red-600"
                  />
                  <span className="text-sm font-bold text-slate-600">
                    Visible
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-slate-100">
              <button
                onClick={closeModal}
                disabled={saving}
                className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-bold hover:bg-red-700 transition disabled:opacity-50"
              >
                {saving && <FiRefreshCw className="animate-spin" size={14} />}
                {editing.categoryId ? "Save Changes" : "Create Category"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
