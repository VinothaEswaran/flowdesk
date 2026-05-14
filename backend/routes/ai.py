from fastapi import APIRouter, Depends, Header
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from database import get_db
from routes.auth import get_current_user
from groq import Groq
import os

router = APIRouter()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class AIRequest(BaseModel):
    prompt_type: str
    context: Optional[str] = None
    client_name: Optional[str] = None
    project_name: Optional[str] = None
    amount: Optional[float] = None

def auth_header(authorization: str = Header(...), db: Session = Depends(get_db)):
    token = authorization.replace("Bearer ", "")
    return get_current_user(token, db)

PROMPTS = {
    "email": lambda d: f"""Write a professional follow-up email to {d.client_name or 'the client'}
about a delayed payment{f' of Rs.{d.amount}' if d.amount else ''}.
{f'Context: {d.context}' if d.context else ''}
Keep it polite, firm, and professional. Include subject line.""",

    "proposal": lambda d: f"""Write a professional project proposal for {d.client_name or 'a client'}
for the project: {d.project_name or 'a web development project'}.
{f'Additional context: {d.context}' if d.context else ''}
Include: overview, scope, timeline, and call to action. Make it compelling.""",

    "insights": lambda d: f"""As a productivity coach, analyze this freelancer's work context:
{d.context or 'Managing multiple projects with various deadlines.'}
Provide 3 actionable productivity insights with specific recommendations.
Be concise, specific, and motivating.""",

    "summary": lambda d: f"""Summarize the following project/task information into a clear weekly status report:
{d.context or 'Multiple tasks across projects.'}
Format it professionally for sharing with a client."""
}

@router.post("/generate")
def generate_ai_content(data: AIRequest, user=Depends(auth_header)):
    try:
        prompt_fn = PROMPTS.get(data.prompt_type)
        if not prompt_fn:
            return {"error": "Invalid prompt type. Use: email, proposal, insights, summary"}
        prompt = prompt_fn(data)
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1024
        )
        return {
            "result": response.choices[0].message.content,
            "prompt_type": data.prompt_type
        }
    except Exception as e:
        return {"error": str(e)}

@router.post("/chat")
def ai_chat(body: dict, user=Depends(auth_header)):
    try:
        user_message = body.get("message", "")
        history      = body.get("history", [])

        system_msg = {
            "role": "system",
            "content": "You are FlowDesk AI, a helpful assistant for freelancers and startups. Help with project management, client communication, invoicing, and productivity. Be concise and practical."
        }

        clean_history = []
        for msg in history:
            if isinstance(msg, dict) and "role" in msg and "content" in msg:
                if msg["role"] in ["user", "assistant"]:
                    clean_history.append({
                        "role":    msg["role"],
                        "content": str(msg["content"])
                    })

        messages = [system_msg] + clean_history + [
            {"role": "user", "content": user_message}
        ]

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=messages,
            max_tokens=1024
        )
        return {"reply": response.choices[0].message.content}

    except Exception as e:
        return {"error": str(e), "reply": f"Error: {str(e)}"}