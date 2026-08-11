"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Menu, X, Linkedin, Github, Download, ArrowUpRight } from "lucide-react";
import ThemeSelector from "./ThemeSelector";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" }
];

export default function Navbar({ name, hero }) {
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("portfolio-theme");
    const initialTheme = storedTheme || "dark";
    setTheme(initialTheme);
    setMounted(true);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    window.localStorage.setItem("portfolio-theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.setAttribute("data-theme", nextTheme);
  };

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur">
        <nav className="container-page flex items-center justify-between h-16">
          <a href="#top" className="font-display font-semibold tracking-tight text-lg">
            {name || "Portfolio"}
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-ink-muted hover:text-ink transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeSelector />
            {/* Hamburger — shown on mobile for offcanvas */}
            <button
              type="button"
              aria-label="Open menu"
              id="navbar-menu-btn"
              className="md:hidden p-2 rounded-full border border-border hover:border-primary transition-colors"
              onClick={() => setOpen(true)}
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </nav>
      </header>

      {/* ── Offcanvas Backdrop ── */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* ── Offcanvas Drawer ── */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed top-0 right-0 z-50 h-full w-[300px] max-w-[85vw] bg-surface border-l border-border shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-border flex-shrink-0">
          <a
            href="#top"
            onClick={() => setOpen(false)}
            className="font-display font-semibold tracking-tight text-lg"
          >
            {name || "Portfolio"}
          </a>
          <button
            type="button"
            aria-label="Close menu"
            id="navbar-close-btn"
            onClick={() => setOpen(false)}
            className="p-2 rounded-full border border-border hover:border-primary transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-6 py-8 overflow-y-auto">
          <p className="text-xs font-mono uppercase tracking-widest text-ink-muted mb-5">Navigation</p>
          <div className="space-y-1">
            {LINKS.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                id={`offcanvas-link-${link.href.replace("#", "")}`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between group px-4 py-3 rounded-xl text-sm font-medium text-ink-muted hover:text-ink hover:bg-surface-alt transition-all duration-150"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <span>{link.label}</span>
                <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>

          {/* Divider */}
          <div className="my-8 border-t border-border" />

          {/* Social / Action Links */}
          <p className="text-xs font-mono uppercase tracking-widest text-ink-muted mb-5">Connect</p>
          <div className="space-y-2">
            {hero?.linkedinUrl && (
              <a
                href={hero.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="offcanvas-linkedin-link"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-ink-muted hover:text-ink hover:bg-surface-alt transition-all group"
              >
                <span className="w-8 h-8 rounded-lg bg-[#0A66C2]/10 flex items-center justify-center flex-shrink-0">
                  <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                </span>
                LinkedIn
                <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            )}
            {hero?.githubUrl && (
              <a
                href={hero.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="offcanvas-github-link"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-ink-muted hover:text-ink hover:bg-surface-alt transition-all group"
              >
                <span className="w-8 h-8 rounded-lg bg-surface-alt flex items-center justify-center flex-shrink-0 border border-border">
                  <Github className="w-4 h-4" />
                </span>
                GitHub
                <ArrowUpRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            )}
          </div>
        </nav>

        {/* Resume CTA at bottom */}
        {hero?.resumeUrl && (
          <div className="px-6 py-5 border-t border-border flex-shrink-0">
            <a
              href={hero.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              id="offcanvas-resume-btn"
              className="flex items-center justify-center gap-2 w-full rounded-xl bg-primary text-white px-5 py-3 text-sm font-semibold hover:bg-primary-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Resume
            </a>
          </div>
        )}
      </aside>
    </>
  );
}
