/**
 * smoke.mjs - golden quotation tests.
 *
 * Loads each tool in a real browser, drives a fixed set of inputs and
 * captures the resulting totals. The captured numbers are compared against
 * tools/golden.json so a price update can never silently change what a
 * customer is quoted.
 *
 *   node tools/smoke.mjs              run the tests
 *   node tools/smoke.mjs --update     re-record the golden numbers
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright';
import { ROOT } from './lib/catalog.mjs';

const GOLDEN_PATH = path.join(ROOT, 'tools', 'golden.json');
const update = process.argv.includes('--update');

/* ---------------- browser discovery ---------------- */

async function launchBrowser() {
  try {
    return await chromium.launch();
  } catch {
    // Playwright's pinned browser build may not be downloaded; fall back to
    // whatever chromium build is present on this machine.
    const base = path.join(process.env.LOCALAPPDATA || '', 'ms-playwright');
    if (!existsSync(base)) throw new Error('No Playwright browser found. Run: npx playwright install');
    const builds = readdirSyncDirs(base).filter((d) => d.startsWith('chromium-')).sort().reverse();
    for (const b of builds) {
      const exe = path.join(base, b, 'chrome-win64', 'chrome.exe');
      if (existsSync(exe)) return await chromium.launch({ executablePath: exe });
    }
    throw new Error('No usable Chromium build found under ' + base);
  }
}

function readdirSyncDirs(dir) {
  return existsSync(dir)
    ? readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name)
    : [];
}

/* ---------------- page helpers ---------------- */

const fileUrl = (rel) => 'file:///' + path.join(ROOT, rel).replace(/\\/g, '/');

async function selectByText(page, selectId, text) {
  return page.evaluate(({ selectId, text }) => {
    const sel = document.getElementById(selectId);
    if (!sel) return false;
    const opt = [...sel.options].find((o) => o.textContent.includes(text));
    if (!opt) return false;
    sel.selectedIndex = opt.index;
    sel.dispatchEvent(new Event('change', { bubbles: true }));
    return true;
  }, { selectId, text });
}

/* ---------------- scenarios ---------------- */

const SCENARIOS = [
  {
    name: 'on-grid',
    page: 'on-grid/index.html',
    async run(page) {
      await page.evaluate(() => {
        document.getElementById('systemKw').value = '5';
        document.getElementById('commonMargin').value = '20';
      });
      await selectByText(page, 'inverterModel', 'NXI 150(5KW)');
      await selectByText(page, 'panelModel', 'NON DCR LUM 620TG132');
      await page.evaluate(() => {
        document.getElementById('panelQty').value = '9';
        updatePanelData(true);
        recalcAllCards();
      });
      return page.evaluate(() => {
        const t = calcTotals();
        return {
          items: t.items.length,
          subtotal: t.subtotal, totalGst: t.totalGst,
          gst5: t.gst5Total, gst18: t.gst18Total,
          grandTotal: t.grandTotal,
        };
      });
    },
  },
  {
    name: 'off-grid',
    page: 'off-grid/index.html',
    async run(page) {
      await page.evaluate(() => {
        document.getElementById('systemKw').value = '5';
        document.getElementById('commonMargin').value = '20';
      });
      await selectByText(page, 'inverterModel', 'SOLARVERTER PRO 5KVA/48V (MPPT)');
      await selectByText(page, 'batteryModel', 'LPTT 12100H');
      await selectByText(page, 'panelModel', 'NON DCR LUM 620TG132');
      await page.evaluate(() => {
        document.getElementById('panelQty').value = '9';
        updatePanelData(true);
        recalcAllCards();
      });
      return page.evaluate(() => {
        const t = calcTotals();
        return {
          items: t.items.length,
          subtotal: t.subtotal, totalGst: t.totalGst,
          gst5: t.gst5Total, gst18: t.gst18Total,
          grandTotal: t.grandTotal,
        };
      });
    },
  },
  {
    name: 'hybrid',
    page: 'hybrid/index.html',
    async run(page) {
      await page.evaluate(() => {
        document.getElementById('systemKw').value = '5';
        document.getElementById('commonMargin').value = '20';
      });
      await selectByText(page, 'inverterModel', 'HYBRID TX 5KVA');
      await selectByText(page, 'batteryModel', 'LV LiFePO4 Battery SE-F5 PLUS');
      await selectByText(page, 'panelModel', 'NON DCR LUM 620TG132');
      await page.evaluate(() => {
        document.getElementById('panelQty').value = '9';
        updatePanelData(true);
        recalcAllCards();
      });
      return page.evaluate(() => {
        const t = calcTotals();
        return {
          items: t.items.length,
          subtotal: t.subtotal, totalGst: t.totalGst,
          gst5: t.gst5Total, gst18: t.gst18Total,
          grandTotal: t.grandTotal,
        };
      });
    },
  },
  {
    name: 'ups-b2b',
    page: 'ups-b2b/index.html',
    async run(page) {
      await page.evaluate(() => { document.getElementById('global-margin').value = '20'; });
      await page.click('#add-ups-btn');
      await page.evaluate(() => {
        const rows = document.querySelectorAll('.ups-row');
        const row = rows[rows.length - 1];
        row.querySelector('.row-active').checked = true;
        // .model-select is a hidden input holding the catalog id.
        row.querySelector('.model-select').value = 'u2';
        row.querySelector('.item-qty').value = '2';
      });
      return page.evaluate(() => {
        const gm = parseFloat(document.getElementById('global-margin').value) || 0;
        const isReduce = document.getElementById('global-margin-reduce').checked;
        const items = extractRowData('.ups-row', upsCatalog, gm, isReduce);
        const preTax = items.reduce((s, i) => s + i.totalPreTax, 0);
        const gst = items.reduce((s, i) => s + i.gstAmount, 0);
        return {
          items: items.length,
          subtotal: Math.round(preTax * 100) / 100,
          totalGst: Math.round(gst * 100) / 100,
          grandTotal: Math.round((preTax + gst) * 100) / 100,
        };
      });
    },
  },

  /* The searchable dropdown must drive the real <select>, which then drives
     the normal pricing path. This guards the widget end to end. */
  {
    name: 'search-dropdown',
    page: 'on-grid/index.html',
    async run(page) {
      // widget built for every product select?
      const widgets = await page.evaluate(() => document.querySelectorAll('.ss .ss-input').length);

      // set up a 5 kW system
      await page.evaluate(() => {
        document.getElementById('systemKw').value = '5';
        document.getElementById('commonMargin').value = '20';
        document.getElementById('systemKw').dispatchEvent(new Event('input', { bubbles: true }));
      });
      await page.waitForTimeout(150);

      // type "novasys" into the panel box and read the filtered list
      const panelBox = page.locator('.ss').filter({ has: page.locator('#panelModel') }).locator('.ss-input');
      await panelBox.click();
      await panelBox.fill('novasys');
      await page.waitForTimeout(250);

      const filtered = await page.evaluate(() => {
        const open = document.querySelector('.ss.is-open');
        if (!open) return { open: false };
        return {
          open: true,
          count: open.querySelectorAll('.ss-item').length,
          first: open.querySelector('.ss-item .ss-name')?.textContent || null,
          detail: open.querySelector('.ss-item .ss-detail')?.textContent || null,
        };
      });

      // pick it with the keyboard
      await page.keyboard.press('ArrowDown');
      await page.keyboard.press('Enter');
      await page.waitForTimeout(250);

      const picked = await page.evaluate(() => {
        const t = calcTotals();
        const p = t.items.find((i) => i.type === 'panels');
        return {
          selectValue: document.getElementById('panelModel').value,
          panelDesc: p?.desc,
          panelRate: p?.baseRate,
          panelQty: p?.qty,
          grandTotal: t.grandTotal,
        };
      });

      return { widgets, filtered: filtered.count, firstMatch: filtered.first, detail: filtered.detail, ...picked };
    },
  },
];

