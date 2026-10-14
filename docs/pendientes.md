# Pendientes (no-backend)

## QA móvil (hacer después)
Servidores expuestos a la WiFi según guía del chat (`0.0.0.0` + `NUXT_PUBLIC_API_BASE_URL` por IP LAN):

- [ ] Reportar evidencia real: foto con cámara, GPS, publicación, aparece en muro + mapa.
- [ ] Votos Sigue/Resuelto sobre ese reporte.
- [ ] Anti-spam: 4to reporte seguido debe frenar.
- [ ] Tarjeta WhatsApp desde provincia: imagen legible al compartir.
- [ ] Nota: GPS/push/PWA exigen HTTPS; si fallan en HTTP local, probar en deploy preview Vercel.

## Deuda frontend (futuro)
- [ ] Extraer `EvidenceDetailModal.vue` (duplicado evidencias/provincia).
- [ ] `NuxtImage` + `srcset` en galería y tarjetas.
- [ ] i18n (al menos es-DO formalizado).
- [ ] Smoke E2E con Playwright (`scripts/qa-shots.mjs` como base).
- [ ] `pnpm typecheck` limpio (vue-tsc).
