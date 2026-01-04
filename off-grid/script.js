/*******************************************************
 * off-grid/script.js
 * Rebuilt calculation + quotation engine for Off-Grid
 * Author: Generated for V-Sustain Solar Solutions
 *******************************************************/

/* ===========================
   1. DATASETS (editable)
   =========================== */

// OFF-GRID INVERTERS
const inverterList = [
  { model: "NXG 850E (NXG PWM)", price: 4135 },
  { model: "NXG 1150E (NXG PWM)", price: 5274 },
  { model: "NXG 1450E (NXG PWM)", price: 6375 },
  { model: "NXG 1850E (NXG PWM)", price: 7515 },
  { model: "NXG 2350 (NXG PWM)", price: 9527 },
  { model: "NXP 3500 (NXG PWM)", price: 13701 },
  { model: "NXP PRO 3500 (NXP PRO MPPT)", price: 22507 },
  { model: "SOLAR NXE 5KVA/48V (NXE PWM)", price: 30592 },
  { model: "NXG PRO 1KVA/12V (NXG MPPT)", price: 8946 },
  { model: "NXG PRO 1KVA/24V (NXG MPPT)", price: 8946 },
  { model: "SOLARVERTER 2KVA/24V (PWM)", price: 11177 },
  { model: "SOLARVERTER 3KVA/36V (PWM)", price: 16286 },
  { model: "SOLARVERTER 5KVA/48V (PWM)", price: 30592 },
  { model: "SOLARVERTER PRO 2KVA ECO (MPPT)", price: 16159 },
  { model: "SOLARVERTER PRO 3KVA ECO (MPPT)", price: 23778 },
  { model: "SOLARVERTER PRO 3.5KVA (MPPT)", price: 30701 },
  { model: "SOLARVERTER PRO 5KVA (MPPT)", price: 40666 },
  { model: "SOLARVERTER PRO 6KVA (MPPT)", price: 47247 },
  { model: "SOLARVERTER PRO 7.5KVA (MPPT)", price: 64266 },
  { model: "SOLARVERTER PRO 10.1KVA (MPPT)", price: 82817 }
];

// SOLAR PANELS (model / watt / dealer price)
const panelList = [
  { model: "POLY 170W/12V", watt: 170, price: 3815 },
  { model: "PV MOD LUM24550M DCR BI-TS EXWH31", watt: 550, price: 14025 },
  { model: "PV MOD LUM 24585T144 TCHC 144C EXWH31", watt: 585, price: 9694 },
  { model: "PV MOD LUM 24590T144 BI-TS-31", watt: 590, price: 9694 }
];

// SOLAR BATTERIES (Specific to Off-Grid)
const batteryList = [
  { model: "LPT 1240L (40Ah, 60M*)", price: 4300, voltage: 12 },
  { model: "LPT 1240H (40Ah, 72M*)", price: 4765, voltage: 12 },
  { model: "LPT 1280H (80Ah, 72M*)", price: 7587, voltage: 12 },
  { model: "LPTT 12100H (100Ah, 72M*)", price: 9370, voltage: 12 },
  { model: "LPTT12120H (120Ah, 72M*)", price: 10006, voltage: 12 },
  { model: "LPTT 12150L (150Ah, 60M*)", price: 11526, voltage: 12 },
  { model: "LPTT 12150H (150Ah, 72M*)", price: 12554, voltage: 12 },
  { model: "LPTT 12200L (200Ah, 60M*)", price: 15561, voltage: 12 },
  { model: "LPTT 12200H (200Ah, 72M*)", price: 16311, voltage: 12 }
];

// ACDB / DCDB
const acdbList = [
  { sku: "TSAD0AC32PH1", desc: "ACDB Single Phase 32 Amp", price: 1899.80 },
  { sku: "TSAD0AC63PH1", desc: "ACDB Single Phase 63 Amp", price: 2312.80 },
  { sku: "TSAD0AC40PH1", desc: "ACDB Single Phase 40 Amp", price: 2277.40 },
  { sku: "TSAD0AC32PH3", desc: "ACDB Three Phase 32 Amp", price: 4177.20 }
];

const dcdbList = [
  { sku: "TSADDC600V11", desc: "DCDB 1 In 1 Out With MCB", price: 1939.92 },
  { sku: "TSADDC600V22", desc: "DCDB 2 In 2 Out With Fuse", price: 2808.40 },
  { sku: "TSADDC600V21", desc: "DCDB 2 In 1 Out With MCB", price: 2997.20 }
];

// Meter Options
const meterOptions = [
  { code: "single", label: "Single Phase", price: 4500 },
  { code: "three", label: "Three Phase", price: 7500 }
];

/* ===========================
   2. HELPERS & FORMATTING
   =========================== */
const n = v => (isNaN(parseFloat(v)) ? 0 : parseFloat(v));
const round2 = v => Math.round((v + Number.EPSILON) * 100) / 100;
const fmt = v => {
  const num = n(v);
  return "₹" + num.toLocaleString("en-IN", { maximumFractionDigits: 2 });
};

function $(id) { return document.getElementById(id); }

/* ===========================
   3. INITIALIZATION
   =========================== */
window.addEventListener('DOMContentLoaded', () => {
  populateSelects();
  attachEventListeners();
  setInitialValues();
  recalcAllCards();
});

/* populate dropdowns */
function populateSelects() {
  const invSel = $('inverterModel');
  inverterList.forEach(inv => {
    const o = document.createElement('option');
    o.value = inv.model;
    o.dataset.price = inv.price;
    // Off-grid list doesn't always have capacityKw explicit in object, but for display:
    o.textContent = `${inv.model} — ${fmt(inv.price)}`;
    invSel.appendChild(o);
  });

  const panelSel = $('panelModel');
  panelList.forEach(p => {
    const o = document.createElement('option');
    o.value = p.model;
    o.dataset.watt = p.watt;
    o.dataset.price = p.price;
    o.textContent = `${p.model} — ${p.watt} W — ${fmt(p.price)}`;
    panelSel.appendChild(o);
  });

  // Battery Select (New)
  const battSel = $('batteryModel');
  batteryList.forEach(b => {
    const o = document.createElement('option');
    o.value = b.model;
    o.dataset.price = b.price;
    o.dataset.voltage = b.voltage;
    o.textContent = `${b.model} (${b.voltage}V) — ${fmt(b.price)}`;
    battSel.appendChild(o);
  });

  const acdbSel = $('acdbModel');
  acdbList.forEach(a => {
    const o = document.createElement('option');
    o.value = a.sku;
    o.dataset.price = a.price;
    o.textContent = `${a.desc} — ${fmt(a.price)}`;
    acdbSel.appendChild(o);
  });

  const dcdbSel = $('dcdbModel');
  dcdbList.forEach(d => {
    const o = document.createElement('option');
    o.value = d.sku;
    o.dataset.price = d.price;
    o.textContent = `${d.desc} — ${fmt(d.price)}`;
    dcdbSel.appendChild(o);
  });

  const meterSel = $('meterType');
  meterOptions.forEach(m => {
    const o = document.createElement('option');
    o.value = m.code;
    o.dataset.price = m.price;
    o.textContent = `${m.label} — ${fmt(m.price)}`;
    meterSel.appendChild(o);
  });
}

/* attach UI event handlers */
function attachEventListeners() {
  // System KW and common margin
  $('systemKw').addEventListener('input', () => { updateSystemDependent(); recalcAllCards(); });
  $('commonMargin').addEventListener('input', () => recalcAllCards());

  // Inverter
  $('inverterModel').addEventListener('change', updateInverterData);
  $('inverterQty').addEventListener('input', updateInverterData);
  $('inverterOverrideToggle').addEventListener('change', () => toggleOverrideUI('inverter'));
  $('inverterOverridePrice').addEventListener('input', updateInverterData);
  $('inverterUseCommonMargin').addEventListener('change', toggleCustomMarginInput.bind(null, 'inverter'));
  $('inverterCustomMargin').addEventListener('input', updateInverterData);

  // Panels - Updated listener for quantity input to allow manual editing
  $('panelModel').addEventListener('change', () => updatePanelData(false));
  $('panelQty').addEventListener('input', () => updatePanelData(true)); // Pass true for manual edit
  $('panelOverrideToggle').addEventListener('change', () => toggleOverrideUI('panel'));
  $('panelOverridePrice').addEventListener('input', () => updatePanelData(false)); // Recalc with new price
  $('panelsUseCommonMargin').addEventListener('change', toggleCustomMarginInput.bind(null, 'panels'));
  $('panelsCustomMargin').addEventListener('input', () => updatePanelData(false)); // Recalc with new margin

  // Battery (New)
  $('batteryModel').addEventListener('change', updateBatteryData);
  $('batteryQty').addEventListener('input', updateBatteryData);
  $('batteryOverrideToggle').addEventListener('change', () => toggleOverrideUI('battery'));
  $('batteryOverridePrice').addEventListener('input', updateBatteryData);
  $('batteryUseCommonMargin').addEventListener('change', toggleCustomMarginInput.bind(null, 'battery'));
  $('batteryCustomMargin').addEventListener('input', updateBatteryData);

  // Meter
  $('meterType').addEventListener('change', updateMeterData);
  $('meterQty').addEventListener('input', updateMeterData);
  $('meterOverrideToggle').addEventListener('change', () => toggleOverrideUI('meter'));
  $('meterOverridePrice').addEventListener('input', updateMeterData);
  $('meterUseCommonMargin').addEventListener('change', toggleCustomMarginInput.bind(null, 'meter'));
  $('meterCustomMargin').addEventListener('input', updateMeterData);

  // ACDB/DCDB
  $('acdbModel').addEventListener('change', updateACDBData);
  $('acdbQty').addEventListener('input', updateACDBData);
  $('acdbOverrideToggle').addEventListener('change', () => toggleOverrideUI('acdb'));
  $('acdbOverridePrice').addEventListener('input', updateACDBData);
  $('acdbUseCommonMargin').addEventListener('change', toggleCustomMarginInput.bind(null, 'acdb'));
  $('acdbCustomMargin').addEventListener('input', updateACDBData);

  $('dcdbModel').addEventListener('change', updateDCDBData);
  $('dcdbQty').addEventListener('input', updateDCDBData);
  $('dcdbOverrideToggle').addEventListener('change', () => toggleOverrideUI('dcdb'));
  $('dcdbOverridePrice').addEventListener('input', updateDCDBData);
  $('dcdbUseCommonMargin').addEventListener('change', toggleCustomMarginInput.bind(null, 'dcdb'));
  $('dcdbCustomMargin').addEventListener('input', updateDCDBData);

  // AC cable & Earth cable
  $('acCableQty').addEventListener('input', updateACCableData);
  $('acCablePrice').addEventListener('input', updateACCableData);
  $('earthCableQty').addEventListener('input', updateEarthCableData);
  $('earthCablePrice').addEventListener('input', updateEarthCableData);

  // LA, installation, structure
  $('laQty').addEventListener('input', updateLAData);
  $('laPrice').addEventListener('input', updateLAData);

  $('installEditable').addEventListener('input', updateInstallationData);
  $('installUseCommonMargin').addEventListener('change', toggleCustomMarginInput.bind(null,'installation'));
  $('installCustomMargin').addEventListener('input', updateInstallationData);

  $('structEditable').addEventListener('input', updateStructureData);
  $('structUseCommonMargin').addEventListener('change', toggleCustomMarginInput.bind(null,'structure'));
  $('structCustomMargin').addEventListener('input', updateStructureData);

   // Earthing Set
   $('earthingSetQty').addEventListener('input', updateEarthingSetData);
   $('earthingSetOverrideToggle').addEventListener('change', () => toggleOverrideUI('earthingSet'));
   $('earthingSetOverridePrice').addEventListener('input', updateEarthingSetData);
   $('earthingSetUseCommonMargin').addEventListener('change', toggleCustomMarginInput.bind(null, 'earthingSet'));
   $('earthingSetCustomMargin').addEventListener('input', updateEarthingSetData);
 

  // enable/disable products via header toggles
  ['inverter','panels','battery','meter','acdb','dcdb','acCable','earthCable','la','installation','structure', 'earthingSet'].forEach(pid => {
    const el = document.querySelector(`#${pid}Card input[type="checkbox"]`);
    if (el) el.addEventListener('change', () => recalcAllCards());
  });

  // custom product add
  // addCustomProduct defined later; button calls addCustomProduct()

  // quote buttons (functions defined later)
  // generateDetailedQuote() and generateSummaryQuote() will be global functions bound in HTML
}

