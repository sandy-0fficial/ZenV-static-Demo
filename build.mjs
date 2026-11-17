import { build } from 'esbuild';
import { mkdir, writeFile, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { products as rawProducts } from './source/catalogue.mjs';

const root = dirname(fileURLToPath(import.meta.url));
process.chdir(root);
const products = rawProducts.map(p => {
  const { stock, images, ...product } = p;
  return { ...product, image: p.image.replace(/^\//, ''), variants: p.variants || [{ id: 'original-finish', label: p.material }] };
});
await mkdir('assets', { recursive: true });
await mkdir('products', { recursive: true });
await mkdir('.build', { recursive: true });
await build({ absWorkingDir: root, entryPoints: ['source/client.tsx'], outfile: 'assets/site.js', bundle: true, minify: true, format: 'iife', platform: 'browser', target: ['es2020'], jsx: 'automatic', loader: { '.css': 'empty' }, define: { 'process.env.NODE_ENV': '"production"' } });
await build({ absWorkingDir: root, entryPoints: ['source/render.tsx'], outfile: '.build/render.mjs', bundle: true, format: 'esm', platform: 'node', target: 'node20', jsx: 'automatic', packages: 'external', loader: { '.css': 'empty' } });
await build({ absWorkingDir: root, entryPoints: ['source/lib.ts'], outfile: '.build/lib.mjs', bundle: true, format: 'esm', platform: 'node' });
await copyFile('source/pages.css', 'assets/pages.css');
await copyFile('source/static.css', 'assets/static.css');
const { render } = await import(resolve(root, '.build/render.mjs'));
const pages = [
  ['index.html', 'home', 'Fashion jewellery & little luxuries'],
  ['gallery.html', 'gallery', 'Gallery & collection'], ['favourites.html', 'favourites', 'Your favourites'],
  ['about.html', 'about', 'Our story'], ['journal.html', 'journal', 'The ZenV journal'],
  ['article-care.html', 'article-care', 'A little care, a longer love'],
  ['article-styling.html', 'article-styling', 'Everyday styling'], ['article-gifting.html', 'article-gifting', 'Thoughtful gifting'],
  ['contact.html', 'contact', 'Say hello'], ['visit.html', 'visit', 'Maps & showroom'],
  ['care.html', 'care', 'Jewellery care'], ['faq.html', 'faq', 'Questions & answers'],
  ...products.map(p => [`products/${p.id}.html`, 'product', p.name, p.id]),
];
const escape = s => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
for (const [file, page, title, productId] of pages) {
  const base = file.startsWith('products/') ? '../' : './';
  const boot = { page, base, products, ...(productId ? { productId } : {}) };
  const data = JSON.stringify(boot).replaceAll('<', '\\u003c').replaceAll('\u2028', '\\u2028').replaceAll('\u2029', '\\u2029');
  const html = `<!doctype html>
<html lang="en" data-theme="light"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="theme-color" content="#fbfaf7"><meta name="description" content="ZenV fashion jewellery, editorial stories and personal WhatsApp enquiries. Illustrative catalogue from Bengaluru."><title>${escape(title)} | ZenV Jewels</title><link rel="icon" href="${base}assets/favicon.svg"><link rel="stylesheet" href="${base}assets/fonts.css"><link rel="stylesheet" href="${base}assets/styles.css"><link rel="stylesheet" href="${base}assets/typography.css"><link rel="stylesheet" href="${base}assets/pages.css"><link rel="stylesheet" href="${base}assets/static.css"><style>html:not(.js-ready) button,html:not(.js-ready) .static-info-contact-form form{display:none} .static-nojs{padding:20px 6%;font-size:1rem;background:var(--paper)}</style></head>
<body><noscript><p class="static-nojs">Browse all pages and product photographs without JavaScript. Enable JavaScript for themes, filters, favourites and WhatsApp item selections. You can also contact <a href="https://www.instagram.com/zenvjewels/">ZenV on Instagram</a>.</p></noscript><div id="root">${render(boot)}</div><script src="${base}settings.js"></script><script>window.ZENV_BOOT=${data};</script><script src="${base}assets/site.js"></script></body></html>`;
  await writeFile(file, html);
}
await writeFile('assets/catalogue.json', JSON.stringify(products, null, 2) + '\n');
await writeFile('pages.json', JSON.stringify(pages.map(([file]) => file), null, 2) + '\n');
console.log(`Generated ${pages.length} real HTML pages, local CSS/fonts/images and a classic script bundle. Open static-site/index.html directly; no server is needed.`);
