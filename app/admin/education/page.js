"use client";

import { useEffect, useState } from "react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import StatusBanner from "@/components/admin/StatusBanner";
import { Field, inputClass } from "@/components/admin/FormField";
import { Pencil, Trash2, X, Save, GraduationCap, Plus } from "lucide-react";

const EMPTY = {
  institution: "",
  degree: "",
  fieldOfStudy: "",
  location: "",
  startDate: "",
  endDate: "",
  grade: "",
  order: 0
};

export default function AdminEducationPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  function load() {
    setLoading(true);
    fetch("/api/education", { cache: "no-store" })
      .then((res) => res.json())
      .then(setItems)
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function openNew() {
    setForm(EMPTY);
    setEditingId("new");
  }

  function openEdit(item) {
    setForm({ ...EMPTY, ...item, grade: String(item.grade ?? "") });
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
      const payload = {
        institution: String(form.institution ?? "").trim(),
        degree: String(form.degree ?? "").trim(),
        fieldOfStudy: String(form.fieldOfStudy ?? "").trim(),
        location: String(form.location ?? "").trim(),
        startDate: String(form.startDate ?? "").trim(),
        endDate: String(form.endDate ?? "").trim(),
        grade: String(form.grade ?? "").trim(),
        order: Number(form.order ?? 0)
      };
      const isNew = editingId === "new";
      const res = await fetch(isNew ? "/api/education" : `/api/education/${editingId}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error();
      setStatus({ type: "success", message: `Education ${isNew ? "added" : "updated"}.` });
      closeForm();
      load();
    } catch {
      setStatus({ type: "error", message: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this education entry? This cannot be undone.")) return;
    const res = await fetch(`/api/education/${id}`, { method: "DELETE" });
    if (res.ok) {
      setStatus({ type: "success", message: "Education deleted." });
      load();
    } else {
      setStatus({ type: "error", message: "Failed to delete." });
    }
  }

  return (
    <>
      <AdminTopbar title="Education" />
      <div className="p-6 max-w-3xl">
        <StatusBanner status={status} />

        {editingId ? (
          <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border p-5 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold">
                {editingId === "new" ? "Add education" : "Edit education"}
              </h2>
              <button type="button" onClick={closeForm} className="text-ink-muted hover:text-ink">
                <X className="w-4 h-4" />
              </button>
            </div>

            <Field label="Institution">
              <input
                required
                className={inputClass}
                value={form.institution}
                onChange={(e) => setForm({ ...form, institution: e.target.value })}
                placeholder="University of Example"
              />
            </Field>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Degree / program">
                <input
                  className={inputClass}
                  value={form.degree}
                  onChange={(e) => setForm({ ...form, degree: e.target.value })}
                  placeholder="Bachelor of Technology"
                />
              </Field>
              <Field label="Field of study">
                <input
                  className={inputClass}
                  value={form.fieldOfStudy}
                  onChange={(e) => setForm({ ...form, fieldOfStudy: e.target.value })}
                  placeholder="Computer Science"
                />
              </Field>
            </div>

            <div className="grid sm:grid-cols-3 gap-5">
              <Field label="Start date" hint="e.g. 2020">
                <input
                  className={inputClass}
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  placeholder="2020"
                />
              </Field>
              <Field label="End date" hint="e.g. 2024 or Present">
                <input
                  className={inputClass}
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  placeholder="2024"
                />
              </Field>
              <Field label="Location">
                <input
                  className={inputClass}
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Chennai, India"
                />
              </Field>
            </div>

            <Field label="Grade / CGPA / Percentage" hint="Free text, e.g. 9.2 CGPA, 84%, First Class">
              <input
                className={inputClass}
                value={form.grade}
                onChange={(e) => setForm({ ...form, grade: e.target.value })}
                placeholder="9.2 CGPA"
              />
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
            Add education
          </button>
        )}

        {loading ? (
          <p className="text-sm text-ink-muted">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-ink-muted">No education entries yet.</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item._id}
                className="rounded-xl border border-border bg-surface-alt/20 p-4 flex items-start justify-between gap-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-ink truncate">{item.institution}</p>
                    <p className="text-xs text-ink-muted mt-0.5">
                      {[item.degree, item.fieldOfStudy].filter(Boolean).join(" · ")}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-xs text-ink-muted bg-surface px-2.5 py-0.5 rounded-md border border-border">
                        {item.startDate || "Start"} — {item.endDate || "Present"}
                      </span>
                      {item.location && (
                        <span className="text-xs text-ink-muted bg-surface px-2.5 py-0.5 rounded-md border border-border">
                          {item.location}
                        </span>
                      )}
                      {item.grade && (
                        <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-0.5 rounded-md border border-primary/20">
                          Grade: {item.grade}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="p-2 rounded-lg hover:bg-surface-alt text-ink-muted hover:text-primary transition-colors"
                    aria-label="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item._id)}
                    className="p-2 rounded-lg hover:bg-surface-alt text-ink-muted hover:text-red-500 transition-colors"
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
