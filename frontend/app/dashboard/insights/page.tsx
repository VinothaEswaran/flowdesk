"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from "recharts";

const COLORS = ["#6c63ff", "#00d4aa", "#ffb347", "#ff6b6b"];

export default function InsightsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    api.get("/projects/").then(r => setProjects(r.data));
    api.get("/invoices/").then(r => setInvoices(r.data));
    api.get("/invoices/stats").then(r => setStats(r.data));
  }, []);

  const taskData = [
    { name: "To Do", value: projects.flatMap(p => p.tasks || []).filter((t: any) => t.status === "todo").length },
    { name: "In Progress", value: projects.flatMap(p => p.tasks || []).filter((t: any) => t.status === "in_progress").length },
    { name: "Done", value: projects.flatMap(p => p.tasks || []).filter((t: any) => t.status === "done").length },
  ];

  const invoiceData = [
    { name: "Paid", value: stats.paid || 0 },
    { name: "Unpaid", value: stats.unpaid || 0 },
    { name: "Overdue", value: stats.overdue || 0 },
  ];

  const projectBar = projects.slice(0, 6).map(p => ({
    name: p.title.slice(0, 12),
    tasks: (p.tasks || []).length,
    done: (p.tasks || []).filter((t: any) => t.status === "done").length,
  }));

  const tooltipStyle = { background: "#1a1a24", border: "1px solid #2a2a38", borderRadius: 8, color: "#f0f0f8", fontSize: 12 };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 className="font-syne" style={{ fontSize: 22, fontWeight: 700 }}>Insights</h1>
        <p style={{ fontSize: 13, color: "#7b7b99", marginTop: 4 }}>Visual overview of your productivity & revenue</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <div className="card" style={{ padding: 20 }}>
          <div className="font-syne" style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Tasks by Status</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={taskData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                {taskData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            {taskData.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#7b7b99" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[i] }} />
                {d.name}: {d.value}
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div className="font-syne" style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Revenue Breakdown</div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={invoiceData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                {invoiceData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => `₹${v.toLocaleString("en-IN")}`} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
            {invoiceData.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#7b7b99" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: COLORS[i] }} />
                {d.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 16 }}>
        <div className="font-syne" style={{ fontSize: 13, fontWeight: 700, marginBottom: 16 }}>Tasks per Project</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={projectBar} barSize={20}>
            <XAxis dataKey="name" tick={{ fill: "#7b7b99", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#7b7b99", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="tasks" fill="#6c63ff" radius={[4, 4, 0, 0]} name="Total Tasks" />
            <Bar dataKey="done" fill="#00d4aa" radius={[4, 4, 0, 0]} name="Done" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
        {[
          { label: "Total Projects", value: projects.length, color: "#6c63ff" },
          { label: "Total Tasks", value: projects.flatMap(p => p.tasks || []).length, color: "#00d4aa" },
          { label: "Completion Rate", value: `${projects.flatMap(p => p.tasks || []).length ? Math.round((projects.flatMap(p => p.tasks || []).filter((t: any) => t.status === "done").length / projects.flatMap(p => p.tasks || []).length) * 100) : 0}%`, color: "#ffb347" },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: 16, borderTop: `2px solid ${s.color}` }}>
            <div style={{ fontSize: 10, color: "#7b7b99", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>{s.label}</div>
            <div className="font-syne" style={{ fontSize: 28, fontWeight: 700 }}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
