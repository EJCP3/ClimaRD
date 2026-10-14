import { chromium } from '@playwright/test';
const browser = await chromium.launch({
  executablePath: '/Users/imac/Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
});
for (const url of ['http://localhost:3000/alertas', 'http://localhost:3000/evidencias']) {
  const page = await browser.newPage();
  page.on('console', (m) => {
    if (m.text().includes('Hydration')) console.log('URL:', url, '\n' + m.text().slice(0, 2000) + '\n---');
  });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(2000);
  await page.close();
}
await browser.close();
