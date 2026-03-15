import uuid6, uuid
from typing import Optional
from sqlmodel import SQLModel, Field, JSON, Column, UUID
from sqlalchemy import ForeignKey

 

class Message(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user: Optional[str] = None
    session_id: Optional[uuid.UUID] = Field(default=None, sa_column=Column(UUID, ForeignKey("session.id", ondelete="CASCADE")))
    input: Optional[dict[str, str]] = Field(sa_column=Column(JSON))
    response: Optional[str] = None
    
class Session(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid6.uuid7, primary_key=True)
    name: Optional[str] = None
    user: Optional[str] = None

    
DatabaseModel = Message | Session