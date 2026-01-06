/*******************************************************
 * off-grid/script.js
 * Off-Grid Calculation + Quotation Engine
 * Based on original On-Grid script structure
 *******************************************************/

/* ===========================
   1. DATASETS (Off-Grid Specific)
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

// SOLAR BATTERIES (New)
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

const panelList = [
  { model: "550W Mono Perc", watts: 550, price: 22 },
  { model: "540W Mono Perc", watts: 540, price: 21 },
  { model: "450W Mono Perc", watts: 450, price: 20 },
  { model: "335W Poly", watts: 335, price: 19 }
];

const acdbList = [
  { model: "1 Phase ACDB", price: 1800 },
  { model: "3 Phase ACDB", price: 3800 }
];

const dcdbList = [
  { model: "1 In 1 Out", price: 1500 },
  { model: "2 In 2 Out", price: 2500 },
  { model: "3 In 3 Out", price: 3500 }
];

const meterOptions = [
  { model: "Single Phase Net Meter", price: 8000 },
  { model: "Three Phase Net Meter", price: 15000 },
  { model: "None", price: 0 }
];

/* ===========================
   2. INITIALIZATION
   =========================== */

window.onload = function() {
    populateSelects();
    attachEventListeners();
    setInitialValues();
    recalcAllCards();
};

function populateSelects() {
    // Inverter
    const invSelect = safeGet('inverterSelect');
    inverterList.forEach(i => {
        let opt = document.createElement('option');
        opt.value = i.model;
        opt.textContent = `${i.model} - ₹${fmt(i.price)}`;
        invSelect.appendChild(opt);
    });

    // Battery (Added for Off-Grid)
    const batSelect = safeGet('batterySelect');
    batteryList.forEach(b => {
        let opt = document.createElement('option');
        opt.value = b.model;
        opt.textContent = `${b.model} - ₹${fmt(b.price)}`;
        batSelect.appendChild(opt);
    });

    // Panels
    const pnlSelect = safeGet('panelSelect');
    panelList.forEach(p => {
        let opt = document.createElement('option');
        opt.value = p.model;
        opt.textContent = `${p.model} (${p.watts}W)`;
        pnlSelect.appendChild(opt);
    });

    // BOS
    const acdbSelect = safeGet('acdbSelect');
    acdbList.forEach(a => {
        let opt = document.createElement('option');
        opt.value = a.model;
        opt.textContent = `${a.model} - ₹${fmt(a.price)}`;
        acdbSelect.appendChild(opt);
    });
    
    const dcdbSelect = safeGet('dcdbSelect');
    dcdbList.forEach(d => {
        let opt = document.createElement('option');
        opt.value = d.model;
        opt.textContent = `${d.model} - ₹${fmt(d.price)}`;
        dcdbSelect.appendChild(opt);
    });

    // Net Meter
    const nmSelect = safeGet('netMeterSelect');
    meterOptions.forEach(m => {
        let opt = document.createElement('option');
        opt.value = m.model;
        opt.textContent = `${m.model} - ₹${fmt(m.price)}`;
        nmSelect.appendChild(opt);
    });
}

