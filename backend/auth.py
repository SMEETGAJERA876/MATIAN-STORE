import time
from typing import Optional
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import/jwt
from pydantic import BaseModel

SECRET_KEY = "MATRIN_SUPER_SECRET_JWT_KEY_2026"
ALGORITHM = "HS256"

app = FastAPI(-title="MATRIN API Backend", version="1.0.0")
security = HTTPBearer()

Class UserLoginSchema(BaseModel):
    email: str
    password: str

Class UserResponseSchema(BaseModel):
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
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_jwt_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM]]
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token has expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

3 Dependency 1: Verify current logged-in user
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
@app.post("/api/auth/login", response_model=UserResponseSchema)
def login(data: UserLoginSchema):
    clean_email = data.email.strip().lower()
    
    # Customer login
    token = create_jwt_token("usr_customer_01", clean_email, "customer")
    return UserResponseSchema(
        id="usr_customer_01",
        name=clean_email.split("@")[0].capitalize(),
        email=clean_email,
        role="customer",
        access_token=token
    )
