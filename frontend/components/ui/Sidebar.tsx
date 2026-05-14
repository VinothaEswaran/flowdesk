"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { LayoutDashboard, FolderKanban, Users, FileText, Bot, BarChart2, Settings, LogOut } from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/clients", label: "Clients", icon: Users },
  { href: "/dashboard/invoices", label: "Invoices", icon: FileText },
  { href: "/dashboard/ai-assistant", label: "AI Assistant", icon: Bot },
  { href: "/dashboard/insights", label: "Insights", icon: BarChart2 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    const u = localStorage.getItem("fd_user");
    if (u) setUser(JSON.parse(u));
  }, []);

  const logout = () => {
    localStorage.removeItem("fd_token");
    localStorage.removeItem("fd_user");
    router.push("/login");
  };

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()
    : "FD";

  return (
    <aside style={{ background: "#13131a", borderRight: "1px solid #2a2a38", display: "flex", flexDirection: "column", width: 220, minHeight: "100vh" }}>
      <div style={{ padding: "20px", borderBottom: "1px solid #2a2a38" }}>
        <div className="font-syne" style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.5px" }}>
          Flow<span style={{ color: "#6c63ff" }}>Desk</span>
        </div>
        <div style={{ fontSize: 10, color: "#7b7b99", letterSpacing: "1px", textTransform: "uppercase", marginTop: 2 }}>Workspace</div>
      </div>

      <nav style={{ flex: 1, padding: "12px 0" }}>
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link key={href} href={href} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "10px 20px",
              fontSize: 13, color: active ? "#f0f0f8" : "#7b7b99",
              borderLeft: `2px solid ${active ? "#6c63ff" : "transparent"}`,
              background: active ? "linear-gradient(90deg,rgba(108,99,255,0.1),transparent)" : "transparent",
              textDecoration: "none", transition: "all 0.2s"
            }}>
              <Icon size={15} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: "16px 20px", borderTop: "1px solid #2a2a38" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", background: "linear-gradient(135deg,#6c63ff,#00d4aa)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>
            {initials}
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 500 }}>{user?.name || "User"}</div>
            <div style={{ fontSize: 10, color: "#7b7b99" }}>Freelancer</div>
          </div>
        </div>
        <button onClick={logout} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#ff6b6b", background: "none", border: "none", cursor: "pointer" }}>
          <LogOut size={13} /> Logout
        </button>
      </div>
    </aside>
  );
}