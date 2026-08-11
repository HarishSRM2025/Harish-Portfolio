"use client";

import { useEffect, useState } from "react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import StatusBanner from "@/components/admin/StatusBanner";
import { Field, inputClass, textareaClass } from "@/components/admin/FormField";
import { Save, Plus, X } from "lucide-react";

const EMPTY = {
  heading: "About Me",
  description: "",
  yearsOfExperience: 0,
  highlights: []
};

export default function AdminAboutPage() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const [newHighlight, setNewHighlight] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch("/api/about")
      .then((res) => res.json())
      .then((data) => setForm({ ...EMPTY, ...data }))
      .finally(() => setLoading(false));
  }, []);

  function addHighlight() {
    if (!newHighlight.trim()) return;
    setForm({ ...form, highlights: [...form.highlights, newHighlight.trim()] });
    setNewHighlight("");
  }

  function removeHighlight(index) {
    setForm({ ...form, highlights: form.highlights.filter((_, i) => i !== index) });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/about", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error();
      setStatus({ type: "success", message: "About section saved." });
    } catch {
      setStatus({ type: "error", message: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <>
        <AdminTopbar title="About Section" />
        <div className="p-6 text-sm text-ink-muted">Loading...</div>
      </>
    );
  }

  return (
    <>
      <AdminTopbar title="About Section" />
      <div className="p-6">
        <StatusBanner status={status} />
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Heading">
            <input
              className={inputClass}
              value={form.heading}
              onChange={(e) => setForm({ ...form, heading: e.target.value })}
            />
          </Field>

          <Field label="Description">
            <textarea
              rows={6}
              className={textareaClass}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Tell visitors about your background, focus areas, and what drives you."
            />
          </Field>

          <Field label="Years of experience">
            <input
              type="number"
              min={0}
              className={inputClass}
              value={form.yearsOfExperience}
              onChange={(e) => setForm({ ...form, yearsOfExperience: Number(e.target.value) })}
            />
          </Field>

          <Field label="Highlights" hint="Short bullet facts, e.g. '50+ projects shipped'">
            <div className="space-y-2 mb-2">
              {form.highlights.map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className={inputClass + " flex-1"}>{item}</span>
                  <button
                    type="button"
                    onClick={() => removeHighlight(i)}
                    className="p-2 rounded-lg border border-border hover:border-red-500 hover:text-red-500 transition-colors"
                    aria-label="Remove highlight"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                className={inputClass}
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addHighlight();
                  }
                }}
                placeholder="Add a highlight"
              />
              <button
                type="button"
                onClick={addHighlight}
                className="p-2.5 rounded-lg border border-border hover:border-primary hover:text-primary transition-colors flex-shrink-0"
                aria-label="Add highlight"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </Field>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary text-white px-5 py-2.5 text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </>
  );
}
