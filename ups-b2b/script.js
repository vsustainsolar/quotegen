// --- DATA CATALOGS ---
const upsCatalog = [
    { id: 'u1', name: 'Luminous ECO WATT NEO 2300 (2KVA/24V)', price: 7887, gst: 18 },
    { id: 'u2', name: 'Luminous EVO D 2300 (24V)', price: 7887, gst: 18 },
    { id: 'u3', name: 'Luminous EVO S 2300 (24V)', price: 8790, gst: 18 },
    { id: 'u4', name: 'Luminous Eco Volt Neo 2300+ (2KVA/24V)', price: 8790, gst: 18 },
    { id: 'u5', name: 'Luminous OPTIMUS 2300+ (2KVA/24V)', price: 10210, gst: 18 },
    { id: 'u6', name: 'Luminous OPTIMUS 2800+ (2.5KVA/24V)', price: 12414, gst: 18 },
    { id: 'u7', name: 'Luminous OPTIMUS 3500+ (3KVA/24V)', price: 14357, gst: 18 },
    { id: 'u8', name: 'Luminous OPTIMUS 3800+ (3.5KVA/36V)', price: 15286, gst: 18 },
    { id: 'u9', name: 'Luminous OPTIMUS 4300+ (4KVA/36V)', price: 21175, gst: 18 },
    { id: 'u10', name: 'Luminous OPTIMUS 4500+ (4KVA/48V)', price: 17994, gst: 18 },
    { id: 'u11', name: 'Luminous OPTIMUS 6000+ (5KVA/48V)', price: 25464, gst: 18 },
    { id: 'u12', name: 'Luminous OPTIMUS 6500+ (5.5KVA/72V)', price: 25944, gst: 18 },
    { id: 'u13', name: 'Luminous I-CRUZE 7000+ (6KVA/96V)', price: 38187, gst: 18 },
    { id: 'u14', name: 'Luminous OPTIMUS 8000+ (7.5KVA/96V)', price: 51916, gst: 18 },
    { id: 'u15', name: 'Luminous I-CRUZE 9000+ (7.5KVA/120V)', price: 48490, gst: 18 },
    { id: 'u16', name: 'Luminous OPTIMUS 11000+ (10KVA/120V)', price: 68482, gst: 18 },
    { id: 'u17', name: 'Luminous SYNC-X WI-FI DATA LOGGER', price: 100, gst: 18 }
];

