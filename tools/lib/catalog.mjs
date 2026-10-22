/**
 * Shared helpers for reading and rewriting the product catalogs that live
 * inside the plain-JS tool files.
 *
 * Design rule: we never re-render a line we did not have to touch.
 * `patchList` only rewrites a line when a field actually differs, which is
 * what lets `npm run prices` produce an empty diff when nothing changed.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

export const readText = (rel) => readFileSync(path.join(ROOT, rel), 'utf8');
export const writeText = (rel, text) => writeFileSync(path.join(ROOT, rel), text, 'utf8');

/* ------------------------------------------------------------------ *
 * Locating and parsing a `const <name> = [ ... ];` block
 * ------------------------------------------------------------------ */

/**
 * Find a top-level array literal assignment.
 * Returns { start, end, bodyStart, bodyEnd } offsets into `src`:
 *   start      -> index of `const`
 *   bodyStart  -> index just after the opening `[`
 *   bodyEnd    -> index of the closing `]` (exclusive of the `;`)
 */
export function findArrayBlock(src, name) {
  const decl = new RegExp(`const\\s+${escapeRe(name)}\\s*=\\s*\\[`);
  const m = decl.exec(src);
  if (!m) throw new Error(`array "${name}" not found`);

  const bodyStart = m.index + m[0].length;
  const bodyEnd = findMatchingBracket(src, bodyStart - 1);
  if (bodyEnd < 0) throw new Error(`array "${name}" has no matching "]"`);
  return { start: m.index, bodyStart, bodyEnd, end: bodyEnd + 2 };
}

/** Given src[i] === '[', return the index of the matching ']'. */
function findMatchingBracket(src, openIdx) {
  let depth = 0;
  let quote = null;
  for (let i = openIdx; i < src.length; i++) {
    const ch = src[i];
    if (quote) {
      if (ch === '\\') { i++; continue; }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; continue; }
    if (ch === '[') depth++;
    else if (ch === ']') { depth--; if (depth === 0) return i; }
  }
  return -1;
}

/** Parse the array literal at `name` into real JS objects. */
export function parseArray(src, name) {
  const { bodyStart, bodyEnd } = findArrayBlock(src, name);
  const literal = src.slice(bodyStart - 1, bodyEnd + 1); // include both brackets
  // The catalog arrays are static literals from this repo - safe to evaluate.
  return new Function(`return (${literal});`)();
}

/**
 * Split an array body into its top-level element chunks, keeping each
 * element's exact original text (including any leading comment lines that
 * belong to it).
 */
export function splitEntries(body) {
  const out = [];
  let depth = 0;
  let quote = null;
  let start = 0;
  for (let i = 0; i < body.length; i++) {
    const ch = body[i];
    if (quote) {
      if (ch === '\\') { i++; continue; }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; continue; }
    if (ch === '{' || ch === '[') depth++;
    else if (ch === '}' || ch === ']') depth--;
    else if (ch === ',' && depth === 0) {
      out.push({ text: body.slice(start, i) });
      start = i + 1;
    }
  }
  const tail = body.slice(start);
  if (tail.trim()) out.push({ text: tail });
  return out;
}

/* ------------------------------------------------------------------ *
 * Field level patching
 * ------------------------------------------------------------------ */

