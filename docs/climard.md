# Clima RD (ClimaAlerta RD) - Documento Principal del Proyecto

## 1. Visión y Resumen Ejecutivo
**Clima RD** (concebido también como **ClimaAlerta RD**) es una plataforma web full-stack, colaborativa y de servicio público desarrollada para la República Dominicana. El sistema combina los datos meteorológicos oficiales del **Instituto Dominicano de Meteorología (INDOMET)** y del **Instituto Dominicano de Aviación Civil (IDAC)** con la inteligencia colectiva ciudadana (*crowdsourcing* estilo Waze) para el monitoreo y reporte temprano de inundaciones urbanas, árboles caídos, vías bloqueadas y deslizamientos de tierra.

Durante temporadas de lluvias torrenciales, vaguadas, tormentas tropicales o huracanes, la plataforma sirve como el punto neurálgico donde el ciudadano consulta el pronóstico en tiempo real y, a la vez, reporta y valida el estado de las calles con un par de clics.

---

## 2. Objetivos del Proyecto

### 2.1. Objetivo General
Construir una plataforma web moderna, rápida y accesible que centralice los avisos oficiales de INDOMET y habilite un canal bidireccional de alertas ciudadanas georreferenciadas para mitigar riesgos en las vías públicas dominicanas.

### 2.2. Objetivos Específicos
1. **Consumo y Normalización de Datos Oficiales:** Extraer, procesar y almacenar en caché los boletines climáticos, pronósticos provinciales y niveles de alerta (Verde, Amarilla, Roja) emitidos por INDOMET y el COE mediante un backend especializado en Python.
2. **Monitoreo Cartográfico Operativo:** Proporcionar un mapa interactivo de alto rendimiento mediante WebGL (MapLibre) que soporte cientos de reportes concurrentes mediante agrupación (*clustering*) y capas meteorológicas.
3. **Diseño Mobile-First Expresivo:** Implementar la interfaz de usuario utilizando el sistema de diseño **`@moni-labs/moni-ui`** (basado en **Material Design 3 Expressive**) para máxima accesibilidad y usabilidad bajo situaciones de emergencia.
4. **Participación Ciudadana Eficiente:** Facilitar a los usuarios el reporte de incidencias viales y climatológicas en menos de 10 segundos, capturando coordenadas GPS y evidencia fotográfica opcional.
5. **Verificación Comunitaria y Depuración:** Implementar un sistema de validación comunitaria (votos positivos/negativos de persistencia del incidente) y caducidad temporal para evitar desinformación o reportes obsoletos.
6. **Educación y Respuesta Rápida:** Ofrecer guías preventivas de acción ante fenómenos atmosféricos y accesos directos a líneas de emergencia (911, COE, Defensa Civil).

---

## 3. Arquitectura y Stack Tecnológico

La plataforma adopta una arquitectura desacoplada y robusta: **Nuxt 4 (v4.5+)** para el frontend y renderizado SSR/SEO, el sistema de diseño **`@moni-labs/moni-ui`** para componentes visuales, y **Python (FastAPI)** como backend de alto rendimiento para APIs, procesamiento geoespacial e ingesta de datos.

```text
                +---------------------------------------------------+
                |               Cliente / Navegador                 |
                |   - Nuxt 4 (Vue 3.5+ + TypeScript)                |
                |   - UI: @moni-labs/moni-ui (Material Design 3)    |
                |   - Estilos: Tailwind CSS | Estado: Pinia         |
                +-------------------------+-------------------------+
                                          |
                                 HTTP / REST / JSON
                                          |
                                          v
                +---------------------------------------------------+
                |              Backend Python (FastAPI)             |
                |  - Endpoints REST (/api/v1/*) + Swagger (/docs)   |
                |  - Ingesta programada & Scraping (APScheduler)    |
                |  - Consultas espaciales (GeoAlchemy2 / PostGIS)   |
                +-------------+-----------------------+-------------+
                              |                       |
                Scraping / HTTPX                      | SQLAlchemy ORM
                              v                       v
                 +--------------------+     +-------------------+
                 |  INDOMET / IDAC    |     | PostgreSQL        |
                 | (Boletines/Tiempo) |     | + Extensión       |
                 +--------------------+     | PostGIS           |
                                            +-------------------+
                                                      |
                                                      v
                                            +-------------------+
                                            | Object Storage    |
                                            | (MinIO / S3)      |
                                            | Evidencias Fotos  |
                                            +-------------------+
```

### 3.1. Frontend y Renderizado (Nuxt 4)
* **Framework:** **Nuxt 4 (Vue 3.5+ + TypeScript)**.
  * *Estructura `app/`:* Utiliza la convención estándar de Nuxt 4 con la carpeta `app/` para páginas (`app/pages/`), componentes (`app/components/`) y layouts (`app/layouts/`), manteniendo la raíz limpia.
  * *SSR (Server-Side Rendering):* Garantiza indexación SEO y generación dinámica de tarjetas Open Graph al compartir enlaces de alertas por WhatsApp, X y Facebook.
  * *Componentes Client-Only:* Las instancias cartográficas basadas en navegador (como MapLibre) se aíslan bajo `<ClientOnly>` o mediante la nomenclatura `.client.vue`.
