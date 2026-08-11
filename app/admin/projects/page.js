"use client";

import { useEffect, useState } from "react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import StatusBanner from "@/components/admin/StatusBanner";
import { Field, inputClass, textareaClass } from "@/components/admin/FormField";
import { Plus, Pencil, Trash2, X, Save, FolderKanban, Star, Upload, Image as ImageIcon } from "lucide-react";

const EMPTY = {
  title: "",
  description: "",
  status: "",
  imageUrl: "",
  liveUrl: "",
  githubUrl: "",
  techStack: [],
  featured: false,
  order: 0
};

export default function AdminProjectsPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [techInput, setTechInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);

  function load() {
    setLoading(true);
    fetch("/api/projects", { cache: "no-store" })
      .then((res) => res.json())
      .then(setItems)
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleImageUpload(file) {
    if (!file) return;
    setUploading(true);
    setStatus(null);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body: data });
      if (!res.ok) throw new Error();
      const result = await res.json();
      setForm((current) => ({ ...current, imageUrl: result.path }));
      setStatus({ type: "success", message: "Project image uploaded." });
    } catch {
      setStatus({ type: "error", message: "Failed to upload image. Please try again." });
    } finally {
      setUploading(false);
    }
  }

  function openNew() {
    setForm(EMPTY);
    setTechInput("");
    setEditingId("new");
  }

  function openEdit(item) {
    setForm({ ...EMPTY, ...item });
    setTechInput("");
    setEditingId(item._id);
  }

  function closeForm() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const isNew = editingId === "new";
      const res = await fetch(isNew ? "/api/projects" : `/api/projects/${editingId}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error();
      setStatus({ type: "success", message: `Project ${isNew ? "added" : "updated"}.` });
      closeForm();
      load();
    } catch {
      setStatus({ type: "error", message: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this project?")) return;
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    if (res.ok) {
      setStatus({ type: "success", message: "Project deleted." });
      load();
    } else {
      setStatus({ type: "error", message: "Failed to delete." });
    }
  }

  function addTech() {
    if (!techInput.trim()) return;
    setForm({ ...form, techStack: [...form.techStack, techInput.trim()] });
    setTechInput("");
  }

  function removeTech(i) {
    setForm({ ...form, techStack: form.techStack.filter((_, idx) => idx !== i) });
  }

  return (
    <>
      <AdminTopbar title="Projects" />
      <div className="p-6">
        <StatusBanner status={status} />

        {editingId ? (
          <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border p-5 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold">
                {editingId === "new" ? "Add project" : "Edit project"}
              </h2>
              <button type="button" onClick={closeForm} className="text-ink-muted hover:text-ink">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Title">
                <input
                  required
                  className={inputClass}
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </Field>
              <Field label="Status" hint="Free text — e.g. In Progress, Completed, Live, Archived">
                <input
                  className={inputClass}
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  placeholder="e.g. Live, In Progress, Archived"
                />
              </Field>
            </div>

            <Field label="Description">
              <textarea
                rows={4}
                className={textareaClass}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Field>

            <Field label="Project image" hint="Upload an image file for the project thumbnail">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-surface hover:border-primary text-sm font-medium cursor-pointer transition-colors">
                    <Upload className="w-4 h-4 text-primary" />
                    {uploading ? "Uploading..." : "Choose Image File"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      disabled={uploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleImageUpload(file);
                      }}
                    />
                  </label>
                  {form.imageUrl && (
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, imageUrl: "" })}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Remove image
                    </button>
                  )}
                </div>

                {form.imageUrl ? (
                  <div className="relative aspect-video max-w-xs rounded-xl border border-border overflow-hidden bg-surface-alt">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.imageUrl}
                      alt="Project preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <p className="text-xs text-ink-muted">No image uploaded yet.</p>
                )}
              </div>
            </Field>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Live URL">
                <input
                  className={inputClass}
                  value={form.liveUrl}
                  onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                  placeholder="https://..."
                />
              </Field>
              <Field label="GitHub URL">
                <input
                  className={inputClass}
                  value={form.githubUrl}
                  onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                  placeholder="https://github.com/..."
                />
              </Field>
            </div>

            <Field label="Tech stack">
              <div className="flex flex-wrap gap-2 mb-2">
                {form.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border border-border"
                  >
                    {tech}
                    <button type="button" onClick={() => removeTech(i)} aria-label="Remove">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  className={inputClass}
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTech();
                    }
                  }}
                  placeholder="e.g. Next.js"
                />
                <button
                  type="button"
                  onClick={addTech}
                  className="p-2.5 rounded-lg border border-border hover:border-primary hover:text-primary flex-shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </Field>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  className="accent-primary w-4 h-4"
                />
                Featured project
              </label>
              <Field label="Order">
                <input
                  type="number"
                  className={inputClass}
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                />
              </Field>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-primary text-white px-5 py-2.5 text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save"}
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={openNew}
            className="inline-flex items-center gap-2 rounded-lg bg-primary text-white px-4 py-2.5 text-sm font-medium hover:bg-primary-700 transition-colors mb-6"
          >
            <Plus className="w-4 h-4" />
            Add project
          </button>
        )}

        {loading ? (
          <p className="text-sm text-ink-muted">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-ink-muted">No projects yet.</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item._id}
                className="rounded-xl border border-border p-4 flex items-start justify-between gap-4"
              >
                <div className="flex gap-3 min-w-0 items-center">
                  {item.imageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-12 h-12 rounded-lg object-cover border border-border flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-surface-alt border border-border flex items-center justify-center flex-shrink-0 text-primary">
                      <FolderKanban className="w-5 h-5" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-medium text-sm flex items-center gap-2 flex-wrap">
                      {item.title}
                      {item.featured && <Star className="w-3.5 h-3.5 text-primary" />}
                      {item.status && (
                        <span className="inline-flex text-[10px] px-2 py-0.5 rounded-full border border-border bg-surface-alt text-ink-muted font-mono">
                          {item.status}
                        </span>
                      )}
                    </p>
                    {item.techStack?.length > 0 && (
                      <p className="text-xs text-ink-muted mt-0.5 truncate">
                        {item.techStack.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="p-2 rounded-lg hover:bg-surface-alt text-ink-muted hover:text-primary"
                    aria-label="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item._id)}
                    className="p-2 rounded-lg hover:bg-surface-alt text-ink-muted hover:text-red-500"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
