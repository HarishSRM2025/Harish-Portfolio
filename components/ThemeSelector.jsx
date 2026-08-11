"use client";

import { useState, useEffect, useRef } from "react";
import { Sun, Moon, Palette, Check } from "lucide-react";

export const COLOR_OPTIONS = [
  { id: "indigo", name: "Indigo", bg: "bg-indigo-500", ring: "ring-indigo-500" },
  { id: "emerald", name: "Emerald", bg: "bg-emerald-500", ring: "ring-emerald-500" },
  { id: "violet", name: "Violet", bg: "bg-violet-500", ring: "ring-violet-500" },
  { id: "cyan", name: "Cyan", bg: "bg-cyan-500", ring: "ring-cyan-500" },
  { id: "rose", name: "Rose", bg: "bg-rose-500", ring: "ring-rose-500" },
  { id: "amber", name: "Amber", bg: "bg-amber-500", ring: "ring-amber-500" },
];

export default function ThemeSelector() {
  const [theme, setTheme] = useState("dark");
  const [color, setColor] = useState("indigo");
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const storedTheme = localStorage.getItem("portfolio-theme") || "dark";
    const storedColor = localStorage.getItem("portfolio-color") || "indigo";

    setTheme(storedTheme);
    setColor(storedColor);
    setMounted(true);

    document.documentElement.classList.toggle("dark", storedTheme === "dark");
    document.documentElement.setAttribute("data-theme", storedTheme);
    document.documentElement.setAttribute("data-color", storedColor);
  }, []);

  const toggleTheme = (newMode) => {
    setTheme(newMode);
    localStorage.setItem("portfolio-theme", newMode);
    document.documentElement.classList.toggle("dark", newMode === "dark");
    document.documentElement.setAttribute("data-theme", newMode);
  };

  const changeColor = (newColor) => {
    setColor(newColor);
    localStorage.setItem("portfolio-color", newColor);
    document.documentElement.setAttribute("data-color", newColor);
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!mounted) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Theme & Color customization"
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border hover:border-primary bg-surface/80 text-sm font-medium transition-all shadow-sm"
      >
        {theme === "dark" ? <Moon className="w-4 h-4 text-primary" /> : <Sun className="w-4 h-4 text-primary" />}
        <Palette className="w-3.5 h-3.5 text-ink-muted" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-border bg-surface/95 backdrop-blur-xl p-4 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Mode Toggle */}
          <div className="mb-4">
            <p className="text-xs font-mono uppercase tracking-widest text-ink-muted mb-2.5">
              Appearance
            </p>
            <div className="grid grid-cols-2 gap-1.5 bg-surface-alt p-1 rounded-xl border border-border">
              <button
                type="button"
                onClick={() => toggleTheme("light")}
                className={`flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
                  theme === "light"
                    ? "bg-surface text-ink shadow-sm border border-border font-semibold"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                <Sun className="w-3.5 h-3.5" /> Light
              </button>
              <button
                type="button"
                onClick={() => toggleTheme("dark")}
                className={`flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg text-xs font-medium transition-all ${
                  theme === "dark"
                    ? "bg-surface text-ink shadow-sm border border-border font-semibold"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                <Moon className="w-3.5 h-3.5" /> Dark
              </button>
            </div>
          </div>

          {/* Accent Color Palette */}
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-ink-muted mb-2.5">
              Accent Color
            </p>
            <div className="grid grid-cols-6 gap-2">
              {COLOR_OPTIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  title={item.name}
                  onClick={() => changeColor(item.id)}
                  className={`w-7 h-7 rounded-full ${item.bg} flex items-center justify-center transition-transform hover:scale-110 shadow-sm relative ${
                    color === item.id ? "ring-2 ring-offset-2 ring-offset-surface " + item.ring : "opacity-80 hover:opacity-100"
                  }`}
                >
                  {color === item.id && <Check className="w-3 h-3 text-white stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
