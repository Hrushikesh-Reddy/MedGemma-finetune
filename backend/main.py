from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from .dependencies import init_managers, cleanup_managers
from contextlib import asynccontextmanager
from .routes import ws, sessions, utils, auth
from loguru import logger
from .config import settings
""" from fastapi_plugin.fast_api_client import Auth0FastAPI

auth0 = Auth0FastAPI(
    domain=settings.AUTH0_DOMAIN,
    audience=settings.AUTH0_AUDIENCE
) """

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8000",
        "http://localhost:3000",
        "http://127.0.0.1:8000",
        "http://localhost:8001",
        "http://localhost:8081",
        "http://192.168.1.4:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#app.include_router(auth.router)
app.include_router(ws.router)
app.include_router(utils.router)
app.include_router(
    sessions.router,
    prefix="/sessions", 
    #dependencies=[Depends(auth0.require_auth(scopes="read:messages write:messages"))]
)
templates = Jinja2Templates(directory="public")

@app.get("/")
async def get():
    return templates.TemplateResponse("index.html", {"request": {}})
