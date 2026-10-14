from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ReporteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    tipo: str
    lugar: Optional[str] = None
    descripcion: Optional[str] = None
    latitud: float
    longitud: float
    foto_url: Optional[str] = None
    provincia: str
    votos_activo: int
    votos_resuelto: int
    activo: bool
    creado_en: datetime


class ReporteLista(BaseModel):
    total: int
    incidentes: list[ReporteOut]