function attachEventListeners() {
    // Global Inputs
    safeGet('systemKW').addEventListener('input', () => { updateSystemDependent(); recalcAllCards(); });
    safeGet('commonMargin').addEventListener('input', recalcAllCards);
    safeGet('useCommonMargin').addEventListener('change', () => {
        const useCommon = safeGet('useCommonMargin').checked;
        const marginGroups = document.querySelectorAll('.margin-col');
        marginGroups.forEach(g => {
            if (useCommon) g.classList.add('disabled');
            else g.classList.remove('disabled');
        });
        recalcAllCards();
    });

    // Inverter Section
    safeGet('inverterSelect').addEventListener('change', recalcAllCards);
    safeGet('inverterQty').addEventListener('input', recalcAllCards);
    safeGet('inverter-manual-toggle').addEventListener('change', () => toggleOverrideUI('inverter'));
    safeGet('inverterManualPrice').addEventListener('input', recalcAllCards);
    safeGet('inverterMargin').addEventListener('input', recalcAllCards);

    // Battery Section (Added for Off-Grid)
    safeGet('batterySelect').addEventListener('change', recalcAllCards);
    safeGet('batteryQty').addEventListener('input', recalcAllCards);
    safeGet('battery-manual-toggle').addEventListener('change', () => toggleOverrideUI('battery'));
    safeGet('batteryManualPrice').addEventListener('input', recalcAllCards);
    safeGet('batteryMargin').addEventListener('input', recalcAllCards);

    // Panel Section
    safeGet('panelSelect').addEventListener('change', recalcAllCards);
    safeGet('panelQty').addEventListener('input', recalcAllCards);
    safeGet('panel-manual-toggle').addEventListener('change', () => toggleOverrideUI('panel'));
    safeGet('panelManualPrice').addEventListener('input', recalcAllCards);
    safeGet('panelMargin').addEventListener('input', recalcAllCards);

    // Structure Section
    safeGet('structureSelect').addEventListener('change', recalcAllCards);
    safeGet('structureRate').addEventListener('input', recalcAllCards);
    safeGet('structure-manual-toggle').addEventListener('change', () => toggleOverrideUI('structure'));
    safeGet('structureManualPrice').addEventListener('input', recalcAllCards);
    safeGet('structureMargin').addEventListener('input', recalcAllCards);
    
    // Installation Section
    safeGet('installRate').addEventListener('input', recalcAllCards);
    safeGet('install-manual-toggle').addEventListener('change', () => toggleOverrideUI('install'));
    safeGet('installManualPrice').addEventListener('input', recalcAllCards);
    safeGet('installMargin').addEventListener('input', recalcAllCards);

    // BOS Section
    safeGet('acdbSelect').addEventListener('change', recalcAllCards);
    safeGet('acdbQty').addEventListener('input', recalcAllCards);
    safeGet('dcdbSelect').addEventListener('change', recalcAllCards);
    safeGet('dcdbQty').addEventListener('input', recalcAllCards);
    safeGet('boxesMargin').addEventListener('input', recalcAllCards);

    safeGet('dcCableQty').addEventListener('input', recalcAllCards);
    safeGet('dcCableRate').addEventListener('input', recalcAllCards);
    safeGet('acCableQty').addEventListener('input', recalcAllCards);
    safeGet('acCableRate').addEventListener('input', recalcAllCards);
    safeGet('cableMargin').addEventListener('input', recalcAllCards);

    safeGet('netMeterSelect').addEventListener('change', recalcAllCards);
    safeGet('netMeterQty').addEventListener('input', recalcAllCards);
    safeGet('netmeter-manual-toggle').addEventListener('change', () => toggleOverrideUI('netmeter'));
    safeGet('netmeterManualPrice').addEventListener('input', recalcAllCards);
    safeGet('netmeterMargin').addEventListener('input', recalcAllCards);

    safeGet('earthingQty').addEventListener('input', recalcAllCards);
    safeGet('earthingRate').addEventListener('input', recalcAllCards);
    safeGet('laQty').addEventListener('input', recalcAllCards);
    safeGet('laRate').addEventListener('input', recalcAllCards);
    safeGet('safetyMargin').addEventListener('input', recalcAllCards);
}

function setInitialValues() {
    // Default system sizing logic if needed
    updateSystemDependent();
}

function updateSystemDependent() {
    // Example: Auto-adjust cables based on KW if needed
    // const kw = n('systemKW');
    // if (kw > 0) safeGet('dcCableQty').value = kw * 10;
}

/* ===========================
   3. CORE LOGIC & HELPERS
   =========================== */

function n(idOrValue) {
    if (typeof idOrValue === 'string') {
        const el = document.getElementById(idOrValue);
        return el ? (parseFloat(el.value) || 0) : 0;
    }
    return parseFloat(idOrValue) || 0;
}

