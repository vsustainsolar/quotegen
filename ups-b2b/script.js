// --- DATA CATALOGS ---
const upsCatalog = [
    { id: 'u1', name: 'Luminous 3kVA Cruze Sine Wave UPS', price: 28500, gst: 18 },
    { id: 'u2', name: 'Luminous 5kVA Cruze Sine Wave UPS', price: 46000, gst: 18 },
    { id: 'u3', name: 'Luminous 7.5kVA Cruze PRO', price: 68000, gst: 18 },
    { id: 'u4', name: 'Luminous 10kVA Cruze PRO', price: 82000, gst: 18 },
    { id: 'u5', name: 'Microtek 10kVA Online UPS (3-Phase)', price: 95000, gst: 18 }
];

const inverterCatalog = [
    { id: 'i1', name: 'Luminous NXG+ 1400 Hybrid Inverter', price: 8500, gst: 18 },
    { id: 'i2', name: 'Luminous Solar Hybrid 3kVA (Cruze)', price: 32000, gst: 18 },
    { id: 'i3', name: 'Luminous Solar Hybrid 5kVA', price: 48000, gst: 18 },
    { id: 'i4', name: 'Microtek 10kVA Solar Grid-Tie', price: 65000, gst: 18 },
    { id: 'i5', name: 'Luminous 15kVA Solar Inverter', price: 110000, gst: 18 }
];

const batteryCatalog = [
    { id: 'b1', name: 'Luminous 150Ah RedCharge Tubular', price: 13500, gst: 28 },
    { id: 'b2', name: 'Luminous 200Ah Inverlast Tubular', price: 16800, gst: 28 },
    { id: 'b3', name: 'Exide 150Ah InstaBrite', price: 12500, gst: 28 },
    { id: 'b4', name: 'Exide 200Ah InvaTubular', price: 17200, gst: 28 }
];

const trolleyCatalog = [
    { id: 't1', name: 'Single Battery Trolley', price: 1200, gst: 18 },
    { id: 't2', name: 'Double Battery Trolley', price: 2000, gst: 18 },
    { id: 't3', name: 'Triple Battery Rack', price: 3200, gst: 18 },
    { id: 't4', name: 'Four Battery Rack', price: 4500, gst: 18 },
    { id: 't5', name: 'Heavy Duty MS Battery Stand (Custom)', price: 6000, gst: 18 }
];

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject Global Pricing Settings Dynamically via JS
    const upsPanel = document.getElementById('ups-container').closest('.panel');
    const globalPanel = document.createElement('section');
    globalPanel.className = 'panel highlight-panel';
    globalPanel.innerHTML = `
        <h2>2. Global Pricing Settings</h2>
        <p class="helper-text">Set a common margin for all products. Turn on "Reduce Margin" to apply a discount instead of a markup.</p>
        <div class="form-grid" style="align-items: center;">
            <div class="input-group">
                <label>Common Margin (%)</label>
                <input type="number" id="global-margin" value="15" min="0">
            </div>
            <div class="input-group" style="display: flex; align-items: center; gap: 15px; margin-top: 15px;">
                <label class="toggle-switch">
                    <input type="checkbox" id="global-margin-reduce">
                    <span class="slider"></span>
                </label>
                <span id="margin-mode-text" style="font-weight: bold; font-size: 15px;">Add Margin (Markup)</span>
            </div>
        </div>
    `;
    upsPanel.parentNode.insertBefore(globalPanel, upsPanel);

    // Auto-renumber the H2 headings dynamically
    let panelIndex = 3;
    let currentSibling = globalPanel.nextElementSibling;
    while(currentSibling && currentSibling.classList.contains('panel')) {
        const h2 = currentSibling.querySelector('h2');
        if(h2) {
            h2.innerText = h2.innerText.replace(/^\d+\./, panelIndex + '.');
            panelIndex++;
        }
        currentSibling = currentSibling.nextElementSibling;
    }

    const reduceToggle = document.getElementById('global-margin-reduce');
    const modeText = document.getElementById('margin-mode-text');
    reduceToggle.addEventListener('change', function() {
        if(this.checked) {
            modeText.textContent = 'Reduce Margin (Discount)';
            modeText.style.color = 'var(--danger)';
        } else {
            modeText.textContent = 'Add Margin (Markup)';
            modeText.style.color = 'var(--success)';
        }
    });
    reduceToggle.dispatchEvent(new Event('change'));

    // 2. Rewrite Trolley HTML row to support Custom Margin toggling
    const trolleyRow = document.getElementById('trolley-row');
    trolleyRow.style.flexWrap = 'wrap';
    trolleyRow.innerHTML = `
        <label class="toggle-switch" title="Enable Accessories">
            <input type="checkbox" id="trolley-active" checked>
            <span class="slider"></span>
        </label>
        <select id="trolley-select" class="item-select"></select>
        <div class="input-group-inline">
            <label>Qty:</label>
            <input type="number" id="trolley-qty" class="item-qty" value="1" min="1" style="width: 60px;">
        </div>
        <div class="input-group-inline" style="border-left: 2px solid var(--border); padding-left: 15px; margin-left: auto;">
            <label style="cursor: pointer; display: flex; align-items: center; gap: 5px; font-size: 13px;">
                <input type="checkbox" id="trolley-custom-margin-toggle"> Custom Margin
            </label>
            <input type="number" id="trolley-margin" class="item-margin" value="15" min="0" disabled style="width: 60px; opacity: 0.5;">
        </div>
    `;
    const trolleySelect = document.getElementById('trolley-select');
    populateDropdown(trolleySelect, trolleyCatalog);

    const trolleyMarginToggle = document.getElementById('trolley-custom-margin-toggle');
    const trolleyMarginInput = document.getElementById('trolley-margin');
    trolleyMarginToggle.addEventListener('change', (e) => {
        trolleyMarginInput.disabled = !e.target.checked;
        trolleyMarginInput.style.opacity = e.target.checked ? '1' : '0.5';
    });

    addUpsRow();
    addInverterRow();
    addBatteryRow();

    // 3. Attach Custom Row Logic
    document.getElementById('add-custom-btn').addEventListener('click', addCustomRow);
    document.getElementById('add-ups-btn').addEventListener('click', addUpsRow);
    document.getElementById('add-inverter-btn').addEventListener('click', addInverterRow);
    document.getElementById('add-battery-btn').addEventListener('click', addBatteryRow);
    document.getElementById('generate-btn').addEventListener('click', generateQuotation);
});

