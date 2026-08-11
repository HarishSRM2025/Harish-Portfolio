"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import AdminTopbar from "@/components/admin/AdminTopbar";
import StatusBanner from "@/components/admin/StatusBanner";
import { Field, inputClass } from "@/components/admin/FormField";
import { buildPrimaryShades } from "@/lib/color";
import { Save, Sun, Moon, Palette } from "lucide-react";

const PRESET_COLORS = [
  "#6366f1", // indigo
  "#3b82f6", // blue
  "#06b6d4", // cyan
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#ec4899", // pink
  "#8b5cf6" // violet
];

export default function AdminSettingsPage() {
  const { setTheme } = useTheme();
  const [settings, setSettings] = useState({
    siteName: "My Portfolio",
    defaultTheme: "dark",
    primaryColor: "#6366f1"
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then(setSettings)
      .finally(() => setLoading(false));
  }, []);

  // Live-preview the primary color as the admin picks it, without saving yet.
  function previewColor(hex) {
    const shades = buildPrimaryShades(hex);
    const root = document.documentElement;
    Object.entries(shades).forEach(([key, value]) => root.style.setProperty(key, value));
    setSettings((s) => ({ ...s, primaryColor: hex }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      if (!res.ok) throw new Error();
      setTheme(settings.defaultTheme);
      setStatus({ type: "success", message: "Settings saved and applied site-wide." });
    } catch {
      setStatus({ type: "error", message: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <>
        <AdminTopbar title="Settings" />
        <div className="p-6 text-sm text-ink-muted">Loading...</div>
      </>
    );
  }

  return (
    <>
      <AdminTopbar title="Settings" />
      <div className="p-6">
        <StatusBanner status={status} />
        <form onSubmit={handleSubmit} className="space-y-8">
          <Field label="Site name">
            <input
              className={inputClass}
              value={settings.siteName}
              onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
            />
          </Field>

          <div>
            <span className="block text-sm font-medium mb-2">Default theme</span>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSettings({ ...settings, defaultTheme: "light" })}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg border py-3 text-sm transition-colors ${
                  settings.defaultTheme === "light"
                    ? "border-primary text-primary bg-primary/10"
                    : "border-border text-ink-muted"
                }`}
              >
                <Sun className="w-4 h-4" />
                Light
              </button>
              <button
                type="button"
                onClick={() => setSettings({ ...settings, defaultTheme: "dark" })}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg border py-3 text-sm transition-colors ${
                  settings.defaultTheme === "dark"
                    ? "border-primary text-primary bg-primary/10"
                    : "border-border text-ink-muted"
                }`}
              >
                <Moon className="w-4 h-4" />
                Dark
              </button>
            </div>
            <p className="text-xs text-ink-muted mt-2">
              Visitors can still switch themes manually — this sets what they see first.
            </p>
          </div>

          <div>
            <span className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Primary color
            </span>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              {PRESET_COLORS.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => previewColor(hex)}
                  className={`w-9 h-9 rounded-full border-2 transition-transform hover:scale-110 ${
                    settings.primaryColor.toLowerCase() === hex ? "border-ink" : "border-transparent"
                  }`}
                  style={{ backgroundColor: hex }}
                  aria-label={hex}
                />
              ))}
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => previewColor(e.target.value)}
                className="w-9 h-9 rounded-full border border-border cursor-pointer bg-transparent"
                aria-label="Custom color"
              />
            </div>
            <input
              className={inputClass + " max-w-[160px] font-mono"}
              value={settings.primaryColor}
              onChange={(e) => previewColor(e.target.value)}
            />
            <p className="text-xs text-ink-muted mt-2">
              Applied instantly across the portfolio and admin panel — buttons, links, and accents.
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-primary text-white px-5 py-2.5 text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {saving ? "Saving..." : "Save settings"}
          </button>
        </form>
      </div>
    </>
  );
}
