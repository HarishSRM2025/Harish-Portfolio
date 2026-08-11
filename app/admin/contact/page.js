"use client";

import { useEffect, useState } from "react";
import AdminTopbar from "@/components/admin/AdminTopbar";
import StatusBanner from "@/components/admin/StatusBanner";
import { Field, inputClass, textareaClass } from "@/components/admin/FormField";
import { Mail, MailOpen, Trash2, Save, ChevronDown, ChevronUp } from "lucide-react";

const EMPTY_INFO = {
  heading: "Let's Work Together",
  description: "",
  email: "",
  phone: "",
  address: "",
  linkedinUrl: "",
  githubUrl: "",
  twitterUrl: ""
};

export default function AdminContactPage() {
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [status, setStatus] = useState(null);

  const [info, setInfo] = useState(EMPTY_INFO);
  const [infoOpen, setInfoOpen] = useState(false);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [savingInfo, setSavingInfo] = useState(false);

  function loadMessages() {
    setLoadingMessages(true);
    fetch("/api/contact")
      .then((res) => res.json())
      .then(setMessages)
      .finally(() => setLoadingMessages(false));
  }

  useEffect(() => {
    loadMessages();
    fetch("/api/contactinfo")
      .then((res) => res.json())
      .then((data) => setInfo({ ...EMPTY_INFO, ...data }))
      .finally(() => setLoadingInfo(false));
  }, []);

  async function toggleRead(msg) {
    await fetch(`/api/contact/${msg._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read: !msg.read })
    });
    loadMessages();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this message?")) return;
    const res = await fetch(`/api/contact/${id}`, { method: "DELETE" });
    if (res.ok) {
      setStatus({ type: "success", message: "Message deleted." });
      loadMessages();
    }
  }

  async function handleInfoSubmit(e) {
    e.preventDefault();
    setSavingInfo(true);
    setStatus(null);
    try {
      const res = await fetch("/api/contactinfo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(info)
      });
      if (!res.ok) throw new Error();
      setStatus({ type: "success", message: "Contact info saved." });
    } catch {
      setStatus({ type: "error", message: "Failed to save. Please try again." });
    } finally {
      setSavingInfo(false);
    }
  }

  return (
    <>
      <AdminTopbar title="Messages" />
      <div className="p-6 max-w-3xl">
        <StatusBanner status={status} />

        <div className="rounded-xl border border-border mb-8">
          <button
            type="button"
            onClick={() => setInfoOpen((v) => !v)}
            className="w-full flex items-center justify-between px-5 py-4 text-sm font-medium"
          >
            Public contact section content
            {infoOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {infoOpen && !loadingInfo && (
            <form onSubmit={handleInfoSubmit} className="px-5 pb-5 space-y-5 border-t border-border pt-5">
              <Field label="Heading">
                <input
                  className={inputClass}
                  value={info.heading}
                  onChange={(e) => setInfo({ ...info, heading: e.target.value })}
                />
              </Field>
              <Field label="Description">
                <textarea
                  rows={3}
                  className={textareaClass}
                  value={info.description}
                  onChange={(e) => setInfo({ ...info, description: e.target.value })}
                />
              </Field>
              <div className="grid sm:grid-cols-2 gap-5">
                <Field label="Email">
                  <input
                    className={inputClass}
                    value={info.email}
                    onChange={(e) => setInfo({ ...info, email: e.target.value })}
                  />
                </Field>
                <Field label="Phone">
                  <input
                    className={inputClass}
                    value={info.phone}
                    onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                  />
                </Field>
              </div>
              <Field label="Address">
                <input
                  className={inputClass}
                  value={info.address}
                  onChange={(e) => setInfo({ ...info, address: e.target.value })}
                />
              </Field>
              <div className="grid sm:grid-cols-3 gap-5">
                <Field label="LinkedIn URL">
                  <input
                    className={inputClass}
                    value={info.linkedinUrl}
                    onChange={(e) => setInfo({ ...info, linkedinUrl: e.target.value })}
                  />
                </Field>
                <Field label="GitHub URL">
                  <input
                    className={inputClass}
                    value={info.githubUrl}
                    onChange={(e) => setInfo({ ...info, githubUrl: e.target.value })}
                  />
                </Field>
                <Field label="Twitter URL">
                  <input
                    className={inputClass}
                    value={info.twitterUrl}
                    onChange={(e) => setInfo({ ...info, twitterUrl: e.target.value })}
                  />
                </Field>
              </div>
              <button
                type="submit"
                disabled={savingInfo}
                className="inline-flex items-center gap-2 rounded-lg bg-primary text-white px-5 py-2.5 text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                {savingInfo ? "Saving..." : "Save"}
              </button>
            </form>
          )}
        </div>

        <h2 className="font-display font-semibold mb-4">Inbox</h2>
        {loadingMessages ? (
          <p className="text-sm text-ink-muted">Loading...</p>
        ) : messages.length === 0 ? (
          <p className="text-sm text-ink-muted">No messages yet.</p>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`rounded-xl border p-4 ${
                  msg.read ? "border-border" : "border-primary/40 bg-primary/5"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-medium text-sm">
                      {msg.name} <span className="text-ink-muted font-normal">· {msg.email}</span>
                    </p>
                    {msg.subject && (
                      <p className="text-sm text-ink-muted mt-0.5">{msg.subject}</p>
                    )}
                    <p className="text-sm mt-2 whitespace-pre-line">{msg.message}</p>
                    <p className="text-xs text-ink-muted mt-2">
                      {new Date(msg.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleRead(msg)}
                      className="p-2 rounded-lg hover:bg-surface-alt text-ink-muted hover:text-primary"
                      aria-label={msg.read ? "Mark unread" : "Mark read"}
                      title={msg.read ? "Mark unread" : "Mark read"}
                    >
                      {msg.read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(msg._id)}
                      className="p-2 rounded-lg hover:bg-surface-alt text-ink-muted hover:text-red-500"
                      aria-label="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
