# Backend — Pendientes para integrar con el frontend

> El frontend ya llama a estos endpoints y maneja sus errores. Cada punto indica
> qué espera exactamente, para que al implementarlo la integración sea directa.
> Estado del frontend: `NUXT_PUBLIC_USE_MOCK=true` (mocks centrales hasta que existan 7 y 8).

Base URL: `http://localhost:8000` (`NUXT_PUBLIC_API_BASE_URL`).

---

## 1. Votos con estado (activo / resuelto) — PRIORITARIO

El frontend ya hace `POST /api/v1/reportes/{id}/voto` con body JSON:

```json
{ "estado": "activo" }
{ "estado": "resuelto" }
```

Respuesta esperada:

```json
{ "ok": true, "votos_activo": 6 }
```

Notas:

- El modelo `Reporte` ya tiene `votos_activo` / `votos_resuelto`: incrementar según `estado`.
- El frontend hace optimistic UI y revierte si hay error: devolver 4xx/5xx claros.
- Regla de negocio sugerida: un reporte se considera resuelto si `votos_resuelto > votos_activo`.

## 2. Filtros en `GET /reportes`

Ya existen `lat`, `lng`, `radio_km`. Faltan (el frontend los usará en cuanto existan):

| Parámetro        | Tipo   | Efecto                                              |
| ---------------- | ------ | --------------------------------------------------- |
| `provincia`      | string | Slug (`distrito-nacional`) o nombre. Ver punto 3.   |
| `max_age_hours`  | int    | Solo reportes con `creado_en` dentro de la ventana. |
| `hide_resolved`  | bool   | Excluye `votos_resuelto > votos_activo`.            |
| `page` / `limit` | int    | Paginación (default `page=1, limit=20`).            |

## 3. `POST /reportes` acepta slug de provincia — IMPORTANTE

El frontend ahora envía `provincia` como **slug** (`distrito-nacional`,
`san-jose-de-ocoa`), no como nombre. El `ilike(f"%{provincia}%")` actual **no**
resuelve slugs (`%distrito-nacional%` no matchea `Distrito Nacional`).

Opciones:

1. Normalizar en backend: `slug.replace("-", " ")` + `ilike`, con mapa de alias
   (`dajabon`→`Dajabón`, `elias-pina`→`Elías Piña`, etc.), o
2. Nueva tabla/columna `slug` en `Provincia` y match exacto (recomendado).

Además validar longitudes que el frontend ya recorta: `ubicacion ≤ 120`,
`descripcion ≤ 280`. Devolver `422` si se exceden.

## 4. Rate-limit real (`429`)

El frontend limita a 3 reportes/hora por navegador (evita duplicados
accidentales), pero eso se salta borrando `localStorage`. Implementar con
`slowapi` (ya está en `requirements.txt`):

- `POST /reportes`: ~5/hora por IP → `429 { "detail": "límite excedido, reintenta en N min" }`.
- `POST /reportes/{id}/voto` y `/abuso`: ~20/hora por IP.
- El frontend muestra `detail` tal cual en un toast.

## 5. Reporte de abuso / moderación

El frontend ya llama:

```http
POST /api/v1/reportes/{id}/abuso
{ "motivo": "contenido_falso" }
→ { "ok": true }
```

Sugerido: tabla `reporte_abusos` (reporte_id, motivo, ip_hash, creado_en) y
ocultar/auto-revisar reportes con ≥3 abusos. El frontend guarda el abuso
localmente aunque el endpoint falle, así que es seguro desplegarlo después.

## 6. `GET /api/v1/vias-afectadas` (nuevo)

El panel "Vías a evitar" del mapa hoy agrega en cliente. Shape esperado:

```json
[
  { "sector": "Av. 27 de Febrero esq. Churchill", "count": 4, "maxSeverity": "ALTO", "lng": -69.94, "lat": 18.468 }
]
```

Query opcional: `?provincia={slug}&max_age_hours=48`. `maxSeverity` se deriva del
tipo/severidad de los reportes del sector.

## 7. Push con VAPID (Fase 3)

1. Generar par VAPID y exponer la pública en el frontend vía
   `NUXT_PUBLIC_VAPID_KEY` (ya leído en `nuxt.config.ts` → `runtimeConfig.public.vapidPublicKey`).
2. Endpoints:

```http
POST   /api/v1/push/subscriptions   { "endpoint": "...", "keys": { "p256dh": "...", "auth": "..." }, "province_slug": "azua", "lat": 18.5, "lng": -70.9 }
DELETE /api/v1/push/subscriptions   { "endpoint": "..." }
```

3. Ante cambio a alerta ROJA/AMARILLA en una provincia, enviar push a suscritos
   de esa zona (título + cuerpo + `icon: /icon-192.png`). Librería sugerida: `pywebpush`.

## 8. Ingesta INDOMET/COE y apagado de mocks

Cuando esto exista, en el frontend basta `NUXT_PUBLIC_USE_MOCK=false`:

- Ampliar `GET /api/v1/clima/nacional`: las **32 provincias** con `slug`
  (hoy solo 3 y sin slug), más `temp_c`, `humedad`, `viento_kmh`, `lluvia_pct`,
  `alerta` (`ROJA|AMARILLA|VERDE|NORMAL`), `condicion` y `actualizado_en`.
- Ampliar `GET /api/v1/alertas/indomet`: matriz completa 32 provincias
  (hoy parcial) + lista de boletines:

```json
{
  "actualizado_en": "...",
  "alertas": { "azua": "ROJA", "...": "NORMAL" },
  "boletines": [{ "id": 1, "fecha": "...", "estado": "Vigente", "titulo": "...", "resumen": "..." }]
}
```

- Respetar Ley 200-04: scraping programado cada 30–60 min con caché (ya previsto
  con APScheduler), nunca por request.

## 9. Checklist de verificación

```bash
# Voto resuelto
curl -X POST localhost:8000/api/v1/reportes/<id>/voto \
  -H 'Content-Type: application/json' -d '{"estado":"resuelto"}'
# → {"ok":true,"votos_activo":N}

# Filtros
curl 'localhost:8000/api/v1/reportes?provincia=azua&max_age_hours=48&hide_resolved=true&page=1&limit=20'

# Abuso
curl -X POST localhost:8000/api/v1/reportes/<id>/abuso \
  -H 'Content-Type: application/json' -d '{"motivo":"contenido_falso"}'

# Vías + clima completo
curl localhost:8000/api/v1/vias-afectadas | head -c 300
curl localhost:8000/api/v1/clima/nacional | python3 -c "import json,sys; print(len(json.load(sys.stdin)['provincias']))"
# → 32
```

Orden sugerido: **3 → 1 → 4 → 2 → 5 → 6 → 8 → 7**.