// --- DYNAMIC ROW BUILDERS ---
function populateDropdown(selectElement, catalog) {
    selectElement.innerHTML = '<option value="">-- Select Model --</option>';
    catalog.forEach(item => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = `${item.name} (Base: ₹${item.price.toLocaleString()})`;
        selectElement.appendChild(option);
    });
}

function createRow(type, catalog) {
    const row = document.createElement('div');
    row.className = `item-row ${type}-row`;
    row.style.flexWrap = 'wrap';
    
    row.innerHTML = `
        <label class="toggle-switch" title="Enable/Disable Product">
            <input type="checkbox" class="row-active" checked>
            <span class="slider"></span>
        </label>
        <select class="item-select model-select" style="min-width: 200px;"></select>
        <div class="input-group-inline">
            <label>Qty:</label>
            <input type="number" class="item-qty" value="1" min="1" style="width: 60px;">
        </div>
        <div class="input-group-inline" style="border-left: 2px solid var(--border); padding-left: 15px; margin-left: auto;">
            <label style="cursor: pointer; display: flex; align-items: center; gap: 5px; font-size: 13px;">
                <input type="checkbox" class="use-custom-margin"> Custom Margin (%)
            </label>
            <input type="number" class="item-margin" value="15" min="0" disabled style="width: 60px; opacity: 0.5;">
        </div>
        <button type="button" class="btn-remove" title="Remove Row">✖</button>
    `;

    const selectElement = row.querySelector('.model-select');
    populateDropdown(selectElement, catalog);

    const customToggle = row.querySelector('.use-custom-margin');
    const marginInput = row.querySelector('.item-margin');
    customToggle.addEventListener('change', (e) => {
        marginInput.disabled = !e.target.checked;
        marginInput.style.opacity = e.target.checked ? '1' : '0.5';
    });

    row.querySelector('.btn-remove').addEventListener('click', () => {
        row.remove();
    });

    return row;
}

