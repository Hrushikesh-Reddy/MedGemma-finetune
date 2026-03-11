from fastapi import FastAPI
from fastapi.templating import Jinja2Templates
from .dependencies import init_managers, cleanup_managers
from contextlib import asynccontextmanager
from .routes import ws
from loguru import logger
from .config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    
    try:
        await init_managers(settings.database_uri)
    except Exception as e:
        logger.error(f"Failed to initialize managers : {e}")
    
    logger.info(f"Application startup complete")
    
    yield
    
    try:
        logger.info("Cleaning up application resources...")
        await cleanup_managers()
        logger.info("Application shutdown complete")
    except Exception as e:
        logger.error(f"Error during shutdown: {e}")

app = FastAPI(lifespan=lifespan)

app.include_router(ws.router)

templates = Jinja2Templates(directory="public")

@app.get("/")
async def get():
    return templates.TemplateResponse("index.html", {"request": {}})




            
