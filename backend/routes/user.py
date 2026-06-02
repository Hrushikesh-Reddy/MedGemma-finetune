from fastapi import APIRouter, Depends, Form, File
from ..dependencies import get_db
from ..datamodel import Message, Session, Input, User
from pydantic import BaseModel

router = APIRouter()

@router.get("/{auth0_sub}")
async def get_user(auth0_sub: str, db=Depends(get_db)):
    res = db.get(
        User,
        filters={"auth0_id":auth0_sub},
        return_json=True
    )
    print(res)
    return res