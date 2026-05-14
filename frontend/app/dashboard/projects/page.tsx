"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import toast from "react-hot-toast";
import { Plus, X } from "lucide-react";

const STATUSES = ["todo", "in_progress", "done"];
const STATUS_LABELS: Record<string, string> = { todo: "To Do", in_progress: "In Progress", done: "Done" };
const STATUS_COLORS: Record<string, string> = { todo: "#7b7b99", in_progress: "#6c63ff", done: "#00d4aa" };

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", description: "", client_id: "", deadline: "" });
  const [taskForm, setTaskForm] = useState({ title: "", priority: "medium", status: "todo", due_date: "" });

  const load = () => {
    api.get("/projects/").then(r => setProjects(r.data));
    api.get("/clients/").then(r => setClients(r.data));
  };
  useEffect(() => { load(); }, []);

  const createProject = async () => {
    if (!form.title) return toast.error("Title required");
    await api.post("/projects/", { ...form, client_id: form.client_id || null });
    toast.success("Project created!");
    setShowModal(false);
    setForm({ title: "", description: "", client_id: "", deadline: "" });
    load();
  };

  const createTask = async (projectId: number) => {
    if (!taskForm.title) return toast.error("Task title required");
    await api.post(`/projects/${projectId}/tasks`, taskForm);
    toast.success("Task added!");
    setShowTaskModal(null);
    setTaskForm({ title: "", priority: "medium", status: "todo", due_date: "" });
    load();
  };

  const updateTaskStatus = async (taskId: number, status: string) => {
    await api.patch(`/projects/tasks/${taskId}/status?status=${status}`, {});
    load();
  };

  const deleteProject = async (id: number) => {
    if (!confirm("Delete this project?")) return;
    await api.delete(`/projects/${id}`);
    toast.success("Project deleted");
    load();
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 className="font-syne" style={{ fontSize: 22, fontWeight: 700 }}>Projects</h1>
          <p style={{ fontSize: 13, color: "#7b7b99", marginTop: 4 }}>{projects.length} active projects</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={14} style={{ display: "inline", marginRight: 6 }} /> New Project
        </button>
      </div>

      {projects.map(project => (
        <div key={project.id} className="card" style={{ padding: 18, marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div className="font-syne" style={{ fontSize: 15, fontWeight: 700 }}>{project.title}</div>
              {project.description && <div style={{ fontSize: 12, color: "#7b7b99", marginTop: 2 }}>{project.description}</div>}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-ghost" style={{ fontSize: 11, padding: "5px 10px" }} onClick={() => setShowTaskModal(project.id)}>
                + Task
              </button>
              <button onClick={() => deleteProject(project.id)} style={{ background: "none", border: "none", color: "#ff6b6b", cursor: "pointer" }}>
                <X size={14} />
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {STATUSES.map(status => {
              const tasks = (project.tasks || []).filter((t: any) => t.status === status);
              return (
                <div key={status} style={{ background: "#13131a", borderRadius: 8, padding: 10, minHeight: 80 }}>
                  <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "1px", color: "#7b7b99", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: STATUS_COLORS[status] }} />
                    {STATUS_LABELS[status]} ({tasks.length})
                  </div>
                  {tasks.map((task: any) => (
                    <div key={task.id} style={{ background: "#1a1a24", border: "1px solid #2a2a38", borderRadius: 6, padding: 8, marginBottom: 6 }}>
                      <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 6 }}>{task.title}</div>
                      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                        {STATUSES.filter(s => s !== status).map(s => (
                          <button key={s} onClick={() => updateTaskStatus(task.id, s)}
                            style={{ fontSize: 9, padding: "2px 6px", borderRadius: 4, border: `1px solid ${STATUS_COLORS[s]}`, background: "transparent", color: STATUS_COLORS[s], cursor: "pointer" }}>
                            → {STATUS_LABELS[s]}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {tasks.length === 0 && <div style={{ fontSize: 11, color: "#3a3a50" }}>Drop tasks here</div>}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {projects.length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#3a3a50" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📁</div>
          <div style={{ fontSize: 14 }}>No projects yet. Create your first one!</div>
        </div>
      )}

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div className="card" style={{ padding: 24, width: 440 }}>
            <div className="font-syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>New Project</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input placeholder="Project Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              <textarea placeholder="Description" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              <select value={form.client_id} onChange={e => setForm({ ...form, client_id: e.target.value })}>
                <option value="">Select Client (optional)</option>
                {clients.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <button className="btn-primary" onClick={createProject}>Create Project</button>
              <button className="btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showTaskModal !== null && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div className="card" style={{ padding: 24, width: 400 }}>
            <div className="font-syne" style={{ fontSize: 16, fontWeight: 700, marginBottom: 20 }}>Add Task</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <input placeholder="Task Title *" value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} />
              <select value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}>
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
              <select value={taskForm.status} onChange={e => setTaskForm({ ...taskForm, status: e.target.value })}>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
              <input type="date" value={taskForm.due_date} onChange={e => setTaskForm({ ...taskForm, due_date: e.target.value })} />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
              <button className="btn-primary" onClick={() => createTask(showTaskModal)}>Add Task</button>
              <button className="btn-ghost" onClick={() => setShowTaskModal(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
