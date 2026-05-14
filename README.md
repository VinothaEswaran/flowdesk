FlowDesk
Project and client management platform built for freelancers and small teams. Handles projects, invoices, client records, and AI-assisted communication from a single dashboard.
Project Structure
flowdesk/
├── frontend/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── login/page.tsx
│   │   └── dashboard/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── projects/page.tsx
│   │       ├── clients/page.tsx
│   │       ├── invoices/page.tsx
│   │       ├── ai-assistant/page.tsx
│   │       └── insights/page.tsx
│   ├── components/ui/Sidebar.tsx
│   ├── lib/api.ts
│   └── package.json
│
└── backend/
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
Prerequisites

Node.js 18+
Python 3.10+
PostgreSQL

Backend Setup
bashcd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux
pip install -r requirements.txt
cp .env.example .env
Edit .env:
DATABASE_URL=postgresql://postgres:yourpassword@localhost/flowdesk_db
GROQ_API_KEY=your_groq_api_key
SECRET_KEY=your-secret-key
Create the database:
bashpsql -U postgres -c "CREATE DATABASE flowdesk_db;"
Start the backend:
bashuvicorn main:app --reload
Runs at http://localhost:8000. API docs available at http://localhost:8000/docs.
Frontend Setup
bashcd frontend
npm install
npm run dev
Runs at http://localhost:3000.
Running the App
Open two terminals:
Terminal 1:
bashcd backend
venv\Scripts\activate
uvicorn main:app --reload
Terminal 2:
bashcd frontend
npm run dev
Open http://localhost:3000 in your browser.
Features

JWT-based authentication
Project management with Kanban board
Client records and contact management
Invoice tracking
AI-powered email and proposal generator
AI chat assistant for freelance workflows
Analytics dashboard with charts

Tech Stack

Frontend: Next.js 14, TailwindCSS, Recharts
Backend: FastAPI, SQLAlchemy, PostgreSQL
Auth: JWT with python-jose and bcrypt
AI: Groq API (llama-3.3-70b)
