/**
 * The single source of truth for "where does which catalog live".
 *
 * Both `extract-catalog.mjs` (code -> catalog.json) and `apply-prices.mjs`
 * (catalog.json -> code) read this file, so the two can never drift apart.
 *
 * category  groups products that are the same real-world thing across files
 * key       the field that identifies a product inside its list
 * fields    the fields rendered into that list, in order
 */

export const TARGETS = [
  /* ---------------- on-grid ---------------- */
  { path: 'on-grid/script.js', style: 'on-grid', list: 'inverterList',
    category: 'solar-inverter-ongrid', key: 'model',
    fields: ['model', 'capacityKw', 'warranty', 'price'] },
  { path: 'on-grid/script.js', style: 'on-grid', list: 'panelList',
    category: 'solar-panel', key: 'model',
    fields: ['model', 'watt', 'price'] },
  { path: 'on-grid/script.js', style: 'on-grid', list: 'acdbList',
    category: 'acdb', key: 'sku',
    fields: ['sku', 'desc', 'price'] },
  { path: 'on-grid/script.js', style: 'on-grid', list: 'dcdbList',
    category: 'dcdb', key: 'sku',
    fields: ['sku', 'desc', 'price'] },
  { path: 'on-grid/script.js', style: 'on-grid', list: 'meterOptions',
    category: 'meter', key: 'code',
    fields: ['code', 'label', 'price'] },

  /* ---------------- off-grid ---------------- */
  { path: 'off-grid/script.js', style: 'off-grid', list: 'inverterList',
    category: 'solar-inverter-offgrid', key: 'model',
    fields: ['model', 'price'] },
  { path: 'off-grid/script.js', style: 'off-grid', list: 'batteryList',
    category: 'battery-offgrid', key: 'model',
    fields: ['model', 'price'] },
  { path: 'off-grid/script.js', style: 'off-grid', list: 'panelList',
    category: 'solar-panel', key: 'model',
    fields: ['model', 'watt', 'price'] },
  { path: 'off-grid/script.js', style: 'off-grid', list: 'acdbList',
    category: 'acdb', key: 'sku',
    fields: ['sku', 'desc', 'price'] },
  { path: 'off-grid/script.js', style: 'off-grid', list: 'dcdbList',
    category: 'dcdb', key: 'sku',
    fields: ['sku', 'desc', 'price'] },

  /* ---------------- hybrid ---------------- */
  { path: 'hybrid/script.js', style: 'hybrid', list: 'inverterList',
    category: 'solar-inverter-hybrid', key: 'model',
    fields: ['model', 'price'] },
  { path: 'hybrid/script.js', style: 'hybrid', list: 'batteryList',
    category: 'battery-hybrid', key: 'model',
    fields: ['model', 'price'] },
  { path: 'hybrid/script.js', style: 'hybrid', list: 'panelList',
    category: 'solar-panel', key: 'model',
    fields: ['model', 'watt', 'price'] },
  { path: 'hybrid/script.js', style: 'hybrid', list: 'acdbList',
    category: 'acdb', key: 'sku',
    fields: ['sku', 'desc', 'price'] },
  { path: 'hybrid/script.js', style: 'hybrid', list: 'dcdbList',
    category: 'dcdb', key: 'sku',
    fields: ['sku', 'desc', 'price'] },

  /* ---------------- ups-b2b ---------------- */
  { path: 'ups-b2b/script.js', style: 'ups-b2b', list: 'upsCatalog',
    category: 'ups', key: 'id', fields: ['id', 'name', 'price', 'gst'] },
  { path: 'ups-b2b/script.js', style: 'ups-b2b', list: 'inverterCatalog',
    category: 'ups-inverter', key: 'id', fields: ['id', 'name', 'price', 'gst'] },
  { path: 'ups-b2b/script.js', style: 'ups-b2b', list: 'solarInverterCatalog',
    category: 'solar-inverter-ups', key: 'id', fields: ['id', 'name', 'price', 'gst'] },
  { path: 'ups-b2b/script.js', style: 'ups-b2b', list: 'batteryCatalog',
    category: 'battery-ups', key: 'id', fields: ['id', 'name', 'price', 'gst'] },
  { path: 'ups-b2b/script.js', style: 'ups-b2b', list: 'solarBatteryCatalog',
    category: 'battery-solar-ups', key: 'id', fields: ['id', 'name', 'price', 'gst'] },
  { path: 'ups-b2b/script.js', style: 'ups-b2b', list: 'epBatteryCatalog',
    category: 'battery-ep', key: 'id', fields: ['id', 'name', 'price', 'gst'] },
  { path: 'ups-b2b/script.js', style: 'ups-b2b', list: 'onlineUpsCatalog',
    category: 'ups-online', key: 'id', fields: ['id', 'name', 'price', 'gst'] },
  { path: 'ups-b2b/script.js', style: 'ups-b2b', list: 'trolleyCatalog',
    category: 'trolley', key: 'id', fields: ['id', 'name', 'price', 'gst'] },
];

