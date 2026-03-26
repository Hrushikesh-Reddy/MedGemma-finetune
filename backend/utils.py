import httpx
from jose import jwt
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from .config import settings
from fastapi_plugin.fast_api_client import Auth0FastAPI
from loguru import logger

security = HTTPBearer()
ALGORITHMS = ["RS256"]
auth0 = Auth0FastAPI(
    domain=settings.AUTH0_DOMAIN,
    audience=settings.AUTH0_AUDIENCE
)

async def get_jwks():
    url = f"https://{settings.AUTH0_DOMAIN}/.well-known/jwks.json"

    async with httpx.AsyncClient() as client:
        response = await client.get(url)

    return response.json()

async def get_current_user(claims: dict = Depends(auth0.require_auth()), token = Depends(security)):

    jwks = await get_jwks()
    user_info = None
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(f"https://{settings.AUTH0_DOMAIN}/userinfo", headers={"Authorization":f"Bearer {token.credentials}"})
            user_info = response.json()
        return user_info

    except Exception as e:
        logger.error(f"Error getting user info:{e}")
        raise HTTPException(status_code=401, detail="Invalid token")
    
"""         payload = jwt.decode(
            token.credentials, # raw JWT string
            jwks,
            algorithms=ALGORITHMS,
            audience=settings.AUTH0_AUDIENCE,
            issuer=f"https://{settings.AUTH0_DOMAIN}/"
        )
        print(f"payload", payload) """