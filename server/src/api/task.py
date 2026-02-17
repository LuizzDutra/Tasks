from fastapi import APIRouter, Request, HTTPException
from pydantic import UUID4
from models import task
from models.db import SessionDep
import models.user as User
from fastapi import Depends
from typing import Annotated


router = APIRouter(prefix='/tasks')

@router.get("")
def get_all_user_tasks(session: SessionDep, token: Annotated[str, Depends(User.oauth2_scheme)]):
    return task.get_all_user_tasks(session, token)

@router.post("")
def create_task(session: SessionDep, token: Annotated[str, Depends(User.oauth2_scheme)], title: str = "None", steps: int = 0):
    return task.create_task(title, steps, session, token)
    
@router.delete("")
def delete_task(session: SessionDep, id:UUID4, token: Annotated[str, Depends(User.oauth2_scheme)]):
    if task.delete_task(id, session, token):
        return {'response': f'deleted {id}'}
    else:
        raise HTTPException(status_code=404, detail="Task not found")

@router.patch("")
def update_task(session: SessionDep, token: Annotated[str, Depends(User.oauth2_scheme)], id: UUID4, field: str, val: str | int):
    #Type validation before
    if field in ('steps', 'progress'):
        try:
            int(val)
        except:
            raise HTTPException(status_code=400, detail="Invalid field type")

    result = task.update_task(id, field, val, session, token)
    if result:
        return result
    else:
        raise HTTPException(status_code=404, detail="Task not found")

