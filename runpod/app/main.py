from fastapi import FastAPI
from llm import Llm
from typing_extensions import TypedDict
import base64

class ImagePayload(TypedDict):
    text: str
    image: str

llm = Llm()

app = FastAPI()

@app.get("/")
async def root():
    res = await llm.generate("")
    return res

@app.post("/")
async def test_prompt(request:ImagePayload):
    print(request)
    res = await llm.generate(request)
    return res