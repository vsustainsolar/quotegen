/* =========================================
   1. DATA SETS (OFF-GRID VERSION)
   ========================================= */

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

// SOLAR BATTERIES (OFF-GRID)
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

const panelList = [
    { model: "550W Mono Perc", watts: 550, price: 22 }, // Price per watt
    { model: "540W Mono Perc", watts: 540, price: 21 },
    { model: "450W Mono Perc", watts: 450, price: 20 },
    { model: "335W Poly", watts: 335, price: 19 }
];

const acdbList = [
    { model: "1 Phase ACDB", price: 1500 },
    { model: "3 Phase ACDB", price: 3500 }
];

const dcdbList = [
    { model: "1 In 1 Out", price: 1200 },
    { model: "2 In 2 Out", price: 2200 },
    { model: "3 In 3 Out", price: 3200 }
];

/* =========================================
   2. INITIALIZATION
   ========================================= */

window.onload = function() {
    populateSelects();
    attachEventListeners();
    setInitialValues();
    recalcAllCards(); // Initial calculation
};

function populateSelects() {
    // Inverter
    const invSelect = $('inverterSelect');
    inverterList.forEach(i => {
        let opt = document.createElement('option');
        opt.value = i.model;
        opt.textContent = `${i.model} - ₹${fmt(i.price)}`;
        invSelect.appendChild(opt);
    });

    // Battery (NEW)
    const batSelect = $('batterySelect');
    batteryList.forEach(b => {
        let opt = document.createElement('option');
        opt.value = b.model;
        opt.textContent = `${b.model} - ₹${fmt(b.price)}`;
        batSelect.appendChild(opt);
    });

    // Panels
    const pnlSelect = $('panelSelect');
    panelList.forEach(p => {
        let opt = document.createElement('option');
        opt.value = p.model;
        opt.textContent = `${p.model} (${p.watts}W)`;
        pnlSelect.appendChild(opt);
    });

    // ACDB/DCDB
    const acdbSelect = $('acdbSelect');
    acdbList.forEach(a => {
        let opt = document.createElement('option');
        opt.value = a.model;
        opt.textContent = `${a.model} - ₹${fmt(a.price)}`;
        acdbSelect.appendChild(opt);
    });
    
    const dcdbSelect = $('dcdbSelect');
    dcdbList.forEach(d => {
        let opt = document.createElement('option');
        opt.value = d.model;
        opt.textContent = `${d.model} - ₹${fmt(d.price)}`;
        dcdbSelect.appendChild(opt);
    });
}

function attachEventListeners() {
    // Global
    $('systemKW').addEventListener('input', () => { updateSystemDependent(); recalcAllCards(); });
    $('commonMargin').addEventListener('input', recalcAllCards);
    $('useCommonMargin').addEventListener('change', () => {
        // Toggle disable state of individual margins
        const useCommon = $('useCommonMargin').checked;
        const marginGroups = document.querySelectorAll('.margin-group');
        marginGroups.forEach(g => {
            if (useCommon) g.classList.add('disabled');
            else g.classList.remove('disabled');
        });
        recalcAllCards();
    });

    // Inverter
    $('inverterSelect').addEventListener('change', recalcAllCards);
    $('inverterQty').addEventListener('input', recalcAllCards);
    $('inverterManualPrice').addEventListener('input', recalcAllCards);
    $('inverterMargin').addEventListener('input', recalcAllCards);

    // Battery (NEW)
    $('batterySelect').addEventListener('change', recalcAllCards);
    $('batteryQty').addEventListener('input', recalcAllCards);
    $('batteryManualPrice').addEventListener('input', recalcAllCards);
    $('batteryMargin').addEventListener('input', recalcAllCards);

    // Panel
    $('panelSelect').addEventListener('change', recalcAllCards);
    $('panelQty').addEventListener('input', recalcAllCards);
    $('panelManualPrice').addEventListener('input', recalcAllCards);
    $('panelMargin').addEventListener('input', recalcAllCards);

    // Structure & Install
    $('structureSelect').addEventListener('change', recalcAllCards);
    $('structureRate').addEventListener('input', recalcAllCards);
    $('structureManualPrice').addEventListener('input', recalcAllCards);
    $('structureMargin').addEventListener('input', recalcAllCards);
    
    $('installRate').addEventListener('input', recalcAllCards);
    $('installManualPrice').addEventListener('input', recalcAllCards);
    $('installMargin').addEventListener('input', recalcAllCards);

    // BOS
    $('acdbSelect').addEventListener('change', recalcAllCards);
    $('acdbQty').addEventListener('input', recalcAllCards);
    $('dcdbSelect').addEventListener('change', recalcAllCards);
    $('dcdbQty').addEventListener('input', recalcAllCards);
    $('boxesMargin').addEventListener('input', recalcAllCards);

    $('dcCableQty').addEventListener('input', recalcAllCards);
    $('dcCableRate').addEventListener('input', recalcAllCards);
    $('acCableQty').addEventListener('input', recalcAllCards);
    $('acCableRate').addEventListener('input', recalcAllCards);
    $('cableMargin').addEventListener('input', recalcAllCards);

    $('earthingQty').addEventListener('input', recalcAllCards);
    $('earthingRate').addEventListener('input', recalcAllCards);
    $('laQty').addEventListener('input', recalcAllCards);
    $('laRate').addEventListener('input', recalcAllCards);
    $('safetyMargin').addEventListener('input', recalcAllCards);
}

