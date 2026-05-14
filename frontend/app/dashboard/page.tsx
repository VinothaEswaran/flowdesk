"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { TrendingUp, Users, FileText, CheckSquare } from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({ paid: 0, unpaid: 0, count: 0 });
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("fd_user") || "{}");
    setUser(u);
    api.get("/invoices/stats").then(r => setStats(r.data));
    api.get("/projects/").then(r => setProjects(r.data));
    api.get("/clients/").then(r => setClients(r.data));
  }, []);

  const totalTasks = projects.flatMap(p => p.tasks || []).length;
  const doneTasks = projects.flatMap(p => p.tasks || []).filter(t => t.status === "done").length;
  const donePercent = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const metrics = [
    { label: "Active Projects", value: projects.length, change: "+this month", icon: TrendingUp, color: "#6c63ff" },
    { label: "Revenue (Paid)", value: `₹${(stats.paid / 1000).toFixed(0)}K`, change: "total earned", icon: TrendingUp, color: "#00d4aa" },
    { label: "Pending Invoices", value: `₹${(stats.unpaid / 1000).toFixed(0)}K`, change: `${stats.count} invoices`, icon: FileText, color: "#ffb347" },
    { label: "Tasks Done", value: `${donePercent}%`, change: `${doneTasks}/${totalTasks} tasks`, icon: CheckSquare, color: "#ff6b6b" },
  ];

  const todoTasks = projects.flatMap(p => (p.tasks || []).filter((t: any) => t.status === "todo").map((t: any) => ({ ...t, project: p.title })));
  const inProgressTasks = projects.flatMap(p => (p.tasks || []).filter((t: any) => t.status === "in_progress").map((t: any) => ({ ...t, project: p.title })));
  const doneTasks2 = projects.flatMap(p => (p.tasks || []).filter((t: any) => t.status === "done").map((t: any) => ({ ...t, project: p.title })));

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 className="font-syne" style={{ fontSize: 22, fontWeight: 700, letterSpacing: "-0.5px" }}>
          Good morning, {user?.name?.split(" ")[0] || "there"} 👋
        </h1>
        <p style={{ fontSize: 13, color: "#7b7b99", marginTop: 4 }}>Here's what's happening with your projects today.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {metrics.map((m, i) => (
          <div key={i} className="card" style={{ padding: 16, borderTop: `2px solid ${m.color}` }}>
            <div style={{ fontSize: 10, color: "#7b7b99", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>{m.label}</div>
            <div className="font-syne" style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-1px" }}>{m.value}</div>
            <div style={{ fontSize: 11, color: "#7b7b99", marginTop: 4 }}>{m.change}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16 }}>
        <div className="card" style={{ padding: 18 }}>
          <div className="font-syne" style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Project Board</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
            {[
              { label: "To Do", color: "#7b7b99", tasks: todoTasks },
              { label: "In Progress", color: "#6c63ff", tasks: inProgressTasks },
              { label: "Done", color: "#00d4aa", tasks: doneTasks2 },
            ].map(col => (
              <div key={col.label}>
                <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "1px", color: "#7b7b99", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", background: col.color }} />
                  {col.label} ({col.tasks.length})
                </div>
                {col.tasks.slice(0, 4).map((t: any) => (
                  <div key={t.id} style={{ background: "#13131a", border: "1px solid #2a2a38", borderRadius: 8, padding: 10, marginBottom: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 4 }}>{t.title}</div>
                    <div style={{ fontSize: 10, color: "#7b7b99" }}>{t.project}</div>
                  </div>
                ))}
                {col.tasks.length === 0 && <div style={{ fontSize: 11, color: "#3a3a50", padding: "8px 0" }}>No tasks</div>}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="card" style={{ padding: 16, border: "1px solid rgba(108,99,255,0.3)", background: "rgba(108,99,255,0.05)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: "#6c63ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>AI</div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>AI Assistant</div>
            </div>
            {["Draft payment follow-up email", "Generate project proposal", "Summarize weekly insights"].map(p => (
              <a key={p} href="/dashboard/ai-assistant" style={{ display: "block", background: "#13131a", border: "1px solid #2a2a38", borderRadius: 8, padding: "8px 10px", fontSize: 11, color: "#7b7b99", marginBottom: 6, textDecoration: "none", transition: "all 0.2s" }}>
                {p} →
              </a>
            ))}
          </div>

          <div className="card" style={{ padding: 16 }}>
            <div className="font-syne" style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>Clients ({clients.length})</div>
            {clients.slice(0, 4).map((c: any) => (
              <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: "1px solid #2a2a38" }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(108,99,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#9d96ff" }}>
                  {c.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 500 }}>{c.name}</div>
                  <div style={{ fontSize: 10, color: "#7b7b99" }}>{c.company || c.email}</div>
                </div>
              </div>
            ))}
            {clients.length === 0 && <div style={{ fontSize: 12, color: "#3a3a50" }}>No clients yet. Add one!</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
