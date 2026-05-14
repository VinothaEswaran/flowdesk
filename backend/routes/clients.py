from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database import get_db
from models import Client
from routes.auth import get_current_user

router = APIRouter()

class ClientCreate(BaseModel):
    name: str
    email: str
    company: Optional[str] = None
    phone: Optional[str] = None

def auth_header(authorization: str = Header(...), db: Session = Depends(get_db)):
    token = authorization.replace("Bearer ", "")
    return get_current_user(token, db)

@router.get("/")
def get_clients(db: Session = Depends(get_db), user=Depends(auth_header)):
    clients = db.query(Client).filter(Client.owner_id == user.id).all()
    return [{"id": c.id, "name": c.name, "email": c.email, "company": c.company, "phone": c.phone} for c in clients]

@router.post("/")
def create_client(data: ClientCreate, db: Session = Depends(get_db), user=Depends(auth_header)):
    client = Client(**data.dict(), owner_id=user.id)
    db.add(client)
    db.commit()
    db.refresh(client)
    return client

@router.put("/{client_id}")
def update_client(client_id: int, data: ClientCreate, db: Session = Depends(get_db), user=Depends(auth_header)):
    client = db.query(Client).filter(Client.id == client_id, Client.owner_id == user.id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    for key, val in data.dict(exclude_unset=True).items():
        setattr(client, key, val)
    db.commit()
    return client

@router.delete("/{client_id}")
def delete_client(client_id: int, db: Session = Depends(get_db), user=Depends(auth_header)):
    client = db.query(Client).filter(Client.id == client_id, Client.owner_id == user.id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(client)
    db.commit()
    return {"message": "Deleted"}