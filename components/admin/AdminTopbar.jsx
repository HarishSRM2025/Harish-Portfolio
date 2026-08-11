import ThemeSelector from "@/components/ThemeSelector";

export default function AdminTopbar({ title }) {
  return (
    <header className="h-16 border-b border-border flex items-center justify-between px-6 sticky top-0 bg-surface/90 backdrop-blur z-10">
      <h1 className="font-display font-semibold text-lg">{title}</h1>
      <ThemeSelector />
    </header>
  );
}
