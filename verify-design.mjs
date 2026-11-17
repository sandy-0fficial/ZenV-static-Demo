import { chromium } from 'playwright';
import { readFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
const root = dirname(fileURLToPath(import.meta.url));
const catalogue = JSON.parse(await readFile(resolve(root, 'assets/catalogue.json'), 'utf8'));
const browser = await chromium.launch();
const selectors = ['.announcement', '.header-main', '.desktop-nav', '.hero', '.hero-copy', '.hero h1', '.hero-description', '.hero-copy .button', '.hero-photo', '.values-strip', '.category-section', '.category-grid', '.favorites-section', '.editorial'];
try {
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, colorScheme: 'light' });
    const original = await context.newPage();
    await original.route('http://original.test/**', async route => {
      const url = new URL(route.request().url());
      if (url.pathname === '/') return route.fulfill({ contentType: 'text/html', body: '<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/site.css"></head><body><div id="root"></div><script src="/site.js"></script></body></html>' });
      if (url.pathname === '/api/products') return route.fulfill({ json: catalogue.slice(0, 12).map(p => ({ ...p, stock: 20, revision: 0, image: '/' + p.image, images: ['/' + p.image] })) });
      if (url.pathname === '/api/account/session') return route.fulfill({ json: { account: null } });
      const path = url.pathname.startsWith('/images/') ? resolve(root, url.pathname.slice(1)) : resolve(root, '.build/reference', url.pathname.slice(1));
      return route.fulfill({ path });
    });
    await original.goto('http://original.test/');
    await original.waitForFunction(() => document.querySelectorAll('.product-card').length === 4);
    await original.evaluate(() => document.fonts.ready);
    const portable = await context.newPage();
    await portable.goto(pathToFileURL(resolve(root, 'index.html')).href);
    await portable.waitForSelector('html.js-ready');
    await portable.evaluate(() => document.fonts.ready);
    const measure = async page => page.evaluate(selectors => Object.fromEntries(selectors.map(selector => {
      const node = document.querySelector(selector), r = node.getBoundingClientRect();
      return [selector, { x: r.x, y: r.y, width: r.width, height: r.height }];
    })), selectors);
    const before = await measure(original), after = await measure(portable);
    const differences = [];
    for (const selector of selectors) for (const dimension of ['x', 'y', 'width', 'height']) {
      if (Math.abs(before[selector][dimension] - after[selector][dimension]) > 1) differences.push({ selector, dimension, original: before[selector][dimension], static: after[selector][dimension] });
    }
    console.log(JSON.stringify({ width, differences }, null, 2));
    await mkdir(resolve(root, 'artifacts'), { recursive: true });
    await portable.screenshot({ path: resolve(root, `artifacts/static-light-${width}.png`), fullPage: true });
    assert.equal(differences.length, 0, `Original design geometry differs at ${width}px`);
    await context.close();
  }
  console.log('Original hero/header/editorial geometry preserved at mobile and desktop widths.');
} finally { await browser.close(); }
