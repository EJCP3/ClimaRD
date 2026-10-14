import { chromium } from '@playwright/test';
const browser = await chromium.launch({
  executablePath: '/Users/imac/Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
});
const errors = [];
async function shot(name, url, actions) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', (e) => errors.push(`${name}: ${e.message.split('\n')[0]}`));
  page.on('console', (m) => {
    if (m.type() === 'error' && !m.text().includes('favicon')) errors.push(`${name}: ${m.text().slice(0, 140)}`);
  });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }).catch((e) => errors.push(`${name} goto: ${e.message.split('\n')[0]}`));
  await page.waitForTimeout(2500);
  if (actions) await actions(page).catch((e) => errors.push(`${name} action: ${e.message.split('\n')[0]}`));
  await page.screenshot({ path: `/tmp/climard-qa/${name}.png` });
  await page.close();
  console.log('shot:', name);
}
await shot('10-analitica', 'http://localhost:3000/analitica');
await shot('11-ruta', 'http://localhost:3000/ruta-segura');
await shot('12-ruta-plan', 'http://localhost:3000/ruta-segura', async (page) => {
  await page.getByLabel(/origen/i).fill('Piantini, Distrito Nacional');
  await page.getByLabel(/destino/i).fill('Boca Chica');
  await page.getByRole('button', { name: /planificar/i }).click();
  await page.waitForTimeout(12000);
});
await shot('13-mapa-radar-anim', 'http://localhost:3000/mapa', async (page) => {
  await page.getByRole('button', { name: /lluvia/i }).click({ timeout: 10000 });
  await page.waitForTimeout(8000);
});
await browser.close();
console.log('\nERRORES JS:', errors.length ? '' : '(ninguno)');
for (const e of errors) console.log(' -', e);
