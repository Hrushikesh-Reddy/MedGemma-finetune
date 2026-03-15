from fastapi import APIRouter, Depends
from ..dependencies import get_db
from ..datamodel import Message, Session, Input
from pydantic import BaseModel
from loguru import logger
router = APIRouter()

class Request(BaseModel):
    user: str
    session_id: str
    input: Input
    
    
@router.post("/run")
async def create_run(request: Request, db=Depends(get_db)):
    msg = Message(
        user=request.user,
        session_id=request.session_id,
        input=request.input.model_dump()
    )
    print(msg)
    res = db.upsert(msg)
    
    return res
    
@router.post("/{user}")
async def create_session(user: str, db=Depends(get_db)):
    res = db.upsert(Session(
        user=user,
    ), return_json=True)
    return res.data

@router.get("/{user}")
async def list_sessions(user: str, db=Depends(get_db)):
    res = db.get(
        Session,
        {"user":user},
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