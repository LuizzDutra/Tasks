from fastapi import APIRouter, Request, Depends, HTTPException, Response
from typing import Annotated
from fastapi.security import OAuth2PasswordRequestForm
import config
from time import sleep
from models.db import SessionDep
import models.user as User
from .task import router
from datetime import datetime, timedelta, timezone


api_router = APIRouter(prefix='/api')
api_router.include_router(router)

def include_router(router: APIRouter):
    api_router.include_router(router)

@api_router.get("/greet")
def get_greeting(request: Request):
    sleep(1) #throttle
    settings: config.Settings = config.get_settings()
    print(settings.name)
    return {"data": f"{settings.name}!"}


@api_router.post("/refresh")
def refresh(refresh_token: Annotated[str, Depends(User.oauth2_scheme)], session: SessionDep):
    return User.refresh_token(refresh_token, session)

@api_router.post("/login")
def login(response: Response, form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session: SessionDep):
    user: User.User|None = User.get_user(form_data.username, session)
    if not user:
        return User.login_except
    if not User.verify_password(form_data.password, user):
        return User.login_except
    token = User.create_access_token(user, fresh=True)
    refresh = User.create_refresh_token(user, session)
    response.set_cookie("refresh_token", refresh.refresh_token, expires=refresh.expire)
    return token

@api_router.post("/register")
def register(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session: SessionDep):
    user: User.User|None = User.get_user(form_data.username, session)
    if user:
        return HTTPException(400, "Username already taken")
    return User.create_user(form_data.username, form_data.password, session)


@api_router.get("/user")
def get_user_info(token: Annotated[str, Depends(User.oauth2_scheme)], session: SessionDep):
    return User.get_usermodel_from_token(token, session)
