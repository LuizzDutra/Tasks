from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from time import sleep
from functools import lru_cache
import config

app = FastAPI()



#npm run build assets
app.mount("/assets", StaticFiles(directory="./public/dist/assets"), name="assets")
templates = Jinja2Templates("./public/dist/")

@lru_cache
def get_settings() -> config.Settings:
    return config.Settings()

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_settings().origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)



@app.get("/greet")
def read_root(request: Request, settings: config.Settings = get_settings()):
    sleep(1) #throttle
    return {"data": f"{settings.name}!"}

@app.get("/")
def home(request: Request):
    return templates.TemplateResponse("index.html", {'request': request})

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}
