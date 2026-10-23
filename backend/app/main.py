from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth import router as auth_router
from app.api.contact import admin_router as admin_messages_router
from app.api.contact import router as contact_router
from app.api.projects import admin_router as admin_projects_router
from app.api.projects import public_router as projects_router
from app.core.config import get_settings
from app.db.init_db import initialize_database
from app.db.session import engine


@asynccontextmanager
async def lifespan(_: FastAPI):
    initialize_database(engine)
    yield


settings = get_settings()
app = FastAPI(title=settings.app_name, version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/api")
app.include_router(projects_router, prefix="/api")
app.include_router(admin_projects_router, prefix="/api")
app.include_router(contact_router, prefix="/api")
app.include_router(admin_messages_router, prefix="/api")


@app.get("/api/health", tags=["system"])
def health() -> dict[str, str]:
    return {"status": "ok", "service": "portfolio-api"}

