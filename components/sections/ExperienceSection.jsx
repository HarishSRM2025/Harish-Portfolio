import { Briefcase, MapPin, Calendar } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function ExperienceSection({ experience }) {
  if (!experience?.length) return null;

  return (
    <section id="experience" className="border-t border-border">
      <div className="container-page py-20 md:py-28">
        <ScrollReveal>
          <p className="section-eyebrow mb-3">Experience</p>
          <h2 className="font-display text-3xl font-semibold mb-12">Where I've Worked</h2>
        </ScrollReveal>

        <ol className="relative border-l border-border ml-3">
          {experience.map((exp, idx) => (
            <ScrollReveal key={exp._id} delay={idx * 120}>
              <li className="mb-10 ml-8 last:mb-0">
                <span className="absolute -left-[9px] flex items-center justify-center w-4 h-4 rounded-full bg-primary ring-4 ring-surface" />
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="font-display text-lg font-semibold flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-primary" />
                    {exp.role} · {exp.company}
                  </h3>
                  <span className="text-xs text-ink-muted inline-flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {exp.startDate} — {exp.endDate}
                  </span>
                </div>
                {exp.location && (
                  <p className="text-xs text-ink-muted mt-1 inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {exp.location}
                  </p>
                )}
                {exp.description && (
                  <p className="text-sm text-ink-muted mt-3 leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>
                )}
                {exp.technologies?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 dark:bg-surface-alt dark:text-ink-muted border border-border"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </li>
            </ScrollReveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
