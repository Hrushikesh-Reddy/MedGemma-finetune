import uuid
from typing import Optional
from sqlmodel import SQLModel, Field, JSON, Column

 

class Message(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user: Optional[str] = None
    session_id: Optional[uuid.UUID] = None
    input: Optional[dict[str, str]] = Field(sa_column=Column(JSON))
    response: Optional[str] = None
    
DatabaseModel = Message