from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, EmailStr
import json
import os

# Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-this-in-production-greengap-2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 10080  # 7 days

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# Simple file-based user storage (for MVP - replace with database later)
USERS_FILE = "users.json"

# Pydantic models
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    email: EmailStr
    name: str
    created_at: str
    picture: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user: User

# Helper functions
def load_users():
    """Load users from JSON file"""
    if not os.path.exists(USERS_FILE):
        return {}
    try:
        with open(USERS_FILE, 'r') as f:
            return json.load(f)
    except json.JSONDecodeError:
        return {}

def save_users(users):
    """Save users to JSON file"""
    with open(USERS_FILE, 'w') as f:
        json.dump(users, f, indent=2)

def verify_password(plain_password, hashed_password):
    """Verify password against hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    """Hash a password"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_user(email: str):
    """Get user by email"""
    users = load_users()
    if email in users:
        return users[email]
    return None

def authenticate_user(email: str, password: str):
    """Authenticate user"""
    user = get_user(email)
    if not user:
        return False
    if not verify_password(password, user["hashed_password"]):
        return False
    return user

async def get_current_user(token: str = Depends(oauth2_scheme)):
    """Get current user from token"""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = get_user(email)
    if user is None:
        raise credentials_exception
    
    return User(
        email=user["email"],
        name=user["name"],
        created_at=user["created_at"],
        picture=user.get("picture")
    )

async def verify_google_token(token: str):
    """Verify Google OAuth token and return user info"""
    try:
        from google.oauth2 import id_token
        from google.auth.transport import requests as google_requests
        
        # Verify the token with Google
        idinfo = id_token.verify_oauth2_token(
            token, 
            google_requests.Request(), 
            os.getenv("GOOGLE_CLIENT_ID")
        )
        
        # Token is valid, extract user info
        email = idinfo.get('email')
        name = idinfo.get('name')
        picture = idinfo.get('picture')
        
        if not email:
            return None
            
        # Check if user exists
        users = load_users()
        
        # If user doesn't exist, create them
        if email not in users:
            new_user = {
                "email": email,
                "name": name,
                "picture": picture,
                "hashed_password": None,  # No password for OAuth users
                "auth_provider": "google",
                "created_at": datetime.utcnow().isoformat()
            }
            users[email] = new_user
            save_users(users)
            print(f" New Google user created: {email}")
        else:
            # Update user info from Google (name/picture might have changed)
            users[email]["name"] = name
            users[email]["picture"] = picture
            save_users(users)
            print(f" Existing Google user updated: {email}")
        
        return users[email]
        
    except ValueError as e:
        # Invalid token
        print(f" Google token verification failed: {e}")
        return None
    except ImportError:
        print(" google-auth library not installed. Google OAuth unavailable.")
        return None
    except Exception as e:
        print(f" Unexpected error in Google auth: {e}")
        return None