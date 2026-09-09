from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ReporteOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    tipo: str
    lugar: str | None
    descripcion: str | None
    latitud: float
    longitud: float
    foto_url: str | None
    provincia: str
    votos_activo: int
    votos_resuelto: int
    activo: bool
    creado_en: datetime


class ReporteLista(BaseModel):
    total: int
    incidentes: list[ReporteOut]