/* =========================================
   3. LOGIC & CALCULATIONS
   ========================================= */

// Helper: Get Number
function n(idOrValue) {
    if (typeof idOrValue === 'string') {
        const el = $(idOrValue);
        return el ? (parseFloat(el.value) || 0) : 0;
    }
    return parseFloat(idOrValue) || 0;
}

// Helper: Format Currency
function fmt(num) {
    return num.toLocaleString('en-IN');
}

// Helper: Get Element
function $(id) { return document.getElementById(id); }

// Logic: Determine Tax Rate
// UPDATED FOR OFF-GRID: 5% for Inverter, Battery, Panels
function getGstFor(type) {
    if (type === 'panel') return 0.05;
    if (type === 'inverter') return 0.05;
    if (type === 'battery') return 0.05; // User Requirement: 5%
    return 0.18; // Default for others
}

function getCommonMargin() {
    return $('useCommonMargin').checked ? n('commonMargin') : null;
}

function toggleOverrideUI(section) {
    const isManual = $(section + '-manual-toggle').checked;
    const group = $(section + '-override-group');
    if(isManual) group.classList.remove('hidden');
    else group.classList.add('hidden');
    recalcAllCards();
}

function setInitialValues() {
    const kw = n('systemKW');
    // Default assumptions
    $('structureRate').value = 5000;
    $('installRate').value = 4000;
}

function updateSystemDependent() {
    // When KW changes, update default Quantities if needed
    // Panel qty is calc'd in panel function, but BOS qtys might scale? 
    // Keeping simple for now.
}

// --- CARD UPDATERS ---

