from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from config import get_settings
from api.api import api_router
from models.db import create_db_and_tables

app = FastAPI()

#npm run build assets
app.mount("/assets", 
          StaticFiles(directory="./public/dist/assets"), 
          name="app")
templates = Jinja2Templates("./public/dist/")

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_settings().origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(api_router)

@asynccontextmanager
async def lifespan():
    create_db_and_tables()
    yield


#Interacts with React router
@app.get("/app/{path:path}")
def page(request: Request, path):
    print(path)
    return templates.TemplateResponse("index.html", {'request': request})



