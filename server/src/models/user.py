import uuid
from pydantic import UUID4
from sqlmodel import SQLModel, Field, select, delete, Session
from sqlalchemy import func
from .db import SessionDep
from fastapi import HTTPException
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from pwdlib import PasswordHash
import jwt
from jwt.exceptions import InvalidTokenError
import config
from datetime import timedelta, timezone, datetime

class User(SQLModel, table=True):
    id: UUID4 = Field(default=None, primary_key=True)
    username: str = Field(default=None)
    hashed_password: str = Field(default=None)

class Token(BaseModel):
    access_token: str
    token_type: str

ALGO = "HS256"
SECRET_KEY = config.get_settings().SECRET_KEY
TOKEN_EXPIRE_TIME_DELTA = timedelta(hours=24)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

def create_access_token(user: User):
    data: dict[str, str|datetime] = {"sub": user.username}
    expire = datetime.now(timezone.utc) + TOKEN_EXPIRE_TIME_DELTA
    data["exp"] = expire
    encoded = jwt.encode(data, SECRET_KEY, algorithm=ALGO)
    return Token(access_token=encoded, token_type="bearer")


credential_except = HTTPException(401, detail="Could not validade credential")

def get_current_user(token: str, session: SessionDep):
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGO])
        username = decoded.get("sub")
        if not username:
            raise credential_except
        user = get_user(username, session)
        if not user:
            raise credential_except
    except InvalidTokenError:
        raise credential_except

    return user
    


login_except = HTTPException(status_code=400, detail="Incorrect Username or Password")

hash_algo = PasswordHash.recommended()

def verify_password(password: str, user: User):
    return hash_algo.verify(password, user.hashed_password)

def hash_password(password: str):
    return hash_algo.hash(password)


def create_user(username: str, password: str, session: SessionDep):
    user: User = User(id= uuid.uuid4(),
                username=username.lower(),
                hashed_password=hash_password(password))
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

#Case insensitive username comparison
def get_user(username, session: SessionDep):
    return session.exec(select(User).where(func.lower(User.username) == username.lower())).first()

