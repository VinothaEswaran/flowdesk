"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!form.email || !form.password) return toast.error("Fill all required fields");
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const payload = mode === "login" ? { email: form.email, password: form.password } : form;
      const res = await api.post(endpoint, payload);
      localStorage.setItem("fd_token", res.data.access_token);
      localStorage.setItem("fd_user", JSON.stringify(res.data.user));
      toast.success(mode === "login" ? "Welcome back!" : "Account created!");
      router.push("/dashboard");
    } catch (e: any) {
      const detail = e.response?.data?.detail;
      const msg = typeof detail === "string" ? detail : "Something went wrong";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0f" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(108,99,255,0.1) 0%, transparent 60%)", pointerEvents: "none" }} />
      <div style={{ width: 400, position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div className="font-syne" style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-1px" }}>
            Flow<span style={{ color: "#6c63ff" }}>Desk</span>
          </div>
          <div style={{ fontSize: 13, color: "#7b7b99", marginTop: 6 }}>Smart workspace for freelancers & startups</div>
        </div>
        <div className="card" style={{ padding: 28 }}>
          <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
            {["login", "register"].map(m => (
              <button key={m} onClick={() => setMode(m as any)}
                style={{ flex: 1, padding: "8px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", border: "none",
                  background: mode === m ? "#6c63ff" : "#13131a", color: mode === m ? "#fff" : "#7b7b99" }}>
                {m === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {mode === "register" && (
              <input placeholder="Full Name *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            )}
            <input placeholder="Email *" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <input placeholder="Password *" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
              onKeyDown={e => e.key === "Enter" && submit()} />
          </div>
          <button className="btn-primary" onClick={submit} disabled={loading}
            style={{ width: "100%", marginTop: 20, padding: "12px", fontSize: 14, opacity: loading ? 0.6 : 1 }}>
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: "#3a3a50" }}>
          FlowDesk — Built for productive freelancers
        </div>
      </div>
    </div>
  );
}