"use client";

import { useState, useEffect, useRef } from "react";
import { Rocket } from "lucide-react";

const DURATION_MS = 5000;

const PHASES = [
  { threshold: 0, label: "IGNITION SEQUENCE" },
  { threshold: 20, label: "MAIN ENGINE START" },
  { threshold: 45, label: "ASCENDING" },
  { threshold: 75, label: "MAX-Q" },
  { threshold: 95, label: "STAGE SEPARATION" },
];

function getPhaseLabel(progress) {
  let label = PHASES[0].label;
  for (const phase of PHASES) {
    if (progress >= phase.threshold) label = phase.label;
  }
  return progress >= 100 ? "LIFTOFF" : label;
}

// Ease-out curve so the launch feels like it's accelerating early
// and settling into orbit near the end, rather than linear ticking.
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

export default function Preloader({ name }) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const startRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    startRef.current = performance.now();

    const tick = (now) => {
      const elapsed = now - startRef.current;
      const t = Math.min(elapsed / DURATION_MS, 1);
      const eased = easeOutCubic(t);
      setProgress(Math.round(eased * 100));

      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setExiting(true);
        setTimeout(() => setLoading(false), 600);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  if (!loading) return null;

  const clamped = Math.min(progress, 100);
  // Rocket travels from just below center up toward the top of its track.
  const rocketOffset = (clamped / 100) * 130;
  const wobble = clamped < 100 ? Math.sin(clamped / 6) * 3 : 0;
  const flameScale = 0.85 + Math.sin(clamped / 3) * 0.15;

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface overflow-hidden transition-all duration-500 ease-in-out ${
        exiting ? "opacity-0 pointer-events-none scale-105" : "opacity-100"
      }`}
    >
      {/* Starfield */}
      <div className="absolute inset-0 pointer-events-none">
        {STARS.map((star, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-ink-muted animate-pulse"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.size,
              height: star.size,
              opacity: star.opacity,
              animationDuration: `${star.duration}s`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Ambient glow, brightens as thrust builds */}
      <div
        className="absolute w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none transition-opacity duration-300"
        style={{ opacity: 0.4 + (clamped / 100) * 0.4 }}
      />

      <div className="relative flex flex-col items-center gap-7 z-10">
        {/* Launch track */}
        <div className="relative w-20 h-40 flex items-end justify-center">
          {/* Track guide line */}
          <div className="absolute bottom-0 w-px h-full bg-border" />

          {/* Smoke trail beneath the rocket, grows and fades as it climbs */}
          <div
            className="absolute bottom-0 rounded-full bg-ink-muted/20 blur-md transition-all duration-150 ease-out"
            style={{
              width: 28 + clamped * 0.3,
              height: 10 + clamped * 0.4,
              opacity: clamped > 3 ? Math.max(0.5 - clamped / 200, 0.1) : 0,
            }}
          />

          {/* Rocket + flame, moves up the track with a slight thrust wobble */}
          <div
            className="absolute flex flex-col items-center transition-transform duration-150 ease-out"
            style={{
              bottom: rocketOffset,
              transform: `translateX(${wobble}px)`,
            }}
          >
            <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 border border-primary/30 shadow-lg text-primary">
              <Rocket
                className="w-7 h-7"
                style={{ transform: "rotate(-45deg)" }}
              />
            </div>
            {/* Flame */}
            {clamped < 100 && (
              <div
                className="w-3 h-5 -mt-1 rounded-b-full bg-gradient-to-b from-primary via-primary/70 to-transparent transition-transform duration-100"
                style={{ transform: `scaleY(${flameScale})`, transformOrigin: "top" }}
              />
            )}
          </div>
        </div>

        {/* Title */}
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight text-ink">
            {name || "Portfolio"}
          </h2>
          <p className="text-xs font-mono uppercase tracking-widest text-primary mt-1">
            {getPhaseLabel(clamped)}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-56 space-y-2">
          <div className="h-1.5 w-full bg-surface-alt rounded-full overflow-hidden border border-border">
            <div
              className="h-full bg-gradient-to-r from-primary via-primary/80 to-primary transition-all duration-150 ease-out"
              style={{ width: `${clamped}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-ink-muted px-1">
            <span>T-MINUS {Math.max(0, Math.ceil((100 - clamped) / 20))}</span>
            <span className="text-primary font-semibold">{clamped}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Fixed star field so positions don't reshuffle on re-render.
const STARS = Array.from({ length: 28 }, (_, i) => {
  const seed = i * 137.5;
  return {
    x: (seed * 3.7) % 100,
    y: (seed * 5.3) % 100,
    size: 1 + ((i * 7) % 3),
    opacity: 0.2 + ((i * 13) % 40) / 100,
    duration: 1.5 + ((i * 3) % 20) / 10,
    delay: (i % 10) / 5,
  };
});