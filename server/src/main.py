from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from time import sleep

app = FastAPI()


origins = [
        'http://localhost:3000'
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root(request: Request):
    sleep(1) #throttle
    return {"data": "Hello, World!"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}