function fmt(num) {
    return num.toLocaleString('en-IN');
}

// Improved safeGet to prevent crashes on missing listeners
function safeGet(id) {
    const el = document.getElementById(id);
    return el ? el : { value: '', checked: false, addEventListener: ()=>{} };
}

function getCommonMargin() {
    return safeGet('useCommonMargin').checked ? n('commonMargin') : null;
}

function toggleOverrideUI(section) {
    const isManual = safeGet(section + '-manual-toggle').checked;
    const group = safeGet(section + '-override-group');
    if(group && group.classList) {
        if(isManual) group.classList.remove('hidden-row');
        else group.classList.add('hidden-row');
    }
    recalcAllCards();
}

// TAXATION LOGIC (Custom for Off-Grid)
function getGstFor(type) {
    // Inverter, Battery, Panel = 5%
    if (type === 'inverter') return 0.05;
    if (type === 'battery') return 0.05; 
    if (type === 'panel') return 0.05;
    // Services/BOS = 18%
    return 0.18; 
}


/* ===========================
   4. CARD UPDATE FUNCTIONS
   =========================== */

function updateInverterData() {
    const isManual = safeGet('inverter-manual-toggle').checked;
    let basePrice = 0;
    let modelName = "";

    if (isManual) {
        basePrice = n('inverterManualPrice');
        modelName = "Manual Inverter Spec";
    } else {
        const sel = safeGet('inverterSelect').value;
        const item = inverterList.find(i => i.model === sel);
        if (item) {
            basePrice = item.price;
            modelName = item.model;
        }
    }

    const qty = n('inverterQty');
    const totalBase = basePrice * qty;
    
    // Margin
    const common = getCommonMargin();
    const margin = (common !== null) ? common : n('inverterMargin');
    const withMargin = totalBase + (totalBase * margin / 100);

    // GST
    const gstRate = getGstFor('inverter'); // 5%
    const tax = withMargin * gstRate;
    const final = withMargin + tax;

    const el = document.getElementById('inverterTotal');
    if(el) el.textContent = "₹" + fmt(Math.round(final));

    return { 
        name: modelName, 
        qty: qty, 
        base: totalBase, 
        marginAmt: withMargin - totalBase, 
        tax: tax, 
        total: final,
        type: 'inverter'
    };
}

// NEW: Battery Update Function
function updateBatteryData() {
    const isManual = safeGet('battery-manual-toggle').checked;
    let basePrice = 0;
    let modelName = "";

    if (isManual) {
        basePrice = n('batteryManualPrice');
        modelName = "Manual Battery Spec";
    } else {
        const sel = safeGet('batterySelect').value;
        const item = batteryList.find(b => b.model === sel);
        if (item) {
            basePrice = item.price;
            modelName = item.model;
        }
    }

    const qty = n('batteryQty');
    const totalBase = basePrice * qty;
    
    const common = getCommonMargin();
    const margin = (common !== null) ? common : n('batteryMargin');
    const withMargin = totalBase + (totalBase * margin / 100);

    // GST 5%
    const gstRate = getGstFor('battery');
    const tax = withMargin * gstRate;
    const final = withMargin + tax;

    const el = document.getElementById('batteryTotal');
    if(el) el.textContent = "₹" + fmt(Math.round(final));

    return { 
        name: modelName, 
        qty: qty, 
        base: totalBase, 
        marginAmt: withMargin - totalBase, 
        tax: tax, 
        total: final,
        type: 'battery'
    };
}

