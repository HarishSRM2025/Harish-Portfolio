"use client";

import { useEffect, useState } from "react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import StatusBanner from "@/components/admin/StatusBanner";
import { Field, inputClass, textareaClass } from "@/components/admin/FormField";
import { Plus, Pencil, Trash2, X, Save, Briefcase } from "lucide-react";

const EMPTY = {
  company: "",
  role: "",
  location: "",
  startDate: "",
  endDate: "Present",
  description: "",
  technologies: [],
  order: 0
};

export default function AdminExperiencePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null); // null = closed, "new" = creating
  const [form, setForm] = useState(EMPTY);
  const [techInput, setTechInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  function load() {
    setLoading(true);
    fetch("/api/experience")
      .then((res) => res.json())
      .then(setItems)
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

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
      const res = await fetch(isNew ? "/api/experience" : `/api/experience/${editingId}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error();
      setStatus({ type: "success", message: `Experience ${isNew ? "added" : "updated"}.` });
      closeForm();
      load();
    } catch {
      setStatus({ type: "error", message: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this experience entry? This cannot be undone.")) return;
    const res = await fetch(`/api/experience/${id}`, { method: "DELETE" });
    if (res.ok) {
      setStatus({ type: "success", message: "Experience deleted." });
      load();
    } else {
      setStatus({ type: "error", message: "Failed to delete." });
    }
  }

  function addTech() {
    if (!techInput.trim()) return;
    setForm({ ...form, technologies: [...form.technologies, techInput.trim()] });
    setTechInput("");
  }

  function removeTech(i) {
    setForm({ ...form, technologies: form.technologies.filter((_, idx) => idx !== i) });
  }

  return (
    <>
      <AdminTopbar title="Experience" />
      <div className="p-6 max-w-3xl">
        <StatusBanner status={status} />

        {editingId ? (
          <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border p-5 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold">
                {editingId === "new" ? "Add experience" : "Edit experience"}
              </h2>
              <button type="button" onClick={closeForm} className="text-ink-muted hover:text-ink">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Company">
                <input
                  required
                  className={inputClass}
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                />
              </Field>
              <Field label="Role">
                <input
                  required
                  className={inputClass}
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                />
              </Field>
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              <Field label="Start date" hint="e.g. Jan 2023">
                <input
                  required
                  className={inputClass}
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </Field>
              <Field label="End date" hint="Use 'Present' if current">
                <input
                  className={inputClass}
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </Field>
              <Field label="Location">
                <input
                  className={inputClass}
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
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

            <Field label="Technologies used">
              <div className="flex flex-wrap gap-2 mb-2">
                {form.technologies.map((tech, i) => (
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
                  placeholder="e.g. Node.js"
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

            <Field label="Display order" hint="Lower numbers appear first">
              <input
                type="number"
                className={inputClass}
                value={form.order}
                onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
              />
            </Field>

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
            Add experience
          </button>
        )}

        {loading ? (
          <p className="text-sm text-ink-muted">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-ink-muted">No experience entries yet.</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item._id}
                className="rounded-xl border border-border p-4 flex items-start justify-between gap-4"
              >
                <div className="flex gap-3">
                  <Briefcase className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">
                      {item.role} · {item.company}
                    </p>
                    <p className="text-xs text-ink-muted mt-0.5">
                      {item.startDate} — {item.endDate}
                    </p>
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
