import uuid
from pydantic import UUID4
from sqlmodel import SQLModel, Field, select, delete
from .db import SessionDep
from . import user as User


class Task(SQLModel, table=True):
    id: UUID4 = Field(default=None, primary_key=True)
    user_id: UUID4 = Field(default=None, foreign_key="user.id")
    title: str = Field(index=True)
    steps: int = Field()
    progress: int = Field()


def get_task(task_id: UUID4, user_id: UUID4, session):
    statement = select(Task).where(Task.id == task_id).where(Task.user_id == user_id)
    results = session.exec(statement)
    return results.one_or_none()

def get_all_user_tasks(session: SessionDep, token: str):
    user = User.get_usermodel_from_token(token, session)
    statement = select(Task).where(Task.user_id == user.id)
    results = session.exec(statement)
    return results.all()



def delete_task(id: UUID4, session: SessionDep, token: str) -> bool:
    user = User.get_usermodel_from_token(token, session)
    task = get_task(id, user.id, session)
    if task:
        session.delete(task)
        session.commit()
        return True
    else:
        return False


def update_task(id: UUID4, field: str, val: str | int, session: SessionDep, token: str):
    """field = title | steps | progress"""
    user = User.get_usermodel_from_token(token, session)
    task: Task|None = get_task(id, user.id, session)
    if task:
        match field:
            case 'title':
                task.title = str(val)
            case 'steps':
                task.steps = int(val)
            case 'progress':
                task.progress = int(val)

        session.commit()
        session.refresh(task)
    return task




def create_task(t: str, s: int, session: SessionDep, token):
    user = User.get_usermodel_from_token(token, session)
    task = Task(id=uuid.uuid4(),
                title=t,
                steps=s,
                progress=0,
                user_id=user.id)
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