function updatePanelData() {
    const isManual = safeGet('panel-manual-toggle').checked;
    const sysKW = n('systemKW');
    let totalBase = 0;
    let modelName = "";
    let qty = 0;

    if (isManual) {
        const ratePerWatt = n('panelManualPrice');
        const totalWatts = sysKW * 1000;
        totalBase = totalWatts * ratePerWatt;
        modelName = "Custom Panels";
        qty = Math.ceil(totalWatts / 550);
        safeGet('panelQty').value = qty; 
    } else {
        const sel = safeGet('panelSelect').value;
        const item = panelList.find(p => p.model === sel);
        if (item) {
            const req = (sysKW * 1000) / item.watts;
            qty = Math.ceil(req);
            safeGet('panelQty').value = qty; 
            
            const costPerPanel = item.price * item.watts;
            totalBase = costPerPanel * qty;
            modelName = item.model;
        }
    }

    const common = getCommonMargin();
    const margin = (common !== null) ? common : n('panelMargin');
    const withMargin = totalBase + (totalBase * margin / 100);

    const gstRate = getGstFor('panel'); // 5%
    const tax = withMargin * gstRate;
    const final = withMargin + tax;

    const el = document.getElementById('panelTotal');
    if(el) el.textContent = "₹" + fmt(Math.round(final));

    return { name: modelName, qty: qty, base: totalBase, marginAmt: withMargin - totalBase, tax: tax, total: final, type: 'panel' };
}

function updateStructureData() {
    const isManual = safeGet('structure-manual-toggle').checked;
    const sysKW = n('systemKW');
    let totalBase = 0;
    let typeName = safeGet('structureSelect').value;

    if (isManual) {
        totalBase = n('structureManualPrice');
    } else {
        const rate = n('structureRate'); 
        totalBase = rate * sysKW;
    }

    const common = getCommonMargin();
    const margin = (common !== null) ? common : n('structureMargin');
    const withMargin = totalBase + (totalBase * margin / 100);
    
    const tax = withMargin * getGstFor('structure');
    const final = withMargin + tax;

    const el = document.getElementById('structureTotal');
    if(el) el.textContent = "₹" + fmt(Math.round(final));
    return { name: "Structure (" + typeName + ")", qty: 1, base: totalBase, marginAmt: withMargin - totalBase, tax: tax, total: final, type: 'structure' };
}

function updateInstallData() {
    const isManual = safeGet('install-manual-toggle').checked;
    const sysKW = n('systemKW');
    let totalBase = 0;

    if (isManual) {
        totalBase = n('installManualPrice');
    } else {
        const rate = n('installRate'); 
        totalBase = rate * sysKW;
    }

    const common = getCommonMargin();
    const margin = (common !== null) ? common : n('installMargin');
    const withMargin = totalBase + (totalBase * margin / 100);
    
    const tax = withMargin * getGstFor('install');
    const final = withMargin + tax;

    const el = document.getElementById('installTotal');
    if(el) el.textContent = "₹" + fmt(Math.round(final));
    return { name: "I&C, Transport", qty: 1, base: totalBase, marginAmt: withMargin - totalBase, tax: tax, total: final, type: 'other' };
}

