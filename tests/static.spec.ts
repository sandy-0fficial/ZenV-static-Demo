import { test, expect, type Page } from '@playwright/test';
import { readFile, access, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';
const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const local = (file: string) => pathToFileURL(resolve(root, file)).href;
const files: string[] = JSON.parse(await readFile(resolve(root, 'pages.json'), 'utf8'));
const config = { whatsappNumber: '919876543210', websiteUrl: 'https://example.com/zenv/', email: 'hello@example.com' }; // Test only; not a real ZenV number.
async function open(page: Page, file: string) { await page.goto(local(file)); await expect(page.locator('html')).toHaveClass(/js-ready/); await page.evaluate(() => document.fonts.ready); }
async function configured(page: Page) { await page.addInitScript(c => { Object.defineProperty(window, 'ZENV_CONFIG', { configurable: true, get: () => c, set: () => {} }); }, config); }
async function addProduct(page: Page, name: string, variant: string, quantity: number) {
  await page.getByRole('button', { name, exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Product finish').selectOption(variant);
  for (let i = 1; i < quantity; i++) await dialog.getByRole('button', { name: 'Increase product quantity' }).click();
  await dialog.getByRole('button', { name: 'Add to bag', exact: true }).click();
  await page.keyboard.press('Escape');
}
async function message(page: Page) {
  await page.getByRole('button', { name: /Shopping bag,/ }).click();
  await page.getByRole('button', { name: 'Prepare WhatsApp request' }).click();
  return page.locator('#whatsapp-message').inputValue();
}
async function readable(page: Page) {
  const result = await page.evaluate(() => {
    const tiny = [...document.querySelectorAll('main *,header *,footer *')].filter(e => {
      const r = e.getBoundingClientRect(), s = getComputedStyle(e);
      return r.width && r.height && s.display !== 'none' && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent?.trim()) && parseFloat(s.fontSize) < 12;
    }).map(e => `${e.tagName}.${e.className}: ${getComputedStyle(e).fontSize}`).slice(0, 12);
    return { overflow: document.documentElement.scrollWidth > innerWidth + 1, body: getComputedStyle(document.body).fontSize, tiny };
  });
  expect(result).toEqual({ overflow: false, body: '16px', tiny: [] });
}

test('all 26 pages open as files, load local images and have valid internal links without API requests', async ({ page }) => {
  const errors: string[] = [], remote: string[] = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('request', r => { if (/^https?:/.test(r.url())) remote.push(r.url()); });
  for (const file of files) {
    await open(page, file);
    await expect(page.locator('main')).not.toBeEmpty();
    await page.locator('footer').scrollIntoViewIfNeeded();
    await expect.poll(() => page.evaluate(() => [...document.images].every(i => i.complete && i.naturalWidth > 0))).toBe(true);
    const links = await page.locator('a').evaluateAll(as => as.map(a => (a as HTMLAnchorElement).href).filter(h => h.startsWith('file:') && new URL(h).pathname.endsWith('.html')));
    for (const link of links) await access(fileURLToPath(new URL(new URL(link).pathname, 'file:')));
  }
  expect(remote).toEqual([]); expect(errors).toEqual([]);
});

test('real content and product navigation work with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const file of ['index.html', 'gallery.html', 'journal.html', 'article-care.html', 'visit.html', 'products/cuban-ring.html']) {
    await page.goto(local(file)); await expect(page.locator('main')).not.toBeEmpty();
    await expect(page.locator('main')).toContainText(file.includes('cuban') ? 'Cuban Ring' : /./);
    await expect(page.locator('main button:visible')).toHaveCount(0);
  }
  await page.goto(local('gallery.html'));
  await page.getByRole('link', { name: 'View Cuban Ring', exact: true }).click();
  await expect(page).toHaveURL(/products\/cuban-ring\.html/);
  await context.close();
});