const inverterCatalog = [
    // Sine Wave Inverters
    { id: 'i1', name: 'Luminous ICON 1100 12V (Sine Wave) - 3 Yrs Warranty', price: 7802, gst: 18 },
    { id: 'i2', name: 'Luminous ICON 1600 12V (Sine Wave) - 3 Yrs Warranty', price: 10664, gst: 18 },
    { id: 'i3', name: 'Luminous OPTIMUS 1250+ 12V (Sine Wave) - 3 Yrs Warranty', price: 6272, gst: 18 },
    { id: 'i4', name: 'Luminous ECO VOLT NEO 750 12V (Sine Wave) - 3 Yrs Warranty', price: 3882, gst: 18 },
    { id: 'i5', name: 'Luminous ECO VOLT NEO 850 12V (Sine Wave) - 3 Yrs Warranty', price: 4080, gst: 18 },
    { id: 'i6', name: 'Luminous ECO VOLT NEO 1050 12V (Sine Wave) - 3 Yrs Warranty', price: 4700, gst: 18 },
    { id: 'i7', name: 'Luminous ECO VOLT NEO 1250+ 12V (Sine Wave) - 3 Yrs Warranty', price: 5484, gst: 18 },
    { id: 'i8', name: 'Luminous ECO VOLT NEO 1550 12V (Sine Wave) - 3 Yrs Warranty', price: 7549, gst: 18 },
    { id: 'i9', name: 'Luminous ECO VOLT NEO 1650 24V (Sine Wave) - 3 Yrs Warranty', price: 6893, gst: 18 },
    { id: 'i10', name: 'Luminous ZELIO S 1150 12V (Sine Wave) - 3 Yrs Warranty', price: 5975, gst: 18 },
    { id: 'i11', name: 'Luminous ZELIO S 1250 12V (Sine Wave) - 3 Yrs Warranty', price: 6452, gst: 18 },
    { id: 'i12', name: 'Luminous ZELIO S 1550 12V (Sine Wave) - 3 Yrs Warranty', price: 8561, gst: 18 },
    { id: 'i13', name: 'Luminous EVO S 750 12V (Sine Wave) - 3 Yrs Warranty', price: 3882, gst: 18 },
    { id: 'i14', name: 'Luminous EVO S 850 12V (Sine Wave) - 3 Yrs Warranty', price: 4080, gst: 18 },
    { id: 'i15', name: 'Luminous EVO S 1050 12V (Sine Wave) - 3 Yrs Warranty', price: 4700, gst: 18 },
    { id: 'i16', name: 'Luminous EVO S 1250 12V (Sine Wave) - 3 Yrs Warranty', price: 5484, gst: 18 },
    { id: 'i17', name: 'Luminous EVO S 1550 12V (Sine Wave) - 3 Yrs Warranty', price: 7549, gst: 18 },
    { id: 'i18', name: 'Luminous EVO S 1650 24V (Sine Wave) - 3 Yrs Warranty', price: 6893, gst: 18 },

    // Square Wave Inverters
    { id: 'i19', name: 'Luminous ECO WATT NEO 800 12V (Square Wave) - 3 Yrs Warranty', price: 3614, gst: 18 },
    { id: 'i20', name: 'Luminous ECO WATT NEO 900 12V (Square Wave) - 3 Yrs Warranty', price: 3886, gst: 18 },
    { id: 'i21', name: 'Luminous ECO WATT NEO 1050 12V (Square Wave) - 3 Yrs Warranty', price: 4192, gst: 18 },
    { id: 'i22', name: 'Luminous ECO WATT NEO 1250 PRO 12V (Square Wave) - 3 Yrs Warranty', price: 5002, gst: 18 },
    { id: 'i23', name: 'Luminous ECO WATT NEO 1650 24V (Square Wave) - 3 Yrs Warranty', price: 6040, gst: 18 },
    { id: 'i24', name: 'Luminous SHAKTI CHARGE NEO 1150 PRO 12V (Square Wave) - 3 Yrs Warranty', price: 4876, gst: 18 },
    { id: 'i25', name: 'Luminous SHAKTI CHARGE NEO 1450 PRO 12V (Square Wave) - 3 Yrs Warranty', price: 5490, gst: 18 },
    { id: 'i26', name: 'Luminous SHAKTI CHARGE NEO 1750 PRO 12V (Square Wave) - 3 Yrs Warranty', price: 6784, gst: 18 },
    { id: 'i27', name: 'Luminous EVO D 700 12V (Square Wave) - 3 Yrs Warranty', price: 3456, gst: 18 },
    { id: 'i28', name: 'Luminous EVO D 800 12V (Square Wave) - 3 Yrs Warranty', price: 3614, gst: 18 },
    { id: 'i29', name: 'Luminous EVO D 900 12V (Square Wave) - 3 Yrs Warranty', price: 3886, gst: 18 },
    { id: 'i30', name: 'Luminous EVO D 1050 12V (Square Wave) - 3 Yrs Warranty', price: 4192, gst: 18 },
    { id: 'i31', name: 'Luminous EVO D 1250 12V (Square Wave) - 3 Yrs Warranty', price: 5002, gst: 18 },
    { id: 'i32', name: 'Luminous EVO D 1650 24V (Square Wave) - 3 Yrs Warranty', price: 6040, gst: 18 }
];

