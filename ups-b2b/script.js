// --- DATA CATALOGS ---
const upsCatalog = [
    { id: 'u1', name: 'Luminous 3kVA Cruze Sine Wave UPS', price: 28500, gst: 18 },
    { id: 'u2', name: 'Luminous 5kVA Cruze Sine Wave UPS', price: 46000, gst: 18 },
    { id: 'u3', name: 'Luminous 7.5kVA Cruze PRO', price: 68000, gst: 18 },
    { id: 'u4', name: 'Luminous 10kVA Cruze PRO', price: 82000, gst: 18 },
    { id: 'u5', name: 'Microtek 10kVA Online UPS (3-Phase)', price: 95000, gst: 18 }
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
    // Insert Global Panel before the UPS section
    upsPanel.parentNode.insertBefore(globalPanel, upsPanel);

    // Update the numbering of subsequent panels
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

    // Toggle styling & text logic for Global Margin
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

    // 3. Initialize default rows
    addUpsRow();
    addBatteryRow();

    // 4. Attach Listeners
    document.getElementById('add-ups-btn').addEventListener('click', addUpsRow);
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

    // Custom Margin Toggle Logic for dynamically added rows
    const customToggle = row.querySelector('.use-custom-margin');
    const marginInput = row.querySelector('.item-margin');
    customToggle.addEventListener('change', (e) => {
        marginInput.disabled = !e.target.checked;
        marginInput.style.opacity = e.target.checked ? '1' : '0.5';
    });

    // Delete button logic
    row.querySelector('.btn-remove').addEventListener('click', () => {
        row.remove();
    });

    return row;
}

function addUpsRow() {
    const container = document.getElementById('ups-container');
    container.appendChild(createRow('ups', upsCatalog));
}

