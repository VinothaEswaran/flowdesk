from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum, Text, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base
import enum

class TaskStatus(str, enum.Enum):
    todo = "todo"
    in_progress = "in_progress"
    done = "done"

class InvoiceStatus(str, enum.Enum):
    paid = "paid"
    unpaid = "unpaid"
    overdue = "overdue"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    clients = relationship("Client", back_populates="owner")
    projects = relationship("Project", back_populates="owner")

class Client(Base):
    __tablename__ = "clients"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    company = Column(String)
    phone = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    owner = relationship("User", back_populates="clients")
    projects = relationship("Project", back_populates="client")
    invoices = relationship("Invoice", back_populates="client")

class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    deadline = Column(DateTime)
    owner_id = Column(Integer, ForeignKey("users.id"))
    client_id = Column(Integer, ForeignKey("clients.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    owner = relationship("User", back_populates="projects")
    client = relationship("Client", back_populates="projects")
    tasks = relationship("Task", back_populates="project", cascade="all, delete")

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    status = Column(Enum(TaskStatus), default=TaskStatus.todo)
    priority = Column(String, default="medium")
    due_date = Column(DateTime)
    project_id = Column(Integer, ForeignKey("projects.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    project = relationship("Project", back_populates="tasks")

class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(Integer, primary_key=True, index=True)
    invoice_number = Column(String, unique=True, nullable=False)
    amount = Column(Float, nullable=False)
    status = Column(Enum(InvoiceStatus), default=InvoiceStatus.unpaid)
    due_date = Column(DateTime)
    description = Column(Text)
    client_id = Column(Integer, ForeignKey("clients.id"))
    owner_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    client = relationship("Client", back_populates="invoices")