function createCustomRow() {
    const row = document.createElement('div');
    row.className = `item-row custom-row`;
    row.style.flexWrap = 'wrap';
    
    row.innerHTML = `
        <label class="toggle-switch" title="Enable/Disable Product">
            <input type="checkbox" class="row-active" checked>
            <span class="slider"></span>
        </label>
        <input type="text" class="item-name" placeholder="Item Name (e.g. Extra AC Cable)" style="flex: 1; min-width: 150px; padding: 10px; border: 1px solid var(--border); border-radius: 6px; font-size: 15px;">
        <div class="input-group-inline">
            <label>Qty:</label>
            <input type="number" class="item-qty" value="1" min="1" style="width: 60px;">
        </div>
        <div class="input-group-inline">
            <label>Base Price:</label>
            <input type="number" class="item-price" placeholder="0" style="width: 80px; padding: 10px; border: 1px solid var(--border); border-radius: 6px;">
        </div>
        <div class="input-group-inline">
            <label>GST %:</label>
            <input type="number" class="item-gst" value="18" min="0" style="width: 50px; padding: 10px; border: 1px solid var(--border); border-radius: 6px;">
        </div>
        <div class="input-group-inline" style="border-left: 2px solid var(--border); padding-left: 15px; margin-left: auto;">
            <label style="cursor: pointer; display: flex; align-items: center; gap: 5px; font-size: 13px;">
                <input type="checkbox" class="use-custom-margin"> Custom Margin
            </label>
            <input type="number" class="item-margin" value="15" min="0" disabled style="width: 60px; opacity: 0.5;">
        </div>
        <button type="button" class="btn-remove" title="Remove Row">✖</button>
    `;

    const customToggle = row.querySelector('.use-custom-margin');
    const marginInput = row.querySelector('.item-margin');
    customToggle.addEventListener('change', (e) => {
        marginInput.disabled = !e.target.checked;
        marginInput.style.opacity = e.target.checked ? '1' : '0.5';
    });

    row.querySelector('.btn-remove').addEventListener('click', () => {
        row.remove();
    });

    return row;
}

function addUpsRow() {
    const container = document.getElementById('ups-container');
    container.appendChild(createRow('ups', upsCatalog));
}

function addInverterRow() {
    const container = document.getElementById('inverter-container');
    container.appendChild(createRow('inverter', inverterCatalog));
}

function addBatteryRow() {
    const container = document.getElementById('battery-container');
    container.appendChild(createRow('battery', batteryCatalog));
}

function addCustomRow() {
    const container = document.getElementById('custom-container');
    container.appendChild(createCustomRow());
}

// --- CALCULATION & INVOICE GENERATION ---

function extractRowData(rowSelector, catalog, globalMargin, isReduce) {
    const rows = document.querySelectorAll(rowSelector);
    let items = [];

    rows.forEach(row => {
        const isActive = row.querySelector('.row-active').checked;
        const modelId = row.querySelector('.model-select').value;
        const qty = parseInt(row.querySelector('.item-qty').value) || 0;
        
        const useCustom = row.querySelector('.use-custom-margin').checked;
        const customMarginVal = parseFloat(row.querySelector('.item-margin').value) || 0;

        if (isActive && modelId && qty > 0) {
            const product = catalog.find(item => item.id === modelId);
            if (product) {
                const baseTotal = product.price * qty;
                let finalBase = baseTotal;
                
                if (useCustom) {
                    finalBase = baseTotal + (baseTotal * (customMarginVal / 100)); 
                } else {
                    if (isReduce) {
                        finalBase = baseTotal - (baseTotal * (globalMargin / 100)); 
                    } else {
                        finalBase = baseTotal + (baseTotal * (globalMargin / 100)); 
                    }
                }

                const gstAmount = finalBase * (product.gst / 100);

                items.push({
                    name: product.name,
                    make: product.name.split(' ')[0], // Extracts 'Luminous', 'Microtek', etc.
                    qty: qty,
                    unitPriceWithMargin: finalBase / qty,
                    gstRate: product.gst,
                    gstAmount: gstAmount,
                    totalPreTax: finalBase,
                    totalPrice: finalBase + gstAmount
                });
            }
        }
    });
    return items;
}

