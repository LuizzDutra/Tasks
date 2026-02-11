from fastapi import APIRouter, Request
import uuid
from pydantic import UUID4
import config
from time import sleep
from models.db import SessionDep
from sqlmodel import select
from .task import router


api_router = APIRouter(prefix='/api')
api_router.include_router(router)


@api_router.get("/greet")
def get_greeting(request: Request):
    sleep(1) #throttle
    settings: config.Settings = config.get_settings()
    print(settings.name)
    return {"data": f"{settings.name}!"}


