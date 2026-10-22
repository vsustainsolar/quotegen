/**
 * validate-catalog.mjs - sanity checks on data/catalog.json.
 *
 *   node tools/validate-catalog.mjs
 *
 * Warnings do not fail the build; errors do. Exit code is non-zero when an
 * error is found, so it can gate a price update.
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { ROOT } from './lib/catalog.mjs';
import { TARGETS, SETTINGS, HTML_SELECT_TARGETS } from './lib/targets.mjs';

const CATALOG_PATH = path.join(ROOT, 'data', 'catalog.json');
const catalog = JSON.parse(readFileSync(CATALOG_PATH, 'utf8'));

const errors = [];
const warnings = [];
const info = [];

/* ---------------- required fields per target ---------------- */

const requiredByCategory = new Map();
for (const t of [...TARGETS, ...HTML_SELECT_TARGETS]) {
  const set = requiredByCategory.get(t.category) || new Set();
  t.fields.forEach((f) => set.add(f));
  requiredByCategory.set(t.category, set);
}

/* ---------------- per-product checks ---------------- */

const seenSku = new Map();
const seenCategoryKey = new Map();

for (const p of catalog.products) {
  const id = p.sku || `${p.category}:${p.key}`;

  // -- sku uniqueness ------------------------------------------------
  if (seenSku.has(id)) errors.push(`duplicate sku "${id}"`);
  else seenSku.set(id, p);

  // -- key uniqueness within a category ------------------------------
  const ck = `${p.category}|${p.key}`;
  if (seenCategoryKey.has(ck)) {
    errors.push(`duplicate product in ${p.category}: "${p.key}" appears more than once`);
  } else {
    seenCategoryKey.set(ck, p);
  }

  // -- price ----------------------------------------------------------
  const price = p.price;
  if (price === undefined || price === null) {
    errors.push(`${id}: missing price`);
  } else if (typeof price !== 'number' || !Number.isFinite(price)) {
    errors.push(`${id}: price is not a number (${price})`);
  } else if (price <= 0) {
    errors.push(`${id}: price must be greater than zero (${price})`);
  }

  // -- required fields for the lists this product feeds ---------------
  const required = requiredByCategory.get(p.category);
  if (required) {
    for (const f of required) {
      if (p[f] === undefined || p[f] === null || p[f] === '') {
        errors.push(`${id}: missing required field "${f}" for category ${p.category}`);
      }
    }
  }

  // -- panels: rate-first panels must equal ratePerWp x watt -----------
  // Only enforced for priceBasis "per-watt". For "per-unit" panels the
  // Rs/Wp figure was back-calculated from the price and is reference only.
  if (p.category === 'solar-panel') {
    if (typeof p.watt === 'number' && p.watt > 0) {
      if (p.priceBasis === 'per-watt') {
        const expected = Math.round(p.ratePerWp * p.watt * 100) / 100;
        if (Math.abs(expected - p.price) > 0.01) {
          errors.push(`${id}: price ${p.price} != ${p.ratePerWp}/Wp x ${p.watt}Wp = ${expected}`);
        }
      }
      if (p.ratePerWp !== undefined && typeof p.ratePerWp !== 'number') {
        errors.push(`${id}: ratePerWp must be a number`);
      }
    }
    if (!p.brand) warnings.push(`${id}: no brand recorded`);
  }
}

/* ---------------- inverted price vs capacity ---------------- */

/** Compare products that share a brand+type and have a comparable capacity. */
function checkCapacityAnomalies(category, capacityField, groupFields, label) {
  const groups = new Map();
  for (const p of catalog.products) {
    if (p.category !== category) continue;
    // Micro inverters are priced per module and are not comparable to a
    // string inverter of the same kW, so they are excluded.
    if (/MICRO INVERTER/i.test(p.model || p.name || '')) continue;
    const cap = p[capacityField];
    if (typeof cap !== 'number' || cap <= 0) continue;
    const gk = groupFields.map((f) => p[f] ?? '-').join('|');
    if (!groups.has(gk)) groups.set(gk, []);
    groups.get(gk).push({ p, cap });
  }
  for (const [gk, list] of groups) {
    list.sort((a, b) => a.cap - b.cap);
    for (let i = 1; i < list.length; i++) {
      const prev = list[i - 1], cur = list[i];
      // Same capacity but cheaper? Or a bigger module that costs less?
      if (cur.p.price < prev.p.price) {
        warnings.push(
          `${category} [${gk}]: ${cur.p.key} (${label} ${cur.cap}) is Rs ${cur.p.price} but ` +
          `${prev.p.key} (${label} ${prev.cap}) is Rs ${prev.p.price}`
        );
      }
    }
  }
}

checkCapacityAnomalies('solar-panel', 'watt', ['brand', 'type'], 'W');
checkCapacityAnomalies('solar-inverter-ongrid', 'capacityKw', ['brand'], 'kW');

/* ---------------- same model, different price across categories ---------------- */

const byModel = new Map();
for (const p of catalog.products) {
  const model = p.model || p.name;
  if (!model) continue;
  if (!byModel.has(model)) byModel.set(model, []);
  byModel.get(model).push(p);
}
for (const [model, list] of byModel) {
  if (list.length < 2) continue;
  const prices = new Set(list.map((p) => p.price));
  if (prices.size > 1) {
    const detail = list.map((p) => `${p.category}=${p.price}`).join(', ');
    warnings.push(`same product priced differently across lists: "${model}" -> ${detail}`);
  }
}

/* ---------------- settings ---------------- */

for (const s of SETTINGS) {
  const entry = catalog.settings?.[s.id];
  if (!entry) { errors.push(`settings "${s.id}" is missing from catalog.json`); continue; }
  if (typeof entry.price !== 'number' || !Number.isFinite(entry.price) || entry.price <= 0) {
    errors.push(`settings "${s.id}" has an invalid price: ${entry.price}`);
  }
}

/* ---------------- report ---------------- */

console.log(`Catalog: ${path.relative(ROOT, CATALOG_PATH)}`);
console.log(`Products: ${catalog.products.length} across ${new Set(catalog.products.map((p) => p.category)).size} categories\n`);

if (errors.length) {
  console.log(`ERRORS (${errors.length}):`);
  errors.forEach((e) => console.log('  x ' + e));
}
if (warnings.length) {
  console.log(`\nWARNINGS (${warnings.length}):`);
  warnings.forEach((w) => console.log('  ! ' + w));
}
if (info.length) {
  console.log(`\nINFO (${info.length}):`);
  info.forEach((i) => console.log('  - ' + i));
}

if (!errors.length && !warnings.length && !info.length) console.log('Catalog looks clean.');

console.log('');
if (errors.length) {
  console.log(`${errors.length} error(s) - fix these before publishing prices.`);
  process.exit(1);
}
console.log('No errors.');
