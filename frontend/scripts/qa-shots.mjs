import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const OUT = '/tmp/climard-qa';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: '/Users/imac/Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
});
const errors = [];

async function shot(name, url, actions) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', (e) => errors.push(`${name}: ${e.message.split('\n')[0]}`));
  page.on('console', (m) => {
    if (m.type() === 'error' && !m.text().includes('favicon')) errors.push(`${name} [console]: ${m.text().slice(0, 160)}`);
  });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 }).catch((e) => errors.push(`${name} goto: ${e.message.split('\n')[0]}`));
  await page.waitForTimeout(2500);
  if (actions) await actions(page).catch((e) => errors.push(`${name} action: ${e.message.split('\n')[0]}`));
  await page.screenshot({ path: `${OUT}/${name}.png` });
  await page.close();
  console.log('shot:', name);
}

await shot('01-index', 'http://localhost:3000/');
await shot('02-alertas', 'http://localhost:3000/alertas');
await shot('03-evidencias', 'http://localhost:3000/evidencias');
await shot('04-provincia-azua', 'http://localhost:3000/provincia/azua');
await shot('05-recomendaciones', 'http://localhost:3000/recomendaciones');
await shot('06-mapa', 'http://localhost:3000/mapa');
await shot('07-mapa-lluvia', 'http://localhost:3000/mapa', async (page) => {
  const btn = page.getByRole('button', { name: /lluvia/i });
  await btn.click({ timeout: 10000 });
  await page.waitForTimeout(6000);
});
await shot('08-offline', 'http://localhost:3000/offline');

// móvil: home
{
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `${OUT}/09-index-mobile.png` });
  await page.close();
  console.log('shot: 09-index-mobile');
}

await browser.close();
console.log('\nERRORES JS:', errors.length ? '' : '(ninguno)');
for (const e of errors) console.log(' -', e);
