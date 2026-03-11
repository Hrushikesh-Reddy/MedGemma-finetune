from pydantic import BaseModel
from typing import Optional, Any


class Input(BaseModel):
    prompt:str
    image:str
    
class Run(BaseModel):
    user:str
    input:Input
    
class Response(BaseModel):
    message: str
    status: bool
    data: Optional[Any] = None


    