function updateBosData() {
    const common = getCommonMargin();
    const bosItems = [];
    
    // ACDB/DCDB
    const acdbP = acdbList.find(a => a.model === safeGet('acdbSelect').value)?.price || 0;
    const dcdbP = dcdbList.find(d => d.model === safeGet('dcdbSelect').value)?.price || 0;
    const acdbTotal = acdbP * n('acdbQty');
    const dcdbTotal = dcdbP * n('dcdbQty');
    const boxBase = acdbTotal + dcdbTotal;
    const boxMargin = (common !== null) ? common : n('boxesMargin');
    const boxSell = boxBase + (boxBase * boxMargin / 100);
    const boxTax = boxSell * 0.18;
    
    const boxEl = document.getElementById('boxesTotal');
    if(boxEl) boxEl.textContent = "₹" + fmt(Math.round(boxSell + boxTax));
    
    bosItems.push({name: "ACDB / DCDB", total: boxSell + boxTax, tax: boxTax, base: boxSell});

    // Cables
    const dcC = n('dcCableQty') * n('dcCableRate');
    const acC = n('acCableQty') * n('acCableRate');
    const cabBase = dcC + acC;
    const cabMargin = (common !== null) ? common : n('cableMargin');
    const cabSell = cabBase + (cabBase * cabMargin / 100);
    const cabTax = cabSell * 0.18;
    
    const cabEl = document.getElementById('cableTotal');
    if(cabEl) cabEl.textContent = "₹" + fmt(Math.round(cabSell + cabTax));
    
    bosItems.push({name: "DC/AC Cables", total: cabSell + cabTax, tax: cabTax, base: cabSell});

    // Net Meter
    const isMeterManual = safeGet('netmeter-manual-toggle').checked;
    let meterBase = 0;
    if (isMeterManual) {
        meterBase = n('netmeterManualPrice');
    } else {
        const mSel = safeGet('netMeterSelect').value;
        const mItem = meterOptions.find(m => m.model === mSel);
        meterBase = (mItem ? mItem.price : 0) * n('netMeterQty');
    }
    const meterMargin = (common !== null) ? common : n('netmeterMargin');
    const meterSell = meterBase + (meterBase * meterMargin / 100);
    const meterTax = meterSell * 0.18;

    const nmEl = document.getElementById('netMeterTotal');
    if(nmEl) nmEl.textContent = "₹" + fmt(Math.round(meterSell + meterTax));
    
    bosItems.push({name: "Net Metering/Liasoning", total: meterSell + meterTax, tax: meterTax, base: meterSell});

    // Earthing
    const earth = n('earthingQty') * n('earthingRate');
    const la = n('laQty') * n('laRate');
    const safeBase = earth + la;
    const safeMargin = (common !== null) ? common : n('safetyMargin');
    const safeSell = safeBase + (safeBase * safeMargin / 100);
    const safeTax = safeSell * 0.18;
    
    const safeEl = document.getElementById('safetyTotal');
    if(safeEl) safeEl.textContent = "₹" + fmt(Math.round(safeSell + safeTax));

    bosItems.push({name: "Earthing & LA", total: safeSell + safeTax, tax: safeTax, base: safeSell});

    return bosItems;
}

// Custom Products
let customItems = [];
function addCustomProduct() {
    const container = document.getElementById('customProductList');
    if(!container) return; // safety
    const id = Date.now();
    const div = document.createElement('div');
    div.className = "row custom-row";
    div.id = `custom-${id}`;
    div.innerHTML = `
        <div class="col"><input type="text" placeholder="Item Name" class="c-name"></div>
        <div class="col"><input type="number" placeholder="Cost" class="c-cost" oninput="recalcAllCards()"></div>
        <button style="background:red; color:white; border:none; padding:5px 10px; cursor:pointer;" onclick="removeCustom('${id}')">X</button>
    `;
    container.appendChild(div);
}

function removeCustom(id) {
    const el = document.getElementById(`custom-${id}`);
    if (el) el.remove();
    recalcAllCards();
}

function getCustomData() {
    const rows = document.querySelectorAll('.custom-row');
    let items = [];
    rows.forEach(r => {
        const name = r.querySelector('.c-name').value;
        const cost = parseFloat(r.querySelector('.c-cost').value) || 0;
        if(name && cost) {
            const tax = cost * 0.18; 
            const final = cost + tax; 
            items.push({ name: name, qty: 1, base: cost, tax: tax, total: final, type: 'custom' });
        }
    });
    return items;
}

/* ===========================
   5. MASTER RECALCULATION
   =========================== */

let currentQuoteData = {};