// 1. Inverter
function updateInverterData() {
    const isManual = $('inverter-manual-toggle').checked;
    let basePrice = 0;
    let modelName = "";

    if (isManual) {
        basePrice = n('inverterManualPrice');
        modelName = "Manual Inverter Spec";
    } else {
        const sel = $('inverterSelect').value;
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
    const gstRate = getGstFor('inverter');
    const tax = withMargin * gstRate;
    const final = withMargin + tax;

    $('inverterTotal').textContent = "₹" + fmt(Math.round(final));

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

// 2. Battery (NEW)
function updateBatteryData() {
    const isManual = $('battery-manual-toggle').checked;
    let basePrice = 0;
    let modelName = "";
    let voltage = 0;

    if (isManual) {
        basePrice = n('batteryManualPrice');
        modelName = "Manual Battery Spec";
    } else {
        const sel = $('batterySelect').value;
        const item = batteryList.find(b => b.model === sel);
        if (item) {
            basePrice = item.price;
            modelName = item.model;
            voltage = item.voltage;
        }
    }

    const qty = n('batteryQty');
    const totalBase = basePrice * qty;
    
    // Margin
    const common = getCommonMargin();
    const margin = (common !== null) ? common : n('batteryMargin');
    const withMargin = totalBase + (totalBase * margin / 100);

    // GST (5%)
    const gstRate = getGstFor('battery');
    const tax = withMargin * gstRate;
    const final = withMargin + tax;

    $('batteryTotal').textContent = "₹" + fmt(Math.round(final));

    return { 
        name: modelName, 
        qty: qty, 
        base: totalBase, 
        marginAmt: withMargin - totalBase, 
        tax: tax, 
        total: final,
        type: 'battery',
        voltage: voltage
    };
}

// 3. Panels
function updatePanelData() {
    const isManual = $('panel-manual-toggle').checked;
    const sysKW = n('systemKW');
    let totalBase = 0;
    let modelName = "";
    let qty = 0;

    if (isManual) {
        // Manual: User enters Price Per Watt
        // We still assume System KW determines total Watts
        const ratePerWatt = n('panelManualPrice');
        const totalWatts = sysKW * 1000;
        totalBase = totalWatts * ratePerWatt;
        modelName = "Custom Panels";
        qty = Math.ceil(totalWatts / 550); // rough estimate for display
        $('panelQty').value = qty; 
    } else {
        const sel = $('panelSelect').value;
        const item = panelList.find(p => p.model === sel);
        if (item) {
            // Calculate Qty required for System KW
            // e.g. 3kW = 3000W. 3000 / 550 = 5.45 -> 6 panels
            const req = (sysKW * 1000) / item.watts;
            qty = Math.ceil(req);
            // Update UI Qty if not user overridden (logic simplified here)
            // Ideally we let user adjust qty, but for now we auto-calc
            $('panelQty').value = qty; 
            
            // Pricing: Dealer Price per watt * Total Watts of panels
            // Real dealer logic: (Price per watt * Panel Wattage) * Qty
            const costPerPanel = item.price * item.watts;
            totalBase = costPerPanel * qty;
            modelName = item.model;
        }
    }

    // Margin
    const common = getCommonMargin();
    const margin = (common !== null) ? common : n('panelMargin');
    const withMargin = totalBase + (totalBase * margin / 100);

    // GST
    const gstRate = getGstFor('panel');
    const tax = withMargin * gstRate;
    const final = withMargin + tax;

    $('panelTotal').textContent = "₹" + fmt(Math.round(final));

    return { name: modelName, qty: qty, base: totalBase, marginAmt: withMargin - totalBase, tax: tax, total: final, type: 'panel' };
}

// 4. Structure
function updateStructureData() {
    const isManual = $('structure-manual-toggle').checked;
    const sysKW = n('systemKW');
    let totalBase = 0;
    let typeName = $('structureSelect').value;

    if (isManual) {
        totalBase = n('structureManualPrice');
    } else {
        const rate = n('structureRate'); // per KW
        totalBase = rate * sysKW;
    }

    const common = getCommonMargin();
    const margin = (common !== null) ? common : n('structureMargin');
    const withMargin = totalBase + (totalBase * margin / 100);
    
    const tax = withMargin * getGstFor('structure');
    const final = withMargin + tax;

    $('structureTotal').textContent = "₹" + fmt(Math.round(final));
    return { name: "Module Mounting Structure (" + typeName + ")", qty: 1, base: totalBase, marginAmt: withMargin - totalBase, tax: tax, total: final, type: 'structure' };
}

// 5. Installation
function updateInstallData() {
    const isManual = $('install-manual-toggle').checked;
    const sysKW = n('systemKW');
    let totalBase = 0;

    if (isManual) {
        totalBase = n('installManualPrice');
    } else {
        const rate = n('installRate'); // per KW
        totalBase = rate * sysKW;
    }

    const common = getCommonMargin();
    const margin = (common !== null) ? common : n('installMargin');
    const withMargin = totalBase + (totalBase * margin / 100);
    
    const tax = withMargin * getGstFor('install');
    const final = withMargin + tax;

    $('installTotal').textContent = "₹" + fmt(Math.round(final));
    return { name: "I&C, Transport", qty: 1, base: totalBase, marginAmt: withMargin - totalBase, tax: tax, total: final, type: 'other' };
}

// 6. BOS (Boxes, Cables, Safety) - Simplified Grouping
function updateBosData() {
    const common = getCommonMargin();
    const bosItems = [];
    
    // ACDB/DCDB
    const acdbP = acdbList.find(a => a.model === $('acdbSelect').value)?.price || 0;
    const dcdbP = dcdbList.find(d => d.model === $('dcdbSelect').value)?.price || 0;
    const acdbTotal = acdbP * n('acdbQty');
    const dcdbTotal = dcdbP * n('dcdbQty');
    const boxBase = acdbTotal + dcdbTotal;
    const boxMargin = (common !== null) ? common : n('boxesMargin');
    const boxSell = boxBase + (boxBase * boxMargin / 100);
    const boxTax = boxSell * 0.18;
    $('boxesTotal').textContent = "₹" + fmt(Math.round(boxSell + boxTax));
    
    bosItems.push({name: "ACDB / DCDB", total: boxSell + boxTax, tax: boxTax, base: boxSell});

    // Cables
    const dcC = n('dcCableQty') * n('dcCableRate');
    const acC = n('acCableQty') * n('acCableRate');
    const cabBase = dcC + acC;
    const cabMargin = (common !== null) ? common : n('cableMargin');
    const cabSell = cabBase + (cabBase * cabMargin / 100);
    const cabTax = cabSell * 0.18;
    $('cableTotal').textContent = "₹" + fmt(Math.round(cabSell + cabTax));
    
    bosItems.push({name: "DC/AC Cables", total: cabSell + cabTax, tax: cabTax, base: cabSell});

    // Safety
    const earth = n('earthingQty') * n('earthingRate');
    const la = n('laQty') * n('laRate');
    const safeBase = earth + la;
    const safeMargin = (common !== null) ? common : n('safetyMargin');
    const safeSell = safeBase + (safeBase * safeMargin / 100);
    const safeTax = safeSell * 0.18;
    $('safetyTotal').textContent = "₹" + fmt(Math.round(safeSell + safeTax));

    bosItems.push({name: "Earthing & LA", total: safeSell + safeTax, tax: safeTax, base: safeSell});

    return bosItems;
}

// 7. Custom Products
let customItems = [];
function addCustomProduct() {
    const container = $('custom-products-container');
    const id = Date.now();
    const div = document.createElement('div');
    div.className = "grid-3 custom-row";
    div.id = `custom-${id}`;
    div.innerHTML = `
        <input type="text" placeholder="Item Name" class="c-name">
        <input type="number" placeholder="Cost" class="c-cost" oninput="recalcAllCards()">
        <button class="btn-danger" onclick="removeCustom('${id}')">X</button>
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
    let total = 0;
    let items = [];
    rows.forEach(r => {
        const name = r.querySelector('.c-name').value;
        const cost = parseFloat(r.querySelector('.c-cost').value) || 0;
        if(name && cost) {
            // Assume manual cost is final selling price for simplicity, or add margin logic
            // Assuming 18% GST on custom items for safety
            const tax = cost * 0.18; 
            const final = cost + tax; 
            total += final;
            items.push({ name: name, qty: 1, base: cost, tax: tax, total: final, type: 'custom' });
        }
    });
    $('customTotal').textContent = "₹" + fmt(Math.round(total));
    return items;
}

// --- MASTER CALCULATION ---

let currentQuoteData = {};

function recalcAllCards() {
    const invData = updateInverterData();
    const batData = updateBatteryData(); // NEW
    const pnlData = updatePanelData();
    const strData = updateStructureData();
    const instData = updateInstallData();
    const bosDataArray = updateBosData(); // returns array of sub-objects
    const custDataArray = getCustomData();

    // Aggregate for Floating Bar
    let grandSub = 0;
    let grandTax = 0;

    // Sum Function
    const add = (item) => {
        grandSub += item.base; // Base selling price (inc margin, exc tax)
        grandTax += item.tax;
    };

    add(invData);
    add(batData); // NEW
    add(pnlData);
    add(strData);
    add(instData);
    bosDataArray.forEach(b => add(b));
    custDataArray.forEach(c => add(c));

    const total = grandSub + grandTax;

    $('grandSubtotal').textContent = "₹" + fmt(Math.round(grandSub));
    $('grandGst').textContent = "₹" + fmt(Math.round(grandTax));
    $('grandTotal').textContent = "₹" + fmt(Math.round(total));

    // Store for PDF generation
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

/* =========================================
   4. PDF GENERATION
   ========================================= */

function generateDetailedQuote() {
    const element = document.createElement('div');
    element.innerHTML = buildDetailedQuotationHtml();
    
    // PDF Config
    const opt = {
        margin: 0, // No margin for full background
        filename: `OffGrid_Quote_${$('customerName').value || 'Client'}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Generate
    html2pdf().set(opt).from(element).save();
}

function generateSummaryQuote() {
    // Similar to detailed but fewer pages (simplified for brevity)
    generateDetailedQuote(); 
}

// HTML TEMPLATE BUILDER
function buildDetailedQuotationHtml() {
    const d = currentQuoteData;
    const date = new Date().toLocaleDateString('en-IN');
    const custName = $('customerName').value || "Valued Customer";
    const sysSize = $('systemKW').value;

    // 1. Build Item Rows
    let rowsHtml = "";
    let i = 1;

    // Inverter Row
    rowsHtml += `<tr><td>${i++}</td><td>Solar Inverter</td><td>${d.inv.name}</td><td>${d.inv.qty}</td><td>₹${fmt(d.inv.total)}</td></tr>`;
    
    // Battery Row (NEW)
    if(d.bat.qty > 0) {
        rowsHtml += `<tr><td>${i++}</td><td>Solar Battery</td><td>${d.bat.name}</td><td>${d.bat.qty}</td><td>₹${fmt(d.bat.total)}</td></tr>`;
    }

    // Panel Row
    rowsHtml += `<tr><td>${i++}</td><td>Solar Modules</td><td>${d.pnl.name} (${d.pnl.qty} Nos)</td><td>${d.pnl.qty}</td><td>₹${fmt(d.pnl.total)}</td></tr>`;

    // Structure
    rowsHtml += `<tr><td>${i++}</td><td>Structure</td><td>GI Module Mounting Structure</td><td>1 Set</td><td>₹${fmt(d.str.total)}</td></tr>`;
    
    // BOS Combined
    let bosTotal = 0;
    d.bos.forEach(b => bosTotal += b.total);
    rowsHtml += `<tr><td>${i++}</td><td>BOS (Balance of System)</td><td>ACDB, DCDB, Cables, Earthing, LA</td><td>1 Lot</td><td>₹${fmt(bosTotal)}</td></tr>`;
    
    // Installation
    rowsHtml += `<tr><td>${i++}</td><td>I&C</td><td>Installation, Transport & Commisioning</td><td>1 Job</td><td>₹${fmt(d.inst.total)}</td></tr>`;

    // Customs
    d.cust.forEach(c => {
        rowsHtml += `<tr><td>${i++}</td><td>Extra</td><td>${c.name}</td><td>1</td><td>₹${fmt(c.total)}</td></tr>`;
    });

    // Total Row
    rowsHtml += `
        <tr style="font-weight:bold; background:#eef;">
            <td colspan="4" style="text-align:right;">Grand Total (Inc GST)</td>
            <td>₹${fmt(d.totals.final)}</td>
        </tr>
    `;

    // 2. Return Full HTML String
    // We use inline CSS for PDF generation consistency
    return `
    <div style="font-family: Arial, sans-serif; color: #333; width: 210mm; min-height: 297mm; position: relative;">
        
        <div style="width:100%; height:1120px; background: url('../Uplodes/bg 3.png') no-repeat center center; background-size: cover; position: relative;">
            <div style="position: absolute; top: 300px; left: 50px; color: white;">
                <h1 style="font-size: 50px; margin: 0;">OFF-GRID<br>SOLAR PROPOSAL</h1>
                <h3 style="font-size: 24px; margin-top: 20px;">Prepared For: ${custName}</h3>
                <p style="font-size: 18px;">Date: ${date}</p>
            </div>
            <div style="position: absolute; bottom: 50px; right: 50px; color: white; text-align: right;">
                <h2>${sysSize} KW System</h2>
                <p>Reliable Power Backup Solution</p>
            </div>
        </div>

        <div style="padding: 40px; page-break-before: always;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 2px solid #ff9800; padding-bottom: 10px;">
                <img src="../Uplodes/v sustain logo.png" style="height: 60px;">
                <h2 style="color: #1e3c72;">Commercial Offer</h2>
            </div>
            
            <div style="margin-top: 30px;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #1e3c72; color: white;">
                            <th style="padding: 10px; border: 1px solid #ccc;">S.No</th>
                            <th style="padding: 10px; border: 1px solid #ccc;">Item Category</th>
                            <th style="padding: 10px; border: 1px solid #ccc;">Description / Model</th>
                            <th style="padding: 10px; border: 1px solid #ccc;">Qty</th>
                            <th style="padding: 10px; border: 1px solid #ccc;">Price (Inc GST)</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rowsHtml}
                    </tbody>
                </table>
            </div>

            <div style="margin-top: 40px; background: #f9f9f9; padding: 20px; border-radius: 8px;">
                <h3 style="color: #ff9800;">Terms & Conditions</h3>
                <ul style="font-size: 12px; line-height: 1.6;">
                    <li><strong>Validity:</strong> This offer is valid for 7 days.</li>
                    <li><strong>Payment:</strong> 50% Advance, 40% Before Dispatch, 10% After Installation.</li>
                    <li><strong>Warranty:</strong> 
                        <ul>
                            <li>Panels: 25 Years Performance Warranty</li>
                            <li>Inverter: As per OEM (usually 2-5 Years)</li>
                            <li>Battery: As per OEM (usually 3-5 Years)</li>
                        </ul>
                    </li>
                    <li><strong>Scope:</strong> Client to provide roof access and internet for monitoring.</li>
                </ul>
            </div>
        </div>

        <div style="width:100%; height:1120px; background: url('../Uplodes/on grid plannnt explained.png') no-repeat center center; background-size: contain; page-break-before: always;">
            </div>

    </div>
    `;
}
