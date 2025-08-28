import os
import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt

security = HTTPBearer()

SUPABASE_JWKS_URL = os.getenv("SUPABASE_JWKS_URL")


_jwks_cache = None

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    global _jwks_cache
    token = credentials.credentials

    if not _jwks_cache:
        async with httpx.AsyncClient() as client:
            resp = await client.get(SUPABASE_JWKS_URL)
            resp.raise_for_status()
            _jwks_cache = resp.json()

    try:
        header = jwt.get_unverified_header(token)
        key = next(
            (k for k in _jwks_cache["keys"] if k["kid"] == header["kid"]), None
        )
        if not key:
            raise HTTPException(status_code=401, detail="Invalid JWT key")

        user = jwt.decode(token, key, algorithms=[header["alg"]], audience="authenticated")
        return user
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid JWT: {str(e)}")