function recalcAllCards() {
    const invData = updateInverterData();
    const batData = updateBatteryData(); // Include Battery
    const pnlData = updatePanelData();
    const strData = updateStructureData();
    const instData = updateInstallData();
    const bosDataArray = updateBosData(); 
    const custDataArray = getCustomData();

    // Aggregate
    let grandSub = 0;
    let grandTax = 0;

    const add = (item) => {
        grandSub += item.base; 
        grandTax += item.tax;
    };

    add(invData);
    add(batData); // Add Battery
    add(pnlData);
    add(strData);
    add(instData);
    bosDataArray.forEach(b => add(b));
    custDataArray.forEach(c => add(c));

    const total = grandSub + grandTax;

    currentQuoteData = {
        inv: invData,
        bat: batData, // NEW
        pnl: pnlData,
        str: strData,
        inst: instData,
        bos: bosDataArray,
        cust: custDataArray,
        totals: { sub: grandSub, tax: grandTax, final: total }
    };
}

/* ===========================
   6. PDF GENERATION
   =========================== */

function generateDetailedQuote() {
    const html = buildDetailedQuotationHtml();
    openInNewWindow(html);
}
function generateSummaryQuote() {
     const html = buildDetailedQuotationHtml(); 
     openInNewWindow(html);
}
function generateShortQuote() {
    alert("Short quote feature coming soon!");
}

