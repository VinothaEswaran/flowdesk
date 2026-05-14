"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Plus, Mail, Phone, Building2, Trash2 } from "lucide-react";

export default function ClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", company: "", phone: "" });

  const load = () => api.get("/clients/").then(r => setClients(r.data));
  useEffect(() => { load(); }, []);

  const createClient = async () => {
    if (!form.name || !form.email) return toast.error("Name and email required");
    await api.post("/clients/", form);
    toast.success("Client added!");
    setShowModal(false);
    setForm({ name: "", email: "", company: "", phone: "" });
    load();
  };

  const deleteClient = async (id: number) => {
    if (!confirm("Delete this client?")) return;
    await api.delete(`/clients/${id}`);
    toast.success("Client deleted");
    load();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 className="font-syne" style={{ fontSize: 22, fontWeight: 700 }}>Clients</h1>
          <p style={{ fontSize: 13, color: "#7b7b99", marginTop: 4 }}>{clients.length} total clients</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={14} style={{ display: "inline", marginRight: 6 }} /> Add Client
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {clients.map((c: any) => (
          <div key={c.id} className="card" style={{ padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg,rgba(108,99,255,0.3),rgba(0,212,170,0.3))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>
                  {c.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{c.name}</div>
                  {c.company && <div style={{ fontSize: 11, color: "#7b7b99" }}>{c.company}</div>}
                </div>
              </div>
              <button onClick={() => deleteClient(c.id)} style={{ background: "none", border: "none", color: "#ff6b6b", cursor: "pointer" }}>
                <Trash2 size={13} />
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {c.email && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#7b7b99" }}>
                  <Mail size={12} /> {c.email}
                </div>
              )}
              {c.phone && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#7b7b99" }}>
                  <Phone size={12} /> {c.phone}
                </div>
              )}
              {c.company && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#7b7b99" }}>
                  <Building2 size={12} /> {c.company}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {clients.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#3a3a50" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
          <div style={{ fontSize: 14 }}>No clients yet. Add your first client!</div>
        </div>
      )}

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div className="card" style={{ padding: 24, width: 420 }}>
            <div className="font-syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Add New Client</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input placeholder="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input placeholder="Email *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              <input placeholder="Company" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
              <input placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <button className="btn-primary" onClick={createClient}>Add Client</button>
              <button className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
