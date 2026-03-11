from fastapi import APIRouter, Depends
from ..dependencies import get_db
from ..datamodel import Message

router = APIRouter()

@router.post("")
async def create_run(request, db=Depends(get_db)):
    pass

@router.get("")
async def list_sessions(request, db=Depends(get_db)):
    pass

@router.get("")
async def list_session_messages(request, db=Depends(get_db)):
    pass

@router.delete("")
async def delete_session(request, db=Depends(get_db)):
    pass