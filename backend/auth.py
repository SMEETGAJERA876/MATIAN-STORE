import os
import time
from typing import Optional
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

# Compatible JWT import (supports both python-jose and PyJWT)
try:
    from jose import jwt, JWTError
    ExpiredSignatureError = JWTError
except ImportError:
    try:
        import jwt
        JWTError = jwt.PyJWTError
        ExpiredSignatureError = jwt.ExpiredSignatureError
    except ImportError:
        raise ImportError("Neither 'python-jose' nor 'PyJWT' is installed. Please run `pip install python-jose` or `pip install PyJWT`")

SECRET_KEY = os.getenv("JWT_SECRET", "MATRIN_SUPER_SECRET_JWT_KEY_2026")
ALGORITHM = "HS256"
ADMIN_EMAIL = os.getenv("NEXT_PUBLIC_ADMIN_EMAIL", "admin@matrin.com")

app = FastAPI(title="MATRIN API Backend", version="1.0.0")

# Enable CORS for frontend applications (Next.js dev server, Vercel, localhost)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

class UserLoginSchema(BaseModel):
    email: str
    password: str

class UserResponseSchema(BaseModel):
    id: str
    name: str
    email: str
    role: str  # "customer" | "admin"
    access_token: str
    token_type: str = "bearer"

def create_jwt_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "exp": int(time.time()) + (24 * 3600)  # 24 hours expiry
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    if isinstance(token, bytes):
        token = token.decode("utf-8")
    return token

def decode_jwt_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=str(e))

# Dependency 1: Verify current logged-in user
def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    token = credentials.credentials
    return decode_jwt_token(token)

# Dependency 2: Server-side Admin Route Protection (Returns 403 Forbidden if not admin)
def get_current_admin_user(current_user: dict = Depends(get_current_user)) -> dict:
    role = current_user.get("role")
    if role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Admin privileges required to access this resource"
        )
    return current_user

@app.post("/api/auth/login", response_model=UserResponseSchema)
def login(data: UserLoginSchema):
    clean_email = data.email.strip().lower()
    
    # Identify admin vs customer login
    is_admin = (clean_email == ADMIN_EMAIL.lower()) or clean_email.startswith("admin@")
    role = "admin" if is_admin else "customer"
    user_id = "usr_admin_01" if is_admin else "usr_customer_01"
    name = "Administrator" if is_admin else clean_email.split("@")[0].capitalize()
    
    token = create_jwt_token(user_id, clean_email, role)
    return UserResponseSchema(
        id=user_id,
        name=name,
        email=clean_email,
        role=role,
        access_token=token
    )

@app.get("/api/auth/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "id": current_user.get("sub"),
        "email": current_user.get("email"),
        "role": current_user.get("role")
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.auth:app", host="0.0.0.0", port=8000, reload=True)
