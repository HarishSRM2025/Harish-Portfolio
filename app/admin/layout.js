import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin Panel · Portfolio"
};

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