const solarInverterCatalog = [
    // NXG Series (Solar UPS)
    { id: 'si1', name: 'Luminous NXG 850e 12V (Solar UPS)', price: 4325, gst: 18 },
    { id: 'si2', name: 'Luminous NXG 1150e 12V (Solar UPS)', price: 5515, gst: 18 },
    { id: 'si3', name: 'Luminous NXG 1450e 12V (Solar UPS)', price: 6667, gst: 18 },
    { id: 'si4', name: 'Luminous NXG 1850e 24V (Solar UPS)', price: 7860, gst: 18 },
    { id: 'si5', name: 'Luminous NXG 2350 24V (Solar UPS)', price: 9963, gst: 18 },

    // NXG PRO / Solar UPS
    { id: 'si6', name: 'Luminous NXG PRO e 1KVA 12V', price: 9356, gst: 18 },
    { id: 'si7', name: 'Luminous NXG PRO e 1KVA 24V', price: 9356, gst: 18 },

    // Solarverter Series
    { id: 'si8', name: 'Luminous Solarverter 3KVA 48V', price: 16779, gst: 18 },
    { id: 'si9', name: 'Luminous Solarverter 5KVA 48V (PWM)', price: 31516, gst: 18 },

    // NXP Series (PWM & MPPT)
    { id: 'si10', name: 'Luminous NXP 3500 24V (PWM)', price: 14115, gst: 18 },
    { id: 'si11', name: 'Luminous NXP PRO 3500 24V (MPPT)', price: 23188, gst: 18 },

    // Solarverter PRO Series
    { id: 'si12', name: 'Luminous Solarverter PRO 2KVA Eco 24V', price: 16897, gst: 18 },
    { id: 'si13', name: 'Luminous Solarverter PRO 3KVA Eco 36V', price: 24498, gst: 18 },
    { id: 'si14', name: 'Luminous Solarverter PRO 3.5KVA 48V', price: 31629, gst: 18 },
    { id: 'si15', name: 'Luminous Solarverter PRO 5KVA 48V', price: 41895, gst: 18 },
    { id: 'si16', name: 'Luminous Solarverter PRO 6KVA 96V', price: 47247, gst: 18 },
    { id: 'si17', name: 'Luminous Solarverter PRO 7.5KVA Eco 96V', price: 64266, gst: 18 },
    { id: 'si18', name: 'Luminous Solarverter PRO 10.1KVA Eco 120V', price: 82817, gst: 18 },

    // NXT+ Series (MPPT PCU)
    { id: 'si19', name: 'Luminous PCU NXT+ 7.5KVA 96V', price: 58076, gst: 18 },

    // NXE PRO Series
    { id: 'si20', name: 'Luminous NXE PRO 15KVA 240V', price: 129602, gst: 18 },

    // On-Grid Inverters (NXI / NXIT Series - 5% GST)
    { id: 'si21', name: 'Luminous NXIT130 3kW + Dongle (On-Grid)', price: 16941, gst: 5 },
    { id: 'si22', name: 'Luminous NXIT150 5kW + Dongle (On-Grid)', price: 28774, gst: 5 },
    { id: 'si23', name: 'Luminous NXI 140 4kW (On-Grid)', price: 28509, gst: 5 },
    { id: 'si24', name: 'Luminous NXI 150 5kW (On-Grid)', price: 30508, gst: 5 },
    { id: 'si25', name: 'Luminous NXI 305 5kW (On-Grid)', price: 45696, gst: 5 },
    { id: 'si26', name: 'Luminous NXI 306 6kW (On-Grid)', price: 51206, gst: 5 },
    { id: 'si27', name: 'Luminous NXI 308 8kW (On-Grid)', price: 57641, gst: 5 },
    { id: 'si28', name: 'Luminous NXI 310 10kW (On-Grid)', price: 59110, gst: 5 },
    { id: 'si29', name: 'Luminous NXIT310 10kW + Dongle (On-Grid)', price: 55684, gst: 5 },
    { id: 'si30', name: 'Luminous NXI 312 12kW (On-Grid)', price: 63560, gst: 5 },
    { id: 'si31', name: 'Luminous NXI 315 15kW (On-Grid)', price: 66339, gst: 5 },
    { id: 'si32', name: 'Luminous NXI 320 20kW (On-Grid)', price: 79429, gst: 5 },
    { id: 'si33', name: 'Luminous NXI 325 25kW (On-Grid)', price: 97180, gst: 5 },
    { id: 'si34', name: 'Luminous NXI 330 30kW (On-Grid)', price: 110076, gst: 5 },
    { id: 'si35', name: 'Luminous NXI 350 50kW (On-Grid)', price: 150912, gst: 5 },
    { id: 'si36', name: 'Luminous NXI 360 60kW (On-Grid)', price: 161198, gst: 5 },
    { id: 'si37', name: 'Luminous NXI 380 80kW (On-Grid)', price: 251588, gst: 5 },
    { id: 'si38', name: 'Luminous NXI 3100 100kW (On-Grid)', price: 268801, gst: 5 },

    // Utility Scale Inverters
    { id: 'si39', name: 'Luminous NXI A3250-HV 250kW (Utility Scale)', price: 417806, gst: 5 },
    { id: 'si40', name: 'Luminous NXI A3350-HV 350kW (Utility Scale)', price: 555492, gst: 5 },

    // Accessories & Dongles
    { id: 'si41', name: 'Luminous S3 WiFi Dongle', price: 100, gst: 18 },
    { id: 'si42', name: 'Luminous S4 WiFi USB Dongle', price: 100, gst: 18 },
    { id: 'si43', name: 'Luminous Sync X WiFi Dongle', price: 103, gst: 18 },
    { id: 'si44', name: 'Luminous GTI Array Management Unit AI 2000', price: 172150, gst: 18 },

    // Hybrid Inverters (5% GST)
    { id: 'si45', name: 'Luminous Hybrid TX 3KVA 48V', price: 35328, gst: 5 },
    { id: 'si46', name: 'Luminous Hybrid TX 4KVA 48V', price: 46625, gst: 5 },
    { id: 'si47', name: 'Luminous Hybrid TX 5KVA 48V', price: 49512, gst: 5 },
    { id: 'si48', name: 'Luminous Hybrid TX 3.75KVA 48V', price: 35328, gst: 5 },

    // High Frequency Hybrid (NXH Series - 5% GST)
    { id: 'si49', name: 'Luminous NXH 308 A 8kW 120-600V', price: 191841, gst: 5 },
    { id: 'si50', name: 'Luminous NXH 310 A 10kW 120-600V', price: 205269, gst: 5 },
    { id: 'si51', name: 'Luminous NXH 312 A 12kW 120-600V', price: 216033, gst: 5 }
];

