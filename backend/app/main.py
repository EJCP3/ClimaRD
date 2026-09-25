from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.v1.api import api_router
from app.api.v1.media import media_router
from app.core.config import settings
from app.core.database import Base, SessionLocal, engine
from app.models import Provincia

Path(settings.MEDIA_UPLOAD_DIR).mkdir(parents=True, exist_ok=True)


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        from app.models.models import seed_provincias

        seed_provincias(db)

    yield


app = FastAPI(
    title="Clima RD API",
    description="API de monitoreo climático, alertas INDOMET y reportes ciudadanos para República Dominicana",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# CORS configuration for Nuxt 4 frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:3002", "https://climard.do"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")
app.include_router(media_router, prefix="/api/v1")

app.mount("/media/uploads", StaticFiles(directory=settings.MEDIA_UPLOAD_DIR), name="uploads")


@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "ok", "service": "Clima RD API"}