test('numbered WhatsApp request preserves finishes, quantities and public product links', async ({ page }) => {
  await configured(page); await open(page, 'gallery.html');
  await addProduct(page, 'Cuban Ring', 'matte-black', 2);
  await addProduct(page, 'Cuban Ring', 'silver-tone', 1);
  await addProduct(page, 'Silver Chain', 'silver-05m', 5);
  const text = await message(page);
  expect(text).toContain('1) Cuban Ring — Matte black\n   Pieces: 2');
  expect(text).toContain('2) Cuban Ring — Silver-tone\n   Pieces: 1');
  expect(text).toContain('3) Silver Chain — Silver-tone · 0.5 m\n   Pieces: 5');
  expect(text).toContain('Product ID: ZV-R003 / cuban-ring');
  expect(text).toContain('Product: https://example.com/zenv/products/silver-chain.html');
  const url = new URL((await page.getByRole('link', { name: 'Continue in WhatsApp' }).getAttribute('href'))!);
  expect(url.pathname).toBe('/919876543210'); expect(url.searchParams.get('text')).toBe(text);
  expect(text).not.toContain('file:');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Shopping bag, 8 items' })).toBeVisible();
});

test('unconfigured WhatsApp is honest, offline IDs work, selection crosses pages when storage is blocked', async ({ page }) => {
  await page.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage blocked'); } }); });
  await open(page, 'gallery.html'); await addProduct(page, 'Cuban Ring', 'matte-black', 2);
  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await page.getByRole('link', { name: 'Our story', exact: true }).first().click();
  await expect(page).toHaveURL(/about\.html/);
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('button', { name: 'Shopping bag, 2 items' })).toBeVisible();
  const text = await message(page); expect(text).toContain('Product ID: ZV-R003 / cuban-ring'); expect(text).not.toContain('file:');
  await expect(page.getByRole('link', { name: 'Continue in WhatsApp' })).toHaveCount(0);
  await expect(page.getByRole('dialog')).toContainText('number is awaiting confirmation');
  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: /Shopping bag,/ }).click();
  await page.getByRole('button', { name: 'Increase Cuban Ring Matte black', exact: true }).click();
  await page.keyboard.press('Escape'); await page.reload();
  await expect(page.getByRole('button', { name: 'Shopping bag, 3 items' })).toBeVisible();
});

test('search, category filters, favourites, quantities and keyboard modal controls', async ({ page }) => {
  await open(page, 'gallery.html'); await expect(page.locator('.product-card')).toHaveCount(14);
  await page.getByRole('button', { name: 'Rings', exact: true }).click();
  await expect(page.locator('.product-card')).toHaveCount(3);
  await page.getByLabel('Search collection').fill('Cuban'); await expect(page.locator('.product-card')).toHaveCount(1);
  await page.getByRole('button', { name: 'Save Cuban Ring to favourites' }).click();
  await page.getByRole('link', { name: 'Favourites, 1 pieces' }).click();
  await expect(page.locator('.product-card')).toHaveCount(1);
  await page.getByRole('button', { name: 'Cuban Ring', exact: true }).click();
  const dialog = page.getByRole('dialog'); await dialog.locator('summary').first().focus(); await page.keyboard.press('Tab');
  expect(await dialog.evaluate(d => d.contains(document.activeElement))).toBe(true);
  await page.keyboard.press('Escape'); await expect(dialog).toHaveCount(0);
});

