from fastapi import APIRouter, Depends, HTTPException, Header
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from database import get_db
from models import Invoice, InvoiceStatus, Client
from routes.auth import get_current_user
import io, random, string

router = APIRouter()

class InvoiceCreate(BaseModel):
    client_id: int
    amount: float
    description: Optional[str] = None
    due_date: Optional[datetime] = None

def auth_header(authorization: str = Header(...), db: Session = Depends(get_db)):
    token = authorization.replace("Bearer ", "")
    return get_current_user(token, db)

def gen_invoice_number():
    suffix = ''.join(random.choices(string.digits, k=6))
    return f"INV-{suffix}"

@router.get("/")
def get_invoices(db: Session = Depends(get_db), user=Depends(auth_header)):
    invoices = db.query(Invoice).filter(Invoice.owner_id == user.id).all()
    result = []
    for inv in invoices:
        client = db.query(Client).filter(Client.id == inv.client_id).first()
        result.append({
            "id": inv.id, "invoice_number": inv.invoice_number,
            "amount": inv.amount, "status": inv.status,
            "due_date": inv.due_date, "description": inv.description,
            "client_name": client.name if client else "Unknown",
            "created_at": inv.created_at
        })
    return result

@router.post("/")
def create_invoice(data: InvoiceCreate, db: Session = Depends(get_db), user=Depends(auth_header)):
    invoice = Invoice(
        **data.dict(),
        invoice_number=gen_invoice_number(),
        owner_id=user.id,
        status=InvoiceStatus.unpaid
    )
    db.add(invoice)
    db.commit()
    db.refresh(invoice)
    return invoice

@router.patch("/{invoice_id}/status")
def update_invoice_status(invoice_id: int, status: InvoiceStatus, db: Session = Depends(get_db), user=Depends(auth_header)):
    invoice = db.query(Invoice).filter(Invoice.id == invoice_id, Invoice.owner_id == user.id).first()
    if not invoice:
        raise HTTPException(status_code=404, detail="Invoice not found")
    invoice.status = status
    db.commit()
    return invoice

@router.get("/stats")
def get_stats(db: Session = Depends(get_db), user=Depends(auth_header)):
    invoices = db.query(Invoice).filter(Invoice.owner_id == user.id).all()
    total = sum(i.amount for i in invoices)
    paid = sum(i.amount for i in invoices if i.status == InvoiceStatus.paid)
    unpaid = sum(i.amount for i in invoices if i.status == InvoiceStatus.unpaid)
    overdue = sum(i.amount for i in invoices if i.status == InvoiceStatus.overdue)
    return {"total": total, "paid": paid, "unpaid": unpaid, "overdue": overdue, "count": len(invoices)}
