from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import projects, clients, invoices, ai, auth
from database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="FlowDesk API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])
app.include_router(clients.router, prefix="/api/clients", tags=["Clients"])
app.include_router(invoices.router, prefix="/api/invoices", tags=["Invoices"])
app.include_router(ai.router, prefix="/api/ai", tags=["AI"])

@app.get("/")
def root():
    return {"message": "FlowDesk API is running"}
