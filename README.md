# 🌦️ Clima RD (ClimaAlerta RD)

Plataforma cívica y colaborativa para el monitoreo climático, seguimiento de alertas oficiales (**INDOMET / COE**) y reporte temprano de inundaciones urbanas e incidencias viales en la **República Dominicana**.

---

## 🏗️ Arquitectura y Tecnologías

El proyecto está diseñado bajo una arquitectura modular y moderna:

* **Frontend:** **Nuxt 4 (v4.5+)** + **Vue 3.5+** + **TypeScript**
  * **Sistema de Diseño:** [`@moni-labs/moni-ui`](https://github.com/moni-spa/moni-ui) (Material Design 3 Expressive, Mobile-First)
  * **Cartografía Operativa:** [MapLibre GL JS](https://maplibre.org/maplibre-gl-js/docs/) con aceleración WebGL y agrupación (*clustering*).
  * **Dataset Geoespacial:** Códigos postales y sectores de RD ([gareladev/codigos-postales-rd](https://github.com/gareladev/codigos-postales-rd)).
  * **Estilos & Estado:** Tailwind CSS + Pinia.
* **Backend:** **Python 3.11+ con FastAPI**
  * **Base de Datos Espacial:** PostgreSQL + PostGIS vía **SQLAlchemy 2.0** y **GeoAlchemy2**.
  * **Ingesta & Scraping:** `HTTPX` + `BeautifulSoup4` con tareas programadas mediante `APScheduler`.
  * **Documentación de API:** Swagger UI interactivo en `/docs`.
  * **Evidencias Multimedia:** Almacenamiento de objetos compatible con S3 / MinIO.

---

## 📁 Estructura del Repositorio

```text
ClimaRD/
├── docs/                      # Documentación completa del proyecto
│   ├── climard.md             # Visión, objetivos, arquitectura y fases
│   ├── design.md              # Sistema de diseño con @moni-labs/moni-ui
│   └── requerimientos.md      # Requerimientos SRS, modelos y endpoints
├── frontend/                  # Aplicación Nuxt 4
│   ├── app/
│   │   ├── assets/data/       # Dataset de códigos postales dominicanos
│   │   ├── layouts/           # Layout con moni-navigation-rail / navigation-bar
│   │   ├── pages/             # Dashboard, Mapa, Alertas, Evidencias, Ayuda
│   │   └── plugins/           # Registro de Web Components de @moni-labs/moni-ui
│   ├── nuxt.config.ts
│   └── package.json
└── backend/                   # API en Python FastAPI
    ├── app/
    │   ├── api/v1/            # Endpoints REST
    │   ├── models/            # Modelos PostGIS (GeoAlchemy2)
    │   ├── services/          # Scraping INDOMET y Scheduler
    │   └── main.py
    └── requirements.txt
```

---

## 🚀 Inicio Rápido

### 1. Frontend (Nuxt 4)

```bash
cd frontend
pnpm install
pnpm dev
```

La aplicación web estará disponible en `http://localhost:3000`.

### 2. Backend (FastAPI)

```bash
cd backend
python -m venv .venv
# En Windows:
.venv\Scripts\activate
# En Linux/Mac:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

La documentación Swagger estará disponible en `http://localhost:8000/docs`.

---

## 📜 Licencia y Cumplimiento
Proyecto bajo licencia MIT. La información meteorológica estatal se consume en estricto apego a la **Ley General 200-04 de Libre Acceso a la Información Pública** de la República Dominicana, atribuyendo los datos oficiales al **Instituto Dominicano de Meteorología (INDOMET)** y al **COE**.