const batteryCatalog = [
    { id: 'b1', name: 'Luminous ILST 10036 (80Ah) - 24+12* Months Warranty', price: 6459, gst: 18 },
    { id: 'b2', name: 'Luminous ILST 12042 (100Ah) - 24+18* Months Warranty', price: 7849, gst: 18 },
    { id: 'b3', name: 'Luminous RC 15000 Pro (120Ah) - 24+24* Months Warranty', price: 8399, gst: 18 },
    { id: 'b4', name: 'Luminous SC 16060 (135Ah) - 36+24* Months Warranty', price: 9521, gst: 18 },
    { id: 'b5', name: 'Luminous ILTJ 18148 (150Ah) - 36+12* Months Warranty', price: 10466, gst: 18 },
    { id: 'b6', name: 'Luminous RC 18000ST (150Ah) - 18+18* Months Warranty', price: 9510, gst: 18 },
    { id: 'b7', name: 'Luminous RC 18000ST PRO (150Ah) - 24+24* Months Warranty', price: 9763, gst: 18 },
    { id: 'b8', name: 'Luminous NEO 18030 (150Ah) - 15+15* Months Warranty', price: 10336, gst: 18 },
    { id: 'b9', name: 'Luminous RC 18000 (150Ah) - 18+18* Months Warranty', price: 10442, gst: 18 },
    { id: 'b10', name: 'Luminous RC 18000 Pro (150Ah) - 24+24* Months Warranty', price: 10611, gst: 18 },
    { id: 'b11', name: 'Luminous PC 18054 PRO (150Ah) - 30+24* Months Warranty', price: 10813, gst: 18 },
    { id: 'b12', name: 'Luminous PC 18054 TJ PRO (150Ah) - 30+24* Months Warranty', price: 9998, gst: 18 },
    { id: 'b13', name: 'Luminous SC 18060 (150Ah) - 36+24* Months Warranty', price: 11083, gst: 18 },
    { id: 'b14', name: 'Luminous ECO 18000 (150Ah) - 24+18* Months Warranty', price: 10444, gst: 18 },
    { id: 'b15', name: 'Luminous EC 18060 (150Ah) - 36+24* Months Warranty', price: 11422, gst: 18 },
    { id: 'b16', name: 'Luminous ILTT 18060 PRO (150Ah) - 36+24* Months Warranty', price: 11193, gst: 18 },
    { id: 'b17', name: 'Luminous LM 18075 (150Ah) - 60+15* Months Warranty', price: 14216, gst: 18 },
    { id: 'b18', name: 'Luminous UCTT 18066 (150Ah) - 42+24* Months Warranty', price: 12112, gst: 18 },
    { id: 'b19', name: 'Luminous PC 20042 (160Ah) - 21+21* Months Warranty', price: 11032, gst: 18 },
    { id: 'b20', name: 'Luminous ILTT 20060 (160Ah) - 30+30* Months Warranty', price: 11655, gst: 18 },
    { id: 'b21', name: 'Luminous ILTT 20066 (160Ah) - 36+30* Months Warranty', price: 12070, gst: 18 },
    { id: 'b22', name: 'Luminous RC 24000 PRO (180Ah) - 24+24* Months Warranty', price: 12599, gst: 18 },
    { id: 'b23', name: 'Luminous ILTT 24060 (180Ah) - 36+24* Months Warranty', price: 14040, gst: 18 },
    { id: 'b24', name: 'Luminous UCTT 24066 (180Ah) - 42+24* Months Warranty', price: 14331, gst: 18 },
    { id: 'b25', name: 'Luminous RC 25000 (200Ah) - 18+18* Months Warranty', price: 13434, gst: 18 },
    { id: 'b26', name: 'Luminous RC 25000 PRO (200Ah) - 24+24* Months Warranty', price: 13628, gst: 18 },
    { id: 'b27', name: 'Luminous ILTT 25060 (200Ah) - 36+24* Months Warranty', price: 15063, gst: 18 },
    { id: 'b28', name: 'Luminous UCTT 25066 (200Ah) - 42+24* Months Warranty', price: 15488, gst: 18 },
    { id: 'b29', name: 'Luminous UCTT 25072 (200Ah) - 48+24* Months Warranty', price: 15936, gst: 18 },
    { id: 'b30', name: 'Luminous RC 26000 PRO (220Ah) - 24+24* Months Warranty', price: 14872, gst: 18 },
    { id: 'b31', name: 'Luminous ILTT 26060 (220Ah) - 36+24* Months Warranty', price: 16324, gst: 18 },
    { id: 'b32', name: 'Luminous UCTT 26066 (220Ah) - 42+24* Months Warranty', price: 16620, gst: 18 },
    { id: 'b33', name: 'Luminous UCTT 28066 (250Ah) - 42+24* Months Warranty', price: 18279, gst: 18 },
    { id: 'b34', name: 'Luminous ILTT 28060 (250Ah) - 36+24* Months Warranty', price: 18071, gst: 18 },
    { id: 'b35', name: 'Luminous UCTT 29072 (260Ah) - 48+24* Months Warranty', price: 18728, gst: 18 },
    { id: 'b36', name: 'Luminous ILTT 32060 (300Ah) - 36+24* Months Warranty', price: 20598, gst: 18 },
    { id: 'b37', name: 'Luminous ECO 25048 (200Ah) - 24+24* Months Warranty', price: 14310, gst: 18 },
    { id: 'b38', name: 'Luminous ECO 25060 (200Ah) - 36+24* Months Warranty', price: 15814, gst: 18 },
    { id: 'b39', name: 'Luminous ECO 26060 (220Ah) - 36+24* Months Warranty', price: 17140, gst: 18 },
    { id: 'b40', name: 'Luminous ECO 28060 (250Ah) - 36+24* Months Warranty', price: 18974, gst: 18 }
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
    const upsPanel = document.getElementById('ups-container')?.closest('.panel');
    if (upsPanel) {
        const globalPanel = document.createElement('section');
        globalPanel.className = 'panel highlight-panel';
        globalPanel.innerHTML = `
            <h2>2. Global Pricing Settings</h2>
            <p class="helper-text">Set a common margin % for all products. Turn on "Reduce Margin" to apply a discount instead of a markup. <strong style="color:var(--danger);">Margin is required before generating.</strong></p>
            <div class="form-grid" style="align-items: flex-start;">
                <div class="input-group">
                    <label style="display:flex; align-items:center; gap:6px;">
                        Common Margin (%) <span style="color:var(--danger); font-weight:700;">*</span>
                    </label>
                    <input type="number" id="global-margin" placeholder="Enter e.g. 15" min="0"
                        style="border:2px solid var(--danger); background:#fff8f8; transition:border 0.2s, background 0.2s;">
                    <span id="margin-required-hint" style="color:var(--danger); font-size:12px; margin-top:5px; display:none; font-weight:600;">⚠ Please enter a margin value before generating.</span>
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
        // Start from 3 because: 1=Customer Info, 2=Global Pricing (just injected)
        let panelIndex = 3;
        let currentSibling = globalPanel.nextElementSibling;
        while(currentSibling) {
            if (currentSibling.classList.contains('panel') || currentSibling.classList.contains('highlight-panel')) {
                const h2 = currentSibling.querySelector('h2');
                if(h2) {
                    h2.innerText = h2.innerText.replace(/^\d+\./, panelIndex + '.');
                    panelIndex++;
                }
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

        // Clear mandatory styling when user types in margin
        const globalMarginInput = document.getElementById('global-margin');
        globalMarginInput.addEventListener('input', function() {
            if (this.value !== '') {
                this.style.border = '2px solid var(--success)';
                this.style.background = '#f0fff4';
                document.getElementById('margin-required-hint').style.display = 'none';
            } else {
                this.style.border = '2px solid var(--danger)';
                this.style.background = '#fff8f8';
            }
        });
    }

    // 2. Rewrite Trolley HTML row to support Custom Margin toggling
    const trolleyRow = document.getElementById('trolley-row');
    if (trolleyRow) {
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
    }

    // Initialize Default Rows
    addUpsRow();
    addInverterRow();
    addSolarInverterRow(); // Init new section
    addBatteryRow();

    // 3. Attach Event Listeners
    document.getElementById('add-ups-btn')?.addEventListener('click', addUpsRow);
    document.getElementById('add-inverter-btn')?.addEventListener('click', addInverterRow);
    document.getElementById('add-solarinverter-btn')?.addEventListener('click', addSolarInverterRow);
    document.getElementById('add-battery-btn')?.addEventListener('click', addBatteryRow);
    document.getElementById('add-custom-btn')?.addEventListener('click', addCustomRow);
    document.getElementById('generate-btn')?.addEventListener('click', generateQuotation);
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
        <div class="input-group-inline">
            <button type="button" class="btn-override-price" title="Override catalog base price for this item"
                style="background:#eff6ff; color:var(--primary); border:2px solid var(--primary); padding:6px 12px; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer; white-space:nowrap;">
                ✏ Override Price
            </button>
            <span style="font-size:12px; color:var(--text-muted); margin-left:4px; display:none;" class="override-price-label">Custom ₹:</span>
            <input type="number" class="item-override-price" placeholder="Custom base price" min="0"
                style="width:110px; padding:8px; border:2px solid var(--primary); border-radius:6px; display:none; font-size:14px;">
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

    // Override Price button toggle
    const overrideBtn = row.querySelector('.btn-override-price');
    const overridePriceInput = row.querySelector('.item-override-price');
    const overridePriceLabel = row.querySelector('.override-price-label');
    let overrideActive = false;
    overrideBtn.addEventListener('click', () => {
        overrideActive = !overrideActive;
        if (overrideActive) {
            overridePriceInput.style.display = 'block';
            overridePriceLabel.style.display = 'inline';
            overrideBtn.style.background = 'var(--primary)';
            overrideBtn.style.color = 'white';
            overrideBtn.textContent = '✖ Cancel Override';
            overridePriceInput.focus();
        } else {
            overridePriceInput.style.display = 'none';
            overridePriceLabel.style.display = 'none';
            overrideBtn.style.background = '#eff6ff';
            overrideBtn.style.color = 'var(--primary)';
            overrideBtn.textContent = '✏ Override Price';
            overridePriceInput.value = '';
        }
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

    // Override Price button toggle
    const overrideBtn = row.querySelector('.btn-override-price');
    const overridePriceInput = row.querySelector('.item-override-price');
    const overridePriceLabel = row.querySelector('.override-price-label');
    let overrideActive = false;
    overrideBtn.addEventListener('click', () => {
        overrideActive = !overrideActive;
        if (overrideActive) {
            overridePriceInput.style.display = 'block';
            overridePriceLabel.style.display = 'inline';
            overrideBtn.style.background = 'var(--primary)';
            overrideBtn.style.color = 'white';
            overrideBtn.textContent = '✖ Cancel Override';
            overridePriceInput.focus();
        } else {
            overridePriceInput.style.display = 'none';
            overridePriceLabel.style.display = 'none';
            overrideBtn.style.background = '#eff6ff';
            overrideBtn.style.color = 'var(--primary)';
            overrideBtn.textContent = '✏ Override Price';
            overridePriceInput.value = '';
        }
    });

    row.querySelector('.btn-remove').addEventListener('click', () => {
        row.remove();
    });

    return row;
}

// Add row functions
function addUpsRow() {
    const container = document.getElementById('ups-container');
    if(container) container.appendChild(createRow('ups', upsCatalog));
}

function addInverterRow() {
    const container = document.getElementById('inverter-container');
    if(container) container.appendChild(createRow('inverter', inverterCatalog));
}

function addSolarInverterRow() {
    const container = document.getElementById('solarinverter-container');
    if(container) container.appendChild(createRow('solarinverter', solarInverterCatalog));
}

function addBatteryRow() {
    const container = document.getElementById('battery-container');
    if(container) container.appendChild(createRow('battery', batteryCatalog));
}

function addCustomRow() {
    const container = document.getElementById('custom-container');
    if(container) container.appendChild(createCustomRow());
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

        const overridePriceInput = row.querySelector('.item-override-price');
        const overridePriceVal = overridePriceInput ? parseFloat(overridePriceInput.value) : NaN;

        if (isActive && modelId && qty > 0) {
            const product = catalog.find(item => item.id === modelId);
            if (product) {
                const unitPrice = (!isNaN(overridePriceVal) && overridePriceVal > 0) ? overridePriceVal : product.price;
                const baseTotal = unitPrice * qty;
                let finalBase = baseTotal;
                const effectiveMargin = useCustom ? customMarginVal : globalMargin;
                
                if (isReduce) {
                    finalBase = baseTotal - (baseTotal * (effectiveMargin / 100));
                } else {
                    finalBase = baseTotal + (baseTotal * (effectiveMargin / 100));
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
            const effectiveMargin = useCustom ? customMarginVal : globalMargin;
            
            if (isReduce) {
                finalBase = baseTotal - (baseTotal * (effectiveMargin / 100));
            } else {
                finalBase = baseTotal + (baseTotal * (effectiveMargin / 100));
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

    // 2. Fetch & Validate Global Pricing Settings
    const globalMarginInput = document.getElementById('global-margin');
    const globalMarginRaw = globalMarginInput.value.trim();
    if (globalMarginRaw === '' || globalMarginRaw === null) {
        globalMarginInput.style.border = '2px solid var(--danger)';
        globalMarginInput.style.background = '#fff8f8';
        const hint = document.getElementById('margin-required-hint');
        if (hint) { hint.style.display = 'block'; }
        globalMarginInput.focus();
        globalMarginInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    const globalMargin = parseFloat(globalMarginRaw) || 0;
    const isReduce = document.getElementById('global-margin-reduce').checked;

    // 3. Extract active line items from all sections
    let allItems = [];
    allItems = allItems.concat(extractRowData('.ups-row', upsCatalog, globalMargin, isReduce));
    allItems = allItems.concat(extractRowData('.inverter-row', inverterCatalog, globalMargin, isReduce));
    allItems = allItems.concat(extractRowData('.solarinverter-row', solarInverterCatalog, globalMargin, isReduce));
    allItems = allItems.concat(extractRowData('.battery-row', batteryCatalog, globalMargin, isReduce));
    
    // Extract custom line items
    allItems = allItems.concat(extractCustomRowData(globalMargin, isReduce));
    
    // Trolley logic
    const trolleyActive = document.getElementById('trolley-active')?.checked;
    const trolleyId = document.getElementById('trolley-select')?.value;
    if (trolleyActive && trolleyId) {
        const qty = parseInt(document.getElementById('trolley-qty').value) || 1;
        const useCustom = document.getElementById('trolley-custom-margin-toggle').checked;
        const customMarginVal = parseFloat(document.getElementById('trolley-margin').value) || 0;
        
        const product = trolleyCatalog.find(i => i.id === trolleyId);
        const baseTotal = product.price * qty;
        
        let finalBase = baseTotal;
        const effectiveTrolleyMargin = useCustom ? customMarginVal : globalMargin;
        if (isReduce) {
            finalBase = baseTotal - (baseTotal * (effectiveTrolleyMargin / 100));
        } else {
            finalBase = baseTotal + (baseTotal * (effectiveTrolleyMargin / 100));
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
        alert("Please select and activate at least one product to generate a quotation.");
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
    const socketReqNode = document.querySelector('input[name="ups_socket"]:checked');
    const socketReq = socketReqNode ? socketReqNode.value : 'no';
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
        <title>Quotation - ${customer.name}</title>
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
                        <h3 class="text-xl font-bold">Enterprise Power Solution</h3>
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