/* set initial values for installation/structure base */
function setInitialValues() {
  const kw = Math.max(1, n($('systemKw').value) || 1);
  $('installBase').value = round2(kw * 5000);
  $('structBase').value = round2(kw * 8000);
  $('installEditable').value = round2(kw * 5000);
  $('structEditable').value = round2(kw * 8000);
}

/* update system dependent values (panel qty, base rates) */
function updateSystemDependent() {
  const kw = Math.max(0, n($('systemKw').value));
  if (kw > 0) {
    $('installBase').value = round2(kw * 5000);
    $('structBase').value = round2(kw * 8000);
    if (!n($('installEditable').value)) $('installEditable').value = round2(kw * 5000);
    if (!n($('structEditable').value)) $('structEditable').value = round2(kw * 8000);
  } else {
    $('installBase').value = '';
    $('structBase').value = '';
  }
}

/* ===========================
   4. CORE COMPUTATION HELPERS
   =========================== */

function getCommonMargin() {
  return Math.max(0, n($('commonMargin').value));
}

function toggleCustomMarginInput(sectionId) {
  const useCommon = $(`${sectionId}UseCommonMargin`) ? $(`${sectionId}UseCommonMargin`).checked : true;
  const customInp = $(`${sectionId}CustomMargin`);
  if (customInp) customInp.disabled = useCommon;
  recalcAllCards();
}

function toggleOverrideUI(sectionId) {
  const toggle = $(`${sectionId}OverrideToggle`);
  const overrideInput = $(`${sectionId}OverridePrice`);
  if (!toggle || !overrideInput) return;
  if (toggle.checked) {
    overrideInput.classList.remove('hidden');
    overrideInput.disabled = false;
  } else {
    overrideInput.classList.add('hidden');
    overrideInput.disabled = true;
    overrideInput.value = '';
  }
  recalcAllCards();
}

function toggleProduct(section) {
  // card's checkbox changed — recalc totals; HTML binds checkbox to on change
  recalcAllCards();
}

/* compute effective base price for a section (applies manual override if set) */
function computeBasePrice(sectionId, dealerPrice) {
  const overrideToggle = $(`${sectionId}OverrideToggle`);
  const overrideInput = $(`${sectionId}OverridePrice`);
  if (overrideToggle && overrideToggle.checked && overrideInput) {
    const v = n(overrideInput.value);
    if (v > 0) return v;
  }
  return dealerPrice;
}

/* apply margin (either common or custom) */
function applyMarginTo(base, sectionId) {
  const useCommonEl = $(`${sectionId}UseCommonMargin`);
  const customEl = $(`${sectionId}CustomMargin`);
  const common = getCommonMargin();
  if (useCommonEl && useCommonEl.checked) {
    return round2(base * (1 + common / 100));
  } else if (customEl && n(customEl.value) > 0) {
    return round2(base * (1 + n(customEl.value) / 100));
  } else {
    return round2(base);
  }
}

/* get GST percent for OFF-GRID items
   Panels => 5%
   Battery => 28%
   Inverter & Rest => 18%
*/
function getGstFor(type) {
  if (type === 'panels') return 5;
  if (type === 'battery') return 28; 
  return 18;
}

/* check if a section is enabled (header toggle) */
function isEnabled(sectionId) {
  const chk = $(`${sectionId}Card`) ? $(`${sectionId}Card`).querySelector('input[type="checkbox"]') : null;
  if (!chk) return true;
  return chk.checked;
}

/* ===========================
   5. CARD-SPECIFIC UPDATERS
   =========================== */

function updateInverterData() {
  if (!isEnabled('inverter')) {
    $('inverterDealer').value = '';
    $('inverterFinalRate').value = '';
    $('inverterGST').value = '';
    $('inverterTotal').value = '';
    return;
  }
  const sel = $('inverterModel');
  const opt = sel.selectedOptions[0];
  if (!opt) return;
  const dealer = n(opt.dataset.price);
  const qty = Math.max(1, n($('inverterQty').value));
  const base = computeBasePrice('inverter', dealer);
  const finalRate = applyMarginTo(base, 'inverter');
  const gstPct = getGstFor('inverter');
  const amount = round2(finalRate * qty);
  const gstAmt = round2(amount * gstPct / 100);
  const total = round2(amount + gstAmt);

  $('inverterDealer').value = round2(dealer);
  $('inverterFinalRate').value = round2(finalRate);
  $('inverterGST').value = gstAmt;
  $('inverterTotal').value = total;
}

// Updated function to handle manual quantity edits
function updatePanelData(manual = false) {
  if (!isEnabled('panels')) {
    $('panelDealer').value = '';
    $('panelFinalRate').value = '';
    $('panelQty').value = '';
    $('panelCapacity').value = '';
    $('panelGST').value = '';
    $('panelTotal').value = '';
    return;
  }
  const sel = $('panelModel');
  const opt = sel.selectedOptions[0];
  const kw = Math.max(0, n($('systemKw').value));
  if (!opt || !kw) {
    // clear
    $('panelQty').value = '';
    $('panelCapacity').value = '';
    $('panelDealer').value = '';
    $('panelFinalRate').value = '';
    $('panelGST').value = '';
    $('panelTotal').value = '';
    return;
  }

  const watt = n(opt.dataset.watt);
  const dealer = n(opt.dataset.price);

  let qty;
  if (manual) {
      qty = Math.max(0, n($('panelQty').value));
  } else {
      // total watt required = kw * 1000, qty = ceil(totalWatt / watt)
      const totalWatt = round2(kw * 1000);
      qty = Math.ceil(totalWatt / Math.max(1, watt));
      $('panelQty').value = qty;
  }
  
  const dcCapacityKw = round2((qty * watt) / 1000);

  // FIXED: computeBasePrice uses 'panel' (singular) to match input ID
  const base = computeBasePrice('panel', dealer);
  // Margin uses 'panels' (plural) to match input ID
  const finalRate = applyMarginTo(base, 'panels'); 
  const amount = round2(finalRate * qty);
  const gstPct = getGstFor('panels');
  const gstAmt = round2(amount * gstPct / 100);
  const total = round2(amount + gstAmt);

  $('panelCapacity').value = dcCapacityKw;
  $('panelDealer').value = round2(dealer);
  $('panelFinalRate').value = round2(finalRate);
  $('panelGST').value = gstAmt;
  $('panelTotal').value = total;
}

function updateBatteryData() {
  if (!isEnabled('battery')) {
    $('batteryDealer').value = '';
    $('batteryFinalRate').value = '';
    $('batteryGST').value = '';
    $('batteryTotal').value = '';
    return;
  }
  const sel = $('batteryModel');
  const opt = sel.selectedOptions[0];
  if (!opt) return;

  const dealer = n(opt.dataset.price);
  const qty = Math.max(1, n($('batteryQty').value));
  
  const base = computeBasePrice('battery', dealer);
  const finalRate = applyMarginTo(base, 'battery');
  const gstPct = getGstFor('battery'); // 28%
  const amount = round2(finalRate * qty);
  const gstAmt = round2(amount * gstPct / 100);
  const total = round2(amount + gstAmt);

  $('batteryDealer').value = round2(dealer);
  $('batteryFinalRate').value = round2(finalRate);
  $('batteryGST').value = gstAmt;
  $('batteryTotal').value = total;
}

function updateMeterData() {
  if (!isEnabled('meter')) {
    $('meterDealer').value = '';
    $('meterTotal').value = '';
    $('meterGST').value = '';
    return;
  }
  const sel = $('meterType');
  const opt = sel.selectedOptions[0];
  if (!opt) return;
  const dealer = n(opt.dataset.price);
  const qty = Math.max(1, n($('meterQty').value));
  const base = computeBasePrice('meter', dealer);
  const finalRate = applyMarginTo(base, 'meter');
  const amount = round2(finalRate * qty);
  const gstPct = getGstFor('meter');
  const gstAmt = round2(amount * gstPct / 100);
  const total = round2(amount + gstAmt);

  $('meterDealer').value = round2(dealer);
  $('meterGST').value = gstAmt;
  $('meterTotal').value = total;
}

function updateACDBData() {
  if (!isEnabled('acdb')) {
    $('acdbDealer').value = '';
    $('acdbTotal').value = '';
    $('acdbGST').value = '';
    return;
  }
  const sel = $('acdbModel');
  const opt = sel.selectedOptions[0];
  if (!opt) return;
  const dealer = n(opt.dataset.price);
  const qty = Math.max(1, n($('acdbQty').value));
  const base = computeBasePrice('acdb', dealer);
  const finalRate = applyMarginTo(base, 'acdb');
  const amount = round2(finalRate * qty);
  const gstPct = getGstFor('acdb');
  const gstAmt = round2(amount * gstPct / 100);
  const total = round2(amount + gstAmt);

  $('acdbDealer').value = round2(dealer);
  $('acdbGST').value = gstAmt;
  $('acdbTotal').value = total;
}

function updateDCDBData() {
  if (!isEnabled('dcdb')) {
    $('dcdbDealer').value = '';
    $('dcdbTotal').value = '';
    $('dcdbGST').value = '';
    return;
  }
  const sel = $('dcdbModel');
  const opt = sel.selectedOptions[0];
  if (!opt) return;
  const dealer = n(opt.dataset.price);
  const qty = Math.max(1, n($('dcdbQty').value));
  const base = computeBasePrice('dcdb', dealer);
  const finalRate = applyMarginTo(base, 'dcdb');
  const amount = round2(finalRate * qty);
  const gstPct = getGstFor('dcdb');
  const gstAmt = round2(amount * gstPct / 100);
  const total = round2(amount + gstAmt);

  $('dcdbDealer').value = round2(dealer);
  $('dcdbGST').value = gstAmt;
  $('dcdbTotal').value = total;
}

function updateACCableData() {
  if (!isEnabled('acCable')) {
    $('acCableTotal').value = '';
    return;
  }
  const qty = Math.max(0, n($('acCableQty').value));
  const price = Math.max(0, n($('acCablePrice').value));
  if (!qty || !price) {
    $('acCableTotal').value = '';
    return;
  }
  const base = computeBasePrice('acCable', price);
  const finalRate = applyMarginTo(base, 'acCable');
  const amount = round2(finalRate * qty);
  const gstPct = getGstFor('acCable');
  const gstAmt = round2(amount * gstPct / 100);
  const total = round2(amount + gstAmt);
  $('acCableTotal').value = total;
}

function updateEarthCableData() {
  if (!isEnabled('earthCable')) {
    $('earthCableTotal').value = '';
    return;
  }
  const qty = Math.max(0, n($('earthCableQty').value));
  const price = Math.max(0, n($('earthCablePrice').value));
  if (!qty || !price) {
    $('earthCableTotal').value = '';
    return;
  }
  const base = computeBasePrice('earthCable', price);
  const finalRate = applyMarginTo(base, 'earthCable');
  const amount = round2(finalRate * qty);
  const gstPct = getGstFor('earthCable');
  const gstAmt = round2(amount * gstPct / 100);
  const total = round2(amount + gstAmt);
  $('earthCableTotal').value = total;
}

