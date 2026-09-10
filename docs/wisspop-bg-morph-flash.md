# WissPopMorph: destello de bg (rosa / arcoíris) durante la animación

> Estado: **mitigado en el proyecto** (orígenes Rect) — pendiente arreglo propio en la librería.
> Librería: `wisspop@0.2.0` · Archivo: `frontend/node_modules/wisspop/dist/core.js`
> Fecha: 2026-09-10

## Síntoma

Al abrir/cerrar el dropdown de acciones (`NavActionsDropdown`) o los dropdowns
internos de Provincia/Sector (`UserProfileModal`), durante la animación del morph
se ve un cambio de color de fondo raro: destello rosa y a veces tonos arcoíris,
que desaparece cuando la animación termina.

## Reproducción

1. Origen con fondo contrastante respecto al panel. Ej.: píldora negra
   (`bg-zinc-950`) como origen de un panel blanco (`bg-white`).
2. Origen que contiene un icono (`svg`/`img`). Ej.: la píldora con `≡`, o los
   inputs con iconos clear/chevron.
3. Abrir o cerrar el `WissPopMorph` y observar los primeros ~300 ms.

## Causa raíz (código de la librería)

La librería hace **morph de color de fondo + clonado de elemento viajero** por
diseño. Referencias exactas en `node_modules/wisspop/dist/core.js`:

1. **Medición del bg del origen** — `yt()` (líneas ~295-314 y 343):
   lee `getComputedStyle(el).backgroundColor` del elemento origen y lo guarda
   como `bgColor`. (Si el origen es un Rect literal, guarda `bgColor: null`.)
2. **Tween de bg al abrir** — línea 502:
   ```js
   r.set(b, { autoAlpha: 1, ...l.bgColor ? { backgroundColor: l.bgColor } : {} }),
   l.bgColor && G.bgColor && r.to(b, { backgroundColor: G.bgColor, ... })
   ```
   La caja arranca con el bg del origen y GSAP lo interpola al bg del destino.
   Negro → blanco (o cualquier par contrastante) pasa por intermedios visibles.
3. **Clonado del origen como elemento viajero** — línea 483:
   ```js
   l.el.querySelector("svg, img, [data-wisspop-icon], .con-icono")
     ? m = l.el
     : l.el.textContent?.trim() && (m = l.el.textContent.trim())
   ```
   Si el origen contiene un icono, **todo el elemento** se anima como viajero
   (tamaño/color/posición); si tiene texto, el texto viaja con tween de
   `font-size`/color. Ambos efectos se suman al tween de bg.
4. **Tween de bg al cerrar** — línea 649: interpola de vuelta al bg del origen.

No es un bug de un solo lado: la librería hace lo que diseñó (morph completo),
pero el proyecto la alimentaba con el peor caso (orígenes negros con icono →
paneles blancos). Contrasto alto + clon volador = destello visible.

## Workaround aplicado (proyecto, sin tocar la librería)

- `app/components/NavActionsDropdown.vue` → **migrado de `WissPopMorph` a
  Elastic Dropdown Menu**: panel fijo anclado por geometría (`Teleport` a
  `body`, alineado al borde derecho del trigger, anclado por `bottom`) con
  `enterDropdownAnimation` al abrir y `leaveDropdownAnimation` al cerrar
  (`transformOrigin: 'bottom center'` porque el panel abre hacia arriba desde
  la píldora; el snippet genérico usa `'top center'` para menús que abren hacia
  abajo). Estas funciones solo animan escala/opacidad con GSAP: no hay tween de
  `backgroundColor` ni elemento viajero, así que la clase entera de artefactos
  desaparece en este dropdown.
- El `handleSelect` del dropdown pasa un Rect ya resuelto (no el selector) a
  los 3 modales, porque los 3 tenían el mismo destello al heredar la píldora
  negra como origen:
  - `UserProfileModal` (`Mi Perfil y Zona`): su `resolvedOrigin` deja pasar el
    Rect intacto (`unref(trigger)` para no-strings).
  - `IncidentReportModal` (`Reportar Incidencia`) y `AppearanceModal`
    (`Apariencia y Titulares`): ambos llegan a `AppModal.resolveOrigin`, cuyo
    caso 6 devuelve tal cual los literales `{ top, left, width, height }`.
- `app/components/UserProfileModal.vue` → `provinceDropdownOrigin` y
  `sectorDropdownOrigin` vía helper `rectOriginOf()` (`radius: 12`), con
  fallback al elemento si aún no hay geometría medible.
- `app/layouts/default.vue` → eliminados los botones directos de Reportar y
  Apariencia de los navs (clásica, guapa, drawer tasks): ya viven dentro de
  Opciones. Quedan: enlaces, `Mi Perfil (provincia)` directo en clásica y
  `Opciones` en el resto. El botón de perfil usa helper local `rectOf()` para
  abrir el modal con origen Rect; `UserProfileModal` tiene fallback centrado si
  el selector no existe en el nav activo.
- Posición adaptativa del dropdown (`NavActionsDropdown.vue`): se monta
  provisionalmente fuera de vista (`top: -9999`) para medir su alto real y
  luego se coloca según el trigger — arriba si cabe, si no abajo, si no el
  lado con más espacio; horizontal fin → inicio → centrado. El
  `transformOrigin` elástico acompaña (`bottom/top` + `right/left/center`).

## Arreglo propio pendiente (para cuando se retome)

Opciones, de menor a mayor invasividad:

1. **Wrapper local**: crear `app/components/WissPopMorphSafe.vue` que envuelva
   `WissPopMorph` y convierta automáticamente cualquier origen `HTMLElement` a
   Rect (misma lógica de `resolvedOrigin`), con prop opt-in `morphBackground`
   para los casos donde sí se quiera el tween de color. Migrar los usos.
2. **Parche vía `setDefaults`/opts**: revisar si el core acepta flags para
   desactivar el tween de bg y el flying element (hoy no existen como props del
   wrapper `vue.js`: solo `duration`, `ease`, `flyingMode`, `label`, etc.).
3. **Fork/PR a wisspop**: proponer props `morphBackground: boolean` (default
   `true` por compatibilidad) y `flying: boolean | 'text' | 'box'` que
   condicionen las líneas 483/502/649. Verificar antes si versiones > 0.2.0 ya
   lo incluyen (`pnpm outdated wisspop` / changelog).
4. **Regla de estilo**: documentar que ningún origen de morph debe tener icono
   ni bg contrastante con su panel; preferir siempre Rect salvo efecto viajero
   explícito con `[data-wisspop-title]` + `label`.

## Cómo verificar el fix futuro

1. `pnpm run build` en `frontend/` (debe pasar).
2. Manual: abrir/cerrar el dropdown de la píldora de provincia y los dropdowns
   de Provincia/Sector en el modal de perfil, en desktop y móvil, con
   `prefers-reduced-motion` desactivado. No debe haber ningún frame con tinte
   rosa ni cambio de color del panel: solo escala/posición.
3. Grabar a cámara lenta si el destello es sub-300 ms y difícil de ver a ojo.