export const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Read a field's value out of a single entry line. */
export function readField(line, field) {
  const re = new RegExp(`(?:^|[{,]\\s*)${escapeRe(field)}\\s*:\\s*("(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*'|-?[\\d.]+|true|false)`);
  const m = re.exec(line);
  if (!m) return undefined;
  const raw = m[1];
  if (/^["']/.test(raw)) return raw.slice(1, -1);
  if (raw === 'true' || raw === 'false') return raw === 'true';
  const num = Number(raw);
  return Number.isNaN(num) ? raw : num;
}

/** Numeric style of the current literal, so "1899.80" does not become "1899.8". */
function numericStyle(currentRaw, newValue) {
  const v = Number(newValue);
  if (!Number.isFinite(v)) return String(newValue);
  // A whole number is always written without decimals.
  if (Number.isInteger(v)) return String(v);
  const hasDot = currentRaw.includes('.');
  const decimals = hasDot ? (currentRaw.split('.')[1] || '').length : 0;
  if (decimals > 0) return v.toFixed(decimals);
  return String(v);
}

/**
 * Replace one field's value inside a single entry line.
 * Only the value text changes - spacing, key order and every other field
 * on the line are preserved byte-for-byte.
 */
export function replaceField(line, field, newValue) {
  const re = new RegExp(
    `((?:^|[{,]\\s*)${escapeRe(field)}\\s*:\\s*)("(?:[^"\\\\]|\\\\.)*"|'(?:[^'\\\\]|\\\\.)*'|-?[\\d.]+|true|false)`
  );
  const m = re.exec(line);
  if (!m) throw new Error(`field "${field}" not found in: ${line.trim().slice(0, 90)}`);
  const prefix = m[1];
  const currentRaw = m[2];

  let out;
  if (typeof newValue === 'number') {
    out = numericStyle(currentRaw, newValue);
  } else if (typeof newValue === 'boolean') {
    out = String(newValue);
  } else {
    const quote = currentRaw.startsWith('"') ? '"' : currentRaw.startsWith("'") ? "'" : '"';
    out = quote + String(newValue).replace(/\\/g, '\\\\').replace(new RegExp(quote, 'g'), '\\' + quote) + quote;
  }
  return line.slice(0, m.index) + prefix + out + line.slice(m.index + m[0].length);
}

/* ------------------------------------------------------------------ *
 * Rendering brand-new entries in each file's native style
 * ------------------------------------------------------------------ */

/**
 * Per-target rendering rules. `indent` + `quote` reproduce the file's
 * existing style so a new line sits naturally next to its neighbours.
 */
export const RENDER_STYLES = {
  'on-grid': { indent: '  ', quote: '"' },
  'off-grid': { indent: '  ', quote: '"' },
  'hybrid': { indent: '  ', quote: '"' },
  'ups-b2b': { indent: '    ', quote: "'" },
};

const NUMERIC_FIELDS = new Set(['price', 'gst', 'watt', 'capacityKw']);

export function renderEntry(product, fields, file) {
  const style = RENDER_STYLES[file] || RENDER_STYLES['on-grid'];
  const parts = fields.map((f) => {
    const v = product[f];
    if (v === undefined || v === null) throw new Error(`product ${product.sku} is missing field "${f}"`);
    if (NUMERIC_FIELDS.has(f)) return `${f}: ${v}`;
    const q = style.quote;
    const esc = String(v).replace(/\\/g, '\\\\').split(q).join('\\' + q);
    return `${f}: ${q}${esc}${q}`;
  });
  return `${style.indent}{ ${parts.join(', ')} }`;
}

/* ------------------------------------------------------------------ *
 * The main patching routine
 * ------------------------------------------------------------------ */

/**
 * Patch one catalog list inside `src`.
 *
 * @param {string} src          file contents
 * @param {string} name         array variable name
 * @param {object[]} products   desired products, in order
 * @param {object} spec         { key, fields, file }
 * @returns {{ src: string, added: string[], changed: string[], removed: string[] }}
 */
export function patchList(src, name, products, spec, opts = {}) {
  const keepUnknown = opts.keepUnknown !== false;
  const { bodyStart, bodyEnd } = findArrayBlock(src, name);
  const body = src.slice(bodyStart, bodyEnd);

  // Split the body into leading whitespace / core entries / trailing whitespace
  // so the original spacing can be rebuilt byte-for-byte.
  const lead = (body.match(/^\s*/) || [''])[0];
  const trail = (body.match(/\s*$/) || [''])[0];
  let core = body.slice(lead.length, body.length - trail.length);
  // Some lists end with a trailing comma after the last entry - keep it.
  const hasTrailingComma = core.endsWith(',');
  if (hasTrailingComma) core = core.slice(0, -1);
  const eol = body.includes('\r\n') ? '\r\n' : '\n';

  const pieces = splitEntries(core);
  const added = [];
  const changed = [];
  const removed = [];

  const byKey = new Map(products.map((p) => [String(p[spec.key]), p]));
  const matched = new Set();

  // Patch in place, preserving order and every unrelated character.
  for (const piece of pieces) {
    const key = pieceKey(piece, spec.key);
    if (key === undefined) continue; // blank / comment piece - left alone
    const product = byKey.get(key);
    if (!product) {
      removed.push(key);
      if (!keepUnknown) piece.__drop = true;
      continue;
    }
    matched.add(key);

    let updated = piece.text;
    let dirty = false;
    for (const field of spec.fields) {
      const want = product[field];
      if (want === undefined) continue;
      const have = readField(updated, field);
      const same = typeof want === 'number' ? Number(have) === want : String(have) === String(want);
      if (!same) {
        updated = replaceField(updated, field, want);
        dirty = true;
      }
    }
    if (dirty) changed.push(key);
    piece.text = updated;
  }

  // New products are inserted at the position their neighbours in the
  // catalog imply, so the dropdown order matches the catalog order.
  const catIndex = new Map(products.map((p, i) => [String(p[spec.key]), i]));
  const insertions = [];

  for (const product of products) {
    const keyStr = String(product[spec.key]);
    if (matched.has(keyStr)) continue;
    added.push(keyStr);

    const nIdx = catIndex.get(keyStr);
    // Insert after the last existing entry that comes earlier in the catalog.
    let pos = -1;
    for (let i = 0; i < pieces.length; i++) {
      const pk = pieceKey(pieces[i], spec.key);
      if (pk === undefined) continue;
      const pi = catIndex.get(pk);
      if (pi !== undefined && pi < nIdx) pos = i;
    }
    insertions.push({
      pos: pos + 1,
      idx: nIdx,
      text: eol + renderEntry(product, spec.fields, spec.style),
    });
  }

  if (insertions.length) {
    // Splice from the end backwards so earlier positions stay valid, and so
    // that several products sharing an insertion point keep catalog order.
    insertions.sort((a, b) => (b.pos - a.pos) || (b.idx - a.idx));
    for (const ins of insertions) {
      pieces.splice(ins.pos, 0, { text: ins.text });
    }
  }

  const kept = pieces.filter((p) => !p.__drop).map((p) => p.text);
  const rebuilt = lead + kept.join(',') + (hasTrailingComma ? ',' : '') + trail;
  const newSrc = src.slice(0, bodyStart) + rebuilt + src.slice(bodyEnd);
  return { src: newSrc, added, changed, removed };
}

/** The key value of an entry piece, or undefined for blanks and comments. */
function pieceKey(piece, keyField) {
  const text = piece.text;
  // A comment line can sit directly above an entry and end up glued to it
  // after the comma split - so look for the key from the object brace on.
  const braceIdx = text.indexOf('{');
  if (braceIdx < 0) return undefined;
  const v = readField(text.slice(braceIdx), keyField);
  return v === undefined ? undefined : String(v);
}

/* ------------------------------------------------------------------ *
 * HTML <option data-price="..."> patching
 * ------------------------------------------------------------------ */

/**
 * Patch the data-price attribute of <option> tags in an HTML file.
 * Used by hybrid, whose bi-directional meter options live in HTML rather
 * than in a JS array.
 */
export function patchHtmlOptionPrices(src, products, spec) {
  const byKey = new Map(products.map((p) => [String(p[spec.key]), p]));
  const changed = [];
  const added = [];
  const removed = [];
  const seen = new Set();

  const out = src.replace(/<option\b[^>]*>/g, (tag) => {
    const vm = /\bvalue\s*=\s*"([^"]*)"/.exec(tag);
    if (!vm) return tag;
    const key = vm[1];
    const product = byKey.get(key);
    if (!product) return tag;
    seen.add(key);

    const dm = /\bdata-price\s*=\s*"([^"]*)"/.exec(tag);
    const want = Number(product.price);
    if (!dm) {
      // No data-price attribute yet - add one.
      added.push(key);
      return tag.replace(/\s*\/?>$/, ` data-price="${want}">`);
    }
    if (Number(dm[1]) === want) return tag;
    changed.push(key);
    return tag.replace(dm[0], `data-price="${want}"`);
  });

  for (const key of byKey.keys()) if (!seen.has(key)) removed.push(key);
  return { src: out, added, changed, removed };
}

/* ------------------------------------------------------------------ *
 * Small helpers for settings that are not array entries
 * ------------------------------------------------------------------ */

/** Replace every `kw * <n>` style constant in a file. */
export function replaceAllLiteral(src, pattern, replacement, label) {
  const re = new RegExp(pattern, 'g');
  if (!re.test(src)) throw new Error(`settings target not found: ${label}`);
  re.lastIndex = 0;
  return src.replace(re, replacement);
}
