/*******************************************************
 * off-grid/script.js
 * Off-Grid Solar Quotation Engine with Battery Support
 *******************************************************/

/* ===========================
   1. DATASETS
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

// SOLAR BATTERIES (NEW)
const batteryList = [
  { model: "LPT 1240L (40Ah, 60M*)", price: 4300 },
  { model: "LPT 1240H (40Ah, 72M*)", price: 4765 },
  { model: "LPT 1280H (80Ah, 72M*)", price: 7587 },
  { model: "LPTT 12100H (100Ah, 72M*)", price: 9370 },
  { model: "LPTT12120H (120Ah, 72M*)", price: 10006 },
  { model: "LPTT 12150L (150Ah, 60M*)", price: 11526 },
  { model: "LPTT 12150H (150Ah, 72M*)", price: 12554 },
  { model: "LPTT 12200L (200Ah, 60M*)", price: 15561 },
  { model: "LPTT 12200H (200Ah, 72M*)", price: 16311 }
];

// SOLAR PANELS
const panelList = [
  { model: "POLY 170W/12V", watt: 170, price: 3815 },
  { model: "PV MOD LUM24550M DCR BI-TS EXWH31", watt: 550, price: 14025 },
  { model: "PV MOD LUM 24585T144 TCHC 144C EXWH31", watt: 585, price: 9694 },
  { model: "PV MOD LUM 24590T144 BI-TS-31", watt: 590, price: 9694 },
   { model: "NON DCR LUM 620TG132 BI-GL", watt: 620, price: 11203 },
  { model: "NON DCR LUM 625TG132 BI-GL", watt: 625, price: 11293 },
  { model: "NON DCR LUM 630TG132 BI-GL", watt: 630, price: 11384 },
  { model: "NON DCR LUM 635TG132 BI-GL", watt: 635, price: 11474 },
   { model: "DCR LUM 620TG132 BI-GL", watt: 620, price: 16554 },
  { model: "DCR LUM 625TG132 BI-GL", watt: 625, price: 16687 },
  { model: "DCR LUM 630TG132 BI-GL", watt: 630, price: 16821 },
  { model: "DCR LUM 635TG132 BI-GL", watt: 635, price: 16954 }
];

// ACDB / DCDB (same as on-grid)
const acdbList = [
  { sku: "TSAD0AC32PH1", desc: "ACDB Single Phase 32 Amp (0-5 Kw)", price: 1899.80 },
  { sku: "TSAD0AC63PH1", desc: "ACDB Single Phase 63 Amp (7 Kw)", price: 2312.80 },
  { sku: "TSAD0AC40PH1", desc: "ACDB Single Phase 40 Amp (9 Kw)", price: 2277.40 },
  { sku: "TSAD0AC80PH1", desc: "ACDB Single Phase 80 Amp (11 Kw)", price: 4708.20 },
  { sku: "TSADAC100PH1", desc: "ACDB Single Phase 100 Amp", price: 4920.60 },
  { sku: "TSAD0AC32PH3", desc: "ACDB Three Phase 32 Amp", price: 4177.20 }
];

const dcdbList = [
  { sku: "TSADDC600V11", desc: "DCDB 1 In 1 Out With MCB", price: 1939.92 },
  { sku: "TSADDC600V22", desc: "DCDB 2 In 2 Out With Fuse", price: 2808.40 },
  { sku: "TSADDC600V21", desc: "DCDB 2 In 1 Out With MCB", price: 2997.20 },
  { sku: "TSADDC600V31", desc: "DCDB 3 In 1 Out With MCB", price: 3835.00 },
  { sku: "TSADDC600V41", desc: "DCDB 4 In 1 Out With MCB", price: 4224.40 },
  { sku: "TSADDC600V11F", desc: "DCDB 1 In 1 Out With Fuse (A)", price: 1711.00 },
  { sku: "TSADC600V21F", desc: "DCDB 2 In 1 Out With Fuse", price: 2383.60 },
  { sku: "TSADC600V31F", desc: "DCDB 3 In 1 Out With Fuse", price: 2725.80 },
  { sku: "TSADC600V41F", desc: "DCDB 4 In 1 Out With Fuse", price: 3103.40 }
];

/* ===========================
   2. HELPERS
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

function populateSelects() {
  // Inverters
  const invSel = $('inverterModel');
  inverterList.forEach(inv => {
    const o = document.createElement('option');
    o.value = inv.model;
    o.dataset.price = inv.price;
    o.textContent = `${inv.model} — ${fmt(inv.price)}`;
    invSel.appendChild(o);
  });

  // Batteries (NEW)
  const batSel = $('batteryModel');
  batteryList.forEach(bat => {
    const o = document.createElement('option');
    o.value = bat.model;
    o.dataset.price = bat.price;
    o.textContent = `${bat.model} — ${fmt(bat.price)}`;
    batSel.appendChild(o);
  });

  // Panels
  const panelSel = $('panelModel');
  panelList.forEach(p => {
    const o = document.createElement('option');
    o.value = p.model;
    o.dataset.watt = p.watt;
    o.dataset.price = p.price;
    o.textContent = `${p.model} — ${p.watt} W — ${fmt(p.price)}`;
    panelSel.appendChild(o);
  });

  // ACDB
  const acdbSel = $('acdbModel');
  if (acdbSel) {
    acdbList.forEach(a => {
      const o = document.createElement('option');
      o.value = a.sku;
      o.dataset.price = a.price;
      o.dataset.desc = a.desc;
      o.textContent = `${a.desc} — ${fmt(a.price)}`;
      acdbSel.appendChild(o);
    });
  }

  // DCDB
  const dcdbSel = $('dcdbModel');
  if (dcdbSel) {
    dcdbList.forEach(d => {
      const o = document.createElement('option');
      o.value = d.sku;
      o.dataset.price = d.price;
      o.dataset.desc = d.desc;
      o.textContent = `${d.desc} — ${fmt(d.price)}`;
      dcdbSel.appendChild(o);
    });
  }
}

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

  // Battery
  $('batteryModel').addEventListener('change', updateBatteryData);
  $('batteryQty').addEventListener('input', updateBatteryData);
  $('batteryOverrideToggle').addEventListener('change', () => toggleOverrideUI('battery'));
  $('batteryOverridePrice').addEventListener('input', updateBatteryData);
  $('batteryUseCommonMargin').addEventListener('change', toggleCustomMarginInput.bind(null, 'battery'));
  $('batteryCustomMargin').addEventListener('input', updateBatteryData);

  // Panels - Updated listener for quantity input to allow manual editing
  $('panelModel').addEventListener('change', () => updatePanelData(false));
  $('panelQty').addEventListener('input', () => updatePanelData(true)); // Pass true for manual edit
  $('panelOverrideToggle').addEventListener('change', () => toggleOverrideUI('panel'));
  $('panelOverridePrice').addEventListener('input', () => updatePanelData(false)); // Recalc with new price
  $('panelsUseCommonMargin').addEventListener('change', toggleCustomMarginInput.bind(null, 'panels'));
  $('panelsCustomMargin').addEventListener('input', () => updatePanelData(false)); // Recalc with new margin

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
  $('acCableGauge').addEventListener('input', updateACCableData);
  $('earthCableQty').addEventListener('input', updateEarthCableData);
  $('earthCablePrice').addEventListener('input', updateEarthCableData);
  $('earthCableGauge').addEventListener('input', updateEarthCableData);

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
  ['inverter','battery','panels','acdb','dcdb','acCable','earthCable','la','installation','structure', 'earthingSet'].forEach(pid => {
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
   4. CORE HELPERS
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

function toggleOverride(sectionId) {
  toggleOverrideUI(sectionId);
}

function computeBasePrice(sectionId, dealerPrice) {
  const overrideToggle = $(`${sectionId}OverrideToggle`);
  const overrideInput = $(`${sectionId}OverridePrice`);
  if (overrideToggle && overrideToggle.checked && overrideInput) {
    const v = n(overrideInput.value);
    if (v > 0) return v;
  }
  return dealerPrice;
}

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

// Determine which main components are enabled
function getEnabledMainComponents() {
  return {
    inverter: isEnabled('inverter'),
    battery: isEnabled('battery'),
    panels: isEnabled('panels')
  };
}

// NEW TAX LOGIC FOR OFF-GRID:
// - If ALL THREE (inverter + battery + panels) selected → 5% on all three
// - If Panel + Battery (no inverter) → 5% on panel, 18% on battery
// - If Inverter + Panel (no battery) → 5% on panel, 18% on inverter
// - If Inverter + Battery (no panels) → 18% on both
// - All other items (ACDB, DCDB, cables, etc.) always 18%
function getGstFor(type) {
  const enabled = getEnabledMainComponents();
  const allThree = enabled.inverter && enabled.battery && enabled.panels;

  if (type === 'panels') {
    // Panels always 5% if panels are enabled
    return 5;
  }

  if (type === 'inverter') {
    // Inverter 5% only if ALL THREE are selected
    if (allThree) return 5;
    return 18;
  }

  if (type === 'battery') {
    // Battery 5% only if ALL THREE are selected
    if (allThree) return 5;
    return 18;
  }

  // All other items (ACDB, DCDB, cables, structure, installation, etc.) always 18%
  return 18;
}

function isEnabled(sectionId) {
  const chk = $(`${sectionId}Card`) ? $(`${sectionId}Card`).querySelector('input[type="checkbox"]') : null;
  if (!chk) return true;
  return chk.checked;
}

/* ===========================
   5. CARD UPDATERS
   =========================== */