/* ---------------- run ---------------- */

const browser = await launchBrowser();
const results = {};

for (const scenario of SCENARIOS) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(fileUrl(scenario.page));
  await page.waitForTimeout(250);
  results[scenario.name] = await scenario.run(page);
  if (errors.length) results[scenario.name].pageErrors = errors;
  await page.close();
}

await browser.close();

/* ---------------- compare ---------------- */

if (update || !existsSync(GOLDEN_PATH)) {
  writeFileSync(GOLDEN_PATH, JSON.stringify(results, null, 2) + '\n', 'utf8');
  console.log(`Recorded golden results to ${path.relative(ROOT, GOLDEN_PATH)}`);
  for (const [name, r] of Object.entries(results)) {
    console.log(`  ${name.padEnd(10)} grand total ${r.grandTotal}`);
  }
  process.exit(0);
}

const golden = JSON.parse(readFileSync(GOLDEN_PATH, 'utf8'));
let failures = 0;

console.log('Golden quotation check\n');
for (const [name, actual] of Object.entries(results)) {
  const expected = golden[name];
  if (!expected) { console.log(`  ? ${name}: no golden entry - run with --update`); continue; }

  const diffs = [];
  for (const key of Object.keys(expected)) {
    if (key === 'pageErrors') continue;
    const a = actual[key], e = expected[key];
    const same = typeof a === 'number' && typeof e === 'number'
      ? Math.abs(a - e) < 0.01
      : a === e;
    if (!same) diffs.push(`      ${key}: expected ${e}, got ${a}`);
  }
  if (actual.pageErrors?.length) diffs.push(`      page errors: ${actual.pageErrors.join('; ')}`);

  if (diffs.length) {
    failures++;
    console.log(`  FAIL  ${name}`);
    diffs.forEach((d) => console.log(d));
  } else {
    console.log(`  ok    ${name.padEnd(10)} grand total ${actual.grandTotal}`);
  }
}

console.log('');
if (failures) {
  console.log(`${failures} tool(s) differ from the recorded golden numbers.`);
  console.log('If the change was intended, re-record with:  node tools/smoke.mjs --update');
  process.exit(1);
}
console.log('All tools match the recorded golden numbers.');
