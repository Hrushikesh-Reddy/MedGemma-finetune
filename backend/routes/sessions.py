from fastapi import APIRouter, Depends, Form, File
from ..dependencies import get_db
from ..datamodel import Message, Session, Input
from pydantic import BaseModel
from loguru import logger
from ..llm import generate_session_name
import uuid
router = APIRouter()

class Request(BaseModel):
    user_id: str
    session_id: str
    input: Input
    
class CreateSessionRequest(BaseModel):
    user: str
    prompt: str

@router.post("/run")
async def create_run(request: Request, db=Depends(get_db)):
    print(request)
    msg = Message(
        user_id=request.user_id,
        session_id=request.session_id,
        input=request.input.model_dump()
    )
    print(msg)
    res = db.upsert(msg)
    
    return res
    
@router.post("/create/{user_id}")
async def create_session(user_id: str, db=Depends(get_db)):
    res = db.upsert(Session(
        user_id=user_id,
        name="New Session" #await generate_session_name(req.prompt)
    ), return_json=True)
    return res

@router.get("/{user_id}")
async def list_sessions(user_id: str, db=Depends(get_db)):
    res = db.get(
        Session,
        filters={"user_id":user_id},
        return_json=True
    )
    return res

@router.get("/{session_id}/messages")
async def get_session_messages(session_id: str, db=Depends(get_db)):
    res = db.get(Message, filters={"session_id":session_id}, return_json=True)
    return res
    #print(res)

@router.delete("/{session_id}")
async def delete_session(session_id: str, db=Depends(get_db)):
    res1 = db.delete(
        Message,
        {"session_id":session_id}
    )
    res = db.delete(
        Session,
        {"id":session_id}
    )
    return [res1, res]