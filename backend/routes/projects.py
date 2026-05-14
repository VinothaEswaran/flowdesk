from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from database import get_db
from models import Project, Task, TaskStatus
from routes.auth import get_current_user

router = APIRouter()

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    status: TaskStatus = TaskStatus.todo
    priority: str = "medium"
    due_date: Optional[datetime] = None

class ProjectCreate(BaseModel):
    title: str
    description: Optional[str] = None
    client_id: Optional[int] = None
    deadline: Optional[datetime] = None

def auth_header(authorization: str = Header(...), db: Session = Depends(get_db)):
    token = authorization.replace("Bearer ", "")
    return get_current_user(token, db)

@router.get("/")
def get_projects(db: Session = Depends(get_db), user=Depends(auth_header)):
    projects = db.query(Project).filter(Project.owner_id == user.id).all()
    result = []
    for p in projects:
        tasks = db.query(Task).filter(Task.project_id == p.id).all()
        result.append({
            "id": p.id, "title": p.title, "description": p.description,
            "deadline": p.deadline, "client_id": p.client_id,
            "tasks": [{"id": t.id, "title": t.title, "status": t.status, "priority": t.priority, "due_date": t.due_date} for t in tasks]
        })
    return result

@router.post("/")
def create_project(data: ProjectCreate, db: Session = Depends(get_db), user=Depends(auth_header)):
    project = Project(**data.dict(), owner_id=user.id)
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.put("/{project_id}")
def update_project(project_id: int, data: ProjectCreate, db: Session = Depends(get_db), user=Depends(auth_header)):
    project = db.query(Project).filter(Project.id == project_id, Project.owner_id == user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    for key, val in data.dict(exclude_unset=True).items():
        setattr(project, key, val)
    db.commit()
    return project

@router.delete("/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db), user=Depends(auth_header)):
    project = db.query(Project).filter(Project.id == project_id, Project.owner_id == user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(project)
    db.commit()
    return {"message": "Deleted"}

@router.post("/{project_id}/tasks")
def add_task(project_id: int, data: TaskCreate, db: Session = Depends(get_db), user=Depends(auth_header)):
    project = db.query(Project).filter(Project.id == project_id, Project.owner_id == user.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    task = Task(**data.dict(), project_id=project_id)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task

@router.patch("/tasks/{task_id}/status")
def update_task_status(task_id: int, status: TaskStatus, db: Session = Depends(get_db), user=Depends(auth_header)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    task.status = status
    db.commit()
    return task
