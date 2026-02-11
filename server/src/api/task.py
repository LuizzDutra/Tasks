from fastapi import APIRouter, Request, HTTPException
from pydantic import UUID4
from models import task
from models.db import SessionDep


router = APIRouter(prefix='/tasks')

@router.get("")
def get_all_tasks(request: Request, session: SessionDep):
    return task.get_all_tasks(session)

@router.post("")
def create_task(session: SessionDep, title: str = "None", steps: int = 0):
    return task.create_task(title, steps, session)
    
@router.delete("")
def delete_task(session: SessionDep, id:UUID4):
    if task.delete_task(id, session):
        return {'response': f'deleted {id}'}
    else:
        raise HTTPException(status_code=404, detail="Task not found")

@router.patch("")
def update_task(session: SessionDep, id: UUID4, field: str, val: str | int):
    #Type validation before
    if field in ('steps', 'progress'):
        try:
            int(val)
        except:
            raise HTTPException(status_code=400, detail="Invalid field type")

    result = task.update_task(id, field, val, session)
    if result:
        return result
    else:
        raise HTTPException(status_code=404, detail="Task not found")

