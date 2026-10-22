/**
 * apply-prices.mjs - write data/catalog.json back into the four tool files.
 *
 *   node tools/apply-prices.mjs                apply, print a summary
 *   node tools/apply-prices.mjs --dry-run      show what would change
 *   node tools/apply-prices.mjs --allow-remove also delete products dropped
 *                                               from the catalog
 *
 * Only the catalog array literals (and the handful of literal settings) are
 * touched. No pricing, tax or quotation logic is modified.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { ROOT, readText, patchList, patchHtmlOptionPrices } from './lib/catalog.mjs';
import { TARGETS, SETTINGS, HTML_SELECT_TARGETS } from './lib/targets.mjs';

const CATALOG_PATH = path.join(ROOT, 'data', 'catalog.json');
const dryRun = process.argv.includes('--dry-run');
const allowRemove = process.argv.includes('--allow-remove');

const catalog = JSON.parse(readFileSync(CATALOG_PATH, 'utf8'));

/* ---------------- index products by category ---------------- */

const byCategory = new Map();
for (const p of catalog.products) {
  if (!byCategory.has(p.category)) byCategory.set(p.category, []);
  byCategory.get(p.category).push(p);
}

/* ---------------- file buffer ---------------- */

const fileSrc = new Map();
const getSrc = (p) => {
  if (!fileSrc.has(p)) fileSrc.set(p, readText(p));
  return fileSrc.get(p);
};

/* ---------------- apply catalogs ---------------- */

const report = [];

for (const target of TARGETS) {
  const products = byCategory.get(target.category) || [];
  if (!products.length) {
    report.push(`  ! ${target.path} :: ${target.list} - no products for category "${target.category}"`);
    continue;
  }
  const res = patchList(getSrc(target.path), target.list, products, target,
    { keepUnknown: !allowRemove });
  fileSrc.set(target.path, res.src);

  const bits = [];
  if (res.changed.length) bits.push(`${res.changed.length} changed`);
  if (res.added.length) bits.push(`${res.added.length} added`);
  if (res.removed.length) bits.push(`${res.removed.length} not in catalog`);
  report.push(`  ${target.path.padEnd(22)} :: ${target.list.padEnd(16)} ${bits.length ? bits.join(', ') : 'unchanged'}`);

  for (const key of res.added) report.push(`        + ${key}`);
  for (const key of res.changed) report.push(`        ~ ${key}`);
  for (const key of res.removed) {
    report.push(`        - ${key}  (not in catalog${allowRemove ? '' : ' - KEPT in code'})`);
  }
}

/* ---------------- HTML option targets ---------------- */

for (const target of HTML_SELECT_TARGETS) {
  const products = byCategory.get(target.category) || [];
  if (!products.length) continue;
  const res = patchHtmlOptionPrices(getSrc(target.path), products, target);
  fileSrc.set(target.path, res.src);
  const bits = [];
  if (res.changed.length) bits.push(`${res.changed.length} changed`);
  if (res.added.length) bits.push(`${res.added.length} added`);
  if (res.removed.length) bits.push(`${res.removed.length} not in catalog`);
  report.push(`  ${target.path.padEnd(22)} :: ${target.list.padEnd(16)} ${bits.length ? bits.join(', ') : 'unchanged'}`);
}

/* ---------------- settings ---------------- */

function applySetting(src, pattern, template, price) {
  const re = new RegExp(pattern, 'g');
  let hits = 0;
  const out = src.replace(re, (...args) => {
    hits++;
    const groups = args.slice(1, -2);
    const withValue = template.replace(/\{VALUE\}/g, String(price));
    // Templates without a $n reference replace the whole match.
    if (!/\$\d/.test(withValue)) return withValue;
    return withValue.replace(/\$(\d)/g, (_, d) => groups[Number(d) - 1] ?? '');
  });
  return { src: out, hits };
}

for (const setting of SETTINGS) {
  const price = catalog.settings?.[setting.id]?.price;
  if (price === undefined) {
    report.push(`  ! setting "${setting.id}" missing from catalog.json`);
    continue;
  }
  for (const site of [...(setting.js || []), ...(setting.html || [])]) {
    const before = getSrc(site.path);
    const { src: after, hits } = applySetting(before, site.pattern, site.value, price);
    if (hits === 0) {
      report.push(`  ! ${site.path} - pattern not found for setting "${setting.id}"`);
      continue;
    }
    fileSrc.set(site.path, after);
    if (after !== before) {
      report.push(`  ${site.path.padEnd(22)} :: ${setting.id.padEnd(16)} ${hits} occurrence(s) updated`);
    }
  }
}

/* ---------------- write ---------------- */

let touched = 0;
for (const [p, content] of fileSrc) {
  const original = readText(p);
  if (content === original) continue;
  touched++;
  if (dryRun) {
    report.push(`  (dry-run) would write ${p}`);
  } else {
    writeFileSync(path.join(ROOT, p), content, 'utf8');
    report.push(`  wrote ${p}`);
  }
}

console.log(dryRun ? 'DRY RUN - no files written\n' : '');
console.log(report.join('\n'));
console.log(`\n${dryRun ? 'Would update' : 'Updated'} ${touched} file(s) from ${path.relative(ROOT, CATALOG_PATH)}.`);
if (!dryRun && touched === 0) console.log('Nothing changed - the code already matches the catalog.');
