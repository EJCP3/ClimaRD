# Especificación de Requerimientos del Sistema (SRS) - Clima RD

## 1. Introducción y Alcance
Este documento detalla los requerimientos funcionales y no funcionales de la plataforma **Clima RD**. El sistema comprende la ingesta de datos meteorológicos de fuentes oficiales de la República Dominicana, la gestión de alertas por provincias, la captura colaborativa de reportes de inundaciones y siniestros urbanos, y la presentación analítica y cartográfica de dicha información.

---

## 2. Requerimientos Funcionales (RF)

### 2.1. Módulo de Datos Climatológicos y Boletines Oficiales
* **RF-01 (Ingesta de Boletines INDOMET con Python):** El sistema debe ejecutar una tarea programada en el backend de Python (FastAPI + APScheduler) cada 30 a 60 minutos para extraer los boletines meteorológicos oficiales y el estado de alerta de las provincias desde el portal de INDOMET mediante scraping con `HTTPX` y `BeautifulSoup4`.
* **RF-02 (Caché de Pronóstico Provincial):** El servidor Python debe almacenar en caché la información del pronóstico por provincia (temperatura, porcentaje de precipitación, humedad, viento) para responder a las consultas de los clientes sin reenviar peticiones a las APIs o páginas externas de INDOMET.
* **RF-03 (Clasificación de Alertas por Provincia):** El sistema debe categorizar cada una de las 31 provincias y el Distrito Nacional bajo tres estados oficiales de alerta:
  * `VERDE`: Mínima probabilidad de eventos destructivos; vigilancia ordinaria.
  * `AMARILLA`: Condiciones favorables para inundaciones y deslizamientos; preparación.
  * `ROJA`: Inminencia de fenómenos meteorológicos de alto impacto; evacuación en zonas vulnerables.
* **RF-04 (Consulta de Clima Local):** La aplicación debe permitir obtener el pronóstico climático actual a partir de las coordenadas GPS del dispositivo o permitiendo al usuario seleccionar manualmente una provincia del listado nacional.

### 2.2. Módulo de Cartografía e Interactividad
* **RF-05 (Renderizado de Mapa Operativo):** El sistema debe renderizar un mapa interactivo acelerado por WebGL (MapLibre GL JS) en la página operativa (`pages/mapa.vue`).
* **RF-06 (Geolocalización del Usuario):** El mapa debe integrar un control nativo para centrar la visualización en la posición actual del usuario mediante la API de Geolocalización del navegador.
* **RF-07 (Agrupamiento Dinámico de Pines - Clustering):** El mapa debe consolidar los reportes cercanos en agrupaciones circulares numéricas para evitar sobrecarga visual en zonas de alta densidad de incidentes (ej. Avenidas Luperón, Winston Churchill o 27 de Febrero).
* **RF-08 (Visualizador SVG Nacional):** En la vista de alertas (`pages/alertas.vue`), el sistema debe renderizar un mapa vectorial SVG ligero de República Dominicana, asignando a cada provincia la clase de color Tailwind correspondiente según su nivel de alerta activo (`fill-emerald-500`, `fill-amber-500`, `fill-red-500`).
* **RF-08.1 (Geocodificación por Códigos Postales RD):** El mapa debe integrar el dataset de códigos postales dominicanos (`codigos-postales-rd.json`) para permitir la búsqueda, sugerencia y centrado directo por sector (ej. Piantini, Naco, Los Prados, Bella Vista, etc.).

### 2.3. Módulo de Reportes Ciudadanos (Crowdsourcing)
* **RF-09 (Generación Rápida de Reportes):** El usuario debe poder registrar un reporte en dos pasos mediante un diálogo modal (`moni-dialog` / Bottom Sheet) con cuatro categorías predefinidas:
  1. `INUNDACION` (Inundación de calle o cañada desbordada).
  2. `ARBOL_CAIDO` (Obstrucción por vegetación o tendido eléctrico).
  3. `VIA_BLOQUEADA` (Tránsito interrumpido por vehículos varados o agua).
  4. `DERRUMBE` (Deslizamiento de tierra o colapso estructural).