* **Sistema de Diseño y UI:** **`@moni-labs/moni-ui`** (`pnpm install @moni-labs/moni-ui`).
  * Implementa **Material Design 3 (Expressive, Mobile-First)** con Web Components (Lit), animaciones fluidas con GSAP y soporte nativo para Tailwind CSS.
* **Manejo de Estado Global:** **Pinia**, sincronizando geolocalización, alertas activas y reportes en memoria.
* **Diseño y Estilos:** **Tailwind CSS**, complementando los tokens de `@moni-labs/moni-ui`.

### 3.2. Motor Backend en Python (FastAPI)
* **Framework:** **FastAPI (Python 3.11+)** con soporte asíncrono nativo (`asyncio`), validación de esquemas con **Pydantic v2** y documentación OpenAPI automática en `/docs`.
* **Scraping e Ingesta Oficial:** Tareas en segundo plano con `HTTPX` y `BeautifulSoup4` ejecutadas periódicamente cada 30 a 60 minutos mediante **APScheduler** para extraer boletines y pronósticos de INDOMET.
* **Caché en Servidor:** Almacenamiento en memoria o Redis con TTL de 30-60 minutos para evitar saturar la infraestructura estatal dominicana.

### 3.3. Base de Datos y Almacenamiento
* **Motor Relacional y Espacial:** **PostgreSQL** con la extensión **PostGIS**.
* **ORM:** **SQLAlchemy 2.0** con **GeoAlchemy2** y migraciones automáticas mediante **Alembic**, permitiendo filtros espaciales nativos (ej. `ST_DWithin` para incidentes en un radio de 5 km).
* **Almacenamiento de Evidencias:** **MinIO** o buckets compatibles con **Amazon S3** para alojar imágenes y videos de incidentes urbanos.

### 3.4. Motor Cartográfico (Enfoque Dual)
1. **Mapa Operativo Detallado (MapLibre GL JS):** Basado en WebGL, renderizado en cliente, acelerado por hardware. Maneja agrupaciones (*clusters*), pines personalizados y capas GeoJSON.
2. **Mapa de Situación Nacional (SVG Interactivo):** Componente Vue vectorial ligero que representa las 32 provincias dominicanas y reacciona de forma instantánea a los niveles de alerta del COE/INDOMET.

---

## 4. Fuentes de Datos y Cumplimiento Legal

### 4.1. Integraciones Gubernamentales
* **INDOMET (Instituto Dominicano de Meteorología):**
  * Boletín meteorológico general y seguimiento de vaguadas/ciclones.
  * Pronóstico provincial del tiempo por turnos (mañana, tarde, noche).
  * Niveles de alerta por provincia emitidos en coordinación con el Centro de Operaciones de Emergencias (COE).
* **IDAC (Instituto Dominicano de Aviación Civil):**
  * Radares meteorológicos de reflectividad y detección de tormentas severas.
* **Portal Nacional de Datos Abiertos (`datos.gob.do`):**
  * Datasets históricos y catálogos estructurados.

### 4.2. Marco Ético y Legal (Ley 200-04)
El uso de información meteorológica estatal se fundamenta en la **Ley General 200-04 de Libre Acceso a la Información Pública**:
1. **Acceso Ciudadano No Comercial:** La plataforma es de acceso público y gratuito para la seguridad ciudadana.
2. **No Saturación de Infraestructura Estatal:** Se prohíbe el scraping en tiempo real por cada visitante. El backend en Python consulta los portales oficiales de manera programada (cada 30 a 60 minutos) y almacena una copia en caché local.
3. **Atribución y Transparencia:** Cada tarjeta, boletín o dato meteorológico muestra el crédito explícito: *"Información meteorológica oficial proporcionada por el Instituto Dominicano de Meteorología (INDOMET)"*.
4. **Conservación de Marcas:** Las imágenes derivadas de radares conservan los identificadores visuales oficiales de INDOMET e IDAC.

---

## 5. Fases de Desarrollo

* **Fase 1 (MVP - Enfoque Gran Santo Domingo y Nacional):**
  * Dashboard del tiempo por provincia con componentes `@moni-labs/moni-ui`.
  * API en FastAPI con ingesta programada de INDOMET y base de datos PostGIS.
  * Mapa interactivo con MapLibre y modal rápido de 4 tipos de incidentes.
  * Componente SVG con alertas verde, amarilla y roja.
* **Fase 2 (Validación y Evidencias):**
  * Bento Grid de imágenes georreferenciadas con subida a MinIO.
  * Votación comunitaria de estado de reportes (activo/resuelto).
  * Soporte PWA (Progressive Web App) con `@vite-pwa/nuxt`.
* **Fase 3 (Expansión y Radares con Python GIS):**
  * Procesamiento de capas de reflectividad de radar (WMS / Tile Layer) mediante librerías científicas de Python (`rasterio`, `Pillow`).
  * Notificaciones Push geolocalizadas ante alertas rojas en la zona del usuario.
  * Dashboard de analítica histórica sobre vías recurrentemente inundadas.
