"""FastAPI application entry point."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .connectors.factory import get_database
from .routes import admin, public
from .seed import seed_database

settings = get_settings()


@asynccontextmanager
async def lifespan(_: FastAPI):
    # For local/dev runs on the in-memory connector, pre-load site content so
    # the CMS and public API are immediately useful. Never auto-seeds GCP.
    if get_settings().connector == "mock":
        seed_database(get_database())
    yield


app = FastAPI(title="mematcha portfolio API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(public.router)
app.include_router(admin.router)


@app.get("/health", tags=["system"])
def health():
    return {"status": "ok", "connector": settings.connector, "auth_mode": settings.auth_mode}
