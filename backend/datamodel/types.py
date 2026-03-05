from pydantic import BaseModel
import typing

class Input(BaseModel):
    prompt:str
    image:str
    
class Run(BaseModel):
    user:str
    input:Input


    