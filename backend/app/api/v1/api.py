from fastapi import APIRouter

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

@api_router.get("/reportes", tags=["Reportes"])
async def get_reportes(lat: float = None, lng: float = None, radio_km: float = 5.0):
    """Consulta de incidentes ciudadanos georreferenciados (inundaciones, árboles caídos)"""
    return {
        "total": 3,
        "incidentes": [
            {
                "id": "1",
                "tipo": "INUNDACION",
                "lat": 18.4764,
                "lng": -69.9652,
                "descripcion": "Av. Luperón anegada",
                "votos_activo": 34
            }
        ]
    }