function extractCustomRowData(globalMargin, isReduce) {
    const rows = document.querySelectorAll('.custom-row');
    let items = [];

    rows.forEach(row => {
        const isActive = row.querySelector('.row-active').checked;
        const name = row.querySelector('.item-name').value;
        const qty = parseInt(row.querySelector('.item-qty').value) || 0;
        const price = parseFloat(row.querySelector('.item-price').value) || 0;
        const gst = parseFloat(row.querySelector('.item-gst').value) || 18;
        
        const useCustom = row.querySelector('.use-custom-margin').checked;
        const customMarginVal = parseFloat(row.querySelector('.item-margin').value) || 0;

        if (isActive && name && qty > 0) {
            const baseTotal = price * qty;
            let finalBase = baseTotal;
            
            if (useCustom) {
                finalBase = baseTotal + (baseTotal * (customMarginVal / 100)); 
            } else {
                if (isReduce) {
                    finalBase = baseTotal - (baseTotal * (globalMargin / 100)); 
                } else {
                    finalBase = baseTotal + (baseTotal * (globalMargin / 100)); 
                }
            }

            const gstAmount = finalBase * (gst / 100);

            items.push({
                name: name,
                make: 'Standard / Custom',
                qty: qty,
                unitPriceWithMargin: finalBase / qty,
                gstRate: gst,
                gstAmount: gstAmount,
                totalPreTax: finalBase,
                totalPrice: finalBase + gstAmount
            });
        }
    });
    return items;
}

