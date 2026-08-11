import * as Icons from "lucide-react";

// Renders any lucide-react icon by its exported name (e.g. "Code2", "Database").
// Falls back to a generic icon if the name doesn't match a known export.
export default function DynamicIcon({ name, className = "w-5 h-5", ...props }) {
  const IconComponent = Icons[name] || Icons.Code2;
  return <IconComponent className={className} {...props} />;
}

// A curated, professional subset of icons useful for a dev portfolio's skills list.
export const SKILL_ICON_OPTIONS = [
  "Code2", "Terminal", "Database", "Server", "Cloud", "GitBranch",
  "Layout", "Layers", "Braces", "FileCode2", "Cpu", "Boxes",
  "Palette", "Shield", "Workflow", "Container", "Network", "TerminalSquare",
  "Component", "Blocks", "Binary", "Globe", "Rocket", "Settings2"
];
