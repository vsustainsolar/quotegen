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
  { model: "PV MOD LUM 24590T144 BI-TS-31", watt: 590, price: 9694 }
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

function getGstFor(type) {
  if (type === 'panels') return 5;
  return 18; // inverter, battery, and all others
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

/* Note: The full quotation HTML templates are very large. 
   For now, using a simplified version. The full templates from on-grid 
   can be adapted later if needed. This provides basic functionality. */
function buildDetailedQuotationHtml(totals, systemType) {
  const plantKw = Math.max(0, n($('systemKw').value));
  const customerName = $('customerName')?.value || 'Customer Name';
  const customerAddress = $('customerAddress')?.value || 'Bengaluru';
  const customerCity = $('customerCity')?.value || '';
  const customerEmail = $('customerEmail')?.value || '';
  const date = new Date();
  const proposalDate = date.toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' });
  const proposalNo = `VS/${date.getFullYear()}/001`;

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
        <td class="p-3 border text-right">${fmt(amount)}</td>
      </tr>
    `;
  }).join('');

  const footerRows = `
  <tr class="bg-white/50">
    <td class="p-3 border"></td>
    <td class="p-3 border text-right font-medium">GST @ 5%</td>
    <td class="p-3 border"></td>
    <td class="p-3 border"></td>
    <td class="p-3 border text-right">${fmt(totals.gst5Total)}</td>
  </tr>

  <tr class="bg-white/50">
    <td class="p-3 border"></td>
    <td class="p-3 border text-right font-medium">GST @ 18%</td>
    <td class="p-3 border"></td>
    <td class="p-3 border"></td>
    <td class="p-3 border text-right">${fmt(totals.gst18Total)}</td>
  </tr>

  <tr class="bg-white/50 border-t">
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

  // Simplified HTML template - can be enhanced with full design later
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${plantKw}KW Off-Grid ${customerName}${customerEmail ? ' ' + customerEmail : ''}</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    fontFamily: { sans: ['Inter', 'sans-serif'] },
                    colors: {
                        brand: {
                            blue: '#005bac',
                            lightBlue: '#4fa8e0',
                            orange: '#ff9933',
                            green: '#8cc63f',
                        }
                    }
                }
            }
        }
    </script>
    <style>
        @media print {
            .page-break { page-break-before: always; break-before: page; }
            body { background: white; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            .page-container { box-shadow: none; margin: 0; width: 210mm; min-height: 297mm; max-height: 297mm; overflow: hidden; border: none; }
            [contenteditable="true"] { outline: none; }
            .no-print { display: none !important; }
        }
        body { background-color: #e5e7eb; }
        .page-container {
            background-color: white;
            background-image: url('https://github.com/Abhishekcodeking01/v-solar-quote/blob/8f2c0c796ba02307c87dda837a906dc9c079aa05/Uplodes/background%20v%20solar.png?raw=true');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            width: 210mm;
            min-height: 297mm;
            margin: 2rem auto;
            position: relative;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
    </style>
</head>
<body class="font-sans text-gray-800">
    <div class="fixed bottom-8 right-8 z-50 no-print flex flex-col gap-3">
        <button onclick="window.print()" class="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-2xl">Print</button>
    </div>

    <div class="page-container relative flex flex-col justify-between p-8">
        <div class="h-[13%] w-full flex justify-between items-start p-2 relative z-20 bg-white/90">
            <div class="w-36">
                <img src="https://github.com/Abhishekcodeking01/v-solar-quote/blob/9ae39ab1ba9eb2eedc38678b5d67f65a93283d84/Uplodes/v%20sustain%20logo.png?raw=true" alt="V Sustain Logo" class="w-full object-contain">
            </div>
            <div class="text-right text-brand-blue">
                <h2 class="font-bold text-xl">V-Sustain Solar Solutions</h2>
                <p class="text-sm">Authorized Luminous Partner</p>
                <p class="text-sm">Bengaluru</p>
                <p class="text-sm mt-1 font-bold">Proposal No: ${proposalNo}</p>
                <p class="text-sm">${proposalDate}</p>
            </div>
        </div>

        <div class="flex-1 p-8">
            <h1 class="text-3xl font-bold text-brand-blue mb-4">${plantKw} KW Off-Grid Solar System</h1>
            <p class="text-lg mb-4"><strong>Customer:</strong> ${customerName}</p>
            <p class="text-lg mb-4"><strong>Address:</strong> ${customerAddress} ${customerCity}</p>
            
            <h3 class="text-lg font-bold text-brand-green mb-3 mt-8">System Specifications</h3>
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

            <h3 class="text-lg font-bold text-brand-blue mb-3 mt-8">Commercial Proposal</h3>
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
    </div>
</body>
</html>`;
}

function buildSummaryQuotationHtml(totals, systemType) {
  // Similar to detailed but with prices hidden
  return buildDetailedQuotationHtml(totals, systemType).replace(/fmt\(amount\)/g, '"-"');
}

function buildShortQuotationHtml(totals, systemType) {
  const plantKw = Math.max(0, n($('systemKw').value));
  const customerName = $('customerName')?.value || 'Customer Name';
  const proposalDate = new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' });
  const proposalNo = `VS/${new Date().getFullYear()}/001`;

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
                <img src="https://github.com/Abhishekcodeking01/v-solar-quote/blob/9ae39ab1ba9eb2eedc38678b5d67f65a93283d84/Uplodes/v%20sustain%20logo.png?raw=true" alt="V Sustain Logo" class="w-full">
            </div>
            <div class="text-right">
                <h1 class="text-3xl font-bold text-brand-blue mb-1">Quotation</h1>
                <p class="text-sm font-semibold text-gray-600"># ${proposalNo}</p>
                <p class="text-sm text-gray-500">${proposalDate}</p>
            </div>
        </div>

        <div class="flex justify-between mb-10 bg-gray-50 p-6 rounded-xl">
            <div>
                <h3 class="text-xs font-bold text-gray-400 uppercase mb-1">Proposal For</h3>
                <p class="text-lg font-bold text-brand-blue">${customerName}</p>
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

        <div class="mb-8">
            <h3 class="text-lg font-bold text-brand-blue mb-4">Commercial Offer</h3>
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

        <div class="mt-8">
            <h3 class="text-lg font-bold text-brand-blue mb-4">Key Inclusions</h3>
            <div class="grid grid-cols-2 gap-4 text-sm text-gray-700">
                <div class="flex items-center gap-2"><i class="fas fa-check text-brand-green"></i> Tier-1 Solar Modules</div>
                <div class="flex items-center gap-2"><i class="fas fa-check text-brand-green"></i> Luminous Off-Grid Inverter</div>
                <div class="flex items-center gap-2"><i class="fas fa-check text-brand-green"></i> Solar Batteries</div>
                <div class="flex items-center gap-2"><i class="fas fa-check text-brand-green"></i> Standard Mounting Structure</div>
                <div class="flex items-center gap-2"><i class="fas fa-check text-brand-green"></i> ACDB & DCDB Protection</div>
                <div class="flex items-center gap-2"><i class="fas fa-check text-brand-green"></i> Installation & Commissioning</div>
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
