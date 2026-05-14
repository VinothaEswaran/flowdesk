# FlowDesk 
> AI-Powered Project & Client Management SaaS for Freelancers and Startups

---

## Project Structure

```
flowdesk/
├── frontend/          ← Next.js 14 App
│   ├── app/
│   │   ├── page.tsx                    ← Root redirect
│   │   ├── login/page.tsx              ← Login / Register
│   │   └── dashboard/
│   │       ├── layout.tsx              ← Sidebar layout
│   │       ├── page.tsx                ← Dashboard home
│   │       ├── projects/page.tsx       ← Kanban board
│   │       ├── clients/page.tsx        ← Client management
│   │       ├── invoices/page.tsx       ← Invoice tracker
│   │       ├── ai-assistant/page.tsx   ← AI generator + chat
│   │       └── insights/page.tsx       ← Charts & analytics
│   ├── components/ui/Sidebar.tsx
│   ├── lib/api.ts
│   └── package.json
│
└── backend/           ← FastAPI App
    ├── main.py
    ├── database.py
    ├── models/__init__.py
    ├── routes/
    │   ├── auth.py
    │   ├── projects.py
    │   ├── clients.py
    │   ├── invoices.py
    │   └── ai.py
    ├── requirements.txt
    └── .env.example
```

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL installed and running

---

### 1. Clone / Download the project

```bash
cd flowdesk
```

---

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
source venv/bin/activate        # Mac/Linux
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Copy env file and fill values
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL=postgresql://postgres:yourpassword@localhost/flowdesk_db
ANTHROPIC_API_KEY=sk-ant-xxxx         ← Get from console.anthropic.com
SECRET_KEY=any-random-secret-string
```

Create the database:
```bash
psql -U postgres -c "CREATE DATABASE flowdesk_db;"
```

Run the backend:
```bash
uvicorn main:app --reload
# Runs on http://localhost:8000
# API docs at http://localhost:8000/docs
```

---

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Run the dev server
npm run dev
# Runs on http://localhost:3000
```

---

## Running Both Together

Open two terminals:

**Terminal 1 — Backend:**
```bash
cd flowdesk/backend
source venv/bin/activate
uvicorn main:app --reload
```

**Terminal 2 — Frontend:**
```bash
cd flowdesk/frontend
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## Features

| Feature | Status |
|---|---|
| Auth (Register / Login / JWT) | 
| Project Management (CRUD) | 
| Kanban Task Board | 
| Client Management | 
| Invoice Tracker | 
| AI Email/Proposal Generator | 
| AI Chat Assistant | 
| Insights & Charts | 

---

## Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS, Recharts
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL
- **Auth**: JWT (python-jose + passlib bcrypt)
- **AI**: Anthropic Claude API
- **Charts**: Recharts

---

## Get Anthropic API Key

1. Go to https://console.anthropic.com
2. Sign up / Login
3. Go to API Keys → Create Key
4. Paste it in `backend/.env` as `ANTHROPIC_API_KEY`

---

