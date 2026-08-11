import { GraduationCap, Calendar, MapPin, Award, Building2, BookOpen } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function EducationSection({ education }) {
  const items = education || [];

  return (
    <section id="education" className="border-t border-border relative overflow-hidden">
      <div className="container-page py-20 md:py-28 relative">
        <ScrollReveal>
          <p className="section-eyebrow mb-3">Education</p>
          <h2 className="font-display text-3xl font-semibold mb-4">Academic Background</h2>
          <p className="text-sm text-ink-muted mb-12 max-w-xl">
            A snapshot of my formal education, qualifications, and the academic foundation behind my technical work.
          </p>
        </ScrollReveal>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface-alt/30 p-8 text-center text-sm text-ink-muted">
            <GraduationCap className="w-8 h-8 mx-auto mb-3 text-ink-muted/40" />
            Add your education entries in the admin panel to display them here.
          </div>
        ) : (
          <div className="grid gap-6">
            {items.map((item, idx) => {
              const hasGrade = String(item.grade || "").trim() !== "";
              const degreeText = [item.degree, item.fieldOfStudy].filter(Boolean).join(" in ");

              return (
                <ScrollReveal key={item._id} delay={idx * 100} variant="zoom">
                  <article className="group relative rounded-2xl border border-border bg-surface-alt/30 p-6 md:p-8 transition-all duration-300 hover:border-primary/40 hover:bg-surface-alt/60 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5 overflow-hidden">
                    {/* Subtle hover accent line */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-primary/60 to-transparent rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Ambient background glow */}
                    <div className="absolute -right-16 -bottom-16 w-56 h-56 bg-primary/5 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/10 transition-colors duration-500" />

                    <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-6">
                      <div className="flex items-start gap-4">
                        {/* Icon badge */}
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 via-primary/10 to-transparent text-primary border border-primary/20 flex items-center justify-center shadow-inner flex-shrink-0 group-hover:scale-110 group-hover:border-primary/40 transition-all duration-300">
                          <GraduationCap className="w-6 h-6" />
                        </div>

                        <div>
                          {/* Degree / Field of study */}
                          {degreeText && (
                            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-primary font-medium mb-1">
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>{degreeText}</span>
                            </div>
                          )}

                          {/* Institution */}
                          <h3 className="font-display text-xl font-bold text-ink flex items-center gap-2 group-hover:text-primary transition-colors duration-200">
                            <Building2 className="w-4 h-4 text-ink-muted flex-shrink-0 hidden md:inline-block" />
                            {item.institution}
                          </h3>

                          {/* Metadata Pills: Location & Grade */}
                          <div className="flex flex-wrap items-center gap-2.5 mt-3">
                            {item.location && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-surface border border-border text-ink-muted">
                                <MapPin className="w-3.5 h-3.5 text-primary/70" />
                                {item.location}
                              </span>
                            )}

                            {hasGrade && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/25 shadow-sm">
                                <Award className="w-3.5 h-3.5" />
                                <span>{String(item.grade).trim()}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Date range badge */}
                      <div className="flex md:flex-col md:items-end justify-between md:justify-start gap-1 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/60">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl bg-surface border border-border text-ink-muted shadow-sm">
                          <Calendar className="w-3.5 h-3.5 text-primary" />
                          {item.startDate || "Start"} — {item.endDate || "Present"}
                        </span>
                      </div>
                    </div>
                  </article>
                </ScrollReveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