// INVERTER
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

// BATTERY (NEW)
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
  const gstPct = getGstFor('battery');
  const amount = round2(finalRate * qty);
  const gstAmt = round2(amount * gstPct / 100);
  const total = round2(amount + gstAmt);

  $('batteryDealer').value = round2(dealer);
  $('batteryFinalRate').value = round2(finalRate);
  $('batteryGST').value = gstAmt;
  $('batteryTotal').value = total;
}

// PANELS
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
    const totalWatt = round2(kw * 1000);
    qty = Math.ceil(totalWatt / Math.max(1, watt));
    $('panelQty').value = qty;
  }
  
  const dcCapacityKw = round2((qty * watt) / 1000);

  const base = computeBasePrice('panel', dealer);
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
  updateBatteryData();
  // Pass false to ensure standard logic on global recalc, but inputs will trigger with true
  updatePanelData(false); 
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
        desc: sel.value,
        qty,
        unit: 'Nos',
        baseRate: rate,
        gstPercent: getGstFor('inverter')
      });
    }
  }

  // battery
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
        desc: sel.value,
        qty,
        unit: 'Nos',
        baseRate: rate,
        gstPercent: getGstFor('battery')
      });
    }
  }

  // panels
  if (isEnabled('panels')) {
    const sel = $('panelModel').selectedOptions[0];
    if (sel) {
      const qty = Math.max(0, n($('panelQty').value));
      const dealer = n(sel.dataset.price);

      // ✅ FIX: use 'panel' for override lookup
      const base = computeBasePrice('panel', dealer);

      // ✅ Correct margin source remains plural
      const rate = applyMarginTo(base, 'panels');

      items.push({
        type: 'panels',
        item: sel.value,
        desc: `${sel.value} (${sel.dataset.watt} Wp)`,
        qty,
        unit: 'Nos',
        baseRate: rate,
        gstPercent: getGstFor('panels')
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
      // Format: "ACDB - [model details]" - remove "ACDB " prefix from desc if present
      const rawDesc = sel.dataset.desc || sel.value;
      const modelDetails = rawDesc.replace(/^ACDB\s*/i, '');
      items.push({ type:'acdb', item: 'ACDB', desc: `ACDB - ${modelDetails}`, qty, unit:'Nos', baseRate: rate, gstPercent: getGstFor('acdb') });
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
      // Format: "DCDB - [model details]" - remove "DCDB " prefix from desc if present
      const rawDesc = sel.dataset.desc || sel.value;
      const modelDetails = rawDesc.replace(/^DCDB\s*/i, '');
      items.push({ type:'dcdb', item: 'DCDB', desc: `DCDB - ${modelDetails}`, qty, unit:'Nos', baseRate: rate, gstPercent: getGstFor('dcdb') });
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

function calcTotals() {
  const items = buildLineItemsForQuotation();

  let subtotal = 0;
  let totalGst = 0;
  let gst5Total = 0;
  let gst18Total = 0;

  items.forEach(it => {
    const amount = round2(it.baseRate * it.qty);
    const gstAmt = round2(amount * it.gstPercent / 100);

    subtotal = round2(subtotal + amount);
    totalGst = round2(totalGst + gstAmt);

    if (it.gstPercent === 5) gst5Total += gstAmt;
    if (it.gstPercent === 18) gst18Total += gstAmt;
  });

  const grandTotal = round2(subtotal + totalGst);

  return {
    items,
    subtotal: round2(subtotal),
    totalGst: round2(totalGst),
    gst5Total: round2(gst5Total),
    gst18Total: round2(gst18Total),
    grandTotal
  };
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

/* REPLACED WITH FULL MULTI-PAGE DESIGN - ADAPTED FROM ON-GRID */
function buildDetailedQuotationHtml(totals, systemType, summaryMode = false) {
  const plantKw = Math.max(0, n($('systemKw').value));
  const customerName = $('customerName')?.value || 'Customer Name';
  const customerAddress = $('customerAddress')?.value || 'Bengaluru';
  const customerCity = $('customerCity')?.value || '';
  const customerEmail = $('customerEmail')?.value || '';
  const date = new Date();
  const proposalDate = date.toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' });
  const proposalNo = `VS/${date.getFullYear()}/001`;

  // NO SUBSIDY FOR OFF-GRID - removed subsidy check

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

  const commercialRows = totals.items.map((it, idx) => {
    const amount = round2(it.qty * it.baseRate);
    return `
      <tr class="odd:bg-white/50 even:bg-gray-50/50">
        <td class="p-3 border text-center">${idx + 1}</td>
        <td class="p-3 border">${it.item}</td>
        <td class="p-3 border text-center">${it.unit}</td>
        <td class="p-3 border text-center">${it.qty}</td>
        <td class="p-3 border text-right">${summaryMode ? '-' : fmt(amount)}</td>
      </tr>
    `;
  }).join('');

  const footerRows = `
  <tr class="bg-blue-50/80 font-bold border-t-2 border-brand-blue">
    <td class="p-4 border"></td>
    <td class="p-4 border text-right text-base" colspan="3">GRAND TOTAL (Inclusive of all taxes)</td>
    <td class="p-4 border text-right text-xl text-brand-blue">${fmt(totals.grandTotal)}</td>
  </tr>
`;

  // BUILD SUBSIDY DISCLAIMER BLOCK - EMPTY FOR OFF-GRID (no subsidy)
  let subsidyDisclaimerHtml = '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${plantKw}KW Off-Grid ${customerName}${customerEmail ? ' ' + customerEmail : ''}</title>
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
            background-image: url('https://github.com/vsustainsolar/quotegen/blob/f079f0ae77e388c7c8747b26688ade236b61cbd1/Uplodes/background%20v%20solar.png?raw=true');
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
                <img src="https://github.com/vsustainsolar/quotegen/blob/f079f0ae77e388c7c8747b26688ade236b61cbd1/Uplodes/v%20sustain%20logo.png?raw=true" alt="V Sustain Logo" class="w-full object-contain">
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
            
            <!-- 2026 Badge -->
            <div class="absolute top-0 right-16 bg-brand-orange text-white font-bold text-2xl py-4 px-3 shadow-lg" style="clip-path: polygon(0% 0%, 100% 0%, 100% 85%, 50% 100%, 0% 85%);">
                2026
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
                    <h3 class="text-xl font-bold">${plantKw} KW Rooftop Solar</h3>
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
            <img src="https://github.com/vsustainsolar/quotegen/blob/f079f0ae77e388c7c8747b26688ade236b61cbd1/Uplodes/v%20sustain%20logo.png?raw=true" alt="V Sustain Logo" class="w-full object-contain">
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
                    <img src="https://github.com/vsustainsolar/quotegen/blob/84f533bd655985e404e7314c38217f6a03a4f91a/Uplodes/Off-Grid-2-1024x537.png?raw=true" alt="Off Grid Plant Explained" class="h-full w-full object-contain shadow-lg rounded-lg bg-white/50">
                </div>

                <!-- Project Details - Centered and Enlarged -->
                <div class="space-y-6 bg-white/90 p-8 rounded-xl shadow-lg border-l-4 border-brand-green">
                    <div>
                        <h4 class="font-bold text-2xl mb-2 text-brand-blue flex items-center gap-2">
                            <i class="fas fa-solar-panel"></i> ${plantKw} KW Rooftop Solar Solution
                        </h4>
                        <ul class="list-none space-y-1 text-gray-700 ml-2">
                            <li class="flex items-center gap-2"><i class="fas fa-check text-brand-green"></i> Residential Solar System</li>
                            <li class="flex items-center gap-2"><i class="fas fa-check text-brand-green"></i> Off-grid System (Battery Backup)</li>
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
            <img src="https://github.com/vsustainsolar/quotegen/blob/f079f0ae77e388c7c8747b26688ade236b61cbd1/Uplodes/v%20sustain%20logo.png?raw=true" alt="V Sustain Logo" class="w-full object-contain">
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
            <img src="https://github.com/vsustainsolar/quotegen/blob/f079f0ae77e388c7c8747b26688ade236b61cbd1/Uplodes/v%20sustain%20logo.png?raw=true" alt="V Sustain Logo" class="w-full object-contain">
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
                    
                    <!-- NO SUBSIDY FOR OFF-GRID -->
                    ${subsidyDisclaimerHtml}
               </div>

               <!-- Notes -->
               <div class="w-1/3 border border-gray-300 bg-yellow-50/90 p-3 text-xs" contenteditable="true">
                    <p class="font-bold mb-2 border-b border-gray-300 pb-1">Notes / Inclusions:</p>
                    <ul class="list-disc list-inside text-gray-600 space-y-1">
                        <li>Prices inclusive of Bengaluru transport.</li>
                        <li>Standard structure height.</li>
                        <li>Elevated structure extra.</li>
                    </ul>
               </div>
           </div>
        </div>
    </div>

    <!-- PAGE 5: WHY CHOOSE US -->
    <div class="page-container page-break relative">
        <!-- Abstract Top Shape -->
        <div class="wave-corner-top-left-accent h-[150px]"></div>
        <div class="wave-corner-top-left h-[130px]"></div>
        
        <!-- Logo (TOP RIGHT) -->
        <div class="absolute top-8 right-8 z-30 w-32">
            <img src="https://github.com/vsustainsolar/quotegen/blob/f079f0ae77e388c7c8747b26688ade236b61cbd1/Uplodes/v%20sustain%20logo.png?raw=true" alt="V Sustain Logo" class="w-full object-contain">
        </div>

        <!-- Shifted Header -->
        <div class="absolute top-8 left-12 z-30 flex items-center gap-3">
             <i class="far fa-star text-3xl text-white"></i>
             <h2 class="text-3xl font-bold text-white">Why Choose Us?</h2>
        </div>

        <div class="relative z-20 mt-40 px-12 h-full pb-12 flex flex-col">
            
            <p class="text-lg text-gray-600 mb-12 border-l-4 border-brand-orange pl-4 italic bg-white/60 p-2 rounded">
                Empowering your home with eco-friendly solutions and a sustainable future through trusted technology.
            </p>

            <!-- Grid Layout (Unchanged) -->
            <div class="grid grid-cols-2 gap-y-12 gap-x-12">
                <!-- Item 1 -->
                <div class="flex items-start gap-5 content-card-bg p-4 rounded-lg shadow-sm">
                    <div class="flex-shrink-0 w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green border border-brand-green/20">
                        <i class="fas fa-drafting-compass text-2xl"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-xl text-brand-blue mb-2">Customized Solution</h3>
                        <p class="text-sm text-gray-600 leading-relaxed">
                            We don't believe in one-size-fits-all. Our team designs a solar power system tailored specifically to your roof structure and energy needs, ensuring maximum efficiency.
                        </p>
                    </div>
                </div>

                <!-- Item 2 -->
                <div class="flex items-start gap-5 content-card-bg p-4 rounded-lg shadow-sm">
                    <div class="flex-shrink-0 w-16 h-16 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue border border-brand-blue/20">
                        <i class="fas fa-tools text-2xl"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-xl text-brand-blue mb-2">Minimal Maintenance</h3>
                        <p class="text-sm text-gray-600 leading-relaxed">
                            Our systems are built to last with minimal upkeep. High-quality components and optional anti-dust coatings mean you spend less time cleaning and more time saving.
                        </p>
                    </div>
                </div>

                <!-- Item 3 -->
                <div class="flex items-start gap-5 content-card-bg p-4 rounded-lg shadow-sm">
                    <div class="flex-shrink-0 w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange border border-brand-orange/20">
                        <i class="fas fa-medal text-2xl"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-xl text-brand-blue mb-2">Quality Assurance</h3>
                        <p class="text-sm text-gray-600 leading-relaxed">
                            We use only Tier-1 modules and top-rated inverters from trusted global brands. Every installation undergoes rigorous quality checks before commissioning.
                        </p>
                    </div>
                </div>

                <!-- Item 4 -->
                <div class="flex items-start gap-5 content-card-bg p-4 rounded-lg shadow-sm">
                    <div class="flex-shrink-0 w-16 h-16 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green border border-brand-green/20">
                        <i class="fas fa-shield-alt text-2xl"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-xl text-brand-blue mb-2">Highest Safety</h3>
                        <p class="text-sm text-gray-600 leading-relaxed">
                            Safety is our priority. We adhere to strict electrical safety standards, using advanced protection devices (ACDB/DCDB) to safeguard your home and family.
                        </p>
                    </div>
                </div>

                <!-- Item 5 -->
                <div class="flex items-start gap-5 content-card-bg p-4 rounded-lg shadow-sm">
                    <div class="flex-shrink-0 w-16 h-16 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue border border-brand-blue/20">
                        <i class="fas fa-chart-line text-2xl"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-xl text-brand-blue mb-2">Quick ROI</h3>
                        <p class="text-sm text-gray-600 leading-relaxed">
                            Start saving from day one. With substantial electricity bill reductions, most of our customers recover their initial investment within just 3-4 years.
                        </p>
                    </div>
                </div>

                <!-- Item 6 -->
                <div class="flex items-start gap-5 content-card-bg p-4 rounded-lg shadow-sm">
                    <div class="flex-shrink-0 w-16 h-16 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange border border-brand-orange/20">
                        <i class="fas fa-hand-holding-usd text-2xl"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-xl text-brand-blue mb-2">Smart Investment</h3>
                        <p class="text-sm text-gray-600 leading-relaxed">
                            Solar is an asset that appreciates. Increase your property value while hedging against future hikes in utility electricity tariffs.
                        </p>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <!-- PAGE 6: PAYMENT & WARRANTY -->
    <div class="page-container page-break relative">
        <!-- Top Wave -->
        <div class="wave-top-accent"></div>
        <div class="wave-top"></div>
        
        <!-- Logo (CENTERED) -->
        <div class="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-32">
            <img src="https://github.com/vsustainsolar/quotegen/blob/f079f0ae77e388c7c8747b26688ade236b61cbd1/Uplodes/v%20sustain%20logo.png?raw=true" alt="V Sustain Logo" class="w-full object-contain">
        </div>

        <div class="relative z-20 pt-48 px-12 pb-12">
            <!-- Payment Terms - Shifted Down -->
            <div class="flex items-center gap-3 mb-16 mt-8">
                <i class="far fa-credit-card text-3xl text-brand-blue"></i>
                <h2 class="text-3xl font-bold text-brand-blue">Payment Terms</h2>
            </div>

            <!-- Redesigned Payment Steps with FontAwesome Icons -->
            <div class="relative px-4 mb-20">
                <!-- Connecting Line Base -->
                <div class="absolute top-[35%] left-0 w-full h-1 bg-gray-200 z-0 -translate-y-1/2 rounded-full"></div>
                <!-- Connecting Line Highlight -->
                <div class="absolute top-[35%] left-0 w-2/3 h-1 bg-brand-lightBlue/50 z-0 -translate-y-1/2 rounded-full"></div>

                <div class="flex justify-between items-start relative z-10">
                    <!-- Step 1 -->
                    <div class="flex flex-col items-center w-1/3">
                        <div class="bg-white p-2 rounded-full shadow-lg border-4 border-brand-blue w-32 h-32 flex items-center justify-center mb-6 transform hover:scale-105 transition-transform duration-300">
                             <i class="fas fa-file-contract text-5xl text-brand-blue"></i>
                        </div>
                        <div class="bg-white p-4 rounded-xl shadow-md border-b-4 border-brand-blue w-4/5 text-center">
                            <span class="block text-3xl font-bold text-brand-blue leading-none mb-1">25%</span>
                            <span class="block font-bold text-gray-700 text-sm uppercase tracking-wider mb-1">Advance</span>
                            <span class="block text-xs text-gray-500 font-medium">With Purchase Order</span>
                        </div>
                    </div>

                    <!-- Step 2 -->
                    <div class="flex flex-col items-center w-1/3">
                        <div class="bg-white p-2 rounded-full shadow-lg border-4 border-brand-orange w-32 h-32 flex items-center justify-center mb-6 transform hover:scale-105 transition-transform duration-300">
                            <i class="fas fa-truck-fast text-5xl text-brand-orange"></i>
                        </div>
                        <div class="bg-white p-4 rounded-xl shadow-md border-b-4 border-brand-orange w-4/5 text-center">
                             <span class="block text-3xl font-bold text-brand-orange leading-none mb-1">65%</span>
                             <span class="block font-bold text-gray-700 text-sm uppercase tracking-wider mb-1">Delivery</span>
                             <span class="block text-xs text-gray-500 font-medium">On Material Arrival</span>
                        </div>
                    </div>

                    <!-- Step 3 -->
                    <div class="flex flex-col items-center w-1/3">
                        <div class="bg-white p-2 rounded-full shadow-lg border-4 border-brand-green w-32 h-32 flex items-center justify-center mb-6 transform hover:scale-105 transition-transform duration-300">
                            <i class="fas fa-clipboard-check text-5xl text-brand-green"></i>
                        </div>
                        <div class="bg-white p-4 rounded-xl shadow-md border-b-4 border-brand-green w-4/5 text-center">
                             <span class="block text-3xl font-bold text-brand-green leading-none mb-1">10%</span>
                             <span class="block font-bold text-gray-700 text-sm uppercase tracking-wider mb-1">Completion</span>
                             <span class="block text-xs text-gray-500 font-medium">After Installation</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Warranty Terms -->
            <div class="flex items-center gap-3 mb-8">
                <i class="fas fa-shield-alt text-3xl text-brand-blue"></i>
                <h2 class="text-3xl font-bold text-brand-blue">Warranty Terms</h2>
            </div>

            <div class="bg-gradient-to-r from-brand-blue to-[#004080] w-full p-8 rounded-2xl flex justify-between items-center text-white mb-8 shadow-2xl relative overflow-hidden">
                <!-- Background decorative icons -->
                <i class="fas fa-shield-alt absolute -right-10 -bottom-10 text-9xl text-white opacity-10"></i>

                <!-- Item 1 -->
                <div class="flex flex-col items-center flex-1 relative z-10">
                    <div class="flex items-center gap-2 mb-2">
                        <i class="fas fa-solar-panel text-3xl text-brand-orange"></i>
                        <span class="text-4xl font-bold">25+</span>
                    </div>
                    <span class="font-semibold tracking-wide text-center">YEARS PERFORMANCE</span>
                    <span class="text-xs opacity-75 mt-1">On PV Modules</span>
                </div>
                 <!-- Divider -->
                 <div class="h-16 w-px bg-white/30"></div>
                 <!-- Item 2 -->
                 <div class="flex flex-col items-center flex-1 relative z-10">
                    <div class="flex items-center gap-2 mb-2">
                        <i class="fas fa-charging-station text-3xl text-brand-orange"></i>
                        <span class="text-4xl font-bold">8</span>
                    </div>
                    <span class="font-semibold tracking-wide text-center">YEARS WARRANTY</span>
                    <span class="text-xs opacity-75 mt-1">On Inverter</span>
                </div>
                 <!-- Divider -->
                 <div class="h-16 w-px bg-white/30"></div>
                 <!-- Item 3 -->
                 <div class="flex flex-col items-center flex-1 relative z-10">
                    <div class="flex items-center gap-2 mb-2">
                        <i class="fas fa-tools text-3xl text-brand-orange"></i>
                        <span class="text-4xl font-bold">5</span>
                    </div>
                    <span class="font-semibold tracking-wide text-center">YEARS SERVICE</span>
                    <span class="text-xs opacity-75 mt-1">On System</span>
                </div>
            </div>

            <p class="text-xs text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-200 leading-relaxed">
                <strong class="text-brand-blue">Note:</strong> Please refer to the T&C and warranty documents for further details. Warranty is as per OEM terms & conditions. The warranty period depends on the make of the specific inverter selected.
            </p>
        </div>
    </div>

     <!-- PAGE 7: TERMS & CONDITIONS -->
     <div class="page-container page-break relative">
        <!-- Top Wave -->
        <div class="wave-top-accent h-[120px]"></div>
        <div class="wave-top h-[140px]"></div>

        <!-- Logo (CENTERED) -->
        <div class="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-32">
            <img src="https://github.com/vsustainsolar/quotegen/blob/f079f0ae77e388c7c8747b26688ade236b61cbd1/Uplodes/v%20sustain%20logo.png?raw=true" alt="V Sustain Logo" class="w-full object-contain">
        </div>

        <div class="relative z-20 mt-40 px-12">
            <!-- Header -->
            <div class="flex items-center gap-3 mb-6">
                <i class="fas fa-gavel text-3xl text-brand-blue"></i>
                <h2 class="text-3xl font-bold text-brand-blue">General Terms & Conditions</h2>
            </div>

            <p class="text-sm text-gray-600 mb-6 italic border-b pb-2">These General Terms and Conditions have been agreed between the customer/consumer and the Channel Partner only.</p>

            <div class="grid grid-cols-1 gap-4 text-xs text-gray-800 text-justify leading-relaxed bg-white/80 p-4 rounded">
                <div class="bg-gray-50/80 p-3 rounded border border-gray-100">
                    <h4 class="font-bold text-brand-blue mb-1">1. Validity</h4>
                    <p>Quotation is valid for <span class="font-bold">15 Days</span> from the date of submission.</p>
                </div>

                <div class="bg-gray-50/80 p-3 rounded border border-gray-100">
                    <h4 class="font-bold text-brand-blue mb-1">2. Taxes & Duties</h4>
                    <p>On Materials, if acceptance of Purchase Order due to change of government policy if any new taxes are applicable, such rates will be to the Consumer's account. Prices are inclusive of Standard Packing.</p>
                </div>

                <div class="bg-gray-50/80 p-3 rounded border border-gray-100">
                    <h4 class="font-bold text-brand-blue mb-1">3. Delivery Period</h4>
                    <p>The goods will be delivered as per the agreed terms & conditions as per duly accepted PO. Deliveries are subject to "Force Majeure".</p>
                </div>

                <div class="bg-gray-50/80 p-3 rounded border border-gray-100">
                    <h4 class="font-bold text-brand-blue mb-1">4. Cancellation</h4>
                    <p>Order received and acknowledged by us shall not be subject to cancellation, either wholly or partly for any reason whatsoever, without our consent. Cancellation may attract cancellation charges as per company policy.</p>
                </div>

                <div class="bg-gray-50/80 p-3 rounded border border-gray-100">
                    <h4 class="font-bold text-brand-blue mb-1">5. Exclusions</h4>
                    <p class="mb-1">The warranty shall not apply to defects resulting from:</p>
                    <ul class="list-disc list-inside pl-2 space-y-1 text-gray-600">
                        <li>Any materials, components, tools, design, or software provided by Consumers.</li>
                        <li>Negligence or willful misconduct of Consumers.</li>
                        <li>Parts, accessories or attachments other than those supplied by Consumers</li>
                        <li>Improper service work carried out by Consumers without written consent.</li>
                        <li>Use of unsuitable material or consumables by Consumers.</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <!-- PAGE 8: PROPOSAL BY / CONTACT (Enhanced) -->
    <div class="page-container page-break relative flex flex-col">
        <!-- Top Image Section REPLACED WITH BG 3.png -->
        <div class="h-[40%] w-full relative overflow-hidden">
            <img src="https://github.com/vsustainsolar/quotegen/blob/8f2c0c796ba02307c87dda837a906dc9c079aa05/Uplodes/bg%203.png?raw=true" alt="Office Meeting" class="w-full h-full object-cover">
            <div class="absolute inset-0 bg-gradient-to-t from-brand-blue/80 to-transparent"></div>
            
            <div class="absolute inset-0 flex flex-col items-center justify-center text-white z-10 text-center p-8">
                <i class="fas fa-check-circle text-5xl mb-4 text-brand-green drop-shadow-lg"></i>
                <h1 class="text-4xl font-bold mb-2 drop-shadow-md">Let's Go Solar</h1>
                <p class="text-xl opacity-90 font-light max-w-lg drop-shadow-md">Thank you for considering our proposal. We look forward to powering your journey to sustainability.</p>
            </div>
        </div>

         <!-- Logo (CENTERED) -->
         <div class="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-32 bg-white/90 p-2 rounded shadow-lg">
            <img src="https://github.com/vsustainsolar/quotegen/blob/f079f0ae77e388c7c8747b26688ade236b61cbd1/Uplodes/v%20sustain%20logo.png?raw=true" alt="V Sustain Logo" class="w-full object-contain">
        </div>

        <!-- Bottom Content -->
        <div class="h-[60%] w-full bg-white px-12 pt-16 relative flex flex-col items-center">
            
            <!-- Contact Card - Floating overlapping the image boundary -->
            <div class="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-8 -mt-24 z-20 flex items-start gap-8 border-t-8 border-brand-orange">
                
                <!-- Profile Photo Placeholder -->
                <div class="flex-shrink-0">
                    <div class="w-28 h-28 bg-gray-200 rounded-full overflow-hidden border-4 border-white shadow-md">
                        <img src="https://github.com/vsustainsolar/quotegen/blob/main/Uplodes/profile.png?raw=true" alt="Profile" class="w-full h-full object-cover">
                    </div>
                </div>

                <div class="flex-grow">
                    <p class="text-sm text-gray-500 uppercase tracking-wide font-bold mb-1">Proposal Submitted By</p>
                    <h2 class="text-2xl font-bold text-brand-blue">V-Sustain Solar Solutions</h2>
                    <p class="text-xs text-white bg-brand-green px-2 py-1 rounded inline-block mb-6 font-semibold">Authorized Luminous Partner</p>

                    <div class="space-y-4">
                        <div class="flex items-center gap-4 group">
                            <div class="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                <i class="fas fa-user"></i>
                            </div>
                            <div>
                                <p class="text-xs text-gray-400 font-bold uppercase">Contact Person</p>
                                <p class="text-gray-800 font-bold">Pravesh Kumar Tiwari</p>
                            </div>
                        </div>

                        <div class="flex items-center gap-4 group">
                             <div class="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                <i class="fas fa-envelope"></i>
                            </div>
                            <div>
                                <p class="text-xs text-gray-400 font-bold uppercase">Email</p>
                                <p class="text-gray-800">vsustainsolarsolutions@gmail.com</p>
                            </div>
                        </div>

                        <div class="flex items-center gap-4 group">
                             <div class="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors">
                                <i class="fas fa-phone-alt"></i>
                            </div>
                            <div>
                                <p class="text-xs text-gray-400 font-bold uppercase">Phone</p>
                                <p class="text-gray-800 font-mono text-lg">+91 99-000-00476</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Address Footer -->
            <div class="mt-auto mb-8 text-center w-full border-t border-gray-200 pt-6">
                 <p class="text-xs text-gray-400 mb-2">Office Address</p>
                 <p class="text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">NO.33/1, 6th main, Kanteerava Studio Peenya, Rajagopalnagar Main Rd, Nandini Layout, Bengaluru, Karnataka 560096</p>
                 
                 <div class="flex justify-center gap-4 mt-6 opacity-50">
                     <i class="fab fa-facebook text-xl text-brand-blue"></i>
                     <i class="fab fa-instagram text-xl text-brand-blue"></i>
                     <i class="fab fa-linkedin text-xl text-brand-blue"></i>
                     <i class="fab fa-whatsapp text-xl text-brand-green"></i>
                 </div>
            </div>
        </div>
    </div>
</body>
</html>`;
}

function buildSummaryQuotationHtml(totals, systemType) {
  return buildDetailedQuotationHtml(totals, systemType, true);
}

function buildShortQuotationHtml(totals, systemType) {
  const plantKw = Math.max(0, n($('systemKw').value));
  const customerName = $('customerName')?.value || 'Customer Name';
  const customerEmail = $('customerEmail')?.value || '';
  const proposalDate = new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' });
  const proposalNo = `VS/${new Date().getFullYear()}/001`;

  // NO SUBSIDY FOR OFF-GRID - removed subsidy check
  let subsidyBlock = '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${plantKw}KW Off-Grid ${customerName}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    <script>
      tailwind.config = { theme: { extend: { fontFamily: { sans: ['Inter', 'sans-serif'] }, colors: { brand: { blue: '#005bac', orange: '#ff9933', green: '#8cc63f' } } } } }
    </script>
    <style>
      @media print { @page { margin: 0; } .no-print { display: none !important; } body { background: white; } }
      body { background-color: #e5e7eb; font-family: 'Inter', sans-serif; }
      .page-container { background: white; width: 210mm; min-height: 297mm; margin: 2rem auto; padding: 40px; position: relative; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
    </style>
</head>
<body class="text-gray-800">
    <div class="fixed bottom-8 right-8 z-50 no-print">
        <button onclick="window.print()" class="bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-lg">Print</button>
    </div>

    <div class="page-container">
        <div class="flex justify-between items-start border-b-2 border-brand-orange pb-6 mb-8">
            <div class="w-40">
                <img src="https://github.com/vsustainsolar/quotegen/blob/f079f0ae77e388c7c8747b26688ade236b61cbd1/Uplodes/v%20sustain%20logo.png?raw=true" alt="V Sustain Logo" class="w-full">
            </div>
            <div class="text-right">
                <h1 class="text-3xl font-bold text-brand-blue mb-1">Quotation</h1>
                <p class="text-sm font-semibold text-gray-600"># ${proposalNo}</p>
                <p class="text-sm text-gray-500">${proposalDate}</p>
            </div>
        </div>

        <div class="flex justify-between mb-10 bg-gray-50 p-6 rounded-xl">
            <div>
                <h3 class="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Proposal For</h3>
                <p class="text-lg font-bold text-brand-blue">${escapeHtml(customerName)}</p>
                <p class="text-sm text-gray-600">${$('customerAddress')?.value || ''}</p>
                <p class="text-sm text-gray-600">${$('customerCity')?.value || 'Bengaluru'}</p>
            </div>
            <div class="text-right">
                <h3 class="text-xs font-bold text-gray-400 uppercase mb-1">System Details</h3>
                <p class="text-xl font-bold text-brand-green">${plantKw} KW</p>
                <p class="text-sm text-gray-600">Off-Grid Rooftop System</p>
                <p class="text-xs text-gray-500 mt-1">Luminous Authorized</p>
            </div>
        </div>

        <!-- Commercial Offer (Simplified) -->
        <div class="mb-8">
            <h3 class="text-lg font-bold text-brand-blue mb-4 border-l-4 border-brand-blue pl-3">Commercial Offer</h3>
            <table class="w-full text-sm border-collapse">
                <tr class="bg-gray-100 border-b border-gray-200">
                    <td class="p-4 font-medium">Supply & Installation of ${plantKw} KW Off-Grid Solar System</td>
                    <td class="p-4 text-right font-bold">${fmt(totals.grandTotal)}</td>
                </tr>
            </table>
            
            <div class="mt-2 text-right">
                <p class="text-xs text-gray-500">* Price is inclusive of GST, Installation, and Commissioning.</p>
            </div>
        </div>

        ${subsidyBlock}

        <!-- Key Inclusions -->
        <div class="mt-8">
            <h3 class="text-lg font-bold text-brand-blue mb-4 border-l-4 border-brand-orange pl-3">Key Inclusions</h3>
            <div class="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <div class="flex items-center gap-2"><i class="fas fa-check text-brand-green"></i> Tier-1 Solar Modules</div>
                <div class="flex items-center gap-2"><i class="fas fa-check text-brand-green"></i> Luminous Off-Grid Inverter</div>
                <div class="flex items-center gap-2"><i class="fas fa-check text-brand-green"></i> Solar Batteries</div>
                <div class="flex items-center gap-2"><i class="fas fa-check text-brand-green"></i> Standard Mounting Structure</div>
                <div class="flex items-center gap-2"><i class="fas fa-check text-brand-green"></i> ACDB & DCDB Protection</div>
                <div class="flex items-center gap-2"><i class="fas fa-check text-brand-green"></i> Installation & Commissioning</div>
            </div>
        </div>

        <!-- Footer / Contact -->
        <div class="absolute bottom-0 left-0 w-full bg-[#001f3f] text-white p-8">
            <div class="flex justify-between items-center max-w-4xl mx-auto">
                <div>
                    <h4 class="font-bold text-lg mb-1">V-Sustain Solar Solutions</h4>
                    <p class="text-xs opacity-75">Authorized Luminous Partner</p>
                </div>
                <div class="text-right text-sm">
                    <p><i class="fas fa-phone-alt mr-2"></i> +91 99-000-00476</p>
                    <p><i class="fas fa-envelope mr-2"></i> vsustainsolarsolutions@gmail.com</p>
                    <p class="text-xs opacity-50 mt-1">Bengaluru, Karnataka 560096</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
}

/* open the generated html in a new tab */
function openInNewWindow(html) {
  const w = window.open("", "_blank");
  if (!w) {
    alert("Popup blocked. Allow popups for this site to see the quotation.");
    return;
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
}

/* small escape to avoid raw HTML breakouts from descriptions */
function escapeHtml(text) {
  return String(text || '').replace(/[&<>"']/g, function (m) {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' })[m];
  });
} 

/* ===========================
   9. Finish / Helpers & Boot
   =========================== */

// initialization helper to avoid missing elements in different builds
function safeGet(id) {
  const el = document.getElementById(id);
  return el ? el : { value: '', checked: false };
}

// Small helper to initialize UI states when file first loads
(function boot() {
  // ensure custom margin inputs disabled by default where "use common" is checked
  ['inverter','battery','panels','acdb','dcdb','installation','structure','earthingSet'].forEach(id => {
    toggleCustomMarginInput(id);
  });
})();
