import { ArrowUpRight, Download, Linkedin, Github, MapPin } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

export default function HeroSection({ hero }) {
  if (!hero) return null;

  return (
    <section id="top" className="relative overflow-hidden">
      <div className="container-page pt-20 pb-24 md:pt-28 md:pb-32 grid md:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        <ScrollReveal>
          <p className="section-eyebrow mb-4">Full Stack Developer</p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
            {hero.name || "Your Name"}
          </h1>
          {hero.role && (
            <p className="mt-4 text-lg md:text-xl text-ink-muted font-display">{hero.role}</p>
          )}
          {hero.tagline && (
            <p className="mt-3 text-base text-ink-muted max-w-xl leading-relaxed font-medium">
              {hero.tagline}
            </p>
          )}

          {/* Description paragraph */}
          {hero.description && (
            <p className="mt-4 text-sm text-ink-muted max-w-xl leading-relaxed">
              {hero.description}
            </p>
          )}

          {hero.location && (
            <div className="mt-5 flex items-center gap-1.5 text-sm text-ink-muted">
              <MapPin className="w-3.5 h-3.5" />
              {hero.location}
            </div>
          )}

          {/* Action Buttons: LinkedIn, GitHub, Resume */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {hero.resumeUrl && (
              <a
                href={hero.resumeUrl}
                id="hero-resume-btn"
                className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-5 py-2.5 text-sm font-semibold hover:bg-primary-700 transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                Resume PDF
              </a>
            )}
            {hero.linkedinUrl && (
              <a
                href={hero.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="hero-linkedin-btn"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:border-[#0A66C2] hover:text-[#0A66C2] transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                LinkedIn
              </a>
            )}
            {hero.githubUrl && (
              <a
                href={hero.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="hero-github-btn"
                className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:border-primary hover:text-primary transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            )}
            <a
              href="#contact"
              id="hero-contact-link"
              className="inline-flex items-center gap-1.5 px-2 py-2.5 text-sm font-medium text-ink-muted hover:text-primary transition-colors"
            >
              Get in touch
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="zoom" delay={150}>
          <div className="relative mx-auto md:mx-0 w-56 h-56 sm:w-72 sm:h-72 md:w-full md:h-96">
            <div className="absolute inset-0 rounded-3xl bg-primary/10 rotate-3" />
            <div className="relative w-full h-full rounded-3xl overflow-hidden border border-border bg-surface-alt -rotate-2">
              {hero.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={hero.imageUrl}
                  alt={hero.name || "Profile photo"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-ink-muted text-sm">
                  Add a hero image in the admin panel
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
