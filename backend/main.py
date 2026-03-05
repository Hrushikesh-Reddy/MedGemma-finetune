from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from .routes import ws



app = FastAPI()

app.include_router(ws.router)

templates = Jinja2Templates(directory="public")

@app.get("/")
async def get():
    return templates.TemplateResponse("index.html", {"request": {}})




            
