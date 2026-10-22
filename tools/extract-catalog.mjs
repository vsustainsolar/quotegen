/**
 * extract-catalog.mjs - build data/catalog.json from the current tool code.
 *
 * Run this ONCE to seed the master catalog. After that, data/catalog.json is
 * the source of truth and you edit that instead of the four script.js files.
 *
 *   node tools/extract-catalog.mjs           # write data/catalog.json
 *   node tools/extract-catalog.mjs --check    # verify code matches catalog
 */

import { writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { ROOT, readText, parseArray, readField } from './lib/catalog.mjs';
import { TARGETS, SETTINGS, HTML_SELECT_TARGETS } from './lib/targets.mjs';

const CATALOG_PATH = path.join(ROOT, 'data', 'catalog.json');

/* ------------------------------------------------------------------ */

const slug = (s) =>
  String(s).toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/** Best-effort brand / type metadata for the legacy (pre-catalog) entries. */
function deriveMeta(category, keyValue, record) {
  const brand = record.brand ?? null;
  const type = record.type ?? null;
  if (brand && type) return { brand, type };

  const k = String(keyValue);

  // ups-b2b derives its "Make" column from the first word of the name.
  if (/^ups|^battery-(ups|ep|solar-ups)$|^solar-inverter-ups$|^trolley$/.test(category)) {
    const first = String(record.name ?? k).split(/\s+/)[0];
    return { brand: brand ?? first, type };
  }

  if (category === 'solar-panel') {
    const b = brand ?? (/LUM/i.test(k) ? 'Luminous'
      : /^poly/i.test(k) ? 'Generic' : null);
    const t = type ?? (/non\s*dcr/i.test(k) ? 'NON DCR'
      : /\bdcr\b/i.test(k) ? 'DCR' : null);
    return { brand: b, type: t };
  }

  if (category.startsWith('solar-inverter-')) {
    const b = brand ?? (/deye/i.test(k) ? 'DEYE'
      : /feston/i.test(k) ? 'Feston'
      : /nxe|nxh|hybrid/i.test(k) ? 'Luminous'
      : /nxg|nxp|solarverter|solar inverter|nxi/i.test(k) ? 'Luminous'
      : null);
    return { brand: b, type };
  }

  if (category.startsWith('battery-')) {
    const b = brand ?? (/^LV\s/i.test(k) ? 'Livguard'
      : /LiFePO4/i.test(k) ? 'Livguard'
      : /HV Battery/i.test(k) ? 'Luminous'
      : /\bLPT|\bLPTT/i.test(k) ? 'Luminous'
      : null);
    return { brand: b, type };
  }

  return { brand, type };
}

/** Pull the category's field union out of the target specs. */
function fieldsFor(category) {
  const set = new Set();
  for (const t of [...TARGETS, ...HTML_SELECT_TARGETS]) {
    if (t.category === category) t.fields.forEach((f) => set.add(f));
  }
  return [...set];
}

/* ------------------------------------------------------------------ */

const products = new Map();   // category -> Map(key -> product)
const drift = [];

for (const target of TARGETS) {
  const src = readText(target.path);
  let items;
  try {
    items = parseArray(src, target.list);
  } catch (err) {
    console.error(`  ! ${target.path} :: ${target.list} - ${err.message}`);
    process.exitCode = 1;
    continue;
  }

  if (!products.has(target.category)) products.set(target.category, new Map());
  const bucket = products.get(target.category);

  for (const item of items) {
    const key = String(item[target.key]);
    const record = {};
    for (const f of fieldsFor(target.category)) {
      if (item[f] !== undefined) record[f] = item[f];
    }

    if (bucket.has(key)) {
      const prev = bucket.get(key);
      const prevPrice = prev.price;
      if (prevPrice !== record.price) {
        drift.push({ category: target.category, key, a: `${target.path}::${target.list}`, aPrice: prevPrice, bPrice: record.price });
      }
      // keep the richer record
      bucket.set(key, { ...prev, ...record });
    } else {
      bucket.set(key, { ...record, key });
    }
  }
}

/* ---------------- assemble ---------------- */

const catalogProducts = [];
for (const [category, bucket] of products) {
  for (const [key, record] of bucket) {
    const meta = deriveMeta(category, key, record);
    const product = {
      sku: `${category}:${slug(key)}`,
      category,
      ...meta,
      ...record,
    };
    catalogProducts.push(product);
  }
}

// Order is preserved exactly as it appears in the tool files, so a catalog
// that is hand-edited keeps the order the user chose.

/* ---------------- settings ---------------- */

const settings = {};
for (const s of SETTINGS) {
  settings[s.id] = { label: s.label, price: s.price };
}

/* ---------------- emit ---------------- */

const catalog = {
  meta: {
    description: 'Master product + price list for the V-Sustain Solar Quotation Suite.',
    currency: 'INR',
    note: 'Prices are dealer prices, EX-GST and EX-WORKS. GST is applied by each tool on top.',
    extractedAt: new Date().toISOString().slice(0, 10),
  },
  settings,
  products: catalogProducts,
};

if (process.argv.includes('--check')) {
  const current = JSON.parse(readFileSync(CATALOG_PATH, 'utf8'));
  const a = JSON.stringify(current.products);
  const b = JSON.stringify(catalogProducts);
  if (a === b) {
    console.log('OK  code and data/catalog.json agree.');
  } else {
    console.error('DRIFT  code and data/catalog.json disagree.');
    process.exitCode = 1;
  }
} else {
  mkdirSync(path.dirname(CATALOG_PATH), { recursive: true });
  writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2) + '\n', 'utf8');
  console.log(`Wrote ${path.relative(ROOT, CATALOG_PATH)} - ${catalogProducts.length} products in ${products.size} categories.`);
}

if (drift.length) {
  console.log('\nCross-file price drift found while extracting:');
  for (const d of drift) {
    console.log(`  ! ${d.category} :: ${d.key}  ${d.a} = ${d.aPrice}  vs  ${d.b} = ${d.bPrice}`);
  }
  console.log('  (each category keeps the last file read - review these before publishing)');
}
