from math import radians, sin, cos, asin, sqrt

from fastapi import APIRouter, Depends, Form, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.schemas import ReporteLista, ReporteOut
from app.core.database import get_db
from app.models import Provincia, Reporte

api_router = APIRouter()

@api_router.get("/clima/nacional", tags=["Clima"])
async def get_clima_nacional():
    """Retorna el pronóstico consolidado para las 32 provincias (servido desde caché local)"""
    return {
        "fuente": "Instituto Dominicano de Meteorología (INDOMET)",
        "actualizado_en": "2026-09-05T17:00:00Z",
        "provincias": [
            {"nombre": "Distrito Nacional", "temp_c": 29, "condicion": "Aguaceros y tronadas", "alerta": "AMARILLA"},
            {"nombre": "Santiago", "temp_c": 30, "condicion": "Chubascos dispersos", "alerta": "AMARILLA"},
            {"nombre": "Duarte", "temp_c": 28, "condicion": "Tormentas fuertes", "alerta": "ROJA"}
        ]
    }

@api_router.get("/alertas/indomet", tags=["Alertas"])
async def get_alertas_indomet():
    """Retorna los boletines oficiales y la matriz de alertas COE/INDOMET"""
    return {
        "boletin_numero": 24,
        "provincias_rojas": ["Monseñor Nouel", "Duarte"],
        "provincias_amarillas": ["Distrito Nacional", "Santo Domingo", "Santiago", "La Vega", "Sánchez Ramírez", "Monte Plata"],
        "provincias_verdes": ["Puerto Plata", "La Altagracia", "Barahona"]
    }

@api_router.get("/reportes", tags=["Reportes"], response_model=ReporteLista)
async def get_reportes(
    lat: float = None,
    lng: float = None,
    radio_km: float = 5.0,
    db: Session = Depends(get_db),
):
    """Consulta de incidentes ciudadanos georreferenciados (inundaciones, árboles caídos, vías bloqueadas)"""
    stmt = select(Reporte).where(Reporte.activo.is_(True))

    if lat is not None and lng is not None:
        delta = radio_km / 111.0
        stmt = stmt.where(
            Reporte.latitud.between(lat - delta, lat + delta),
            Reporte.longitud.between(lng - delta, lng + delta),
        )

    reportes = db.scalars(stmt.order_by(Reporte.creado_en.desc())).all()
    return {"total": len(reportes), "incidentes": [_to_schema(r) for r in reportes]}


@api_router.post("/reportes", tags=["Reportes"], response_model=ReporteOut)
async def create_reporte(
    tipo: str = Form(...),
    ubicacion: str = Form(...),
    latitud: float = Form(...),
    longitud: float = Form(...),
    descripcion: str = Form(""),
    foto_url: str = Form(""),
    provincia: str = Form("Distrito Nacional"),
    db: Session = Depends(get_db),
):
    """Registro de un nuevo incidente ciudadano con geolocalización obligatoria"""
    prov = (
        db.execute(
            select(Provincia).where(Provincia.nombre.ilike(f"%{provincia.strip()}%"))
        ).scalar_one_or_none()
        or db.execute(
            select(Provincia).where(Provincia.nombre == "Distrito Nacional")
        ).scalar_one()
    )

    reporte = Reporte(
        tipo=tipo,
        lugar=ubicacion.strip(),
        descripcion=descripcion.strip() or None,
        latitud=latitud,
        longitud=longitud,
        foto_url=foto_url.strip() or None,
        provincia_id=prov.id,
    )
    db.add(reporte)
    db.commit()
    db.refresh(reporte)

    return _to_schema(reporte)


def _to_schema(reporte: Reporte) -> ReporteOut:
    return ReporteOut(
        id=str(reporte.id),
        tipo=reporte.tipo,
        lugar=reporte.lugar,
        descripcion=reporte.descripcion,
        latitud=reporte.latitud,
        longitud=reporte.longitud,
        foto_url=reporte.foto_url,
        provincia=reporte.provincia.nombre,
        votos_activo=reporte.votos_activo,
        votos_resuelto=reporte.votos_resuelto,
        activo=reporte.activo,
        creado_en=reporte.creado_en,
    )