function buildDetailedQuotationHtml() {
    const d = currentQuoteData;
    const date = new Date().toLocaleDateString('en-IN');
    const custName = safeGet('customerName').value || "Valued Customer";
    const custAddr = safeGet('customerAddress').value || "";
    const sysSize = safeGet('systemKW').value;

    // --- LINE ITEMS ---
    let rowsHtml = "";
    let i = 1;

    // 1. Inverter
    rowsHtml += `<tr><td>${i++}</td><td>Solar Inverter</td><td>${escapeHtml(d.inv.name)}</td><td>${d.inv.qty}</td><td>₹${fmt(d.inv.total)}</td></tr>`;
    
    // 2. Battery (Conditionally added)
    if (d.bat.qty > 0) {
        rowsHtml += `<tr><td>${i++}</td><td>Solar Battery</td><td>${escapeHtml(d.bat.name)}</td><td>${d.bat.qty}</td><td>₹${fmt(d.bat.total)}</td></tr>`;
    }

    // 3. Panels
    rowsHtml += `<tr><td>${i++}</td><td>Solar Modules</td><td>${escapeHtml(d.pnl.name)} (${d.pnl.qty} Nos)</td><td>${d.pnl.qty}</td><td>₹${fmt(d.pnl.total)}</td></tr>`;

    // 4. Structure
    rowsHtml += `<tr><td>${i++}</td><td>Structure</td><td>Module Mounting Structure</td><td>1 Set</td><td>₹${fmt(d.str.total)}</td></tr>`;
    
    // 5. BOS
    let bosTotal = 0;
    d.bos.forEach(b => { bosTotal += b.total; });
    rowsHtml += `<tr><td>${i++}</td><td>BOS (Balance of System)</td><td>ACDB, DCDB, Cables, Net Meter, Earthing, LA</td><td>1 Lot</td><td>₹${fmt(bosTotal)}</td></tr>`;
    
    // 6. Installation
    rowsHtml += `<tr><td>${i++}</td><td>I&C</td><td>Installation, Transport & Commissioning</td><td>1 Job</td><td>₹${fmt(d.inst.total)}</td></tr>`;

    // 7. Custom
    d.cust.forEach(c => {
        rowsHtml += `<tr><td>${i++}</td><td>Extra</td><td>${escapeHtml(c.name)}</td><td>1</td><td>₹${fmt(c.total)}</td></tr>`;
    });

    // Grand Total
    rowsHtml += `
        <tr style="font-weight:bold; background:#eef;">
            <td colspan="4" style="text-align:right;">Grand Total (Inc GST)</td>
            <td>₹${fmt(d.totals.final)}</td>
        </tr>
    `;

    return `
<!DOCTYPE html>
<html>
<head>
    <title>Off-Grid Quotation - ${escapeHtml(custName)}</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; margin: 0; padding: 0; background: #555; }
        .page { width: 210mm; min-height: 297mm; background: white; margin: 20px auto; padding: 40px; box-sizing: border-box; position: relative; }
        @media print { body { background: white; } .page { margin: 0; width: 100%; height: auto; page-break-after: always; } }
        
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #ff9800; padding-bottom: 20px; margin-bottom: 30px; }
        .logo { height: 80px; }
        .title h1 { color: #1e3c72; margin: 0; font-size: 28px; text-transform: uppercase; }
        .title p { margin: 5px 0 0; color: #666; }
        
        .client-info { background: #f4f4f4; padding: 20px; border-radius: 8px; margin-bottom: 30px; display: flex; justify-content: space-between; }
        .client-info div { width: 48%; }
        .label { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px; }
        .val { font-size: 16px; font-weight: 600; color: #333; margin-top: 5px; }
        
        table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        th { background: #1e3c72; color: white; padding: 12px; text-align: left; font-size: 14px; }
        td { padding: 12px; border-bottom: 1px solid #eee; color: #444; font-size: 14px; }
        
        .terms { margin-top: 40px; padding: 20px; border: 1px solid #eee; border-radius: 8px; }
        .terms h3 { color: #ff9800; margin-top: 0; }
        .terms ul { padding-left: 20px; margin: 0; font-size: 12px; color: #555; line-height: 1.6; }
        
        .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
    </style>
</head>
<body>
    <div class="page">
        <div class="header">
            <img src="../Uplodes/v sustain logo.png" class="logo" alt="Logo">
            <div class="title" style="text-align:right;">
                <h1>OFF-GRID PROPOSAL</h1>
                <p>Date: ${date}</p>
            </div>
        </div>

        <div class="client-info">
            <div>
                <div class="label">Customer Details</div>
                <div class="val">${escapeHtml(custName)}</div>
                <div style="font-size:14px; margin-top:2px;">${escapeHtml(custAddr)}</div>
            </div>
            <div style="text-align:right;">
                <div class="label">System Capacity</div>
                <div class="val">${sysSize} KW (Off-Grid)</div>
                <div style="font-size:14px; color:green; margin-top:5px;">With Battery Backup</div>
            </div>
        </div>

        <table>
            <thead>
                <tr>
                    <th width="5%">#</th>
                    <th width="20%">Category</th>
                    <th width="40%">Description / Model</th>
                    <th width="10%">Qty</th>
                    <th width="25%">Price (Inc GST)</th>
                </tr>
            </thead>
            <tbody>
                ${rowsHtml}
            </tbody>
        </table>

        <div class="terms">
            <h3>Terms & Conditions</h3>
            <ul>
                <li><strong>Payment:</strong> 50% Advance along with PO, 40% before dispatch, 10% after installation.</li>
                <li><strong>Validity:</strong> This quotation is valid for 7 days from the date of issue.</li>
                <li><strong>Warranty (Panels):</strong> 25 Years Performance Warranty.</li>
                <li><strong>Warranty (Inverter):</strong> As per Manufacturer Policy (Typ. 2-5 Years).</li>
                <li><strong>Warranty (Battery):</strong> As per Manufacturer Policy (Typ. 3-5 Years).</li>
                <li><strong>Delivery:</strong> 2-3 Weeks from the date of confirmed order.</li>
                <li><strong>Scope:</strong> Client to provide roof access, water, and electricity during installation.</li>
            </ul>
        </div>

        <div class="footer">
            <p>V-Sustain Solar Solutions | Bengaluru, Karnataka | +91 99-000-00476</p>
            <p>Thank you for choosing green energy!</p>
        </div>
    </div>
</body>
</html>`;
}

function openInNewWindow(html) {
  const w = window.open("", "_blank");
  if (!w) { alert("Popup blocked. Allow popups to see quote."); return; }
  w.document.open();
  w.document.write(html);
  w.document.close();
}

function escapeHtml(text) {
  return String(text || '').replace(/[&<>"']/g, function (m) {
    return ({ '&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'\":'&#39;' })[m];
  });
}
