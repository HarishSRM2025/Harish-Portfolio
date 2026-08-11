export default function Footer({ name }) {
  return (
    <footer className="border-t border-border">
      <div className="container-page py-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-ink-muted">
        <span>
          © {new Date().getFullYear()} {name || "Portfolio"}. All rights reserved.
        </span>
        <span>Built with Next.js &amp; MongoDB</span>
      </div>
    </footer>
  );
}
