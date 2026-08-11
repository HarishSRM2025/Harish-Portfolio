"use client";

import { useRef } from "react";
import { ExternalLink, Github, Sparkles, ArrowUpRight, FolderGit2, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y, Autoplay } from "swiper/modules";
import ScrollReveal from "@/components/ScrollReveal";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ProjectsSection({ projects }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  if (!projects?.length) return null;

  return (
    <section id="projects" className="w-full max-w-full border-t border-border relative overflow-hidden">
      <div className="absolute top-1/4 -right-64 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container-page w-full max-w-full py-20 md:py-28 relative overflow-hidden">
        <ScrollReveal>
          <div className="flex items-end justify-between gap-6 mb-12">
            <div>
              <p className="section-eyebrow mb-3">Projects</p>
              <h2 className="font-display text-3xl font-semibold mb-4">Selected Work</h2>
              <p className="text-sm text-ink-muted max-w-xl">
                A showcase of recent web applications, tools, and digital experiences I've engineered.
              </p>
            </div>

            {/* Nav arrows */}
            <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
              <button
                ref={prevRef}
                aria-label="Previous project"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-border text-ink-muted hover:text-primary hover:border-primary/40 transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                ref={nextRef}
                aria-label="Next project"
                className="w-10 h-10 flex items-center justify-center rounded-full border border-border text-ink-muted hover:text-primary hover:border-primary/40 transition-colors disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <Swiper
            modules={[Navigation, Pagination, A11y, Autoplay]}
            spaceBetween={24}
            slidesPerView={1}
            speed={600}
            loop={projects.length > 2}
            autoplay={{
              delay: 3200,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            breakpoints={{
              640: { slidesPerView: 1.4 },
              1024: { slidesPerView: 2 },
              1280: { slidesPerView: 2.4 },
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            pagination={{ clickable: true, el: ".projects-pagination" }}
            className="!w-full !max-w-full !overflow-hidden !pb-2"
          >
            {projects.map((project) => (
              <SwiperSlide key={project._id} className="h-auto self-stretch">
                <article className="group flex flex-col h-full rounded-2xl border border-border bg-surface-alt/40 overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                  {/* Image — contained, not cropped */}
                  <div className="relative aspect-[16/10] bg-surface-alt overflow-hidden flex-shrink-0">
                    {project.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={project.imageUrl}
                        alt={project.title}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        draggable={false}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-ink-muted/40">
                        <FolderGit2 className="w-8 h-8 stroke-[1.5]" />
                        <span className="text-xs font-mono">No Preview</span>
                      </div>
                    )}

                    {project.featured && (
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 text-xs font-semibold bg-primary text-white px-2.5 py-1 rounded-full">
                        <Sparkles className="w-3 h-3 fill-current" />
                        Featured
                      </span>
                    )}

                    {project.status && (
                      <span className="absolute top-3 right-3 inline-flex items-center text-[10px] bg-surface/80 backdrop-blur-md border border-border text-ink px-2.5 py-1 rounded-full font-mono uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5" />
                        {project.status}
                      </span>
                    )}
                  </div>

                  {/* Body */}
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-display font-bold text-lg text-ink group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <ArrowUpRight className="w-4 h-4 text-ink-muted/40 group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                    </div>

                    {project.description && (
                      <p className="text-sm text-ink-muted leading-relaxed mb-4 flex-1">
                        {project.description}
                      </p>
                    )}

                    {project.techStack?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-5">
                        {project.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="text-[11px] font-medium px-2 py-1 rounded-md bg-primary/8 text-primary border border-primary/15"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 mt-auto pt-4 border-t border-border/50">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-700 transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Live Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-ink transition-colors ml-auto"
                        >
                          <Github className="w-3.5 h-3.5" />
                          Source
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Pagination dots */}
          <div className="projects-pagination flex items-center justify-center gap-2 mt-2" />
        </ScrollReveal>
      </div>

      <style jsx global>{`
        .projects-pagination .swiper-pagination-bullet {
          width: 6px;
          height: 6px;
          border-radius: 9999px;
          background: var(--color-border, #d4d4d8);
          opacity: 1;
          transition: all 0.25s ease;
        }
        .projects-pagination .swiper-pagination-bullet-active {
          width: 20px;
          background: var(--color-primary, #6366f1);
        }
      `}</style>
    </section>
  );
}