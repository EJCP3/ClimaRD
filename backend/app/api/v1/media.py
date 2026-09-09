import os
import uuid
from pathlib import Path

from fastapi import APIRouter, File, HTTPException, UploadFile
from fastapi.responses import JSONResponse

from app.core.config import settings

media_router = APIRouter(tags=["Media"])

ALLOWED_EXTS = {".jpg", ".jpeg", ".png", ".webp", ".gif", ".mp4", ".webm", ".mov"}


@media_router.post("/media/upload")
async def upload_media(file: UploadFile = File(...)):
    ext = Path(file.filename or "").suffix.lower()
    if ext not in ALLOWED_EXTS:
        raise HTTPException(status_code=400, detail=f"Formato no permitido: {ext}")

    content = await file.read()
    max_bytes = settings.MAX_UPLOAD_MB * 1024 * 1024
    if len(content) > max_bytes:
        raise HTTPException(
            status_code=413, detail=f"Archivo supera el límite de {settings.MAX_UPLOAD_MB}MB"
        )
    if len(content) == 0:
        raise HTTPException(status_code=400, detail="Archivo vacío")

    upload_dir = Path(settings.MEDIA_UPLOAD_DIR)
    upload_dir.mkdir(parents=True, exist_ok=True)

    filename = f"{uuid.uuid4().hex}{ext}"
    (upload_dir / filename).write_bytes(content)

    return {"url": f"/media/uploads/{filename}"}