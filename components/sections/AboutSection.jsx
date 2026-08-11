import { CheckCircle2 } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function AboutSection({ about }) {
  if (!about) return null;

  return (
    <section id="about" className="border-t border-border">
      <div className="container-page py-20 md:py-28">
        <ScrollReveal variant="zoom">
          <div className="relative w-full overflow-hidden rounded-3xl border border-border bg-surface-alt/50 p-8 md:p-10 shadow-sm">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-24 -right-20 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -bottom-24 -left-16 w-64 h-64 rounded-full bg-primary/5 blur-3xl" />
            </div>

            <div className="relative grid gap-10 w-full">
              <div className="w-full">
                <p className="section-eyebrow mb-3">About</p>
                <h2 className="font-display text-3xl md:text-4xl font-semibold leading-tight mb-5 w-full">
                  {about.heading || "About Me"}
                </h2>
                {about.description && (
                  <p className="text-ink-muted leading-relaxed whitespace-pre-line text-base md:text-lg w-full">
                    {about.description}
                  </p>
                )}
              </div>

              {about.yearsOfExperience > 0 && (
                <div className="w-full rounded-2xl border border-border bg-surface p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-ink-muted mb-2">Experience</p>
                  <p className="text-3xl font-display font-semibold text-primary">
                    {about.yearsOfExperience}+
                  </p>
                  <p className="text-sm text-ink-muted mt-2">years of professional experience</p>
                </div>
              )}
            </div>

            {about.highlights?.length > 0 && (
              <ul className="relative mt-8 grid sm:grid-cols-2 gap-3">
                {about.highlights.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm rounded-2xl border border-border bg-surface px-4 py-3">
                    <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