* **RF-10 (Georreferenciación Obligatoria):** Todo reporte enviado debe capturar latitud y longitud precisas antes de persistirse en la base de datos PostgreSQL vía PostGIS.
* **RF-11 (Adjunto de Evidencias Multimedia):** El sistema debe permitir al usuario adjuntar de forma opcional una fotografía o video corto representativo del estado del incidente, el cual se subirá a un almacenamiento de objetos (MinIO / S3) gestionado por la API de FastAPI.
* **RF-12 (Validación Comunitaria de Incidentes):** Cada pin en el mapa debe permitir a otros usuarios validar el estado mediante dos acciones:
  * `"Aún activo"` (Incrementa contador de validez).
  * `"Ya se despejó / Nivel normal"` (Incrementa contador de resolución).
* **RF-13 (Expiración Automática de Reportes):** El backend en Python debe desactivar o marcar como resuelto automáticamente cualquier reporte que supere las 6 horas de antigüedad si no ha recibido re-confirmaciones comunitarias recientes.

### 2.4. Módulo de Evidencias y Asistencia
* **RF-14 (Bento Grid de Evidencias):** El sistema debe mostrar un collage estilo Bento Grid con las fotografías más recientes subidas por la comunidad montadas en tarjetas `moni-card`, indicando provincia, tipo de incidente y marca temporal.
* **RF-15 (Directorio de Asistencia de Emergencia):** La vista de recomendaciones debe disponer de botones directos de marcado telefónico (`moni-button`) que inicien llamadas a los servicios públicos de emergencia (911, COE, Defensa Civil).

---

## 3. Requerimientos No Funcionales (RNF)

* **RNF-01 (Rendimiento y WebGL):** El mapa operativo debe mantener una tasa mínima de 30 fotogramas por segundo (FPS) en dispositivos móviles de gama media durante la interacción de paneo y zoom.
* **RNF-02 (Aislamiento de Reactividad en MapLibre):** En el código Vue/Nuxt, la instancia de MapLibre debe ser envuelta obligatoriamente en `markRaw()` para evitar la sobrecarga de observadores reactivos de Vue 3 sobre el árbol de WebGL.
* **RNF-03 (Indexación y SSR con Nuxt 4):** Las páginas públicas de contenido y boletines deben generarse con Server-Side Rendering (SSR) bajo Nuxt 4 (v4.5+) para garantizar una óptima indexación en motores de búsqueda (SEO) y tarjetas enriquecidas en WhatsApp/redes sociales.
* **RNF-04 (Consumo Ético y Protección de Servicios de Terceros):** La arquitectura debe evitar saturar la infraestructura estatal de INDOMET. Las peticiones a portales externos nunca se realizarán directamente desde el navegador del cliente; se canalizarán únicamente mediante tareas en servidor con caché periódica en FastAPI.
* **RNF-05 (Diseño Responsivo con `@moni-labs/moni-ui`):** Toda la interfaz debe utilizar los componentes y tokens de **`@moni-labs/moni-ui`** (Material Design 3 Expressive), garantizando ergonomía táctil en pantallas desde 360 píxeles de ancho.
* **RNF-06 (Soporte Progresivo PWA):** La aplicación debe incluir un manifiesto de aplicación web (`manifest.json`) y Service Workers con `@vite-pwa/nuxt` para permitir su instalación en la pantalla de inicio en Android e iOS.
* **RNF-07 (Prevención de Spam y Abuso):** Los endpoints de FastAPI para creación de reportes deben aplicar limitación de frecuencia (*rate limiting*) por dirección IP (máximo 3 reportes cada 10 minutos por IP) mediante `slowapi` o Redis.

---

## 4. Esquema de Base de Datos Propuesto (SQLAlchemy 2.0 / GeoAlchemy2)

A continuación se detalla la estructura para **PostgreSQL + PostGIS** en Python:

```python
import enum
import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy import String, Float, Integer, Boolean, DateTime, Enum, ForeignKey
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import ARRAY, UUID
from geoalchemy2 import Geometry

class Base(DeclarativeBase):
    pass

class TipoIncidencia(str, enum.Enum):
    INUNDACION = "INUNDACION"
    ARBOL_CAIDO = "ARBOL_CAIDO"
    VIA_BLOQUEADA = "VIA_BLOQUEADA"
    DERRUMBE = "DERRUMBE"

class NivelAlerta(str, enum.Enum):
    VERDE = "VERDE"
    AMARILLA = "AMARILLA"
    ROJA = "ROJA"

class Provincia(Base):
    __tablename__ = "provincias"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    nombre: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    codigo_postal: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    alerta_actual: Mapped[NivelAlerta] = mapped_column(Enum(NivelAlerta), default=NivelAlerta.VERDE)
    ultima_actualizacion: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    reportes: Mapped[List["Reporte"]] = relationship(back_populates="provincia")

class Reporte(Base):
    __tablename__ = "reportes"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tipo: Mapped[TipoIncidencia] = mapped_column(Enum(TipoIncidencia), nullable=False)
    descripcion: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    latitud: Mapped[float] = mapped_column(Float, nullable=False)
    longitud: Mapped[float] = mapped_column(Float, nullable=False)
    # Punto geoespacial PostGIS (WGS 84 - SRID 4326)
    ubicacion = mapped_column(Geometry(geometry_type="POINT", srid=4326), index=True)
    foto_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    provincia_id: Mapped[int] = mapped_column(Integer, ForeignKey("provincias.id"), nullable=False)
    votos_activo: Mapped[int] = mapped_column(Integer, default=1)
    votos_resuelto: Mapped[int] = mapped_column(Integer, default=0)
    activo: Mapped[bool] = mapped_column(Boolean, default=True, index=True)
    creado_en: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
    actualizado_en: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    provincia: Mapped["Provincia"] = relationship(back_populates="reportes")

class BoletinOficial(Base):
    __tablename__ = "boletines_oficiales"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    titulo: Mapped[str] = mapped_column(String(255), nullable=False)
    resumen: Mapped[str] = mapped_column(String, nullable=False)
    enlace_fuente: Mapped[str] = mapped_column(String(500), nullable=False)
    provincias_rojas: Mapped[List[str]] = mapped_column(ARRAY(String), default=[])
    provincias_amarillas: Mapped[List[str]] = mapped_column(ARRAY(String), default=[])
    provincias_verdes: Mapped[List[str]] = mapped_column(ARRAY(String), default=[])
    fecha_boletin: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    creado_en: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
```

---

## 5. Endpoints de la API Interna (FastAPI)

Todos los endpoints exponen documentación interactiva Swagger en `/docs` y ReDoc en `/redoc`.

| Método | Endpoint | Descripción | Acceso / Caché |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/v1/clima/nacional` | Retorna el pronóstico y clima consolidado de las 32 provincias. | Servido desde caché local/Redis (TTL 30 min) |
| **GET** | `/api/v1/alertas/indomet` | Lista de boletines oficiales procesados y matriz de colores por provincia. | Servido desde caché local/Redis (TTL 30 min) |
| **GET** | `/api/v1/reportes` | Consulta incidentes activos con filtro geoespacial (`lat`, `lng`, `radio_km` vía `ST_DWithin`). | Consulta a PostgreSQL + PostGIS |
| **POST** | `/api/v1/reportes` | Registro de un nuevo incidente ciudadano con geolocalización obligatoria. | Rate limited (3 req / 10 min por IP) |
| **POST** | `/api/v1/reportes/{id}/validar` | Incrementa `votos_activo` o `votos_resuelto` para validar la vigencia. | Rate limited |
| **POST** | `/api/v1/media/upload` | Carga de imagen de evidencia hacia el almacenamiento de objetos (MinIO/S3). | Validación MIME y tamaño máx 5MB |
| **GET** | `/api/v1/geodata/codigos-postales` | Búsqueda y filtrado de códigos postales y sectores dominicanos. | Servido en memoria |
