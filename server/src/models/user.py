import uuid
from pydantic import UUID4, BaseModel
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

class UserModel(BaseModel):
    id: UUID4
    username: str

class RefreshToken(SQLModel, table=True):
    refresh_token: str = Field(primary_key=True)
    user_id: UUID4 = Field(foreign_key="user.id")

class RefreshTokenModel(BaseModel):
    refresh_token: str
    expire: datetime
    token_type: str

class Token(BaseModel):
    access_token: str
    expire: datetime
    token_type: str

ALGO = "HS256"
SECRET_KEY = config.get_settings().SECRET_KEY
TOKEN_EXPIRE_TIME_DELTA = timedelta(seconds=15)
REFRESH_EXPIRE_TIME_DELTA = timedelta(days=30)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login", refreshUrl="api/refresh")

def create_access_token(user: User, fresh=False):
    data: dict[str, str|datetime|bool] = {"id": str(user.id),
                                     "username": user.username}
    now = datetime.now(timezone.utc)
    data["exp"] = now + TOKEN_EXPIRE_TIME_DELTA
    data["fresh"] = fresh
    encoded = jwt.encode(data, SECRET_KEY, algorithm=ALGO)
    return Token(access_token=encoded,expire=data["exp"], token_type="bearer")

def delete_refresh_token(user_id: UUID4, session: SessionDep, commit=False):
    statement = select(RefreshToken).where(RefreshToken.user_id == user_id)
    result = session.exec(statement).one_or_none()
    if result:
        session.delete(result)

def create_refresh_token(user: User, session: SessionDep):
    token = {"id": str(user.id),
             "exp": datetime.now(timezone.utc) + REFRESH_EXPIRE_TIME_DELTA}
    encoded = jwt.encode(token, SECRET_KEY, algorithm=ALGO)
    refresh = RefreshToken(refresh_token=encoded, user_id=user.id)
    delete_refresh_token(user.id, session)
    session.add(refresh)
    return RefreshTokenModel(refresh_token=encoded, expire=token["exp"], token_type="refresh")

token_except = HTTPException(401, detail="Could not validate token")

def refresh_token(refresh_token: str, session: SessionDep):
    try:
        jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGO])#Check if expired
        token = session.get(RefreshToken, refresh_token)
        if token:
            user = session.get(User, token.user_id)
            if user:
                return create_access_token(user)
        raise token_except
    except InvalidTokenError:
        raise token_except

credential_except = HTTPException(401, detail="Could not validade credential")

def get_user_id_from_refresh(token: str, session):
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGO])
        user_id = decoded.get("id")
        if not user_id:
            raise token_except
        token = session.get(RefreshToken, token)
        if not token:
            raise token_except 
    except InvalidTokenError:
        raise credential_except
    return uuid.UUID(user_id)


def get_usermodel_from_token(token: str, session: SessionDep):
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=[ALGO])
        user_id = decoded.get("id")
        username = decoded.get("username")
        if not user_id or not username:
            raise credential_except
    except InvalidTokenError:
        raise credential_except
    return UserModel(id=uuid.UUID(user_id),
                     username=username,
                     )
    

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

