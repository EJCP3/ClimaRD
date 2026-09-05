# Especificación de Diseño e Interfaz de Usuario (UI/UX) - Clima RD

## 1. Filosofía de Diseño
El diseño de **Clima RD** prioriza la **legibilidad bajo condiciones de estrés**, la **rapidez operativa con una sola mano (Mobile-First)** y la **claridad semántica visual**. Al tratarse de una herramienta utilizada comúnmente durante tormentas o inundaciones, la jerarquía visual debe comunicar peligros de manera inmediata sin sobrecargar cognitivamente al usuario.

---

## 2. Sistema de Diseño: `@moni-labs/moni-ui` (Material Design 3)

El proyecto adopta **`@moni-labs/moni-ui`** como biblioteca base de diseño y componentes UI.

* **Repositorio:** [github.com/moni-spa/moni-ui](https://github.com/moni-spa/moni-ui)
* **Instalación:**
  ```bash
  pnpm install @moni-labs/moni-ui
  ```
* **Fundamentos:**
  * **Material Design 3 (Expressive, Mobile-First):** Contenedores redondeados, esquinas expresivas, elevaciones tonales y micro-interacciones suaves impulsadas por GSAP.
  * **Arquitectura de Componentes:** Web Components (`lit`) y estilos CSS modulares (`@moni-labs/moni-ui/styles`), totalmente compatibles con Nuxt 4 / Vue 3.5+ y Tailwind CSS.

### 2.1. Paleta Cromática y Tokens Semánticos

| Propósito | Nombre Token / Clase | Hex / Estilo | Significado Semántico |
| :--- | :--- | :--- | :--- |
| **Fondo Principal (Claro)** | `bg-surface-light` | `#F8FAFC` (`slate-50`) | Limpieza visual y contraste alto |
| **Fondo Principal (Oscuro)**| `bg-surface-dark` | `#0F172A` (`slate-900`) | Modo nocturno y visualización cartográfica |
| **Primario (MD3 Primary)** | `primary-blue` | `#0284C7` (`sky-600`) | Representación del clima, agua y acciones clave |
| **Secundario / Acento** | `accent-cyan` | `#06B6D4` (`cyan-500`) | Indicadores de humedad y viento |
| **Alerta: Nivel Verde** | `alert-green` | `#10B981` (`emerald-500`)| Normalidad / Precaución mínima (COE/INDOMET) |
| **Alerta: Nivel Amarillo**| `alert-yellow`| `#F59E0B` (`amber-500`)  | Vigilancia / Posibles inundaciones |
| **Alerta: Nivel Rojo** | `alert-red` | `#EF4444` (`red-500`)    | Peligro extremo / Evacuación preventiva |
| **Alerta Incidencia Vía** | `incident-orange`| `#F97316` (`orange-500`)| Calles bloqueadas o árboles caídos |

### 2.2. Tipografía y Estructura
* **Tipografía Primaria:** Inter / Roboto, sans-serif moderna, de trazo geométrico y alta legibilidad en pantallas móviles pequeñas.
* **Escala Modular:**
  * H1 / Títulos Hero: `text-2xl` a `text-3xl` (`24pt` a `28pt`), peso semibold/bold.
  * Tarjetas de Métricas / Números: `text-xl` a `text-2xl`, monospace opcional para temperaturas.
  * H2 / Títulos de Secciones: `text-lg` a `text-xl` (`14pt` a `16pt`), peso bold.
  * Texto General / Body: `text-sm` a `text-base` (`10pt` a `11pt`), interlineado relajado.
  * Etiquetas / Chips: `text-xs`, uppercase, peso bold con bordes redondeados.

### 2.3. Catálogo de Componentes `@moni-labs/moni-ui` Utilizados
1. **`moni-top-app-bar`:** Cabecera superior con selector de provincia y estado de alerta global.
2. **`moni-navigation-bar`:** Barra de navegación inferior móvil para operación con el pulgar.
3. **`moni-navigation-rail` / Sidebar:** Barra de navegación vertical para resoluciones de escritorio.
4. **`moni-card` (elevated & outlined):** Contenedor de métricas climáticas, boletines y evidencias fotográficas.
5. **`moni-fab` (Floating Action Button):** Botón flotante prominente para disparar el reporte de incidentes.
6. **`moni-chip` y `moni-badge`:** Etiquetas reactivas de estado de alerta (Verde, Amarillo, Rojo).
7. **`moni-dialog` / Bottom Sheet:** Modal deslizable para el flujo de reporte en dos pasos.
8. **`moni-button`:** Acciones principales (Filled), secundarias (Tonal/Outlined) y de llamada de emergencia (911).

---

## 3. Arquitectura de Navegación y Vistas (Estructura Nuxt 4)

La interfaz se estructura sobre la convención de carpetas de **Nuxt 4** (`app/layouts/` y `app/pages/`):
* **Desktop:** Sidebar vertical (`moni-navigation-rail`) a la izquierda con logotipo, enlaces, selector rápido de provincia e indicador de alerta.
* **Mobile:** Barra inferior fija (`moni-navigation-bar`) con 5 destinos táctiles grandes.

```text
+-------------------------------------------------------------------------+
|                        app/layouts/default.vue                          |
|  +----------------+  +-----------------------------------------------+  |
|  |  Nav Rail      |  |                 Área de Contenido             |  |
|  |  (En Desktop)  |  |                 (<NuxtPage />)                |  |
|  |                |  |                                               |  |
|  | - Dashboard    |  |  1. app/pages/index.vue           (Dashboard) |  |
|  | - Mapa         |  |  2. app/pages/mapa.vue            (Mapa+Report)| |
|  | - Alertas      |  |  3. app/pages/alertas.vue         (SVG+INDOMET)| |
|  | - Evidencias   |  |  4. app/pages/evidencias.vue      (Bento Grid) |  |
|  | - Prevención   |  |  5. app/pages/recomendaciones.vue (Guías / 911)|  |
|  +----------------+  +-----------------------------------------------+  |
|  +-------------------------------------------------------------------+  |
|  |     moni-navigation-bar (Visible estrictamente en Mobile)         |  |
|  +-------------------------------------------------------------------+  |
+-------------------------------------------------------------------------+
```

---

## 4. Detalle de Vistas y Componentes

### 4.1. Dashboard Principal (`app/pages/index.vue`)
Vista inicial del usuario que resume las condiciones meteorológicas inmediatas.
1. **Cabecera de Saludo y Localización (`moni-top-app-bar`):**
   * Muestra la provincia actual (ej. *"Santo Domingo de Guzmán"*) con selector desplegable.
   * Fecha actual y chip de alerta oficial en vigencia.
2. **Tarjeta Hero del Clima (`moni-card` elevated):**
   * Temperatura en °C (ej. `29°C`), sensación térmica, descripción (ej. *"Chubascos dispersos"*).
   * Icono animado del clima y probabilidad de precipitación en porcentaje.
3. **Rejilla de Métricas Secundarias (Grid 3 columnas):**
   * Humedad relativa (%).
   * Velocidad y dirección del viento (km/h).
   * Índice Ultravioleta (UV) / Presión barométrica.
4. **Pronóstico por Horas / Días:**
   * Carrusel horizontal de tarjetas `moni-card` con el pronóstico (mañana, tarde, noche y próximos 3 días).

### 4.2. Mapa Operativo y Reportes Ciudadanos (`app/pages/mapa.vue`)
El núcleo interactivo en tiempo real para detección y reporte de incidencias en vías.
1. **Lienzo Cartográfico (MapLibre GL JS):**
   * Vista a pantalla completa (`h-[calc(100vh-theme(spacing.16))]`), aislado en `<ClientOnly>`.
   * Integración del dataset de códigos postales y sectores de República Dominicana (`codigos-postales-rd.json`) para búsqueda rápida y geocodificación.
   * Controles flotantes: Buscador de sectores por código postal/nombre, zoom in/out, re-centrado GPS automático y alternador de capas.
2. **Pines Dinámicos y Agrupamiento (Clustering):**
   * Marcadores con micro-iconos renderizados vía HTML/Tailwind.
   * Los incidentes concentrados se condensan en burbujas con contador numérico que se expanden al hacer zoom.
   * Popup al pulsar un pin: Tipo de incidente, hora relativa (ej. *"Hace 12 min"*), votos de confirmación y foto miniatura.
3. **Botón de Acción Flotante (`moni-fab`):**
   * Botón prominente en la esquina inferior derecha: `"¡Reportar Incidencia!"` con estilo primario llamativo.
4. **Modal de Reporte Rápido (`moni-dialog` / Bottom Sheet en 2 pasos):**
   * **Paso 1 - Selección de Incidencia:** Rejilla táctil de 4 botones grandes:
     1. *Inundación Callejera* (Gota / Ola azul).
     2. *Árbol Caído* (Árbol verde esmeralda).
     3. *Vía Bloqueada* (Auto naranja).
     4. *Derrumbe / Deslizamiento* (Alerta roja / Rocas).
   * **Paso 2 - Confirmación:** Muestra la dirección por geocodificación inversa, campo de comentario, botón para adjuntar foto y botón `moni-button` de envío: `"Publicar Reporte"`.

### 4.3. Centro de Alertas Nacionales (`app/pages/alertas.vue`)
Vista ejecutiva de la situación nacional emitida por INDOMET y el COE.
1. **Estructura Split (2 Columnas en Desktop):**
   * **Columna Izquierda (Mapa Vectorial SVG de RD):**
     * Silueta geográfica nacional dividida en sus 31 provincias y el Distrito Nacional.
     * Cada polígono se colorea dinámicamente (`fill-emerald-500`, `fill-amber-500`, `fill-red-500`).
     * Tooltip al pasar el cursor o pulsar la provincia mostrando su nivel de riesgo y recomendación.
   * **Columna Derecha (Boletines Oficiales INDOMET/COE):**
     * Lista vertical de tarjetas `moni-card` con fecha, tipo de boletín, provincias bajo alerta y sinopsis meteorológica.

### 4.4. Muro de Evidencias en Bento Grid (`app/pages/evidencias.vue`)
Visualización comunitaria estructurada para validar la severidad de los eventos climáticos.
1. **Diseño Bento Grid / Masonry:**
   * Rejilla responsiva con CSS Grid (`grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`).
   * Ciertas tarjetas abarcan doble columna (`col-span-2`) o doble fila (`row-span-2`) para destacar incidentes de alta prioridad.
2. **Tarjeta de Evidencia (`moni-card`):**
   * Imagen optimizada con bordes redondeados.
   * Degradado oscuro inferior con texto superpuesto blanco.
   * Chip de ubicación (ej. `"📍 Av. Luperón, D.N."`), tipo de reporte y fecha relativa.
   * Indicador de confirmaciones comunitarias (ej. `"👍 24 confirmaciones"`).

### 4.5. Prevención, Recomendaciones y Ayuda (`app/pages/recomendaciones.vue`)
Centro educativo y de respuesta rápida ciudadana.
1. **Directorio Telefónico de Emergencia:**
   * Tarjetas táctiles `moni-card` con botón de llamada directa `tel:`:
     * **911:** Sistema Nacional de Atención a Emergencias.
     * **COE:** Centro de Operaciones de Emergencias.
     * **Defensa Civil República Dominicana.**
     * **Cuerpo de Bomberos.**
2. **Guías Preventivas en Acordeones:**
   * Componentes desplegables interactivos estructurados por categorías:
     * *¿Qué hacer antes, durante y después de una inundación urbana?*
     * *Protocolos de seguridad ante alerta roja por huracán.*
     * *Kit básico de emergencia familiar.*

---

## 5. Especificación del Prompt Maestro para Herramientas de Generación UI

Para prototipado en herramientas de generación de código (v0, Figma AI, Cursor, Lovable):

```text
Actúa como un Diseñador UI/UX y Desarrollador Frontend experto en Nuxt 4 (v4.5+), TailwindCSS y el sistema de diseño @moni-labs/moni-ui.
Genera los componentes visuales para "ClimaAlerta RD", una plataforma cívica dominicana de monitoreo climático y reporte de inundaciones.

Requisitos de Diseño:
1. Basado en el sistema de diseño @moni-labs/moni-ui (Material Design 3 Expressive, Mobile-First).
2. Semántica de colores obligatoria: Azul primario (#0284C7 / sky-600) para acciones principales; Verde esmeralda (emerald-500), Amarillo ámbar (amber-500) y Rojo (red-500) exclusivamente para alertas provinciales INDOMET/COE.
3. Componentes requeridos (estructura Nuxt 4 app/pages/):
   - moni-navigation-rail (Desktop) y moni-navigation-bar (Móvil).
   - Vista Dashboard con moni-card hero para clima actual y carrusel de pronóstico.
   - Vista Mapa con contenedor MapLibre, buscador integrado por código postal/sector, moni-fab ("¡Reportar Incidencia!") y moni-dialog/bottom-sheet modal de 4 opciones: Inundación, Árbol Caído, Vía Bloqueada, Derrumbe.
   - Vista Alertas split: mapa SVG nacional reactivo a colores y feed de boletines oficiales con moni-card y chips de alerta.
   - Vista Evidencias en Bento Grid con fotos y etiquetas georreferenciadas.
   - Vista Recomendaciones con tarjetas de marcado rápido al 911/COE/Defensa Civil.
Código en Vue 3.5+ (<script setup>), TailwindCSS y props reactivas con datos de prueba (mock data).
```
