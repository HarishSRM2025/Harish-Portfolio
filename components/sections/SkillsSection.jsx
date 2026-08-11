import ScrollReveal from "@/components/ScrollReveal";

export default function SkillsSection({ skills }) {
  if (!skills?.length) return null;

  // Group skills by category and track the lowest category order in each group.
  const grouped = skills.reduce((acc, skill) => {
    const key = skill.category || "General";
    if (!acc[key]) {
      acc[key] = { items: [], categoryOrder: skill.categoryOrder ?? 0 };
    }
    acc[key].categoryOrder = Math.min(acc[key].categoryOrder, skill.categoryOrder ?? 0);
    acc[key].items.push(skill);
    return acc;
  }, {});

  const categories = Object.entries(grouped).sort(([, a], [, b]) => {
    if (a.categoryOrder !== b.categoryOrder) return a.categoryOrder - b.categoryOrder;
    return 0;
  });

  // Assign a subtle accent color per category index
  const categoryColors = [
    { badge: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20", dot: "bg-violet-500" },
    { badge: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20", dot: "bg-sky-500" },
    { badge: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20", dot: "bg-emerald-500" },
    { badge: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20", dot: "bg-amber-500" },
    { badge: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20", dot: "bg-rose-500" },
    { badge: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20", dot: "bg-cyan-500" },
    { badge: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20", dot: "bg-indigo-500" },
    { badge: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20", dot: "bg-pink-500" },
  ];

  return (
    <section id="skills" className="border-t border-border">
      <div className="container-page py-20 md:py-28">
        <ScrollReveal>
          <p className="section-eyebrow mb-3">Skills</p>
          <h2 className="font-display text-3xl font-semibold mb-4">Tools &amp; Technologies</h2>
          <p className="text-sm text-ink-muted mb-12 max-w-xl">
            A curated set of technologies I use to build products — organised by discipline.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(([category, group], catIdx) => {
            const items = group.items;
            const colors = categoryColors[catIdx % categoryColors.length];
            return (
              <ScrollReveal key={category} delay={catIdx * 80} variant="zoom">
                <div className="rounded-2xl border border-border bg-surface-alt/30 p-6 hover:border-primary/40 transition-colors group h-full">
                  {/* Category header */}
                  <div className="flex items-center gap-2.5 mb-5">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${colors.dot}`} />
                    <h3 className="text-xs font-mono uppercase tracking-widest text-ink-muted">
                      {category}
                    </h3>
                    <span className="ml-auto text-xs font-mono text-ink-muted/60">{items.length}</span>
                  </div>

                  {/* Skill pills */}
                  <div className="flex flex-wrap gap-2">
                    {items.map((skill) => {
                      const weight =
                        skill.proficiency >= 85
                          ? "font-semibold"
                          : skill.proficiency >= 65
                          ? "font-medium"
                          : "font-normal";
                      return (
                        <span
                          key={skill._id}
                          title={`${skill.proficiency}% proficiency`}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border ${colors.badge} ${weight} transition-transform hover:scale-105 cursor-default select-none`}
                        >
                          {skill.name}
                          {skill.proficiency >= 85 && (
                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors.dot} opacity-70`} />
                          )}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
