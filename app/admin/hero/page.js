"use client";

import { useEffect, useState } from "react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import StatusBanner from "@/components/admin/StatusBanner";
import { Field, inputClass, textareaClass } from "@/components/admin/FormField";
import { Save } from "lucide-react";

const EMPTY = {
  name: "",
  role: "",
  tagline: "",
  description: "",
  imageUrl: "",
  resumeUrl: "",
  linkedinUrl: "",
  githubUrl: "",
  email: "",
  location: ""
};

export default function AdminHeroPage() {
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const [uploading, setUploading] = useState(null);

  useEffect(() => {
    fetch("/api/hero")
      .then((res) => res.json())
      .then((data) => setForm({ ...EMPTY, ...data }))
      .finally(() => setLoading(false));
  }, []);

  async function uploadFile(file, targetField) {
    if (!file) return;
    setUploading(targetField);
    setStatus(null);
    try {
      const data = new FormData();
      data.append("file", file);
      const res = await fetch("/api/uploads", { method: "POST", body: data });
      if (!res.ok) throw new Error();
      const result = await res.json();
      setForm((current) => ({ ...current, [targetField]: result.path }));
      setStatus({
        type: "success",
        message:
          targetField === "resumeUrl" ? "Resume uploaded." : "Hero image uploaded."
      });
    } catch {
      setStatus({ type: "error", message: "Upload failed. Please try again." });
    } finally {
      setUploading(null);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error();
      setStatus({ type: "success", message: "Hero section saved." });
    } catch {
      setStatus({ type: "error", message: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <>
        <AdminTopbar title="Hero Section" />
        <div className="p-6 text-sm text-ink-muted">Loading...</div>
      </>
    );
  }

  return (
    <>
      <AdminTopbar title="Hero Section" />
      <div className="p-6">
        <StatusBanner status={status} />
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Full name">
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Jane Doe"
              />
            </Field>
            <Field label="Role / title">
              <input
                className={inputClass}
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="Full Stack Developer"
              />
            </Field>
          </div>

          <Field label="Tagline" hint="A short supporting line under your title">
            <textarea
              rows={2}
              className={textareaClass}
              value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })}
              placeholder="I build fast, reliable web apps end to end."
            />
          </Field>

          <Field label="Description" hint="A longer bio paragraph shown in the hero section">
            <textarea
              rows={4}
              className={textareaClass}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="I'm a passionate full-stack developer with X years of experience building scalable web applications..."
            />
          </Field>

          <Field label="Hero image" hint="Upload an image file.">
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                className={inputClass}
                onChange={(e) => uploadFile(e.target.files?.[0], "imageUrl")}
              />
              <p className="text-xs text-ink-muted break-all">
                {form.imageUrl || "No image uploaded yet."}
              </p>
              {uploading === "imageUrl" && (
                <p className="text-xs text-ink-muted">Uploading image...</p>
              )}
            </div>
          </Field>

          <div className="grid sm:grid-cols-3 gap-5">
            <Field label="Resume PDF" hint="Upload a PDF file.">
              <div className="space-y-2">
                <input
                  type="file"
                  accept="application/pdf"
                  className={inputClass}
                  onChange={(e) => uploadFile(e.target.files?.[0], "resumeUrl")}
                />
                <p className="text-xs text-ink-muted break-all">
                  {form.resumeUrl || "No resume uploaded yet."}
                </p>
                {uploading === "resumeUrl" && (
                  <p className="text-xs text-ink-muted">Uploading resume...</p>
                )}
              </div>
            </Field>
            <Field label="LinkedIn URL">
              <input
                className={inputClass}
                value={form.linkedinUrl}
                onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/..."
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

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Contact email">
              <input
                className={inputClass}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
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
