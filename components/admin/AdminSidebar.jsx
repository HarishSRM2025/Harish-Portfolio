"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UserCircle2,
  Info,
  Briefcase,
  Wrench,
  GraduationCap,
  FolderKanban,
  Mail,
  Settings,
  LogOut,
  ExternalLink
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/hero", label: "Hero Section", icon: UserCircle2 },
  { href: "/admin/about", label: "About", icon: Info },
  { href: "/admin/experience", label: "Experience", icon: Briefcase },
  { href: "/admin/skills", label: "Skills", icon: Wrench },
  { href: "/admin/education", label: "Education", icon: GraduationCap },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/contact", label: "Messages", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings }
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="hidden md:flex flex-col w-64 flex-shrink-0 border-r border-border bg-surface-alt/40 h-screen sticky top-0">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <span className="font-display font-semibold">Admin Panel</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-primary text-white"
                  : "text-ink-muted hover:text-ink hover:bg-surface-alt"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-ink-muted hover:text-ink hover:bg-surface-alt transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          View site
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-ink-muted hover:text-red-500 hover:bg-surface-alt transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}
