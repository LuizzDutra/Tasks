from fastapi import APIRouter, Request, HTTPException, Cookie
from pydantic import UUID4
from models import task
from models.db import SessionDep
import models.user as User
from fastapi import Depends
from typing import Annotated


router = APIRouter(prefix='/tasks')

@router.get("")
def get_all_user_tasks(session: SessionDep, access_token: Annotated[str, Cookie(...)]):
    return task.get_all_user_tasks(session, access_token)

@router.post("")
def create_task(session: SessionDep, access_token: Annotated[str, Cookie(...)], title: str = "None", steps: int = 0):
    return task.create_task(title, steps, session, access_token)
    
@router.delete("")
def delete_task(session: SessionDep, id:UUID4, access_token: Annotated[str, Cookie(...)]):
    if task.delete_task(id, session, access_token):
        return {'response': f'deleted {id}'}
    else:
        raise HTTPException(status_code=404, detail="Task not found")

@router.patch("")
def update_task(session: SessionDep, access_token: Annotated[str, Cookie(...)], id: UUID4, field: str, val: str | int):
    #Type validation before
    if field in ('steps', 'progress'):
        try:
            int(val)
        except:
            raise HTTPException(status_code=400, detail="Invalid field type")

    result = task.update_task(id, field, val, session, access_token)
    if result:
        return result
    else:
        raise HTTPException(status_code=404, detail="Task not found")