function updateLAData() {
  if (!isEnabled('la')) {
    $('laTotal').value = '';
    return;
  }
  const qty = Math.max(0, n($('laQty').value));
  const price = Math.max(0, n($('laPrice').value));
  if (!qty || !price) {
    $('laTotal').value = '';
    return;
  }
  const base = computeBasePrice('la', price);
  const finalRate = applyMarginTo(base, 'la');
  const amount = round2(finalRate * qty);
  const gstPct = getGstFor('la');
  const gstAmt = round2(amount * gstPct / 100);
  const total = round2(amount + gstAmt);
  $('laTotal').value = total;
}

function updateInstallationData() {
  if (!isEnabled('installation')) {
    $('installGST').value = '';
    $('installTotal').value = '';
    return;
  }
  const qty = Math.max(0, n($('systemKw').value));
  const baseDealer = Math.max(0, n($('installEditable').value));
  if (!qty || !baseDealer) {
    $('installGST').value = '';
    $('installTotal').value = '';
    return;
  }
  const base = computeBasePrice('installation', baseDealer);
  const finalRate = applyMarginTo(base, 'installation'); // rate per kW
  const amount = round2(finalRate * qty);
  const gstPct = getGstFor('installation');
  const gstAmt = round2(amount * gstPct / 100);
  const total = round2(amount + gstAmt);
  $('installGST').value = gstAmt;
  $('installTotal').value = total;
}

function updateStructureData() {
  if (!isEnabled('structure')) {
    $('structGST').value = '';
    $('structTotal').value = '';
    return;
  }
  const qty = Math.max(0, n($('systemKw').value));
  const baseDealer = Math.max(0, n($('structEditable').value));
  if (!qty || !baseDealer) {
    $('structGST').value = '';
    $('structTotal').value = '';
    return;
  }
  const base = computeBasePrice('structure', baseDealer);
  const finalRate = applyMarginTo(base, 'structure'); // rate per kW
  const amount = round2(finalRate * qty);
  const gstPct = getGstFor('structure');
  const gstAmt = round2(amount * gstPct / 100);
  const total = round2(amount + gstAmt);
  $('structGST').value = gstAmt;
  $('structTotal').value = total;
}

/* Update Earthing Set (Complete Kit) */
function updateEarthingSetData() {
  if (!isEnabled('earthingSet')) {
    $('earthingSetGST').value = '';
    $('earthingSetTotal').value = '';
    return;
  }
  // Dealer price fixed at 3000 (editable if needed in code, but UI shows 3000)
  const dealer = 3000;
  const qty = Math.max(1, n($('earthingSetQty').value));

  // Base logic
  const base = computeBasePrice('earthingSet', dealer);
  const finalRate = applyMarginTo(base, 'earthingSet');

  const amount = round2(finalRate * qty);
  // GST 18%
  const gstPct = 18; 
  const gstAmt = round2(amount * gstPct / 100);
  const total = round2(amount + gstAmt);

  // Update UI (if these IDs exist in HTML)
  const elDealer = $('earthingSetDealer');
  if(elDealer) elDealer.value = round2(dealer);

  const elGst = $('earthingSetGST');
  if(elGst) elGst.value = gstAmt;

  const elTotal = $('earthingSetTotal');
  if(elTotal) elTotal.value = total;
}

/* recalc all cards */
function recalcAllCards() {
  updateInverterData();
  // Pass false to ensure standard logic on global recalc, but inputs will trigger with true
  updatePanelData(false); 
  updateBatteryData();
  updateMeterData();
  updateACDBData();
  updateDCDBData();
  updateACCableData();
  updateEarthCableData();
  updateLAData();
  updateInstallationData();
  updateStructureData();
  updateCustomProductsPreview(); // updates any visible UI for custom products
  updateEarthingSetData();
}

/* ===========================
   6. CUSTOM PRODUCTS
   =========================== */

function addCustomProduct() {
  const list = $('customProductList');
  const idx = list.children.length + 1;
  const row = document.createElement('div');
  row.className = 'custom-row';
  row.dataset.idx = idx;
  row.innerHTML = `
    <div class="row small">
      <div class="col"><input type="text" class="cp-name" placeholder="Product name"/></div>
      <div class="col"><input type="number" class="cp-qty" placeholder="Qty" value="1" min="1"/></div>
      <div class="col"><input type="number" class="cp-price" placeholder="Price" /></div>
      <div class="col"><label class="switch-small"><input type="checkbox" class="cp-use-common" checked><span class="slider-small round"></span></label></div>
      <div class="col"><input type="number" class="cp-custom-margin" placeholder="Margin %" disabled /></div>
      <div class="col"><input type="number" class="cp-gst" placeholder="GST %" value="18" /></div>
      <div class="col"><button class="btn danger" onclick="removeCustomProduct(this)">Delete</button></div>
    </div>
  `;
  list.appendChild(row);

  // wire events
  row.querySelector('.cp-use-common').addEventListener('change', (e) => {
    const cm = row.querySelector('.cp-custom-margin');
    cm.disabled = e.target.checked;
    recalcAllCards();
  });
  row.querySelector('.cp-qty').addEventListener('input', recalcAllCards);
  row.querySelector('.cp-price').addEventListener('input', recalcAllCards);
  row.querySelector('.cp-custom-margin').addEventListener('input', recalcAllCards);
  row.querySelector('.cp-gst').addEventListener('input', recalcAllCards);
}

function removeCustomProduct(btn) {
  const row = btn.closest('.custom-row');
  if (row) {
    row.remove();
    recalcAllCards();
  }
}

function updateCustomProductsPreview() {
  // No preview UI currently required, but this is placeholder for if you want to show totals per custom product
}

/* Build custom items for invoice */
function gatherCustomItems() {
  const items = [];
  document.querySelectorAll('.custom-row').forEach(row => {
    const name = row.querySelector('.cp-name').value || 'Custom Item';
    const qty = Math.max(0, n(row.querySelector('.cp-qty').value));
    const price = Math.max(0, n(row.querySelector('.cp-price').value));
    if (!qty || !price) return;
    const useCommon = row.querySelector('.cp-use-common').checked;
    const customMargin = n(row.querySelector('.cp-custom-margin').value);
    const gstInput = row.querySelector('.cp-gst');
    const gstPct = gstInput ? n(gstInput.value) : 18; // Read per-row GST or default 18

    let rate = price;
    if (useCommon) {
      rate = round2(price * (1 + getCommonMargin()/100));
    } else if (customMargin > 0) {
      rate = round2(price * (1 + customMargin/100));
    }
    items.push({
      type: 'custom',
      item: name,
      desc: '',
      qty,
      unit: 'Nos',
      baseRate: rate,
      gstPercent: gstPct
    });
  });
  return items;
}

/* ===========================
   7. BUILD LINE ITEMS & TOTALS
   =========================== */

function buildLineItemsForQuotation() {
  const items = [];

  // inverter
  if (isEnabled('inverter')) {
    const sel = $('inverterModel').selectedOptions[0];
    if (sel) {
      const qty = Math.max(1, n($('inverterQty').value));
      const dealer = n(sel.dataset.price);
      const base = computeBasePrice('inverter', dealer);
      const rate = applyMarginTo(base, 'inverter');
      items.push({
  type: 'inverter',
  item: sel.value,
  desc: `Off-Grid Inverter`, // Slightly clearer description for off-grid
  qty,
  unit: 'Nos',
  baseRate: rate,
  gstPercent: getGstFor('inverter')
});
    }
  }

  // panels
  if (isEnabled('panels')) {
    const sel = $('panelModel').selectedOptions[0];
    if (sel) {
      const qty = Math.max(0, n($('panelQty').value));
      const dealer = n(sel.dataset.price);
      const base = computeBasePrice('panels', dealer);
      const rate = applyMarginTo(base, 'panels');
      items.push({
  type: 'panels',
  item: sel.value,
  desc: `${sel.dataset.watt} Wp`, // Using simple watt description
  qty,
  unit: 'Nos',
  baseRate: rate,
  gstPercent: getGstFor('panels')
});
    }
  }

  // battery (Off-Grid Specific)
  if (isEnabled('battery')) {
    const sel = $('batteryModel').selectedOptions[0];
    if (sel) {
      const qty = Math.max(1, n($('batteryQty').value));
      const dealer = n(sel.dataset.price);
      const base = computeBasePrice('battery', dealer);
      const rate = applyMarginTo(base, 'battery');
      items.push({
        type: 'battery',
        item: sel.value,
        desc: `${sel.dataset.voltage}V Battery`,
        qty,
        unit: 'Nos',
        baseRate: rate,
        gstPercent: getGstFor('battery')
      });
    }
  }

  // meter
  if (isEnabled('meter')) {
    const sel = $('meterType').selectedOptions[0];
    if (sel) {
      const qty = Math.max(1, n($('meterQty').value));
      const dealer = n(sel.dataset.price);
      const base = computeBasePrice('meter', dealer);
      const rate = applyMarginTo(base, 'meter');
      items.push({
  type: 'meter',
  item: 'Bi-Directional Meter',
  desc: sel.value === 'single' ? 'Single Phase' : 'Three Phase',
  qty,
  unit: 'Nos',
  baseRate: rate,
  gstPercent: getGstFor('meter')
});
    }
  }

  // ACDB
  if (isEnabled('acdb')) {
    const sel = $('acdbModel').selectedOptions[0];
    if (sel) {
      const qty = Math.max(1, n($('acdbQty').value));
      const dealer = n(sel.dataset.price);
      const base = computeBasePrice('acdb', dealer);
      const rate = applyMarginTo(base, 'acdb');
      items.push({ type:'acdb', item: sel.value, desc: sel.value, qty, unit:'Nos', baseRate: rate, gstPercent: getGstFor('acdb') });
    }
  }

  // DCDB
  if (isEnabled('dcdb')) {
    const sel = $('dcdbModel').selectedOptions[0];
    if (sel) {
      const qty = Math.max(1, n($('dcdbQty').value));
      const dealer = n(sel.dataset.price);
      const base = computeBasePrice('dcdb', dealer);
      const rate = applyMarginTo(base, 'dcdb');
      items.push({ type:'dcdb', item: sel.value, desc: sel.value, qty, unit:'Nos', baseRate: rate, gstPercent: getGstFor('dcdb') });
    }
  }

  // AC cable
  if (isEnabled('acCable')) {
    const qty = Math.max(0, n($('acCableQty').value));
    const price = Math.max(0, n($('acCablePrice').value));
    if (qty && price) {
      const base = computeBasePrice('acCable', price);
      const rate = applyMarginTo(base, 'acCable');
      items.push({ type:'acCable', item: 'AC Cable', desc: $('acCableGauge').value || '', qty, unit: 'Mtr', baseRate: rate, gstPercent: getGstFor('acCable') });
    }
  }

  // Earth cable
  if (isEnabled('earthCable')) {
    const qty = Math.max(0, n($('earthCableQty').value));
    const price = Math.max(0, n($('earthCablePrice').value));
    if (qty && price) {
      const base = computeBasePrice('earthCable', price);
      const rate = applyMarginTo(base, 'earthCable');
      items.push({ type:'earthCable', item: 'Earthing Cable', desc: $('earthCableGauge').value || '', qty, unit: 'Mtr', baseRate: rate, gstPercent: getGstFor('earthCable') });
    }
  }

  // Lightning arrestor
  if (isEnabled('la')) {
    const qty = Math.max(0, n($('laQty').value));
    const price = Math.max(0, n($('laPrice').value));
    if (qty && price) {
      const base = computeBasePrice('la', price);
      const rate = applyMarginTo(base, 'la');
      items.push({ type:'la', item: 'Lightning Arrestor', desc:'', qty, unit:'Nos', baseRate: rate, gstPercent: getGstFor('la') });
    }
  }

   // Earthing Set
if (isEnabled('earthingSet')) {
  const qty = Math.max(1, n($('earthingSetQty').value));
  const dealer = 3000;
  const base = computeBasePrice('earthingSet', dealer);
  const rate = applyMarginTo(base, 'earthingSet');

  items.push({
    type: 'earthingSet',
    item: 'Earthing Set',
    desc: 'Earthing Set (Complete Kit)',
    qty,
    unit: 'Nos',
    baseRate: rate,
    gstPercent: 18
  });
}

  // installation
  if (isEnabled('installation')) {
    const qty = Math.max(0, n($('systemKw').value));
    const baseDealer = Math.max(0, n($('installEditable').value));
    if (qty && baseDealer) {
      const base = computeBasePrice('installation', baseDealer);
      const rate = applyMarginTo(base, 'installation');
      items.push({ type:'installation', item: 'Installation & Commissioning', desc:'Installation services', qty, unit:'kW', baseRate: rate, gstPercent: getGstFor('installation') });
    }
  }

  // structure
  if (isEnabled('structure')) {
    const qty = Math.max(0, n($('systemKw').value));
    const baseDealer = Math.max(0, n($('structEditable').value));
    if (qty && baseDealer) {
      const base = computeBasePrice('structure', baseDealer);
      const rate = applyMarginTo(base, 'structure');
      items.push({ type:'structure', item: 'Module Mounting Structure', desc:'Structure for PV modules', qty, unit:'kW', baseRate: rate, gstPercent: getGstFor('structure') });
    }
  }

  // custom products
  const customItems = gatherCustomItems();
  customItems.forEach(ci => items.push(ci));

  return items;
}

