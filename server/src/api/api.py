from fastapi import APIRouter, Request, Depends, HTTPException, Response
from typing import Annotated
from fastapi import Cookie
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


def set_cookie(response: Response, key, value, expires):
    response.set_cookie(key, value, samesite="strict", secure=True, httponly=True)

@api_router.get("/refresh")
def refresh(response: Response, refresh_token: Annotated[str, Cookie(...)], session: SessionDep):
    token = User.refresh_token(refresh_token, session)
    set_cookie(response, key="access_token", value=token.access_token, expires=token.expire)
    return token

@api_router.delete("/login")
async def logout(response: Response, refresh_token: Annotated[str, Cookie(...)], session: SessionDep):
    user_id = User.get_user_id_from_refresh(refresh_token, session)
    User.delete_refresh_token(user_id, session)
    session.commit()
    response.delete_cookie("refresh_token")
    response.delete_cookie("access_token")
    return

@api_router.post("/login")
async def login(response: Response, form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session: SessionDep):
    user: User.User|None = User.get_user(form_data.username, session)
    if not user:
        raise User.login_except
    if not User.verify_password(form_data.password, user):
        raise User.login_except
    token = User.create_access_token(user, fresh=True)
    refresh = User.create_refresh_token(user, session)
    set_cookie(response, "refresh_token",refresh.refresh_token, expires=refresh.expire)
    set_cookie(response, "access_token", token.access_token, expires=token.expire)
    session.commit()
    return token

@api_router.post("/register")
def register(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], session: SessionDep):
    user: User.User|None = User.get_user(form_data.username, session)
    if user:
        raise HTTPException(400, "Username already taken")
    return User.create_user(form_data.username, form_data.password, session)


@api_router.get("/user")
def get_user_info(access_token: Annotated[str, Cookie(...)], session: SessionDep):
    return User.get_usermodel_from_token(access_token, session)
