from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from config import get_settings
from api.api import api_router
from models.db import create_db_and_tables



@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

#npm run build assets
app.mount("/assets", 
          StaticFiles(directory="../public/dist/assets"), 
          name="app")
templates = Jinja2Templates("../public/dist/")

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_settings().origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(api_router)




#Interacts with React router
@app.get("/{path:path}")
def page(request: Request, path):
    print(path)
    return templates.TemplateResponse("index.html", {'request': request})



