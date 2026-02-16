from fastapi import APIRouter, Request, Depends, HTTPException
from typing import Annotated
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
import config
from time import sleep
from models.db import SessionDep
from .task import router
import models.user as User


api_router = APIRouter(prefix='/api')
api_router.include_router(router)


@api_router.get("/greet")
def get_greeting(request: Request):
    sleep(1) #throttle
    settings: config.Settings = config.get_settings()
    print(settings.name)
    return {"data": f"{settings.name}!"}


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/login")

@api_router.post("/login")
def login(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session: SessionDep):
    user: User.User|None = User.get_user(form_data.username, session)
    if not user:
        return User.login_except
    if not User.verify_password(form_data.password, user):
        return User.login_except
    token = User.create_access_token(user)
    return token

@api_router.post("/register")
def register(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session: SessionDep):
    user: User.User|None = User.get_user(form_data.username, session)
    if user:
        return HTTPException(400, "Username already taken")
    return User.create_user(form_data.username, form_data.password, session)


@api_router.get("/user")
def get_user_info(token: Annotated[str, Depends(oauth2_scheme)], session: SessionDep):
    return User.get_current_user(token, session)

@api_router.get("/users")
def get_users(session: SessionDep):
    return User.get_all_users(session)
