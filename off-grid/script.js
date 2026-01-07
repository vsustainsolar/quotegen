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
  // System & Margin
  $('systemKw').addEventListener('input', () => { updateSystemDependent(); recalcAllCards(); });
  $('commonMargin').addEventListener('input', () => recalcAllCards());

  // Inverter
  $('inverterModel').addEventListener('change', updateInverterData);
  $('inverterQty').addEventListener('input', updateInverterData);
  $('inverterOverrideToggle').addEventListener('change', () => toggleOverrideUI('inverter'));
  $('inverterOverridePrice').addEventListener('input', updateInverterData);
  $('inverterUseCommonMargin').addEventListener('change', toggleCustomMarginInput.bind(null, 'inverter'));
  $('inverterCustomMargin').addEventListener('input', updateInverterData);

  // Battery (NEW)
  $('batteryModel').addEventListener('change', updateBatteryData);
  $('batteryQty').addEventListener('input', updateBatteryData);
  $('batteryOverrideToggle').addEventListener('change', () => toggleOverrideUI('battery'));
  $('batteryOverridePrice').addEventListener('input', updateBatteryData);
  $('batteryUseCommonMargin').addEventListener('change', toggleCustomMarginInput.bind(null, 'battery'));
  $('batteryCustomMargin').addEventListener('input', updateBatteryData);

  // Panels
  $('panelModel').addEventListener('change', () => updatePanelData(false));
  $('panelQty').addEventListener('input', () => updatePanelData(true));
  $('panelOverrideToggle').addEventListener('change', () => toggleOverrideUI('panel'));
  $('panelOverridePrice').addEventListener('input', () => updatePanelData(false));
  $('panelsUseCommonMargin').addEventListener('change', toggleCustomMarginInput.bind(null, 'panels'));
  $('panelsCustomMargin').addEventListener('input', () => updatePanelData(false));

  // Enable/disable toggles
  ['inverter', 'battery', 'panels'].forEach(pid => {
    const el = document.querySelector(`#${pid}Card input[type="checkbox"]`);
    if (el) el.addEventListener('change', () => recalcAllCards());
  });
}

function setInitialValues() {
  const kw = Math.max(1, n($('systemKw').value) || 1);
}

function updateSystemDependent() {
  const kw = Math.max(0, n($('systemKw').value));
  // Could add auto-calculations here if needed
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

function recalcAllCards() {
  updateInverterData();
  updateBatteryData(); // NEW
  updatePanelData(false);
}

/* ===========================
   6. BUILD LINE ITEMS
   =========================== */
function buildLineItemsForQuotation() {
  const items = [];

  // Inverter
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

  // Battery (NEW)
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

  // Panels
  if (isEnabled('panels')) {
    const sel = $('panelModel').selectedOptions[0];
    if (sel) {
      const qty = Math.max(0, n($('panelQty').value));
      const dealer = n(sel.dataset.price);
      const base = computeBasePrice('panel', dealer);
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
   7. QUOTATION GENERATION
   =========================== */
function generateDetailedQuote() {
  const totals = calcTotals();
  const html = buildQuotationHtml(totals, 'Detailed');
  openInNewWindow(html);
}

function generateSummaryQuote() {
  const totals = calcTotals();
  const html = buildQuotationHtml(totals, 'Summary');
  openInNewWindow(html);
}

function generateShortQuote() {
  const totals = calcTotals();
  const html = buildQuotationHtml(totals, 'Short');
  openInNewWindow(html);
}

function buildQuotationHtml(totals, type) {
  const plantKw = Math.max(0, n($('systemKw').value));
  const customerName = $('customerName')?.value || 'Customer Name';
  const customerEmail = $('customerEmail')?.value || '';
  const proposalDate = new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' });

  const rows = totals.items.map((it, idx) => {
    const amount = round2(it.qty * it.baseRate);
    const showPrice = type === 'Detailed' ? fmt(amount) : '-';
    return `
      <tr>
        <td>${idx + 1}</td>
        <td>${it.desc}</td>
        <td>${it.qty}</td>
        <td>${it.unit}</td>
        <td>${showPrice}</td>
      </tr>
    `;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${plantKw}KW Off-Grid ${customerName}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 40px; }
    h1 { color: #667eea; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background: #667eea; color: white; }
    .total-row { background: #f0f0f0; font-weight: bold; }
  </style>
</head>
<body>
  <h1>${plantKw} KW Off-Grid Solar System - ${type} Quotation</h1>
  <p><strong>Customer:</strong> ${customerName}</p>
  <p><strong>Date:</strong> ${proposalDate}</p>
  
  <table>
    <thead>
      <tr>
        <th>#</th>
        <th>Item</th>
        <th>Qty</th>
        <th>Unit</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      ${rows}
      <tr class="total-row">
        <td colspan="4">Subtotal</td>
        <td>${fmt(totals.subtotal)}</td>
      </tr>
      <tr>
        <td colspan="4">GST @ 5%</td>
        <td>${fmt(totals.gst5Total)}</td>
      </tr>
      <tr>
        <td colspan="4">GST @ 18%</td>
        <td>${fmt(totals.gst18Total)}</td>
      </tr>
      <tr class="total-row">
        <td colspan="4">Grand Total</td>
        <td>${fmt(totals.grandTotal)}</td>
      </tr>
    </tbody>
  </table>
  
  <button onclick="window.print()" style="padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">Print</button>
</body>
</html>`;
}

function openInNewWindow(html) {
  const w = window.open("", "_blank");
  if (!w) {
    alert("Popup blocked. Allow popups for this site.");
    return;
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
}
