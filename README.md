# ZenV — portable static website

## Open it

Double-click **index.html** inside this folder. No `npm run dev`, Node server, database, API, login or installation is needed to browse the delivered website. Keep the HTML files, `products/`, `assets/`, `images/` and `settings.js` together.

The original dynamic ZenV project was not modified. This folder is an independent version.

## Included

- The existing editorial home design, photography, local fonts and light/dark themes.
- Gallery with category filters, search, sorting and favourites.
- Fourteen standalone product pages, including the example Cuban Ring and Silver Chain.
- About, contact, showroom/directions, care and FAQ pages.
- A journal with three complete articles: care, everyday styling and thoughtful gifting.
- A selection bag with product finishes and quantities, and a numbered WhatsApp draft with product IDs and shareable product links.
- No inventory management, signup, billing, payment collection or backend dependencies.

This is **static hosting**, with a prebuilt JavaScript enhancement for selections and themes. Each HTML page already contains its content. With JavaScript disabled, page navigation, articles and product photographs still work; selection controls require JavaScript.

## Enable WhatsApp before publishing

Open **settings.js** in a text editor. Set `whatsappNumber` to ZenV’s confirmed number in international format, digits only: country code followed by the actual number, without a plus sign or spaces. The delivered number is intentionally blank; no invented contact is used.

Also fill in the confirmed email, street address and opening hours if desired. The Instagram and external directions links come from the public Instagram profile. No remote map iframe is loaded.

Set `websiteUrl` to the full public catalogue root, with a trailing slash, for example `https://your-real-domain.com/zenv/`. This allows a locally opened catalogue to include public product links. When hosted and this field is blank, product links use the current website and subfolder automatically. A local `file://` path is never put into a WhatsApp request.

Changing settings.js takes effect on reload; **no rebuild is required**. Without a confirmed number, the website clearly offers copying item details and the official Instagram link instead of a misleading WhatsApp button.

### Selection example

1) Cuban Ring — Matte black
   Pieces: 2
   Product ID: ZV-R003 / cuban-ring
   Variant ID: matte-black
   Product: [your public website]/products/cuban-ring.html

2) Silver Chain — Silver-tone · 0.5 m
   Pieces: 5
   Product ID: ZV-N004 / silver-chain
   Variant ID: silver-05m
   Product: [your public website]/products/silver-chain.html

Different finishes remain separate lines. The button opens a draft in WhatsApp; the customer must review and send it there. It does not submit an order, reserve stock or clear the bag.

## Deploy or copy

Use `zenv-static-website.zip` (created by `npm run package`) or copy these items to any static host:

- All top-level `.html` pages
- `products/`, `assets/`, `images/`, `licenses/`
- `settings.js`

A domain root or a subfolder both work. No SPA rewrites are required: every page has a real `.html` file. Serve `.woff2` files as font files and `.js` as JavaScript, not an HTML fallback. For updates, replace the complete deployment and refresh caches. Prefer revalidated HTML/settings and do not indefinitely cache the unversioned CSS/JS assets.

You can omit source/, tests/, node_modules/, .build/, artifacts/, test-results/, the build scripts and package files when publishing. The ZIP excludes them.

## Optional editing/build tools

Only needed to change source layouts or the catalogue, not to run the delivered site:

```bash
cd static-site
npm ci
npm run build
npm run typecheck
npx playwright install chromium
npm test
npm run package
```

Node 20+ is sufficient for this separate build; optional ZIP packaging also uses Python 3. Edit `source/catalogue.mjs` for real product IDs, names, photographs, prices and finish options, then build. Edit source/App.tsx for home/header/footer and source/Pages.tsx for articles and information pages. Build output stays inside this folder. Original CSS and typography were copied into assets/; additional styles are independent static layers.

## Honest limitations and privacy

The catalogue, guide prices, finishes and editorial photographs are illustrative and are not confirmed live stock. Replace them with ZenV’s real catalogue before advertising products. The retained welcome-offer banner is a design sample: confirm or remove it in source/App.tsx before launch. Materials, offers, payment arrangements, shipping and return policies require confirmation with ZenV.

The bag, favourites and theme use this static version’s own browser-storage keys, separate from the dynamic app. Internal navigation also carries non-personal bag selection and theme in query parameters to support browsers that block file storage. Such URLs can reveal the selected products if shared; no name, address or contact-form text is included. Do not treat this browser bag as durable storage. Browser file-storage behaviour varies; keep the folder together and use the tested Chromium path or host it for consistent cross-device use.

Contact drafts stay in page memory, not persistent storage. External WhatsApp, Instagram, directions and email services need connectivity and follow their own privacy policies. The website does not claim that a message has been sent or delivered.

## Verification

The local browser suite checks all 26 direct-file pages, images and internal links; no automatic external/API requests; no-JavaScript page navigation; separate variant lines; quantities and exact WhatsApp URL encoding; missing configuration; blocked storage; contact draft privacy; subfolder hosting; and readable light/dark layouts at 320, 390, 768, 1024 and 1440 pixels.
# ZenV-static-Demo