test('configured contact drafts are validated, previewed, cleared and never saved', async ({ page }) => {
  await configured(page); await open(page, 'contact.html');
  await page.getByRole('button', { name: 'Prepare WhatsApp message', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Please add a message');
  await page.getByLabel('Your name').fill('Priya'); await page.getByLabel('Your message').fill('Is the matte black ring available?');
  await page.getByRole('button', { name: 'Prepare WhatsApp message', exact: true }).click();
  const link = page.getByRole('link', { name: 'Open draft in WhatsApp' });
  expect(new URL((await link.getAttribute('href'))!).searchParams.get('text')).toContain('my name is Priya');
  await expect(page.locator('.static-info-prepared')).toContainText('Nothing has been sent.');
  expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain('Priya');
  await page.getByRole('button', { name: 'Clear draft' }).click(); await expect(link).toHaveCount(0);
  await page.reload(); await expect(page.getByLabel('Your message')).toHaveValue('');
});

for (const width of [320, 390, 768, 1024, 1440]) test(`readable light/dark local pages at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 1000 });
  for (const file of ['index.html', 'gallery.html', 'products/cuban-ring.html', 'journal.html', 'contact.html', 'visit.html', 'faq.html']) {
    await open(page, file); await readable(page);
    const toggle = page.getByRole('button', { name: /Switch to (dark|light) theme/ });
    await toggle.click(); await readable(page);
  }
  if (width === 390 || width === 1440) {
    await open(page, 'index.html'); await mkdir(resolve(root, 'artifacts'), { recursive: true });
    await page.screenshot({ path: resolve(root, `artifacts/static-home-${width}.png`), fullPage: true });
    await open(page, 'journal.html'); await page.screenshot({ path: resolve(root, `artifacts/static-journal-${width}.png`), fullPage: true });
  }
});

test('mobile selection, message preview and navigation remain readable in both themes', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await configured(page); await open(page, 'gallery.html');
  for (const theme of ['light', 'dark']) {
    const active = await page.locator('html').getAttribute('data-theme');
    if (active !== theme) await page.getByRole('button', { name: `Switch to ${theme} theme` }).click();
    await page.getByRole('button', { name: 'Cuban Ring', exact: true }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.getByLabel('Product finish')).toBeVisible();
    await dialog.getByLabel('Product finish').selectOption('matte-black');
    await dialog.getByRole('button', { name: 'Add to bag', exact: true }).click();
    await readableDialog(page); await page.keyboard.press('Escape');
    await page.getByRole('button', { name: /Shopping bag,/ }).click();
    await readableDialog(page);
    await page.getByRole('button', { name: 'Prepare WhatsApp request' }).click();
    await readableDialog(page);
    await expect(page.locator('#whatsapp-message')).toHaveValue(/Cuban Ring — Matte black/);
    await expect(page.getByRole('link', { name: 'Continue in WhatsApp' })).toBeVisible();
    await mkdir(resolve(root, 'artifacts'), { recursive: true });
    await page.screenshot({ path: resolve(root, `artifacts/static-message-${theme}-320.png`), animations: 'disabled' });
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await readableDialog(page); await page.keyboard.press('Escape');
  }
});
async function readableDialog(page: Page) {
  await expect.poll(() => page.getByRole('dialog').evaluate(dialog => {
    const rect = dialog.getBoundingClientRect();
    const tiny = [...dialog.querySelectorAll('*')].filter(e => {
      const r = e.getBoundingClientRect();
      return r.width && r.height && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent?.trim()) && parseFloat(getComputedStyle(e).fontSize) < 12;
    }).map(e => `${e.tagName}: ${getComputedStyle(e).fontSize}`);
    return { tiny, horizontalFit: rect.x >= -1 && rect.right <= innerWidth + 1, overflow: dialog.scrollWidth > dialog.clientWidth + 1 };
  })).toEqual({ tiny: [], horizontalFit: true, overflow: false });
}

test('hosting under a subfolder automatically produces shareable product URLs', async ({ page }) => {
  await page.route('http://static.test/zenv/**', async route => {
    const url = new URL(route.request().url()); const file = decodeURIComponent(url.pathname.slice('/zenv/'.length));
    await route.fulfill({ path: resolve(root, file || 'index.html') });
  });
  await page.goto('http://static.test/zenv/products/cuban-ring.html');
  await expect(page.locator('html')).toHaveClass(/js-ready/);
  await page.getByRole('button', { name: 'Add to bag', exact: true }).click();
  expect(await message(page)).toContain('Product: http://static.test/zenv/products/cuban-ring.html');
});
