"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Plus, CheckCircle, Clock, AlertCircle } from "lucide-react";

const STATUS_STYLES: Record<string, { bg: string; color: string; icon: any }> = {
  paid: { bg: "rgba(0,212,170,0.1)", color: "#00d4aa", icon: CheckCircle },
  unpaid: { bg: "rgba(255,179,71,0.1)", color: "#ffb347", icon: Clock },
  overdue: { bg: "rgba(255,107,107,0.1)", color: "#ff6b6b", icon: AlertCircle },
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [stats, setStats] = useState({ paid: 0, unpaid: 0, overdue: 0, total: 0 });
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ client_id: "", amount: "", description: "", due_date: "" });

  const load = () => {
    api.get("/invoices/").then(r => setInvoices(r.data));
    api.get("/invoices/stats").then(r => setStats(r.data));
    api.get("/clients/").then(r => setClients(r.data));
  };
  useEffect(() => { load(); }, []);

  const createInvoice = async () => {
    if (!form.client_id || !form.amount) return toast.error("Client and amount required");
    await api.post("/invoices/", { ...form, amount: parseFloat(form.amount) });
    toast.success("Invoice created!");
    setShowModal(false);
    setForm({ client_id: "", amount: "", description: "", due_date: "" });
    load();
  };

  const updateStatus = async (id: number, status: string) => {
    await api.patch(`/invoices/${id}/status?status=${status}`, {});
    toast.success("Status updated");
    load();
  };

  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 className="font-syne" style={{ fontSize: 22, fontWeight: 700 }}>Invoices</h1>
          <p style={{ fontSize: 13, color: "#7b7b99", marginTop: 4 }}>Track all payments</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={14} style={{ display: "inline", marginRight: 6 }} /> New Invoice
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Total Revenue", value: fmt(stats.total), color: "#6c63ff" },
          { label: "Paid", value: fmt(stats.paid), color: "#00d4aa" },
          { label: "Pending", value: fmt(stats.unpaid), color: "#ffb347" },
          { label: "Overdue", value: fmt(stats.overdue), color: "#ff6b6b" },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: 16, borderTop: `2px solid ${s.color}` }}>
            <div style={{ fontSize: 10, color: "#7b7b99", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>{s.label}</div>
            <div className="font-syne" style={{ fontSize: 20, fontWeight: 700 }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #2a2a38" }}>
              {["Invoice #", "Client", "Amount", "Description", "Due Date", "Status", "Actions"].map(h => (
                <th key={h} style={{ padding: "12px 16px", fontSize: 11, color: "#7b7b99", textAlign: "left", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv: any) => {
              const s = STATUS_STYLES[inv.status] || STATUS_STYLES.unpaid;
              const Icon = s.icon;
              return (
                <tr key={inv.id} style={{ borderBottom: "1px solid #1a1a24" }}>
                  <td style={{ padding: "12px 16px", fontSize: 12, fontWeight: 600, color: "#6c63ff" }}>{inv.invoice_number}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12 }}>{inv.client_name}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span className="font-syne" style={{ fontSize: 14, fontWeight: 700 }}>{fmt(inv.amount)}</span>
                  </td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#7b7b99" }}>{inv.description || "—"}</td>
                  <td style={{ padding: "12px 16px", fontSize: 12, color: "#7b7b99" }}>{inv.due_date ? new Date(inv.due_date).toLocaleDateString("en-IN") : "—"}</td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, padding: "3px 8px", borderRadius: 10, background: s.bg, color: s.color, fontWeight: 500 }}>
                      <Icon size={10} /> {inv.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <select onChange={e => updateStatus(inv.id, e.target.value)} defaultValue={inv.status}
                      style={{ fontSize: 11, padding: "4px 6px", width: "auto", background: "#13131a", border: "1px solid #2a2a38", borderRadius: 6, color: "#f0f0f8" }}>
                      <option value="unpaid">Unpaid</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {invoices.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px", color: "#3a3a50", fontSize: 13 }}>No invoices yet. Create your first one!</div>
        )}
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div className="card" style={{ padding: 24, width: 420 }}>
            <div className="font-syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Create Invoice</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <select value={form.client_id} onChange={e => setForm({ ...form, client_id: e.target.value })}>
                <option value="">Select Client *</option>
                {clients.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input placeholder="Amount (₹) *" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
              <textarea placeholder="Description / Work Details" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <div style={{ fontSize: 11, color: "#7b7b99" }}>Due Date</div>
              <input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <button className="btn-primary" onClick={createInvoice}>Create Invoice</button>
              <button className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