/* calculate totals */
function calcTotals() {
  const items = buildLineItemsForQuotation();
  let subtotal = 0;
  let totalGst = 0;
  items.forEach(it => {
    const amount = round2(it.baseRate * it.qty);
    const gstAmt = round2(amount * it.gstPercent / 100);
    subtotal = round2(subtotal + amount);
    totalGst = round2(totalGst + gstAmt);
  });
  const grandTotal = round2(subtotal + totalGst);

  // subsidy logic for OFF-GRID - generally 0
  const subsidy = 0;

  return { items, subtotal, totalGst, grandTotal, subsidy };
}

/* ===========================
   8. QUOTATION HTML (Detailed & Summary)
   =========================== */

function generateDetailedQuote() {
  const totals = calcTotals();
  const html = buildDetailedQuotationHtml(totals, 'Off-Grid');
  openInNewWindow(html);
}

function generateSummaryQuote() {
  const totals = calcTotals();
  const html = buildSummaryQuotationHtml(totals, 'Off-Grid');
  openInNewWindow(html);
}

function generateShortQuote() {
  const totals = calcTotals();
  const html = buildShortQuotationHtml(totals, 'Off-Grid');
  openInNewWindow(html);
}

/* REPLACED WITH NEW DESIGN */
function buildDetailedQuotationHtml(totals, systemType) {
  const plantKw = Math.max(0, n($('systemKw').value));
  const customerName = $('customerName')?.value || 'Customer Name';
  const customerAddress = $('customerAddress')?.value || 'Bengaluru';
  const customerCity = $('customerCity')?.value || '';
  const customerEmail = $('customerEmail')?.value || '';
  const date = new Date();
  const proposalDate = date.toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' });
  const proposalNo = `VS/${date.getFullYear()}/001`;

  // Off-grid usually doesn't have subsidy, but code structure kept similar
  const isSubsidyYes = false; 

  /* ===============================
     1. SYSTEM SPECIFICATION ROWS
     Matches Green header style from user design
     Columns: Component | Description | Make | Qty | UoM
     =============================== */
  const specRows = totals.items.map(it => `
    <tr class="odd:bg-white/50 even:bg-gray-50/50">
      <td class="p-2 border font-semibold">${it.item}</td>
      <td class="p-2 border">${it.desc || '-'}</td>
      <td class="p-2 border">Luminous / Standard</td>
      <td class="p-2 border text-center">${it.qty}</td>
      <td class="p-2 border text-center">${it.unit}</td>
    </tr>
  `).join('');

  /* ===============================
     2. COMMERCIAL TABLE ROWS
     Matches Blue header style from user design
     Columns: # | Description | UOM | Qty | Price (INR)
     User design shows Price column. We will put the Base Amount (Qty*Rate) there.
     Then add GST rows at bottom.
     =============================== */
  const commercialRows = totals.items.map((it, idx) => {
    const amount = round2(it.qty * it.baseRate);
    return `
      <tr class="odd:bg-white/50 even:bg-gray-50/50">
        <td class="p-3 border text-center">${idx + 1}</td>
        <td class="p-3 border">${it.item}</td>
        <td class="p-3 border text-center">${it.unit}</td>
        <td class="p-3 border text-center">${it.qty}</td>
        <td class="p-3 border text-right">${fmt(amount)}</td>
      </tr>
    `;
  }).join('');

  // Add GST and Grand Total rows
  const footerRows = `
    <tr class="bg-white/50">
      <td class="p-3 border"></td>
      <td class="p-3 border text-right font-semibold">Total GST</td>
      <td class="p-3 border"></td>
      <td class="p-3 border"></td>
      <td class="p-3 border text-right">${fmt(totals.totalGst)}</td>
    </tr>
    <tr class="bg-blue-50/80 font-bold border-t-2 border-brand-blue">
      <td class="p-4 border"></td>
      <td class="p-4 border text-right text-base" colspan="3">GRAND TOTAL (INR)</td>
      <td class="p-4 border text-right text-xl text-brand-blue">${fmt(totals.grandTotal)}</td>
    </tr>
  `;

  // Use standard On-Grid "getCommonHtml" structure logic here manually to ensure 100% match
  // I will embed the full HTML structure directly as requested to be a replica

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${plantKw}KW Offgrid ${customerName}${customerEmail ? ' ' + customerEmail : ''}</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- Font Awesome for Icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', 'sans-serif'],
                    },
                    colors: {
                        brand: {
                            blue: '#005bac', // Primary Blue
                            lightBlue: '#4fa8e0',
                            orange: '#ff9933', // Accent Orange
                            green: '#8cc63f', // Green for sustainability
                            greenDark: '#7ab82e',
                            gray: '#f3f4f6',
                        }
                    },
                    boxShadow: {
                        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    }
                }
            }
        }
    </script>
    <style>
        /* Print styles to ensure one section per page */
        @media print {
            .page-break { 
                page-break-before: always; 
                break-before: page; 
            }
            body {
                background: white;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }
            .page-container {
                box-shadow: none;
                margin: 0;
                width: 210mm;
                height: 297mm; /* Strict A4 Height */
                max-height: 297mm;
                overflow: hidden; /* Strict overflow hidden */
                border: none;
            }
            /* Remove edit capability visual cues when printing */
            [contenteditable="true"] {
                outline: none;
            }
            .no-print { display: none !important; }

            /* Mobile Print Specifics */
            body.print-mobile .page-container {
                transform: scale(0.92); /* Shrink slightly to fit mobile viewports */
                transform-origin: top left;
                width: 108%; /* Compensate width */
                height: auto;
                overflow: visible; /* Allow flow but controlled by scale */
                page-break-after: always;
            }
            
            /* Laptop Mode: Reset to allow user control */
            body.print-laptop .page-container {
                width: 100%;
                height: auto;
                overflow: visible;
                max-height: none;
            }
        }

        body {
            background-color: #e5e7eb; /* Light gray background for web view */
        }

        .page-container {
            /* Applied the custom background image here */
            background-color: white; /* Fallback */
            background-image: url('https://github.com/Abhishekcodeking01/v-solar-quote/blob/8f2c0c796ba02307c87dda837a906dc9c079aa05/Uplodes/background%20v%20solar.png?raw=true');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            
            width: 210mm; /* A4 width */
            min-height: 297mm; /* A4 height */
            margin: 2rem auto;
            position: relative;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        /* Decorative Shapes using CSS Clip-path */
        .wave-top {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 200px;
            background: #005bac;
            clip-path: polygon(0 0, 100% 0, 100% 60%, 50% 100%, 0 60%);
            z-index: 10;
        }
        
        .wave-top-accent {
            position: absolute;
            top: 0;
            left: 0;
            width: 80%;
            height: 180px;
            background: #ff9933;
            clip-path: polygon(0 0, 100% 0, 80% 100%, 0 80%);
            z-index: 5;
        }

        .wave-corner-top-left {
            position: absolute;
            top: 0;
            left: 0;
            width: 60%;
            height: 250px;
            background-image: linear-gradient(135deg, #005bac 0%, #4fa8e0 100%);
            border-bottom-right-radius: 100% 50%;
            z-index: 10;
        }
        
        .wave-corner-top-left-accent {
            position: absolute;
            top: 0;
            left: 0;
            width: 62%;
            height: 270px;
            background: #ff9933;
            border-bottom-right-radius: 100% 50%;
            z-index: 5;
        }

        /* Bottom Pattern */
        .dots-pattern {
            background-image: radial-gradient(#4fa8e0 1px, transparent 1px);
            background-size: 10px 10px;
            width: 150px;
            height: 100px;
            position: absolute;
            opacity: 0.5;
        }

        .logo-placeholder {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }

        /* Highlight editable areas slightly on hover in web view */
        [contenteditable="true"]:hover {
            background-color: rgba(254, 249, 195, 0.8); /* Light yellow with transparency */
            cursor: text;
            outline: 1px dashed #ccc;
        }
        
        /* Ensure background image shows through but text is readable. 
           Using semi-transparent white backgrounds on cards/content if needed. */
        .content-card-bg {
            background-color: rgba(255, 255, 255, 0.9);
        }
    </style>
    <script>
        function printMode(mode) {
            document.body.className = 'font-sans text-gray-800'; // Reset
            if (mode === 'mobile') {
                document.body.classList.add('print-mobile');
                window.print();
            } else if (mode === 'laptop') {
                document.body.classList.add('print-laptop');
                // Give user control by simply calling print, but with laptop-specific reset style
                window.print();
            }
        }
    </script>
</head>
<body class="font-sans text-gray-800">

    <!-- FLOATING PRINT BUTTONS -->
    <div class="fixed bottom-8 right-8 z-50 no-print flex flex-col gap-3">
        <button onclick="printMode('laptop')" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-2xl flex items-center gap-2 transition-all transform hover:scale-105">
            <i class="fas fa-laptop text-xl"></i> Print (Laptop)
        </button>
        <button onclick="printMode('mobile')" class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-2xl flex items-center gap-2 transition-all transform hover:scale-105">
            <i class="fas fa-mobile-alt text-xl"></i> Print (Mobile)
        </button>
    </div>

    <!-- PAGE 1: COVER -->
    <div class="page-container relative flex flex-col justify-between">
        <!-- Header Design (Reduced Height to 13% and Padding to p-2) -->
        <div class="h-[13%] w-full flex justify-between items-start p-2 relative z-20 bg-white/90">
             <!-- Logo (TOP LEFT) -->
             <div class="w-36">
                <img src="https://github.com/Abhishekcodeking01/v-solar-quote/blob/9ae39ab1ba9eb2eedc38678b5d67f65a93283d84/Uplodes/v%20sustain%20logo.png?raw=true" alt="V Sustain Logo" class="w-full object-contain">
            </div>

            <!-- Header Text -->
            <div class="text-right text-brand-blue">
                <h2 class="font-bold text-xl">V-Sustain Solar Solutions</h2>
                <p class="text-sm">Authorized Luminous Partner</p>
                <p class="text-sm">Bengaluru</p>
                <p class="text-sm mt-1 font-bold">Proposal No: ${proposalNo}</p>
                <p class="text-sm">${proposalDate}</p>
            </div>
        </div>

        <!-- Main Image Area (Reduced to 45% height) -->
        <div class="h-[45%] w-full overflow-hidden relative">
            <img src="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2072&auto=format&fit=crop" alt="Solar Panels" class="w-full h-full object-cover">
            
            <!-- 2025 Badge -->
            <div class="absolute top-0 right-16 bg-brand-orange text-white font-bold text-2xl py-4 px-3 shadow-lg" style="clip-path: polygon(0% 0%, 100% 0%, 100% 85%, 50% 100%, 0% 85%);">
                2025
            </div>
        </div>

        <!-- Footer Dark Blue Block (Increased to 42% to balance layout) -->
        <div class="h-[42%] w-full bg-[#001f3f] text-white p-12 flex flex-col justify-center relative overflow-hidden">
            <!-- Decorative Dots -->
            <div class="dots-pattern bottom-20 left-10"></div>
            <div class="dots-pattern bottom-20 right-10"></div>

            <div class="relative z-10 border-l-4 border-brand-lightBlue pl-6">
                <h1 class="text-4xl font-bold mb-2">Techno-commercial</h1>
                <h1 class="text-4xl font-bold mb-8">Offer</h1>
                
                <div class="space-y-1">
                    <h3 class="text-xl font-bold">${plantKw} KW Off-Grid Solar</h3>
                    <h3 class="text-xl font-bold border-b border-gray-500 pb-2 mb-2 w-1/2">Solution</h3>
                    <p class="text-xl text-gray-300">Proposal for</p>
                    <p class="text-2xl font-semibold">${customerName}</p>
                    <p class="text-lg text-gray-300">${customerCity || 'Bengaluru'}</p>
                </div>
            </div>
        </div>
    </div>

    <!-- PAGE 2: PROJECT EXPLANATION -->
    <div class="page-container page-break relative">
        <!-- Header Shape -->
        <div class="wave-corner-top-left-accent h-[150px]"></div>
        <div class="wave-corner-top-left h-[130px]"></div>
        
        <!-- Logo (TOP RIGHT) -->
        <div class="absolute top-8 right-8 z-30 w-32">
            <img src="https://github.com/Abhishekcodeking01/v-solar-quote/blob/9ae39ab1ba9eb2eedc38678b5d67f65a93283d84/Uplodes/v%20sustain%20logo.png?raw=true" alt="V Sustain Logo" class="w-full object-contain">
        </div>

        <!-- Content Container -->
        <div class="relative z-20 pt-40 px-12 pb-12 flex flex-col h-full justify-between">
            
            <div>
                <!-- Header -->
                <div class="flex items-center gap-3 mb-8">
                    <i class="far fa-arrow-alt-circle-right text-3xl text-brand-blue"></i>
                    <h2 class="text-3xl font-bold text-brand-blue">Project Explanation</h2>
                </div>
                
                <!-- DIAGRAM (Reduced Height to 350px) -->
                <div class="flex items-center justify-center mb-8 relative h-[350px]">
                    <img src="https://github.com/Abhishekcodeking01/v-solar-quote/blob/d2ac544338d64714fdc75e8008f2a733bb61ab83/Uplodes/on%20grid%20plannnt%20explained.png?raw=true" alt="On Grid Plant Explained" class="h-full w-full object-contain shadow-lg rounded-lg bg-white/50">
                </div>

                <!-- Project Details - Centered and Enlarged -->
                <div class="space-y-6 bg-white/90 p-8 rounded-xl shadow-lg border-l-4 border-brand-green">
                    <div>
                        <h4 class="font-bold text-2xl mb-2 text-brand-blue flex items-center gap-2">
                            <i class="fas fa-solar-panel"></i> ${plantKw} KW Off-Grid Solution
                        </h4>
                        <ul class="list-none space-y-1 text-gray-700 ml-2">
                            <li class="flex items-center gap-2"><i class="fas fa-check text-brand-green"></i> Residential Solar System</li>
                            <li class="flex items-center gap-2"><i class="fas fa-check text-brand-green"></i> Battery Backup Included</li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 class="font-bold text-2xl mb-2 text-brand-blue flex items-center gap-2">
                             <i class="fas fa-map-marker-alt"></i> Location
                        </h4>
                        <p class="text-gray-700 ml-2 text-lg">${customerAddress} ${customerCity}</p>
                    </div>

                    <div>
                        <h4 class="font-bold text-2xl mb-2 text-brand-blue flex items-center gap-2">
                             <i class="fas fa-calendar-alt"></i> Validity
                        </h4>
                        <p class="text-gray-700 ml-2">Quotation is valid for <span class="font-bold text-brand-orange">15 Days</span> from the date of submission.</p>
                    </div>
                </div>
            </div>

            <!-- Bottom Right Image -->
            <div class="self-end w-[250px] h-[250px] overflow-hidden rounded-full border-4 border-white shadow-2xl z-10 mt-4 translate-x-12 translate-y-12">
                <img src="https://images.unsplash.com/photo-1624397640148-949b1732bb0a?q=80&w=2000&auto=format&fit=crop" alt="Aerial Solar" class="w-full h-full object-cover">
           </div>
        </div>
    </div>

    <!-- PAGE 3: TECHNO-COMMERCIAL OFFER (SYSTEM SPECS ONLY) -->
    <div class="page-container page-break relative flex flex-col">
        <!-- Minimal Header Shape -->
        <div class="absolute top-0 left-0 w-full h-12 bg-gradient-to-r from-brand-blue to-brand-lightBlue z-10"></div>
        
        <!-- Logo (TOP RIGHT) -->
        <div class="absolute top-4 right-8 z-30 w-32">
            <img src="https://github.com/Abhishekcodeking01/v-solar-quote/blob/9ae39ab1ba9eb2eedc38678b5d67f65a93283d84/Uplodes/v%20sustain%20logo.png?raw=true" alt="V Sustain Logo" class="w-full object-contain">
        </div>

        <div class="relative z-20 mt-16 px-12 h-full flex flex-col justify-start pb-12">
           <!-- Header with Shortened Line -->
           <div class="flex items-center justify-between mb-8 border-b-2 border-brand-orange pb-2 w-[80%]">
               <div class="flex items-center gap-3">
                    <i class="far fa-file-alt text-3xl text-brand-blue"></i>
                    <h2 class="text-3xl font-bold text-brand-blue">Techno-Commercial Offer</h2>
               </div>
           </div>

           <!-- 1. System Specifications Table -->
           <div class="mb-8" contenteditable="true">
               <h3 class="text-lg font-bold text-brand-green mb-3 pl-2 border-l-4 border-brand-green">1. System Specifications</h3>
               <table class="w-full text-sm border-collapse shadow-sm bg-white/90">
                   <thead>
                       <tr class="bg-brand-green text-white">
                           <th class="p-3 border border-brand-green text-left">Component</th>
                           <th class="p-3 border border-brand-green text-left">Description</th>
                           <th class="p-3 border border-brand-green text-left">Make</th>
                           <th class="p-3 border border-brand-green text-center">Qty</th>
                           <th class="p-3 border border-brand-green text-center">UoM</th>
                       </tr>
                   </thead>
                   <tbody class="text-gray-800">
                       ${specRows}
                   </tbody>
               </table>
           </div>
        </div>
    </div>

    <!-- PAGE 4: COMMERCIAL PROPOSAL (SEPARATE PAGE) -->
    <div class="page-container page-break relative flex flex-col">
        <!-- Minimal Header Shape -->
        <div class="absolute top-0 left-0 w-full h-12 bg-gradient-to-r from-brand-blue to-brand-lightBlue z-10"></div>
        
        <!-- Logo (TOP RIGHT) -->
        <div class="absolute top-4 right-8 z-30 w-32">
            <img src="https://github.com/Abhishekcodeking01/v-solar-quote/blob/9ae39ab1ba9eb2eedc38678b5d67f65a93283d84/Uplodes/v%20sustain%20logo.png?raw=true" alt="V Sustain Logo" class="w-full object-contain">
        </div>

        <div class="relative z-20 mt-16 px-12 h-full flex flex-col justify-between pb-12">
             <!-- Header with Shortened Line -->
           <div class="flex items-center justify-between mb-8 border-b-2 border-brand-orange pb-2 w-[80%]">
               <div class="flex items-center gap-3">
                    <i class="fas fa-rupee-sign text-3xl text-brand-blue"></i>
                    <h2 class="text-3xl font-bold text-brand-blue">Commercial Proposal</h2>
               </div>
           </div>

           <!-- 2. Commercial Offer Table -->
           <div class="mb-8" contenteditable="true">
                <table class="w-full text-sm border-collapse shadow-lg bg-white/90">
                    <thead>
                        <tr class="bg-brand-blue text-white">
                            <th class="p-3 border border-white text-center w-12">#</th>
                            <th class="p-3 border border-white text-left">Description</th>
                            <th class="p-3 border border-white text-center">UOM</th>
                            <th class="p-3 border border-white text-center">Qty</th>
                            <th class="p-3 border border-white text-right">Price (INR)</th>
                        </tr>
                    </thead>
                    <tbody class="text-gray-800">
                        ${commercialRows}
                        ${footerRows}
                    </tbody>
                </table>
           </div>

           <!-- 3. Chargeable Services & Notes Row -->
           <div class="flex gap-6 mt-auto">
               <div class="w-2/3" contenteditable="true">
                    <h3 class="text-sm font-bold text-brand-green mb-2">Optional Services</h3>
                    <table class="w-full text-xs border-collapse shadow-sm bg-white/90">
                        <thead>
                            <tr class="bg-gray-600 text-white">
                                <th class="p-2 text-left">Description</th>
                                <th class="p-2 text-center">Tenure</th>
                                <th class="p-2 text-right">Cost (INR)</th>
                            </tr>
                        </thead>
                        <tbody class="text-gray-800">
                            <tr class="bg-gray-50/50 border-b">
                                <td class="p-2 font-semibold">Comprehensive AMC</td>
                                <td class="p-2 text-center">5 Years</td>
                                <td class="p-2 text-right">10,000</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    ${subsidyDisclaimerHtml}
               </div>

               <!-- Notes -->
               <div class="w-1/3 border border-gray-300 bg-yellow-50/90 p-3 text-xs" contenteditable="true">
                    <p class="font-bold mb-2 border-b border-gray-300 pb-1">Notes / Inclusions:</p>
                    <ul class="list-disc list-inside text-gray-600 space-y-1">
                        <li>Prices inclusive of Bengaluru transport.</li>
                        <li>Standard structure height.</li>
                        <li>Elevated structure extra.</li>
                        <li>Discom charges excluded.</li>
                    </ul>
               </div>
           </div>
        </div>
    </div>

    <!-- PAGE 5: WHY CHOOSE US -->
    <div class="page-container page-break relative">
        <div class="wave-corner-top-left-accent h-[150px]"></div><div class="wave-corner-top-left h-[130px]"></div>
        <div class="absolute top-8 right-8 z-30 w-32"><img src="https://github.com/Abhishekcodeking01/v-solar-quote/blob/9ae39ab1ba9eb2eedc38678b5d67f65a93283d84/Uplodes/v%20sustain%20logo.png?raw=true" class="w-full object-contain"></div>
        <div class="absolute top-8 left-12 z-30 flex items-center gap-3"><i class="far fa-star text-3xl text-white"></i><h2 class="text-3xl font-bold text-white">Why Choose Us?</h2></div>
        <div class="relative z-20 mt-40 px-12 h-full pb-12 flex flex-col"><p class="text-lg text-gray-600 mb-12 border-l-4 border-brand-orange pl-4 italic bg-white/60 p-2 rounded">Empowering your home with eco-friendly solutions.</p>
        <div class="grid grid-cols-2 gap-y-12 gap-x-12">
            <div class="flex items-start gap-5 content-card-bg p-4 rounded-lg shadow-sm"><div class="flex-shrink-0 w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green border border-brand-green/20"><i class="fas fa-drafting-compass text-2xl"></i></div><div><h3 class="font-bold text-xl text-brand-blue mb-2">Customized Solution</h3><p class="text-sm text-gray-600 leading-relaxed">Tailored specifically to your energy needs.</p></div></div>
            <div class="flex items-start gap-5 content-card-bg p-4 rounded-lg shadow-sm"><div class="flex-shrink-0 w-16 h-16 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue border border-brand-blue/20"><i class="fas fa-tools text-2xl"></i></div><div><h3 class="font-bold text-xl text-brand-blue mb-2">Minimal Maintenance</h3><p class="text-sm text-gray-600">Built to last with minimal upkeep.</p></div></div>
            <div class="flex items-start gap-5 content-card-bg p-4 rounded-lg shadow-sm"><div class="flex-shrink-0 w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange border border-brand-orange/20"><i class="fas fa-medal text-2xl"></i></div><div><h3 class="font-bold text-xl text-brand-blue mb-2">Quality Assurance</h3><p class="text-sm text-gray-600">Top-rated inverters and Tier-1 modules.</p></div></div>
            <div class="flex items-start gap-5 content-card-bg p-4 rounded-lg shadow-sm"><div class="flex-shrink-0 w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green border border-brand-green/20"><i class="fas fa-shield-alt text-2xl"></i></div><div><h3 class="font-bold text-xl text-brand-blue mb-2">Highest Safety</h3><p class="text-sm text-gray-600">Strict electrical safety standards.</p></div></div>
            <div class="flex items-start gap-5 content-card-bg p-4 rounded-lg shadow-sm"><div class="flex-shrink-0 w-16 h-16 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue border border-brand-blue/20"><i class="fas fa-chart-line text-2xl"></i></div><div><h3 class="font-bold text-xl text-brand-blue mb-2">Quick ROI</h3><p class="text-sm text-gray-600">Substantial electricity bill reductions.</p></div></div>
            <div class="flex items-start gap-5 content-card-bg p-4 rounded-lg shadow-sm"><div class="flex-shrink-0 w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange border border-brand-orange/20"><i class="fas fa-hand-holding-usd text-2xl"></i></div><div><h3 class="font-bold text-xl text-brand-blue mb-2">Smart Investment</h3><p class="text-sm text-gray-600">Appreciating asset hedging against tariff hikes.</p></div></div>
        </div></div>
    </div>
    
    <!-- P6: Payment -->
    <div class="page-container page-break relative">
        <div class="wave-top-accent"></div><div class="wave-top"></div>
        <div class="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-32"><img src="https://github.com/Abhishekcodeking01/v-solar-quote/blob/9ae39ab1ba9eb2eedc38678b5d67f65a93283d84/Uplodes/v%20sustain%20logo.png?raw=true" class="w-full object-contain"></div>
        <div class="relative z-20 pt-48 px-12 pb-12">
            <div class="flex items-center gap-3 mb-16 mt-8"><i class="far fa-credit-card text-3xl text-brand-blue"></i><h2 class="text-3xl font-bold text-brand-blue">Payment Terms</h2></div>
            <div class="relative px-4 mb-20"><div class="absolute top-[35%] left-0 w-full h-1 bg-gray-200 z-0 -translate-y-1/2 rounded-full"></div>
            <div class="flex justify-between items-start relative z-10">
                <div class="flex flex-col items-center w-1/3"><div class="bg-white p-2 rounded-full shadow-lg border-4 border-brand-blue w-32 h-32 flex items-center justify-center mb-6"><i class="fas fa-file-contract text-5xl text-brand-blue"></i></div><div class="bg-white p-4 rounded-xl shadow-md border-b-4 border-brand-blue w-4/5 text-center"><span class="block text-3xl font-bold text-brand-blue">25%</span><span class="block text-sm">Advance</span></div></div>
                <div class="flex flex-col items-center w-1/3"><div class="bg-white p-2 rounded-full shadow-lg border-4 border-brand-orange w-32 h-32 flex items-center justify-center mb-6"><i class="fas fa-truck-fast text-5xl text-brand-orange"></i></div><div class="bg-white p-4 rounded-xl shadow-md border-b-4 border-brand-orange w-4/5 text-center"><span class="block text-3xl font-bold text-brand-orange">65%</span><span class="block text-sm">Delivery</span></div></div>
                <div class="flex flex-col items-center w-1/3"><div class="bg-white p-2 rounded-full shadow-lg border-4 border-brand-green w-32 h-32 flex items-center justify-center mb-6"><i class="fas fa-clipboard-check text-5xl text-brand-green"></i></div><div class="bg-white p-4 rounded-xl shadow-md border-b-4 border-brand-green w-4/5 text-center"><span class="block text-3xl font-bold text-brand-green">10%</span><span class="block text-sm">Completion</span></div></div>
            </div></div>
            <!-- Warranty Terms -->
            <div class="flex items-center gap-3 mb-8"><i class="fas fa-shield-alt text-3xl text-brand-blue"></i><h2 class="text-3xl font-bold text-brand-blue">Warranty Terms</h2></div>
            <div class="bg-gradient-to-r from-brand-blue to-[#004080] w-full p-8 rounded-2xl flex justify-between items-center text-white mb-8 shadow-2xl relative overflow-hidden">
                <i class="fas fa-shield-alt absolute -right-10 -bottom-10 text-9xl text-white opacity-10"></i>
                <div class="flex flex-col items-center flex-1 relative z-10"><div class="flex items-center gap-2 mb-2"><i class="fas fa-solar-panel text-3xl text-brand-orange"></i><span class="text-4xl font-bold">25+</span></div><span class="font-semibold tracking-wide text-center">YEARS PERFORMANCE</span><span class="text-xs opacity-75 mt-1">On PV Modules</span></div>
                <div class="h-16 w-px bg-white/30"></div>
                <div class="flex flex-col items-center flex-1 relative z-10"><div class="flex items-center gap-2 mb-2"><i class="fas fa-charging-station text-3xl text-brand-orange"></i><span class="text-4xl font-bold">8</span></div><span class="font-semibold tracking-wide text-center">YEARS WARRANTY</span><span class="text-xs opacity-75 mt-1">On Inverter</span></div>
                <div class="h-16 w-px bg-white/30"></div>
                <div class="flex flex-col items-center flex-1 relative z-10"><div class="flex items-center gap-2 mb-2"><i class="fas fa-tools text-3xl text-brand-orange"></i><span class="text-4xl font-bold">5</span></div><span class="font-semibold tracking-wide text-center">YEARS SERVICE</span><span class="text-xs opacity-75 mt-1">On System</span></div>
            </div>
            <p class="text-xs text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-200 leading-relaxed"><strong class="text-brand-blue">Note:</strong> Please refer to the T&C and warranty documents for further details.</p>
        </div>
    </div>
    
    <!-- P7: Terms -->
    <div class="page-container page-break relative">
        <div class="wave-top-accent h-[120px]"></div><div class="wave-top h-[140px]"></div>
        <div class="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-32"><img src="https://github.com/Abhishekcodeking01/v-solar-quote/blob/9ae39ab1ba9eb2eedc38678b5d67f65a93283d84/Uplodes/v%20sustain%20logo.png?raw=true" class="w-full object-contain"></div>
        <div class="relative z-20 mt-40 px-12">
            <div class="flex items-center gap-3 mb-6"><i class="fas fa-gavel text-3xl text-brand-blue"></i><h2 class="text-3xl font-bold text-brand-blue">General Terms & Conditions</h2></div>
            <div class="grid grid-cols-1 gap-4 text-xs text-gray-800 bg-white/80 p-4 rounded">
                <div class="bg-gray-50/80 p-3 rounded border"><h4 class="font-bold text-brand-blue">1. Validity</h4><p>15 Days.</p></div>
                <div class="bg-gray-50/80 p-3 rounded border"><h4 class="font-bold text-brand-blue">2. Taxes</h4><p>Included as per norms.</p></div>
                <div class="bg-gray-50/80 p-3 rounded border"><h4 class="font-bold text-brand-blue">3. Warranty</h4><p>As per OEM.</p></div>
            </div>
        </div>
    </div>

    <!-- P8: Contact -->
    <div class="page-container page-break relative flex flex-col">
        <div class="h-[40%] w-full relative overflow-hidden"><img src="https://github.com/Abhishekcodeking01/v-solar-quote/blob/8f2c0c796ba02307c87dda837a906dc9c079aa05/Uplodes/bg%203.png?raw=true" class="w-full h-full object-cover"></div>
        <div class="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-32 bg-white/90 p-2 rounded shadow-lg"><img src="https://github.com/Abhishekcodeking01/v-solar-quote/blob/9ae39ab1ba9eb2eedc38678b5d67f65a93283d84/Uplodes/v%20sustain%20logo.png?raw=true" class="w-full"></div>
        <div class="h-[60%] w-full bg-white px-12 pt-16 relative flex flex-col items-center">
             <div class="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 -mt-24 z-20 flex items-start gap-8 border-t-8 border-brand-orange">
                <div class="flex-shrink-0"><div class="w-28 h-28 bg-gray-200 rounded-full overflow-hidden border-4 border-white shadow-md"><img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop" class="w-full h-full object-cover"></div></div>
                <div class="flex-grow pl-8">
                    <h2 class="text-2xl font-bold text-brand-blue">V-Sustain Solar Solutions</h2><p class="text-gray-800 font-bold">Pravesh Kumar Tiwari</p><p class="text-gray-800">+91 99-000-00476</p><p>vsustainsolarsolutions@gmail.com</p>
                </div>
             </div>
             <div class="mt-auto mb-8 text-center w-full border-t border-gray-200 pt-6">
                 <p class="text-xs text-gray-400 mb-2">Office Address</p>
                 <p class="text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">NO.33/1, 6th main, Kanteerava Studio Peenya, Rajagopalnagar Main Rd, Nandini Layout, Bengaluru, Karnataka 560096</p>
             </div>
        </div>
    </div>
  </body></html>`;
}

function buildSummaryQuotationHtml(totals, systemType) {
  const kw = n($('systemKw').value);
  const name = $('customerName').value || 'Customer';
  const email = $('customerEmail').value || '';
  const dateStr = new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' });
  const propNo = `VS/${new Date().getFullYear()}/OF-${Math.floor(Math.random()*1000)}`;

  // REUSE EXACT SAME TEMPLATE AS DETAILED BUT WITH PRICES HIDDEN
  // This logic is mirrored from the buildDetailedQuotationHtml but commercial table rows are different

  // Rows logic
  const specRows = totals.items.map(it => `
    <tr class="odd:bg-white/50 even:bg-gray-50/50">
      <td class="p-2 border font-semibold">${it.item}</td>
      <td class="p-2 border">${it.desc || '-'}</td>
      <td class="p-2 border">Standard</td>
      <td class="p-2 border text-center">${it.qty}</td>
      <td class="p-2 border text-center">${it.unit}</td>
    </tr>
  `).join('');
  
  // Commercial Rows - Prices Hidden
  const commercialRows = totals.items.map((it, idx) => `
    <tr class="odd:bg-white/50 even:bg-gray-50/50">
      <td class="p-3 border text-center">${idx + 1}</td>
      <td class="p-3 border">${it.item}</td>
      <td class="p-3 border text-center">${it.unit}</td>
      <td class="p-3 border text-center">${it.qty}</td>
      <td class="p-3 border text-right">-</td>
    </tr>
  `).join('');

  // Footer Rows - Grand Total Visible
  const footerRows = `
    <tr class="bg-white/50"><td class="p-3 border"></td><td class="p-3 border text-right font-semibold">Total GST</td><td colspan="2" class="p-3 border"></td><td class="p-3 border text-right">${fmt(totals.totalGst)}</td></tr>
    <tr class="bg-blue-50/80 font-bold border-t-2 border-brand-blue"><td class="p-4 border"></td><td colspan="3" class="p-4 border text-right">GRAND TOTAL (INR)</td><td class="p-4 border text-right text-xl text-brand-blue">${fmt(totals.grandTotal)}</td></tr>
  `;

  // HTML Structure identical to Detailed Quote
  // I'm embedding the template again to ensure it's self-contained and identical
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${kw}KW Offgrid ${name} ${email}</title>${commonStyle}</head>
  <body class="font-sans text-gray-800">
    <div class="fixed bottom-8 right-8 z-50 no-print flex flex-col gap-3">
        <button onclick="printMode('laptop')" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-lg"><i class="fas fa-laptop"></i> Laptop</button>
        <button onclick="printMode('mobile')" class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full shadow-lg"><i class="fas fa-mobile-alt"></i> Mobile</button>
    </div>
    
    <!-- P1: Cover -->
    <div class="page-container relative flex flex-col justify-between">
        <div class="h-[13%] w-full flex justify-between items-start p-2 relative z-20 bg-white/90">
             <div class="w-36"><img src="https://github.com/Abhishekcodeking01/v-solar-quote/blob/9ae39ab1ba9eb2eedc38678b5d67f65a93283d84/Uplodes/v%20sustain%20logo.png?raw=true" class="w-full object-contain"></div>
             <div class="text-right text-brand-blue"><h2 class="font-bold text-xl">V-Sustain Solar Solutions</h2><p class="text-sm">Authorized Luminous Partner</p><p class="text-sm font-bold mt-1"># ${propNo}</p><p class="text-sm">${dateStr}</p></div>
        </div>
        <div class="h-[45%] w-full overflow-hidden relative"><img src="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=2072&auto=format&fit=crop" class="w-full h-full object-cover"></div>
        <div class="h-[42%] w-full bg-[#001f3f] text-white p-12 flex flex-col justify-center relative"><div class="relative z-10 border-l-4 border-brand-lightBlue pl-6"><h1 class="text-4xl font-bold mb-2">Techno-commercial</h1><h1 class="text-4xl font-bold mb-8">Offer</h1><div class="space-y-1"><h3 class="text-xl font-bold">${kw} KW Off-Grid Solar</h3><h3 class="text-xl font-bold border-b border-gray-500 pb-2 mb-2 w-1/2">Solution</h3><p class="text-xl text-gray-300">Proposal for</p><p class="text-2xl font-semibold">${name}</p><p class="text-lg text-gray-300">${$('customerCity').value}</p></div></div></div>
    </div>

    <!-- P2: Project Explanation -->
    <div class="page-container page-break relative">
        <div class="wave-corner-top-left-accent h-[150px]"></div><div class="wave-corner-top-left h-[130px]"></div>
        <div class="absolute top-8 right-8 z-30 w-32"><img src="https://github.com/Abhishekcodeking01/v-solar-quote/blob/9ae39ab1ba9eb2eedc38678b5d67f65a93283d84/Uplodes/v%20sustain%20logo.png?raw=true" class="w-full"></div>
        <div class="relative z-20 pt-40 px-12 pb-12 flex flex-col h-full justify-between">
            <div>
                <div class="flex items-center gap-3 mb-8"><i class="far fa-arrow-alt-circle-right text-3xl text-brand-blue"></i><h2 class="text-3xl font-bold text-brand-blue">Project Explanation</h2></div>
                <div class="flex items-center justify-center mb-8 relative h-[350px]">
                    <img src="https://github.com/Abhishekcodeking01/v-solar-quote/blob/d2ac544338d64714fdc75e8008f2a733bb61ab83/Uplodes/on%20grid%20plannnt%20explained.png?raw=true" class="h-full w-full object-contain shadow-lg rounded-lg bg-white/50">
                </div>
                <div class="space-y-6 bg-white/90 p-8 rounded-xl shadow-lg border-l-4 border-brand-green">
                    <div><h4 class="font-bold text-2xl mb-2 text-brand-blue flex items-center gap-2"><i class="fas fa-solar-panel"></i> ${kw} KW Off-Grid Solution</h4><ul class="list-none ml-2 text-gray-700"><li class="flex gap-2"><i class="fas fa-check text-brand-green"></i> Battery Backup Included</li></ul></div>
                    <div><h4 class="font-bold text-2xl mb-2 text-brand-blue flex items-center gap-2"><i class="fas fa-map-marker-alt"></i> Location</h4><p class="text-lg ml-2">${$('customerAddress').value}</p></div>
                </div>
            </div>
        </div>
    </div>

    <!-- P3: Specs -->
    <div class="page-container page-break relative flex flex-col">
       <div class="absolute top-0 left-0 w-full h-12 bg-gradient-to-r from-brand-blue to-brand-lightBlue z-10"></div>
       <div class="absolute top-4 right-8 z-30 w-32"><img src="https://github.com/Abhishekcodeking01/v-solar-quote/blob/9ae39ab1ba9eb2eedc38678b5d67f65a93283d84/Uplodes/v%20sustain%20logo.png?raw=true" class="w-full"></div>
       <div class="relative z-20 mt-16 px-12 h-full flex flex-col justify-start pb-12">
           <div class="flex items-center justify-between mb-8 border-b-2 border-brand-orange pb-2 w-[80%]"><div class="flex items-center gap-3"><i class="far fa-file-alt text-3xl text-brand-blue"></i><h2 class="text-3xl font-bold text-brand-blue">Techno-Commercial Offer</h2></div></div>
           <div class="mb-8"><h3 class="text-lg font-bold text-brand-green mb-3 pl-2 border-l-4 border-brand-green">1. System Specifications</h3><table class="w-full text-sm border-collapse shadow-sm bg-white/90"><thead><tr class="bg-brand-green text-white"><th class="p-3 border text-left">Component</th><th class="p-3 border text-left">Description</th><th class="p-3 border">Make</th><th class="p-3 border text-center">Qty</th><th class="p-3 border text-center">UoM</th></tr></thead><tbody>${specRows}</tbody></table></div>
       </div>
    </div>

    <!-- P4: Commercial -->
    <div class="page-container page-break relative flex flex-col">
       <div class="absolute top-0 left-0 w-full h-12 bg-gradient-to-r from-brand-blue to-brand-lightBlue z-10"></div>
       <div class="absolute top-4 right-8 z-30 w-32"><img src="https://github.com/Abhishekcodeking01/v-solar-quote/blob/9ae39ab1ba9eb2eedc38678b5d67f65a93283d84/Uplodes/v%20sustain%20logo.png?raw=true" class="w-full"></div>
       <div class="relative z-20 mt-16 px-12 h-full flex flex-col justify-between pb-12">
           <div class="flex items-center justify-between mb-8 border-b-2 border-brand-orange pb-2 w-[80%]"><div class="flex items-center gap-3"><i class="fas fa-rupee-sign text-3xl text-brand-blue"></i><h2 class="text-3xl font-bold text-brand-blue">Commercial Proposal</h2></div></div>
           <div class="mb-8"><table class="w-full text-sm border-collapse shadow-lg bg-white/90"><thead><tr class="bg-brand-blue text-white"><th class="p-3 border w-12">#</th><th class="p-3 border text-left">Description</th><th class="p-3 border text-center">UOM</th><th class="p-3 border text-center">Qty</th><th class="p-3 border text-right">Price (INR)</th></tr></thead><tbody>${commercialRows}${footerRows}</tbody></table></div>
           <div class="flex gap-6 mt-auto"><div class="w-2/3"><h3 class="text-sm font-bold text-brand-green mb-2">Optional Services</h3><table class="w-full text-xs border-collapse shadow-sm bg-white/90"><thead><tr class="bg-gray-600 text-white"><th class="p-2 text-left">Description</th><th class="p-2 text-center">Tenure</th><th class="p-2 text-right">Cost (INR)</th></tr></thead><tbody><tr class="bg-gray-50/50 border-b"><td class="p-2 font-semibold">AMC</td><td class="p-2 text-center">5 Years</td><td class="p-2 text-right">10,000</td></tr></tbody></table></div></div>
       </div>
    </div>

    <!-- P5: Why Choose Us -->
    <div class="page-container page-break relative">
        <div class="wave-corner-top-left-accent h-[150px]"></div><div class="wave-corner-top-left h-[130px]"></div>
        <div class="absolute top-8 right-8 z-30 w-32"><img src="https://github.com/Abhishekcodeking01/v-solar-quote/blob/9ae39ab1ba9eb2eedc38678b5d67f65a93283d84/Uplodes/v%20sustain%20logo.png?raw=true" class="w-full"></div>
        <div class="absolute top-8 left-12 z-30 flex items-center gap-3"><i class="far fa-star text-3xl text-white"></i><h2 class="text-3xl font-bold text-white">Why Choose Us?</h2></div>
        <div class="relative z-20 mt-40 px-12 h-full pb-12 flex flex-col"><p class="text-lg text-gray-600 mb-12 border-l-4 border-brand-orange pl-4 italic bg-white/60 p-2 rounded">Empowering your home with eco-friendly solutions.</p>
        <div class="grid grid-cols-2 gap-y-12 gap-x-12">
            <div class="flex items-start gap-5 content-card-bg p-4 rounded-lg shadow-sm"><div class="flex-shrink-0 w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green border border-brand-green/20"><i class="fas fa-drafting-compass text-2xl"></i></div><div><h3 class="font-bold text-xl text-brand-blue mb-2">Customized Solution</h3><p class="text-sm text-gray-600 leading-relaxed">Tailored specifically to your energy needs.</p></div></div>
            <div class="flex items-start gap-5 content-card-bg p-4 rounded-lg shadow-sm"><div class="flex-shrink-0 w-16 h-16 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue border border-brand-blue/20"><i class="fas fa-tools text-2xl"></i></div><div><h3 class="font-bold text-xl text-brand-blue mb-2">Minimal Maintenance</h3><p class="text-sm text-gray-600">Built to last with minimal upkeep.</p></div></div>
            <div class="flex items-start gap-5 content-card-bg p-4 rounded-lg shadow-sm"><div class="flex-shrink-0 w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange border border-brand-orange/20"><i class="fas fa-medal text-2xl"></i></div><div><h3 class="font-bold text-xl text-brand-blue mb-2">Quality Assurance</h3><p class="text-sm text-gray-600">Top-rated inverters and Tier-1 modules.</p></div></div>
            <div class="flex items-start gap-5 content-card-bg p-4 rounded-lg shadow-sm"><div class="flex-shrink-0 w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green border border-brand-green/20"><i class="fas fa-shield-alt text-2xl"></i></div><div><h3 class="font-bold text-xl text-brand-blue mb-2">Highest Safety</h3><p class="text-sm text-gray-600">Strict electrical safety standards.</p></div></div>
            <div class="flex items-start gap-5 content-card-bg p-4 rounded-lg shadow-sm"><div class="flex-shrink-0 w-16 h-16 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue border border-brand-blue/20"><i class="fas fa-chart-line text-2xl"></i></div><div><h3 class="font-bold text-xl text-brand-blue mb-2">Quick ROI</h3><p class="text-sm text-gray-600">Substantial electricity bill reductions.</p></div></div>
            <div class="flex items-start gap-5 content-card-bg p-4 rounded-lg shadow-sm"><div class="flex-shrink-0 w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange border border-brand-orange/20"><i class="fas fa-hand-holding-usd text-2xl"></i></div><div><h3 class="font-bold text-xl text-brand-blue mb-2">Smart Investment</h3><p class="text-sm text-gray-600">Appreciating asset hedging against tariff hikes.</p></div></div>
        </div></div>
    </div>
    
    <!-- P6: Payment -->
    <div class="page-container page-break relative">
        <div class="wave-top-accent"></div><div class="wave-top"></div>
        <div class="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-32"><img src="https://github.com/Abhishekcodeking01/v-solar-quote/blob/9ae39ab1ba9eb2eedc38678b5d67f65a93283d84/Uplodes/v%20sustain%20logo.png?raw=true" class="w-full"></div>
        <div class="relative z-20 pt-48 px-12 pb-12">
            <div class="flex items-center gap-3 mb-16 mt-8"><i class="far fa-credit-card text-3xl text-brand-blue"></i><h2 class="text-3xl font-bold text-brand-blue">Payment Terms</h2></div>
            <div class="relative px-4 mb-20"><div class="absolute top-[35%] left-0 w-full h-1 bg-gray-200 z-0 -translate-y-1/2 rounded-full"></div>
            <div class="flex justify-between items-start relative z-10">
                <div class="flex flex-col items-center w-1/3"><div class="bg-white p-2 rounded-full shadow-lg border-4 border-brand-blue w-32 h-32 flex items-center justify-center mb-6"><i class="fas fa-file-contract text-5xl text-brand-blue"></i></div><div class="bg-white p-4 rounded-xl shadow-md border-b-4 border-brand-blue w-4/5 text-center"><span class="block text-3xl font-bold text-brand-blue">25%</span><span class="block text-sm">Advance</span></div></div>
                <div class="flex flex-col items-center w-1/3"><div class="bg-white p-2 rounded-full shadow-lg border-4 border-brand-orange w-32 h-32 flex items-center justify-center mb-6"><i class="fas fa-truck-fast text-5xl text-brand-orange"></i></div><div class="bg-white p-4 rounded-xl shadow-md border-b-4 border-brand-orange w-4/5 text-center"><span class="block text-3xl font-bold text-brand-orange">65%</span><span class="block text-sm">Delivery</span></div></div>
                <div class="flex flex-col items-center w-1/3"><div class="bg-white p-2 rounded-full shadow-lg border-4 border-brand-green w-32 h-32 flex items-center justify-center mb-6"><i class="fas fa-clipboard-check text-5xl text-brand-green"></i></div><div class="bg-white p-4 rounded-xl shadow-md border-b-4 border-brand-green w-4/5 text-center"><span class="block text-3xl font-bold text-brand-green">10%</span><span class="block text-sm">Completion</span></div></div>
            </div></div>
            <!-- Warranty Terms -->
            <div class="flex items-center gap-3 mb-8"><i class="fas fa-shield-alt text-3xl text-brand-blue"></i><h2 class="text-3xl font-bold text-brand-blue">Warranty Terms</h2></div>
            <div class="bg-gradient-to-r from-brand-blue to-[#004080] w-full p-8 rounded-2xl flex justify-between items-center text-white mb-8 shadow-2xl relative overflow-hidden">
                <i class="fas fa-shield-alt absolute -right-10 -bottom-10 text-9xl text-white opacity-10"></i>
                <div class="flex flex-col items-center flex-1 relative z-10"><div class="flex items-center gap-2 mb-2"><i class="fas fa-solar-panel text-3xl text-brand-orange"></i><span class="text-4xl font-bold">25+</span></div><span class="font-semibold tracking-wide text-center">YEARS PERFORMANCE</span><span class="text-xs opacity-75 mt-1">On PV Modules</span></div>
                <div class="h-16 w-px bg-white/30"></div>
                <div class="flex flex-col items-center flex-1 relative z-10"><div class="flex items-center gap-2 mb-2"><i class="fas fa-charging-station text-3xl text-brand-orange"></i><span class="text-4xl font-bold">8</span></div><span class="font-semibold tracking-wide text-center">YEARS WARRANTY</span><span class="text-xs opacity-75 mt-1">On Inverter</span></div>
                <div class="h-16 w-px bg-white/30"></div>
                <div class="flex flex-col items-center flex-1 relative z-10"><div class="flex items-center gap-2 mb-2"><i class="fas fa-tools text-3xl text-brand-orange"></i><span class="text-4xl font-bold">5</span></div><span class="font-semibold tracking-wide text-center">YEARS SERVICE</span><span class="text-xs opacity-75 mt-1">On System</span></div>
            </div>
            <p class="text-xs text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-200 leading-relaxed"><strong class="text-brand-blue">Note:</strong> Please refer to the T&C and warranty documents for further details.</p>
        </div>
    </div>
    
    <!-- P7: Terms -->
    <div class="page-container page-break relative">
        <div class="wave-top-accent h-[120px]"></div><div class="wave-top h-[140px]"></div>
        <div class="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-32"><img src="https://github.com/Abhishekcodeking01/v-solar-quote/blob/9ae39ab1ba9eb2eedc38678b5d67f65a93283d84/Uplodes/v%20sustain%20logo.png?raw=true" class="w-full"></div>
        <div class="relative z-20 mt-40 px-12">
            <div class="flex items-center gap-3 mb-6"><i class="fas fa-gavel text-3xl text-brand-blue"></i><h2 class="text-3xl font-bold text-brand-blue">Terms & Conditions</h2></div>
            <div class="grid grid-cols-1 gap-4 text-xs text-gray-800 bg-white/80 p-4 rounded">
                <div class="bg-gray-50/80 p-3 rounded border"><h4 class="font-bold text-brand-blue">1. Validity</h4><p>15 Days.</p></div>
                <div class="bg-gray-50/80 p-3 rounded border"><h4 class="font-bold text-brand-blue">2. Taxes</h4><p>Included as per norms.</p></div>
                <div class="bg-gray-50/80 p-3 rounded border"><h4 class="font-bold text-brand-blue">3. Warranty</h4><p>As per OEM.</p></div>
            </div>
        </div>
    </div>

    <!-- P8: Contact -->
    <div class="page-container page-break relative flex flex-col">
        <div class="h-[40%] w-full relative overflow-hidden"><img src="https://github.com/Abhishekcodeking01/v-solar-quote/blob/8f2c0c796ba02307c87dda837a906dc9c079aa05/Uplodes/bg%203.png?raw=true" class="w-full h-full object-cover"></div>
        <div class="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-32 bg-white/90 p-2 rounded shadow-lg"><img src="https://github.com/Abhishekcodeking01/v-solar-quote/blob/9ae39ab1ba9eb2eedc38678b5d67f65a93283d84/Uplodes/v%20sustain%20logo.png?raw=true" class="w-full"></div>
        <div class="h-[60%] w-full bg-white px-12 pt-16 relative flex flex-col items-center">
             <div class="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 -mt-24 z-20 flex items-start gap-8 border-t-8 border-brand-orange">
                <div class="flex-shrink-0"><div class="w-28 h-28 bg-gray-200 rounded-full overflow-hidden border-4 border-white shadow-md"><img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop" class="w-full h-full object-cover"></div></div>
                <div class="flex-grow pl-8">
                    <h2 class="text-2xl font-bold text-brand-blue">V-Sustain Solar Solutions</h2><p class="text-gray-800 font-bold">Pravesh Kumar Tiwari</p><p class="text-gray-800">+91 99-000-00476</p><p>vsustainsolarsolutions@gmail.com</p>
                </div>
             </div>
             <div class="mt-auto mb-8 text-center w-full border-t border-gray-200 pt-6">
                 <p class="text-xs text-gray-400 mb-2">Office Address</p>
                 <p class="text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">NO.33/1, 6th main, Kanteerava Studio Peenya, Rajagopalnagar Main Rd, Nandini Layout, Bengaluru, Karnataka 560096</p>
             </div>
        </div>
    </div>
  </body></html>`;
}

function buildShortQuotationHtml(totals, systemType) {
  const kw = n($('systemKw').value);
  const name = $('customerName').value || 'Customer';
  const email = $('customerEmail').value || '';
  const dateStr = new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' });
  const propNo = `VS/${new Date().getFullYear()}/OF-${Math.floor(Math.random()*1000)}`;

  // Use the SAME template logic as buildSummaryQuotationHtml in on-grid
  // But adapted to be "short" - only essential info.
  // Actually, user requested "duplicate the summary quote design in the short quotation".
  // The summary design I built above (which is identical to detailed but hidden prices) is HEAVY for a "short" quote if "short" implies 1 page.
  // BUT user said "duplicate the summury quote designe in the in the short quotation".
  // If "summary" quote is now the 8-page version without prices, and "short" quote is meant to be the 1-page version...
  // Wait, user previous instruction: "make the summury quotation just like detailed quoattion... and then add one more button... short quotation... this button should make maximam a one or two page quoitation".
  // So:
  // Detailed = 8 Pages, Full Prices
  // Summary = 8 Pages, No individual prices
  // Short = 1 Page, Full Summary

  // Here is the 1-Page Short Quote Template (Standard condensed view)
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><title>${kw}KW Offgrid ${name} ${email}</title>${commonStyle}</head>
    <body class="font-sans text-gray-800">
      <div class="fixed bottom-8 right-8 z-50 no-print flex flex-col gap-3">
        <button onclick="printMode('laptop')" class="bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg"><i class="fas fa-laptop"></i> Laptop</button>
        <button onclick="printMode('mobile')" class="bg-green-600 text-white font-bold py-3 px-6 rounded-full shadow-lg"><i class="fas fa-mobile-alt"></i> Mobile</button>
      </div>
      <div class="page-container" style="padding:40px;">
        <div class="flex justify-between items-start border-b-2 border-brand-orange pb-6 mb-8">
            <div class="w-40"><img src="https://github.com/Abhishekcodeking01/v-solar-quote/blob/9ae39ab1ba9eb2eedc38678b5d67f65a93283d84/Uplodes/v%20sustain%20logo.png?raw=true" class="w-full"></div>
            <div class="text-right"><h1 class="text-3xl font-bold text-brand-blue">Quotation</h1><p class="text-sm font-semibold text-gray-600"># ${propNo}</p><p class="text-sm text-gray-500">${dateStr}</p></div>
        </div>
        <div class="flex justify-between mb-10 bg-gray-50 p-6 rounded-xl border border-gray-100">
            <div><h3 class="text-xs font-bold text-gray-400 uppercase">Proposal For</h3><p class="text-lg font-bold text-brand-blue">${name}</p><p class="text-sm text-gray-600">${$('customerAddress').value}</p></div>
            <div class="text-right"><h3 class="text-xs font-bold text-gray-400 uppercase">System Details</h3><p class="text-xl font-bold text-brand-green">${kw} KW</p><p class="text-sm text-gray-600">Off-Grid System</p></div>
        </div>
        <div class="mb-8">
            <h3 class="text-lg font-bold text-brand-blue mb-4 border-l-4 border-brand-blue pl-3">Commercial Offer</h3>
            <table class="w-full text-sm border-collapse"><tr class="bg-gray-100 border-b border-gray-200"><td class="p-4 font-medium">Supply & Installation of ${kw} KW Off-Grid Solar System</td><td class="p-4 text-right font-bold">${fmt(totals.grandTotal)}</td></tr></table>
            <div class="mt-2 text-right"><p class="text-xs text-gray-500">* Inclusive of GST & Installation</p></div>
        </div>
        <div class="absolute bottom-0 left-0 w-full bg-[#001f3f] text-white p-8"><div class="flex justify-between items-center max-w-4xl mx-auto"><div><h4 class="font-bold text-lg">V-Sustain Solar Solutions</h4></div><div class="text-right text-sm"><p>+91 99-000-00476</p><p>vsustainsolarsolutions@gmail.com</p></div></div></div>
      </div>
    </body></html>`;
}