/**
 * Non-list prices that still behave like catalog data.
 *
 * `pattern` is a REGEX. The replacement template may use:
 *   {VALUE} -> the new price
 *   $1,$2   -> capture groups from the pattern
 * Using a regex (rather than the literal old number) means a setting can be
 * re-applied after its price has already changed.
 */
export const SETTINGS = [
  { id: 'earthingSet', label: 'Earthing Set (Complete Kit)', price: 3000,
    js: [{ path: 'on-grid/script.js', pattern: 'const dealer = (\\d+);', value: 'const dealer = {VALUE};' },
         { path: 'off-grid/script.js', pattern: 'const dealer = (\\d+);', value: 'const dealer = {VALUE};' },
         { path: 'hybrid/script.js', pattern: 'const dealer = (\\d+);', value: 'const dealer = {VALUE};' }],
    html: [{ path: 'on-grid/index.html', pattern: '(id="earthingSetDealer" value=")(\\d+)', value: '$1{VALUE}' },
           { path: 'off-grid/index.html', pattern: '(id="earthingSetDealer" value=")(\\d+)', value: '$1{VALUE}' },
           { path: 'hybrid/index.html', pattern: '(id="earthingSetDealer" value=")(\\d+)', value: '$1{VALUE}' }] },

  { id: 'installationPerKw', label: 'Installation & Commissioning (per kW)', price: 5000,
    js: [{ path: 'on-grid/script.js', pattern: "(install(?:Base|Editable)'\\)\\.value = round2\\(kw \\* )(\\d+)", value: '$1{VALUE}' },
         { path: 'off-grid/script.js', pattern: "(install(?:Base|Editable)'\\)\\.value = round2\\(kw \\* )(\\d+)", value: '$1{VALUE}' },
         { path: 'hybrid/script.js', pattern: "(install(?:Base|Editable)'\\)\\.value = round2\\(kw \\* )(\\d+)", value: '$1{VALUE}' }],
    html: [] },

  { id: 'structurePerKw', label: 'Module Mounting Structure (per kW)', price: 8000,
    js: [{ path: 'on-grid/script.js', pattern: "(struct(?:Base|Editable)'\\)\\.value = round2\\(kw \\* )(\\d+)", value: '$1{VALUE}' },
         { path: 'off-grid/script.js', pattern: "(struct(?:Base|Editable)'\\)\\.value = round2\\(kw \\* )(\\d+)", value: '$1{VALUE}' },
         { path: 'hybrid/script.js', pattern: "(struct(?:Base|Editable)'\\)\\.value = round2\\(kw \\* )(\\d+)", value: '$1{VALUE}' }],
    html: [] },
];

/**
 * The bi-directional meter options live in HTML for hybrid but in JS for
 * on-grid. Same product, two homes - so it gets its own target type.
 */
export const HTML_SELECT_TARGETS = [
  { path: 'hybrid/index.html', style: 'hybrid', list: 'meterType',
    category: 'meter', key: 'code',
    fields: ['code', 'label', 'price'] },
];
