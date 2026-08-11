import AdminTopbar from "@/components/admin/AdminTopbar";
import { connectDB } from "@/lib/mongodb";
import Experience from "@/models/Experience";
import Skill from "@/models/Skill";
import Education from "@/models/Education";
import Project from "@/models/Project";
import Contact from "@/models/Contact";
import Link from "next/link";
import { Briefcase, Wrench, GraduationCap, FolderKanban, Mail } from "lucide-react";

export const dynamic = "force-dynamic";

async function getStats() {
  await connectDB();
  const [experienceCount, skillCount, educationCount, projectCount, messageCount, unreadCount] = await Promise.all([
    Experience.countDocuments(),
    Skill.countDocuments(),
    Education.countDocuments(),
    Project.countDocuments(),
    Contact.countDocuments(),
    Contact.countDocuments({ read: false })
  ]);
  return { experienceCount, skillCount, educationCount, projectCount, messageCount, unreadCount };
}

const CARDS = [
  { key: "experienceCount", label: "Experience entries", href: "/admin/experience", icon: Briefcase },
  { key: "skillCount", label: "Skills", href: "/admin/skills", icon: Wrench },
  { key: "educationCount", label: "Education", href: "/admin/education", icon: GraduationCap },
  { key: "projectCount", label: "Projects", href: "/admin/projects", icon: FolderKanban },
  { key: "messageCount", label: "Messages", href: "/admin/contact", icon: Mail }
];

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <>
      <AdminTopbar title="Dashboard" />
      <div className="p-6 max-w-4xl">
        <p className="text-sm text-ink-muted mb-6">
          Manage every section of your portfolio. All content is stored in MongoDB and reflects
          immediately on the live site.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.key}
                href={card.href}
                className="rounded-xl border border-border p-5 hover:border-primary transition-colors"
              >
                <Icon className="w-5 h-5 text-primary mb-3" />
                <div className="text-2xl font-display font-semibold">{stats[card.key]}</div>
                <div className="text-sm text-ink-muted mt-1">{card.label}</div>
                {card.key === "messageCount" && stats.unreadCount > 0 && (
                  <div className="text-xs text-primary mt-1.5">{stats.unreadCount} unread</div>
                )}
              </Link>
            );
          })}
        </div>

        <div className="mt-10 rounded-xl border border-border p-5">
          <h2 className="font-display font-semibold mb-2">Quick start</h2>
          <ul className="text-sm text-ink-muted space-y-1.5 list-disc list-inside">
            <li>Fill in the Hero and About sections first — they anchor the homepage.</li>
            <li>Add Experience, Skills and Projects — each supports full create / edit / delete.</li>
            <li>Set your primary brand color and default theme under Settings.</li>
            <li>Check Messages for anything submitted through your public contact form.</li>
          </ul>
        </div>
      </div>
    </>
  );
}