function addBatteryRow() {
    const container = document.getElementById('battery-container');
    container.appendChild(createRow('battery', batteryCatalog));
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
                
                // Prioritize Custom Margin if enabled, otherwise use Global settings
                if (useCustom) {
                    finalBase = baseTotal + (baseTotal * (customMarginVal / 100)); // Custom margin is treated as an overriding markup
                } else {
                    if (isReduce) {
                        finalBase = baseTotal - (baseTotal * (globalMargin / 100)); // Apply discount
                    } else {
                        finalBase = baseTotal + (baseTotal * (globalMargin / 100)); // Apply markup
                    }
                }

                const gstAmount = finalBase * (product.gst / 100);

                items.push({
                    name: product.name,
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

function generateQuotation() {
    // 1. Get Customer Info
    const customer = {
        name: document.getElementById('cust-name').value || 'Valued Customer',
        phone: document.getElementById('cust-phone').value || 'N/A',
        email: document.getElementById('cust-email').value || 'N/A',
        address: document.getElementById('cust-address').value || 'N/A',
        date: new Date().toLocaleDateString('en-IN')
    };

    // 2. Fetch Global Pricing Settings
    const globalMargin = parseFloat(document.getElementById('global-margin').value) || 0;
    const isReduce = document.getElementById('global-margin-reduce').checked;

    // 3. Extract active line items
    let allItems = [];
    
    allItems = allItems.concat(extractRowData('.ups-row', upsCatalog, globalMargin, isReduce));
    allItems = allItems.concat(extractRowData('.battery-row', batteryCatalog, globalMargin, isReduce));
    
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
            qty: qty,
            unitPriceWithMargin: finalBase / qty,
            gstRate: product.gst,
            gstAmount: gstAmount,
            totalPreTax: finalBase,
            totalPrice: finalBase + gstAmount
        });
    }

    if (allItems.length === 0) {
        alert("Please select and activate at least one product (UPS, Battery, or Trolley) to generate a quotation.");
        return;
    }

    // 4. Socket Disclaimer Logic
    const socketReq = document.querySelector('input[name="ups_socket"]:checked').value;
    let disclaimerHtml = "";
    if (socketReq === 'yes') {
        disclaimerHtml = `
            <div class="mt-8 bg-blue-50 border-l-4 border-blue-600 p-4 rounded-r">
                <h4 class="text-blue-800 font-bold mb-1">Pre-requisite / Important Notice:</h4>
                <p class="text-sm text-blue-900">
                    For the installation of the UPS system, the client must ensure a dedicated and properly rated AC "UPS Socket" (15A/20A) with standard earthing (Neutral-to-Earth voltage < 2V) is available at the installation site prior to deployment. Failure to provide suitable electrical grounding may void the manufacturer warranty and risk equipment damage.
                </p>
            </div>
        `;
    }

    // 5. Calculate Grand Totals
    let grandPreTax = 0;
    let grandGst = 0;
    let grandTotal = 0;

    let rowsHtml = '';
    allItems.forEach((item, index) => {
        grandPreTax += item.totalPreTax;
        grandGst += item.gstAmount;
        grandTotal += item.totalPrice;

        rowsHtml += `
            <tr class="border-b hover:bg-gray-50">
                <td class="p-3 text-center text-gray-600">${index + 1}</td>
                <td class="p-3 font-medium text-gray-800">${item.name}</td>
                <td class="p-3 text-center text-gray-600">${item.qty}</td>
                <td class="p-3 text-right text-gray-600">₹${Math.round(item.unitPriceWithMargin).toLocaleString('en-IN')}</td>
                <td class="p-3 text-center text-gray-600">${item.gstRate}%</td>
                <td class="p-3 text-right font-bold text-gray-800">₹${Math.round(item.totalPrice).toLocaleString('en-IN')}</td>
            </tr>
        `;
    });

    // 6. Build HTML String
    const quoteHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Quotation - ${customer.name}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
            body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            @media print {
                .no-print { display: none !important; }
                .page-break { page-break-before: always; }
            }
        </style>
    </head>
    <body class="bg-gray-100 min-h-screen p-8">
        <div class="max-w-4xl mx-auto bg-white p-10 rounded-xl shadow-lg border border-gray-200 relative">
            
            <!-- Print Button -->
            <button onclick="window.print()" class="no-print absolute top-8 right-8 bg-blue-600 text-white px-5 py-2 rounded-lg shadow font-medium hover:bg-blue-700 transition">🖨️ Print Quote</button>

            <!-- Header -->
            <div class="flex justify-between items-start border-b-2 border-gray-100 pb-8 mb-8">
                <div>
                    <!-- Adjust relative path for logo if needed -->
                    <img src="../Uplodes/v sustain logo.png" onerror="this.src='../Uplodes/v sustain logo (1).png'" alt="V-Sustain Solar" class="h-16 mb-4">
                    <h1 class="text-2xl font-bold text-gray-800 tracking-tight">V-SUSTAIN SOLAR SOLUTIONS</h1>
                    <p class="text-sm text-gray-500 mt-1">Authorized Luminous Partner</p>
                    <p class="text-sm text-gray-500">Bengaluru, Karnataka</p>
                    <p class="text-sm text-gray-500">vsustainsolarsolutions@gmail.com | +91 99000 00476</p>
                </div>
                <div class="text-right">
                    <h2 class="text-3xl font-bold text-blue-600 uppercase tracking-widest mb-2">Quotation</h2>
                    <p class="text-gray-600 font-medium">Date: <span class="text-gray-800">${customer.date}</span></p>
                    <p class="text-gray-600 font-medium">Valid Until: <span class="text-gray-800">${new Date(Date.now() + 15 * 86400000).toLocaleDateString('en-IN')}</span></p>
                </div>
            </div>

            <!-- Customer Details -->
            <div class="bg-gray-50 p-5 rounded-lg mb-8 border border-gray-100">
                <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Prepared For</h3>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <p class="font-bold text-lg text-gray-800">${customer.name}</p>
                        <p class="text-gray-600">${customer.address}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-gray-600">📞 ${customer.phone}</p>
                        <p class="text-gray-600">✉️ ${customer.email}</p>
                    </div>
                </div>
            </div>

            <!-- Table -->
            <div class="overflow-x-auto mb-8">
                <table class="w-full text-left border-collapse">
                    <thead>
                        <tr class="bg-blue-600 text-white text-sm uppercase tracking-wider">
                            <th class="p-3 text-center rounded-tl-lg">#</th>
                            <th class="p-3">Item Description</th>
                            <th class="p-3 text-center">Qty</th>
                            <th class="p-3 text-right">Unit Price (Base)</th>
                            <th class="p-3 text-center">GST Rate</th>
                            <th class="p-3 text-right rounded-tr-lg">Total Amount</th>
                        </tr>
                    </thead>
                    <tbody class="text-sm">
                        ${rowsHtml}
                    </tbody>
                </table>
            </div>

            <!-- Totals Area -->
            <div class="flex justify-end mb-8">
                <div class="w-72 bg-gray-50 p-5 rounded-lg border border-gray-100">
                    <div class="flex justify-between mb-2 text-gray-600">
                        <span>Total (Pre-Tax):</span>
                        <span class="font-medium">₹${Math.round(grandPreTax).toLocaleString('en-IN')}</span>
                    </div>
                    <div class="flex justify-between mb-4 text-gray-600">
                        <span>Total GST:</span>
                        <span class="font-medium">₹${Math.round(grandGst).toLocaleString('en-IN')}</span>
                    </div>
                    <div class="flex justify-between items-center border-t border-gray-200 pt-3">
                        <span class="font-bold text-gray-800">Grand Total:</span>
                        <span class="font-bold text-xl text-blue-600">₹${Math.round(grandTotal).toLocaleString('en-IN')}</span>
                    </div>
                </div>
            </div>

            ${disclaimerHtml}

            <!-- Terms -->
            <div class="mt-8 border-t border-gray-200 pt-8">
                <h4 class="font-bold text-gray-800 mb-2">Terms & Conditions</h4>
                <ul class="text-sm text-gray-600 list-disc pl-5 space-y-1">
                    <li>100% advance payment required along with the purchase order.</li>
                    <li>Delivery and installation within 3-5 working days from order confirmation.</li>
                    <li>Warranty is subject to manufacturer terms and conditions.</li>
                    <li>Any additional civil or structural changes required at site will be billed extra.</li>
                </ul>
            </div>

        </div>
    </body>
    </html>
    `;

    // 7. Open Quote in new tab
    const newWin = window.open('', '_blank');
    newWin.document.write(quoteHtml);
    newWin.document.close();
}
