import uuid
from pydantic import UUID4
from sqlmodel import SQLModel, Field, select, delete
from .db import SessionDep


class TaskModel(SQLModel, table=True):
    id: UUID4 = Field(default=None, primary_key=True)
    title: str = Field(index=True)
    steps: int = Field()
    progress: int = Field()


def delete_task(id: UUID4, session: SessionDep) -> bool:
    statement = select(TaskModel).where(TaskModel.id == id)
    results = session.exec(statement)
    task = results.one_or_none()
    if task:
        session.delete(task)
        session.commit()
        return True
    else:
        return False


def get_all_tasks(session: SessionDep):
    return session.exec(select(TaskModel)).all()


def update_task(id: UUID4, field: str, val: str | int, session: SessionDep):
    """field = title | steps | progress"""
    task = session.get(TaskModel, id)
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




def create_task(t: str, s: int, session: SessionDep):
    task = TaskModel(id=uuid.uuid4(),
                     title=t,
                     steps=s,
                     progress=0)
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

