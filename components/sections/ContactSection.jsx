"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Linkedin, Github, Twitter, Send, CheckCircle2 } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function ContactSection({ info }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="border-t border-border">
      <div className="container-page py-20 md:py-28 grid md:grid-cols-2 gap-12">
        <ScrollReveal>
          <p className="section-eyebrow mb-3">Contact</p>
          <h2 className="font-display text-3xl font-semibold mb-4">
            {info?.heading || "Let's Work Together"}
          </h2>
          {info?.description && (
            <p className="text-ink-muted leading-relaxed mb-8">{info.description}</p>
          )}

          <div className="space-y-3 text-sm">
            {info?.email && (
              <a
                href={`mailto:${info.email}`}
                className="flex items-center gap-3 text-ink-muted hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                {info.email}
              </a>
            )}
            {info?.phone && (
              <div className="flex items-center gap-3 text-ink-muted">
                <Phone className="w-4 h-4" />
                {info.phone}
              </div>
            )}
            {info?.address && (
              <div className="flex items-center gap-3 text-ink-muted">
                <MapPin className="w-4 h-4" />
                {info.address}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 mt-6">
            {info?.linkedinUrl && (
              <a
                href={info.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {info?.githubUrl && (
              <a
                href={info.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {info?.twitterUrl && (
              <a
                href={info.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-full border border-border hover:border-primary hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            )}
          </div>
        </ScrollReveal>

        <ScrollReveal variant="zoom" delay={150}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <input
                type="text"
                required
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
              <input
                type="email"
                required
                placeholder="Your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
            <textarea
              required
              placeholder="Your message"
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary resize-none"
            />

            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-6 py-2.5 text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-60"
            >
              {status === "sent" ? (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Sent
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> {status === "sending" ? "Sending..." : "Send message"}
                </>
              )}
            </button>

            {status === "error" && (
              <p className="text-sm text-red-500">Something went wrong. Please try again.</p>
            )}
          </form>
        </ScrollReveal>
      </div>
    </section>
  );
}