function generateQuotation() {
    // 1. Get Customer Info
    const customer = {
        name: document.getElementById('cust-name').value || 'Valued Customer',
        phone: document.getElementById('cust-phone').value || 'N/A',
        email: document.getElementById('cust-email').value || 'N/A',
        address: document.getElementById('cust-address').value || 'Bengaluru',
        date: new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'long', year:'numeric' }),
        proposalNo: `VS/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 900) + 100)}`
    };

    // 2. Fetch Global Pricing Settings
    const globalMargin = parseFloat(document.getElementById('global-margin').value) || 0;
    const isReduce = document.getElementById('global-margin-reduce').checked;

    // 3. Extract active line items
    let allItems = [];
    allItems = allItems.concat(extractRowData('.ups-row', upsCatalog, globalMargin, isReduce));
    allItems = allItems.concat(extractRowData('.inverter-row', inverterCatalog, globalMargin, isReduce));
    allItems = allItems.concat(extractRowData('.battery-row', batteryCatalog, globalMargin, isReduce));
    
    // Extract custom line items
    allItems = allItems.concat(extractCustomRowData(globalMargin, isReduce));
    
    // Trolley logic
    const trolleyActive = document.getElementById('trolley-active').checked;
    const trolleyId = document.getElementById('trolley-select').value;
    if (trolleyActive && trolleyId) {
        const qty = parseInt(document.getElementById('trolley-qty').value) || 1;
        const useCustom = document.getElementById('trolley-custom-margin-toggle').checked;
        const customMarginVal = parseFloat(document.getElementById('trolley-margin').value) || 0;
        
        const product = trolleyCatalog.find(i => i.id === trolleyId);
        const baseTotal = product.price * qty;
        
        let finalBase = baseTotal;
        if (useCustom) {
            finalBase = baseTotal + (baseTotal * (customMarginVal / 100));
        } else {
            if (isReduce) {
                finalBase = baseTotal - (baseTotal * (globalMargin / 100));
            } else {
                finalBase = baseTotal + (baseTotal * (globalMargin / 100));
            }
        }
        
        const gstAmount = finalBase * (product.gst / 100);
        
        allItems.push({
            name: product.name,
            make: 'Standard',
            qty: qty,
            unitPriceWithMargin: finalBase / qty,
            gstRate: product.gst,
            gstAmount: gstAmount,
            totalPreTax: finalBase,
            totalPrice: finalBase + gstAmount
        });
    }

    if (allItems.length === 0) {
        alert("Please select and activate at least one product (UPS, Inverter, Battery, or Trolley) to generate a quotation.");
        return;
    }

    // 4. Calculate Grand Totals & Build Rows
    let grandPreTax = 0;
    let grandGst = 0;
    let grandTotal = 0;

    let specRows = '';
    let commercialRows = '';
    
    allItems.forEach((item, index) => {
        grandPreTax += item.totalPreTax;
        grandGst += item.gstAmount;
        grandTotal += item.totalPrice;

        // Populate System Specifications Table
        specRows += `
            <tr class="odd:bg-white/50 even:bg-gray-50/50">
                <td class="p-2 border font-semibold">${item.name}</td>
                <td class="p-2 border">${item.make}</td>
                <td class="p-2 border text-center">${item.qty}</td>
                <td class="p-2 border text-center">Nos</td>
            </tr>
        `;

        // Populate Commercial Pricing Table
        commercialRows += `
            <tr class="odd:bg-white/50 even:bg-gray-50/50">
                <td class="p-3 border text-center font-semibold text-gray-500">${index + 1}</td>
                <td class="p-3 border font-semibold text-gray-800">${item.name}</td>
                <td class="p-3 border text-center">${item.qty}</td>
                <td class="p-3 border text-right">₹${Math.round(item.unitPriceWithMargin).toLocaleString('en-IN')}</td>
                <td class="p-3 border text-center">${item.gstRate}%</td>
                <td class="p-3 border text-right font-bold text-gray-800">₹${Math.round(item.totalPrice).toLocaleString('en-IN')}</td>
            </tr>
        `;
    });

    let footerRows = `
        <tr class="bg-blue-50/50 font-semibold border-t-2 border-brand-blue">
            <td class="p-3 border"></td>
            <td class="p-3 border text-right text-sm" colspan="4">Total (Pre-Tax)</td>
            <td class="p-3 border text-right text-gray-700">₹${Math.round(grandPreTax).toLocaleString('en-IN')}</td>
        </tr>
        <tr class="bg-blue-50/50 font-semibold">
            <td class="p-3 border"></td>
            <td class="p-3 border text-right text-sm" colspan="4">Total GST</td>
            <td class="p-3 border text-right text-gray-700">₹${Math.round(grandGst).toLocaleString('en-IN')}</td>
        </tr>
        <tr class="bg-brand-blue/10 font-bold border-t-2 border-brand-orange text-lg">
            <td class="p-4 border"></td>
            <td class="p-4 border text-right text-brand-blue" colspan="4">GRAND TOTAL</td>
            <td class="p-4 border text-right text-brand-orange">₹${Math.round(grandTotal).toLocaleString('en-IN')}</td>
        </tr>
    `;

    // 5. Socket Disclaimer Logic
    const socketReq = document.querySelector('input[name="ups_socket"]:checked').value;
    let disclaimerHtml = "";
    if (socketReq === 'yes') {
        disclaimerHtml = `
            <div class="mt-6 p-4 bg-blue-50 border border-brand-lightBlue rounded-lg text-sm text-blue-900 shadow-sm">
                <strong class="block mb-2 text-brand-blue border-b border-blue-200 pb-1 font-bold text-base flex items-center gap-2">
                    <i class="fas fa-plug text-brand-orange"></i> Pre-requisite / Important Notice
                </strong>
                <p class="leading-relaxed">
                    For the installation of the UPS system, the client must ensure a dedicated and properly rated AC "UPS Socket" (15A/20A) with standard earthing (Neutral-to-Earth voltage < 2V) is available at the installation site prior to deployment. Failure to provide suitable electrical grounding may void the manufacturer warranty and risk equipment damage.
                </p>
            </div>
        `;
    }

    // 6. Build the 2-Pager HTML String
    const quoteHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>UPS Quote - ${customer.name}</title>
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
                        fontFamily: { sans: ['Inter', 'sans-serif'], },
                        colors: {
                            brand: {
                                blue: '#005bac',
                                lightBlue: '#4fa8e0',
                                orange: '#ff9933',
                                green: '#8cc63f',
                                greenDark: '#7ab82e',
                                gray: '#f3f4f6',
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
                .page-container { box-shadow: none; margin: 0; width: 210mm; height: 297mm; max-height: 297mm; overflow: hidden; border: none; }
                [contenteditable="true"] { outline: none; }
                .no-print { display: none !important; }

                body.print-mobile .page-container {
                    transform: scale(0.92); transform-origin: top left; width: 108%; height: auto; overflow: visible; page-break-after: always;
                }
                body.print-laptop .page-container { width: 100%; height: auto; overflow: visible; max-height: none; }
            }

            body { background-color: #e5e7eb; font-family: 'Inter', sans-serif; }

            .page-container {
                background-color: white;
                background-image: url('https://github.com/vsustainsolar/quotegen/blob/8f2c0c796ba02307c87dda837a906dc9c079aa05/Uplodes/background%20v%20solar.png?raw=true');
                background-size: cover; background-position: center; background-repeat: no-repeat;
                width: 210mm; min-height: 297mm; margin: 2rem auto; position: relative;
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); display: flex; flex-direction: column; overflow: hidden;
            }

            .dots-pattern {
                background-image: radial-gradient(#4fa8e0 1px, transparent 1px); background-size: 10px 10px;
                width: 150px; height: 100px; position: absolute; opacity: 0.5;
            }

            [contenteditable="true"]:hover { background-color: rgba(254, 249, 195, 0.8); cursor: text; outline: 1px dashed #ccc; }
        </style>
        <script>
            function printMode(mode) {
                document.body.className = 'font-sans text-gray-800'; 
                if (mode === 'mobile') {
                    document.body.classList.add('print-mobile');
                } else if (mode === 'laptop') {
                    document.body.classList.add('print-laptop');
                }
                window.print();
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
            <div class="h-[13%] w-full flex justify-between items-start p-2 relative z-20 bg-white/90">
                 <div class="w-36">
                    <img src="../Uplodes/v sustain logo.png" onerror="this.src='../Uplodes/v sustain logo (1).png'" alt="V Sustain Logo" class="w-full object-contain">
                </div>
                <div class="text-right text-brand-blue pr-4 pt-2">
                    <h2 class="font-bold text-xl">V-Sustain Solar Solutions</h2>
                    <p class="text-sm">Authorized Luminous Partner</p>
                    <p class="text-sm">Bengaluru</p>
                    <p class="text-sm mt-1 font-bold">Proposal No: ${customer.proposalNo}</p>
                    <p class="text-sm">Date: ${customer.date}</p>
                </div>
            </div>

            <!-- Generic Enterprise / Tech Background Image for UPS -->
            <div class="h-[45%] w-full overflow-hidden relative">
                <img src="https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=80&w=2070&auto=format&fit=crop" alt="Enterprise Infrastructure" class="w-full h-full object-cover">
                <div class="absolute top-0 right-16 bg-brand-orange text-white font-bold text-2xl py-4 px-3 shadow-lg" style="clip-path: polygon(0% 0%, 100% 0%, 100% 85%, 50% 100%, 0% 85%);">
                    2026
                </div>
            </div>

            <div class="h-[42%] w-full bg-[#001f3f] text-white p-12 flex flex-col justify-center relative overflow-hidden">
                <div class="dots-pattern bottom-20 left-10"></div>
                <div class="dots-pattern bottom-20 right-10"></div>
                <div class="relative z-10 border-l-4 border-brand-lightBlue pl-6">
                    <h1 class="text-4xl font-bold mb-2">Techno-commercial</h1>
                    <h1 class="text-4xl font-bold mb-8">Offer</h1>
                    <div class="space-y-1">
                        <h3 class="text-xl font-bold">Enterprise UPS Solution</h3>
                        <h3 class="text-xl font-bold border-b border-gray-500 pb-2 mb-2 w-1/2">Proposal for</h3>
                        <p class="text-2xl font-semibold">${customer.name}</p>
                        <p class="text-lg text-gray-300">${customer.address}</p>
                        <p class="text-md text-gray-400 mt-2">📞 ${customer.phone}  |  ✉️ ${customer.email}</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- PAGE 2: COMMERCIAL OFFER & INFO -->
        <div class="page-container page-break relative flex flex-col">
            <div class="absolute top-0 left-0 w-full h-12 bg-gradient-to-r from-brand-blue to-brand-lightBlue z-10"></div>
            
            <div class="absolute top-4 right-8 z-30 w-32">
                <img src="../Uplodes/v sustain logo.png" onerror="this.src='../Uplodes/v sustain logo (1).png'" alt="V Sustain Logo" class="w-full object-contain">
            </div>

            <div class="relative z-20 mt-16 px-12 h-full flex flex-col pb-12">
               
               <div class="flex items-center justify-between mb-6 border-b-2 border-brand-orange pb-2 w-[80%]">
                   <div class="flex items-center gap-3">
                        <i class="fas fa-file-invoice-dollar text-3xl text-brand-blue"></i>
                        <h2 class="text-3xl font-bold text-brand-blue">Techno-Commercial Offer</h2>
                   </div>
               </div>

               <!-- NEW: System Specifications Table -->
               <div class="mb-8" contenteditable="true">
                    <h3 class="text-lg font-bold text-brand-green mb-3 pl-2 border-l-4 border-brand-green">1. System Specifications</h3>
                    <table class="w-full text-sm border-collapse shadow-sm bg-white/90">
                        <thead>
                            <tr class="bg-brand-green text-white">
                                <th class="p-3 border border-brand-green text-left">Component Description</th>
                                <th class="p-3 border border-brand-green text-left">Make / Brand</th>
                                <th class="p-3 border border-brand-green text-center">Qty</th>
                                <th class="p-3 border border-brand-green text-center">UoM</th>
                            </tr>
                        </thead>
                        <tbody class="text-gray-800">
                            ${specRows}
                        </tbody>
                    </table>
               </div>

               <!-- The Detailed Pricing Table -->
               <div class="mb-6" contenteditable="true">
                    <h3 class="text-lg font-bold text-brand-blue mb-3 pl-2 border-l-4 border-brand-blue">2. Commercial Proposal</h3>
                    <table class="w-full text-sm border-collapse shadow-lg bg-white/90">
                        <thead>
                            <tr class="bg-brand-blue text-white">
                                <th class="p-3 border border-white text-center w-12">#</th>
                                <th class="p-3 border border-white text-left">Description</th>
                                <th class="p-3 border border-white text-center">Qty</th>
                                <th class="p-3 border border-white text-right">Unit Price</th>
                                <th class="p-3 border border-white text-center">GST Rate</th>
                                <th class="p-3 border border-white text-right">Total Amount</th>
                            </tr>
                        </thead>
                        <tbody class="text-gray-800">
                            ${commercialRows}
                            ${footerRows}
                        </tbody>
                    </table>
               </div>

               <!-- Conditional Socket Disclaimer -->
               ${disclaimerHtml}

               <!-- Push Terms to Bottom -->
               <div class="mt-auto border border-gray-300 bg-white/95 shadow-md p-5 text-sm rounded-lg relative overflow-hidden" contenteditable="true">
                    <!-- Accent bar for terms -->
                    <div class="absolute left-0 top-0 h-full w-1.5 bg-brand-green"></div>
                    <p class="font-bold mb-3 border-b border-gray-200 pb-2 text-brand-blue text-lg flex items-center gap-2">
                        <i class="fas fa-gavel text-brand-orange"></i> Terms & Conditions
                    </p>
                    <ul class="list-disc list-inside text-gray-700 space-y-2 ml-1">
                        <li><span class="font-semibold text-gray-900">Payment:</span> 100% advance payment is required along with the confirmed purchase order.</li>
                        <li><span class="font-semibold text-gray-900">Validity:</span> This quotation is valid for 15 days from the date of submission.</li>
                        <li><span class="font-semibold text-gray-900">Delivery:</span> Standard delivery and installation within 3-5 working days from order confirmation.</li>
                        <li><span class="font-semibold text-gray-900">Warranty:</span> Subject strictly to OEM (Original Equipment Manufacturer) terms and conditions.</li>
                        <li><span class="font-semibold text-gray-900">Scope:</span> Any additional civil work, structural modifications, or specialized wiring changes required at the site will be billed at an extra cost.</li>
                    </ul>
               </div>
            </div>
        </div>
    </body>
    </html>
    `;

    // 7. Open Quote in new tab
    const newWin = window.open('', '_blank');
    if (!newWin) {
        alert("Popup blocked. Allow popups for this site to see the quotation.");
        return;
    }
    newWin.document.open();
    newWin.document.write(quoteHtml);
    newWin.document.close();
}
