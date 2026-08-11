"use client";

import { useEffect, useState } from "react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import StatusBanner from "@/components/admin/StatusBanner";
import { Field, inputClass } from "@/components/admin/FormField";
import DynamicIcon, { SKILL_ICON_OPTIONS } from "@/components/DynamicIcon";
import { Plus, Pencil, Trash2, X, Save, Layers3 } from "lucide-react";

const EMPTY = { name: "", category: "General", icon: "Code2", order: 0 };

export default function AdminSkillsPage() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const [categorySaving, setCategorySaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const [skillsRes, categoriesRes] = await Promise.all([
        fetch("/api/skills", { cache: "no-store" }),
        fetch("/api/skill-categories", { cache: "no-store" })
      ]);
      const [skillsData, categoriesData] = await Promise.all([skillsRes.json(), categoriesRes.json()]);
      setItems(skillsData);
      setCategories(categoriesData);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setForm(EMPTY);
    setEditingId("new");
  }

  function openEdit(item) {
    setForm({ ...EMPTY, ...item });
    setEditingId(item._id);
  }

  function closeForm() {
    setEditingId(null);
    setForm(EMPTY);
  }

  async function saveCategoryOrders() {
    setCategorySaving(true);
    setStatus(null);
    try {
      console.log("[saveCategoryOrders] Sending categories:", categories);
      const requests = categories.map(({ name, categoryOrder }) => {
        const payload = { category: name, categoryOrder };
        console.log("[saveCategoryOrders] PUT payload:", payload);
        return fetch("/api/skill-categories", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      });
      const responses = await Promise.all(requests);
      const bodies = await Promise.all(responses.map((r) => r.clone().json()));
      console.log("[saveCategoryOrders] Responses:", bodies);
      if (responses.some((res) => !res.ok)) throw new Error();
      setStatus({ type: "success", message: "Category order updated." });
      await load();
      console.log("[saveCategoryOrders] Reloaded categories:", categories);
    } catch (err) {
      console.error("[saveCategoryOrders] Error:", err);
      setStatus({ type: "error", message: "Failed to update category order." });
    } finally {
      setCategorySaving(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const isNew = editingId === "new";
      // Exclude categoryOrder — it is managed via the category order panel, not per-skill edits
      const { categoryOrder, ...payload } = form;
      const res = await fetch(isNew ? "/api/skills" : `/api/skills/${editingId}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error();
      setStatus({ type: "success", message: `Skill ${isNew ? "added" : "updated"}.` });
      closeForm();
      load();
    } catch {
      setStatus({ type: "error", message: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this skill?")) return;
    const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
    if (res.ok) {
      setStatus({ type: "success", message: "Skill deleted." });
      load();
    } else {
      setStatus({ type: "error", message: "Failed to delete." });
    }
  }

  return (
    <>
      <AdminTopbar title="Skills" />
      <div className="p-6">
        <StatusBanner status={status} />

        <div className="rounded-xl border border-border p-5 mb-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="font-display font-semibold">Category order</h2>
              <p className="text-sm text-ink-muted">
                Set the display priority for each skill category. Lower numbers appear first.
              </p>
            </div>
            <button
              type="button"
              onClick={saveCategoryOrders}
              disabled={categorySaving || loading}
              className="inline-flex items-center gap-2 rounded-lg bg-primary text-white px-4 py-2.5 text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-60"
            >
              <Layers3 className="w-4 h-4" />
              {categorySaving ? "Saving..." : "Save categories"}
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-ink-muted">Loading categories...</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-3">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="rounded-lg border border-border bg-surface-alt/30 p-4 flex items-center justify-between gap-4"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{category.name}</p>
                    <p className="text-xs text-ink-muted">
                      {category.count} skills
                    </p>
                  </div>
                  <input
                    type="number"
                    className="w-24 rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
                    value={category.categoryOrder ?? 0}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCategories((prev) =>
                        prev.map((item) =>
                          item.name === category.name
                            ? { ...item, categoryOrder: val }
                            : item
                        )
                      );
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {editingId ? (
          <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-border p-5 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-semibold">
                {editingId === "new" ? "Add skill" : "Edit skill"}
              </h2>
              <button type="button" onClick={closeForm} className="text-ink-muted hover:text-ink">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-xl border border-border bg-surface-alt/30 p-4 space-y-4">
              <p className="text-xs font-mono uppercase tracking-widest text-ink-muted">Skill details</p>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Skill name">
                  <input
                    required
                    className={inputClass}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="React"
                  />
                </Field>
                <Field label="Category">
                  <input
                    className={inputClass}
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Frontend"
                  />
                </Field>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-surface-alt/30 p-4 space-y-4">
              <p className="text-xs font-mono uppercase tracking-widest text-ink-muted">Display settings</p>
              <Field label="Icon">
                <div className="grid grid-cols-6 sm:grid-cols-8 gap-2">
                  {SKILL_ICON_OPTIONS.map((iconName) => (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => setForm({ ...form, icon: iconName })}
                      className={`aspect-square rounded-lg border flex items-center justify-center transition-colors ${
                        form.icon === iconName
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border text-ink-muted hover:border-primary"
                      }`}
                      aria-label={iconName}
                      title={iconName}
                    >
                      <DynamicIcon name={iconName} className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Display order" hint="Lower numbers appear first within a category">
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
            Add skill
          </button>
        )}

        {loading ? (
          <p className="text-sm text-ink-muted">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-ink-muted">No skills yet.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-3">
            {items.map((item) => (
              <div
                key={item._id}
                className="rounded-xl border border-border p-4 flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <DynamicIcon name={item.icon} className="w-4 h-4 text-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{item.name}</p>
                    <p className="text-xs text-ink-muted">
                      {item.category} - Cat {item.categoryOrder ?? 0} - Item {item.order ?? 0}
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
