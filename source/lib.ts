export interface Product {
  id: string; sku: string; name: string; category: string; price: number;
  compareAt: number | null; description: string; details: string[];
  image: string; badge: string | null; material: string;
  variants: { id: string; label: string }[];
}
export interface Item { productId: string; variantId: string; quantity: number }
export interface Config { whatsappNumber: string; email: string; instagram: string; mapsUrl: string; address: string; openingHours: string; websiteUrl: string }
export const defaults: Config = { whatsappNumber: '', email: '', instagram: 'https://www.instagram.com/zenvjewels/', mapsUrl: 'https://maps.app.goo.gl/E2awtcwWRAqQf9cQ6?g_st=ic', address: '', openingHours: '', websiteUrl: '' };
export const money = (amount: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: Number.isInteger(amount) ? 0 : 2, maximumFractionDigits: 2 }).format(amount);
export function saved<T>(key: string, fallback: T): T { try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; } }
export function save(key: string, value: unknown) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* Optional on file://. Links also carry non-personal selection state. */ } }
export function validItems(value: unknown, products: Product[]): Item[] {
  if (!Array.isArray(value)) return [];
  const result: Item[] = [];
  for (const v of value.slice(0, 60)) {
    const product = products.find(p => p.id === v?.productId);
    if (!product || !product.variants.some(o => o.id === v?.variantId) || !Number.isInteger(v?.quantity) || v.quantity < 1 || v.quantity > 99) continue;
    const existing = result.find(i => i.productId === v.productId && i.variantId === v.variantId);
    if (existing) existing.quantity = Math.min(99, existing.quantity + v.quantity);
    else result.push({ productId: product.id, variantId: v.variantId, quantity: v.quantity });
  }
  return result;
}
export function productLink(product: Product, config: Config, origin?: string): string {
  const relative = `products/${product.id}.html`;
  try {
    if (config.websiteUrl) { const url = new URL(config.websiteUrl.endsWith('/') ? config.websiteUrl : config.websiteUrl + '/'); if (url.protocol === 'https:' || url.protocol === 'http:') return new URL(relative, url).href; }
    if (origin && /^https?:/.test(origin)) return new URL(relative, origin).href;
  } catch { /* Product ID still works offline or with invalid settings. */ }
  return '';
}
export function messageFor(items: Item[], products: Product[], config: Config, origin?: string): string {
  const lines = items.flatMap((item, index) => {
    const p = products.find(p => p.id === item.productId), variant = p?.variants.find(v => v.id === item.variantId);
    if (!p || !variant) return [];
    const link = productLink(p, config, origin);
    return [`${index + 1}) ${p.name} — ${variant.label}`, `   Pieces: ${item.quantity}`, `   Product ID: ${p.sku} / ${p.id}`, `   Variant ID: ${variant.id}`, `   Guide price: ${money(p.price)} each`, ...(link ? [`   Product: ${link}`] : [])];
  });
  return ['Hello ZenV! I would like to enquire about these pieces:', '', ...lines, '', 'Please confirm availability, materials, final price, payment options and delivery. This is a request, not a confirmed order.', ...(!items.some(i => { const p = products.find(p => p.id === i.productId); return p && productLink(p, config, origin); }) ? ['Product IDs are included because this catalogue is being viewed locally without a public website URL.'] : [])].join('\n');
}
export function whatsappUrl(number: string, message: string): string { const digits = number.replace(/\D/g, ''); return /^[1-9]\d{9,14}$/.test(digits) ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}` : ''; }
