from fastapi import APIRouter, Depends, requests
from fastapi_plugin.fast_api_client import Auth0FastAPI
from ..config import settings
from ..datamodel import User
from ..utils import get_jwks, get_current_user
from loguru import logger
import httpx
from jose import jwt
from fastapi.security import HTTPBearer
from ..dependencies import get_db
security = HTTPBearer()

router = APIRouter()
ALGORITHMS = ["RS256"]
auth0 = Auth0FastAPI(
    domain=settings.AUTH0_DOMAIN,
    audience=settings.AUTH0_AUDIENCE
)

@router.post("/auth/user")
async def get_user(user_info=Depends(get_current_user), db = Depends(get_db)):
    logger.info(f"{user_info} zamn")
    user = User(
        auth0_id=user_info["sub"],
        name=user_info["name"],
        email=user_info["email"]
    )
    
    cur_user = db.get(User, columns=[User.id, User.name, User.email], filters = {"auth0_id" : user.auth0_id }, no_order=True)
    
    if len(cur_user.data) == 0:
        db.upsert(user)
        cur_user = db.get(User, columns=[User.id, User.name, User.email], filters = {"auth0_id" : user.auth0_id }, no_order=True)
    return cur_user
    
    
    

# Public route - no authentication required
@router.get("/api/public")
async def public():
    return {
        "message": "Hello from a public endpoint! You don't need to be authenticated to see this."
    } 

# Protected route - requires authentication
@router.get("/api/private")
async def private(claims: dict = Depends(auth0.require_auth()), token = Depends(security)):
    print(token)
    return {
        "message": "Hello from a private endpoint! You need to be authenticated to see this.",
        "user_id": claims.get("sub"),
        "permissions": claims.get("permissions", []),
        "claims": claims,
        "token": token
    }

# Scoped route - requires specific permission
@router.get("/api/private-scoped")
async def private_scoped(claims: dict = Depends(auth0.require_auth(scopes="read:messages"))):
    return {
        "message": "Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.",
        "user_id": claims.get("sub")
    }