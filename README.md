# V-Sustain Solar Solutions — Quotation Suite

Static, zero-dependency quotation generators for solar and UPS systems. Open
`index.html` in a browser and it works — no build step, no server, no database.

- **On-Grid** — grid-tied rooftop with net-metering
- **Off-Grid** — battery-backed standalone system
- **Hybrid** — grid-tied with battery backup
- **B2B UPS** — commercial / industrial uninterruptible power systems

Quotations are generated as a printable A4 document in a new window. Use the
browser's *Print → Save as PDF* to produce the PDF the customer receives.

---

## 1. Running it

```
open index.html          # pick a quotation type
```

Everything is plain HTML/CSS/JS. There is no bundler and no runtime
dependency. The only dev dependency is Playwright, used by the price tooling.

---

## 2. Product & price management

> **The master price list is `data/catalog.json`.**
> The four `script.js` files are *generated from it* — never edit a price in
> `script.js` directly, or the next `npm run prices` will overwrite it.

### The workflow

```bash
# 1. edit data/catalog.json  (add / re-price / retire products)

npm run prices          # write the catalog into the four tool files
npm run validate        # sanity-check the catalog (dupes, bad prices, drift)
npm run smoke           # confirm the quotations still come out right
```

| Command | What it does |
|---|---|
| `npm run prices` | Writes `data/catalog.json` into the four tool files. Prints what changed. |
| `npm run prices:check` | Dry run — shows what *would* change, writes nothing. |
| `npm run prices:extract` | Reverse direction: rebuild `data/catalog.json` from the current code. Use once to seed the catalog, or to recover. |
| `npm run validate` | Checks for duplicate SKUs, missing/invalid prices, inverted price-vs-capacity, and the same product priced differently across lists. |
| `npm run smoke` | Loads each tool in a real browser, drives a fixed input and compares the resulting totals against `tools/golden.json`. |
| `npm run smoke:update` | Re-records the golden totals (only after an *intended* price change). |

### Adding a product

Add an entry to the `products` array in `data/catalog.json`, then run
`npm run prices && npm run validate && npm run smoke`.

```json
{
  "sku": "solar-panel:novasys-dcr-550wp",
  "category": "solar-panel",
  "brand": "Novasys",
  "type": "DCR",
  "model": "Novasys DCR 550Wp",
  "watt": 550,
  "price": 12375,
  "ratePerWp": 22.5,
  "priceBasis": "per-watt",
  "key": "Novasys DCR 550Wp"
}
```

- `category` decides which dropdown the product lands in.
- `key` is what matches the product to an existing entry in the code. Changing
  a `model` string means changing the `key` too, otherwise the old entry is
  left behind as an orphan.
- `priceBasis: "per-watt"` means the price was derived from the Rs/Wp rate, so
  the validator can check `ratePerWp × watt == price`. `"per-unit"` means the
  price was given per panel and `ratePerWp` was back-calculated for reference.

### Which catalog feeds which list

`tools/lib/targets.mjs` is the single place that maps products to files. A
product appears in a tool's dropdown when its category is listed for that
tool's list. The `solar-panel` category feeds the panel dropdown in **all
three** solar tools, which is why one entry updates all of them at once.

---

---

## 3. Pricing model

```
dealer price  →  × (1 + margin)  →  customer rate  →  × qty  →  + GST  →  line total
```

- **Dealer price** — what V-Sustain pays. This is what the catalog stores.
- **Margin** — a single common margin (default **20%**) applied to every
  section, or a per-section custom margin. The margin is a *markup*, not a
  margin-on-price.
- **GST** — added on top of the marked-up price.
- Rounding is to 2 decimals at every step (`round2`), per line, then summed.

### The prices that are not products

These behave like catalog data but are not products. They live in the
`settings` block of `data/catalog.json`:

| Setting | Value | Applies to |
|---|---|---|
| `earthingSet` | ₹3,000 | Earthing Set (Complete Kit) — all 3 solar tools |
| `installationPerKw` | ₹5,000/kW | Installation & Commissioning |
| `structurePerKw` | ₹8,000/kW | Module Mounting Structure |

---

## 4. GST logic

> **The 5% combination on inverter + battery + panels is a deliberate
> commercial offering by V-Sustain Solar Solutions.** It is a pricing
> decision that lowers the GST line on a bundled off-grid/hybrid system. It is
> **not** a statutory rate mapping, and it is **not** derived from HSN codes.
> It is applied exactly as described below, and it is switched on by the
> quotation builder turning on the three product cards.

### Rates by tool

| Line item | On-Grid | Off-Grid | Hybrid | B2B UPS |
|---|---|---|---|---|
| Solar panels | 5% | 5% | 5% | — |
| Inverter | 5% | 5% *or* 18% | 5% *or* 18% | per product |
| Battery | — | 5% *or* 18% | 5% *or* 18% | per product |
| Everything else (ACDB, DCDB, meter, cables, earthing, installation, structure) | 18% | 18% | 18% | per product |

\* **The 5% combination (Off-Grid and Hybrid).** When all three of the
inverter, battery and solar-panel cards are enabled in the builder, the
inverter and battery are quoted at 5% alongside the panels. If any one of the
three is switched off, the inverter and battery revert to 18%. The switch is
driven purely by whether the three product cards are turned on — not by
whether a model has been chosen or a quantity entered.

In the B2B UPS tool the GST rate is a **fixed property of each catalogue
entry** (169 products at 18%, 27 solar articles at 5%). There is no
combination logic in that tool.

> **Note from the Deye price list (Oct 2026):** *"GST for Inverters is 5% and
> GST for Batteries and Accessories is 18%."* The hybrid tool's 5% combination
> also puts the **battery** at 5%. That is the commercial offering described
> above and is deliberate — but it is worth checking against the invoice for
> Deye hybrid systems with batteries.

### ACDB / DCDB

ACDB and DCDB are quoted with **18% applied on top of the listed dealer
price**. The listed ACDB/DCDB prices are GST-inclusive (each one is a round
rupee amount × 1.18), so the customer price for these lines includes GST
twice over. **This is intentional and is the agreed commercial position** —
the 18% acts as a markup opportunity on these lines rather than a straight
tax pass-through.

### What the quotation document does *not* show

Be aware of these when reading a generated quotation:

- **No CGST/SGST or IGST split.** A single undifferentiated GST number is
  computed. Intra-state vs inter-state is not detected — the customer's city
  is printed on the quote but is not used for tax. Your accountant will need
  to make the CGST/SGST vs IGST split downstream.
- **No HSN or SAC codes.** The quotation is a commercial proposal, not a
  tax invoice.
- **No taxable-value subtotal and no GST row** in the on-grid, off-grid and
  hybrid tables — the line prices are pre-GST and the grand total is
  GST-inclusive. (The B2B UPS document *does* show a Pre-Tax / Total GST /
  Grand Total footer, but still no rate-wise split.)

---

## 5. Subsidies

Only the **On-Grid** tool computes subsidies. Off-Grid and Hybrid have the
UI placeholders but no calculation; B2B UPS has none.

| Scheme | Rule |
|---|---|
| PM Surya Ghar — residential | ≤ 2 kW → ₹60,000; 3–10 kW → ₹78,000; otherwise ₹0 |
| PM Surya Ghar — apartment common area | ₹18,000 × kW (toggle) |

The customer pays **the full grand total to V-Sustain**; the subsidy is
refunded later by the government via DBT. So the quote carries two figures:

- **Net Payable to V-Sustain** = grand total
- **Net Expenditure (After Subsidy Refund)** = grand total − subsidy

---

## 6. Panel price list

Prices are **dealer prices, EX-GST and EX-WORKS** — freight to site is not
included. GST is added by the tool.

| Brand | Type | Wp | Rs/Wp | Per panel |
|---|---|---|---|---|
| Novasys | DCR | 550 | 22.50 | ₹12,375 |
| Novasys | DCR | 600 | 24.00 | ₹14,400 |
| Novasys | NON DCR | 550 | 14.00 | ₹7,700 |
| Novasys | NON DCR | 630 | 13.80 | ₹8,694 |
| Premier | DCR | 550 | 21.90 | ₹12,045 |
| Premier | DCR | 620 | 25.30 | ₹15,686 |
| Premier | DCR (All Black) | 620 | 26.30 | ₹16,306 |
| Premier | NON DCR | 615 | 14.50 | ₹8,917.50 |
| Waaree | DCR | 540 | 23.50 | ₹12,690 |
| Waaree | DCR | 585 | 25.50 | ₹14,917.50 |
| Waaree | DCR | 705 | 27.50 | ₹19,387.50 |
| Waaree | NON DCR | 620 | 14.00 | ₹8,680 |
| Adani | NON DCR | 615 | 13.90 | ₹8,548.50 |
| Adani | NON DCR | 635 | 13.90 | ₹8,826.50 |
| Adani | DCR PERC | 535 | 23.85 | ₹12,759.75 |
| Adani | DCR PERC | 555 | 23.85 | ₹13,236.75 |
| Adani | DCR TOPCON | 610 | 26.85 | ₹16,378.50 |
| Adani | DCR TOPCON | 635 | 26.85 | ₹17,049.75 |

The older Luminous panels (`POLY 170W/12V`, `PV MOD LUM…`, `NON DCR LUM…`,
`DCR LUM…`) remain in the catalogue alongside these. The panel dropdown shows
the rate per watt for the newer entries so brands can be compared at a glance.

---

## 7. Inverter price lists

### Deye — EPC price list, Oct 2026

Source: *Deye Price List | EPC Price | Oct 2026* (Wekraft Solar). Prices are
**EPC, exclusive of transport and exclusive of GST**. GST is added by the tool.

**On-grid inverters** — used by the On-Grid tool

| kW | Phase | Price | kW | Phase | Price |
|---|---|---|---|---|---|
| 1.5 | Single | 14,514 | 20 | Three | 65,930 |
| 2.2 | Single | 14,652 | 25 | Three | 71,234 |
| 3.0 | Single | 14,455 | 33 | Three | 77,547 |
| 3.3 | Single | 14,725 | 40 | Three | 98,722 |
| 3.6 | Single | 15,400 | 50 | Three | 1,09,452 |
| 4.0 | Single | 16,311 | 60 | Three | 1,20,183 |
| 5.0 | Single | 24,328 | 80 | Three | 2,04,597 |
| 5.0 | Three | 43,697 | 90 | Three | 2,37,699 |
| 6.0 | Three | 45,189 | 100 | Three | 2,44,731 |
| 8.0 | Three | 45,934 | 110 | Three | 2,51,764 |
| 10 | Three | 46,680 | 125 | Three | 2,89,739 |
| 12 | Three | 48,171 | 136 | Three | 2,96,772 |
| 15 | Three | 59,109 | 18 | Three | 62,141 |

**Micro inverters**

| Model | Price |
|---|---|
| Micro Inverter — Ongrid 1000W | 9,397 |
| Micro Inverter — Ongrid 2200W | 15,459 |
| Micro Inverter — Hybrid 1000W | 32,131 |

**Hybrid inverters** — used by the Hybrid tool

| Model | Price |
|---|---|
| 3KW — 24V — LV — Single Phase | 68,955 |
| 3KW — 48V — LV — Single Phase | 68,955 |
| 3.6KW — 48V — LV — Single Phase | 76,291 |
| 5KW — 48V — LV — Single Phase | 81,425 |
| 6KW — 48V — LV — Single Phase | 84,360 |
| 8KW — 48V — LV — Single Phase | 1,18,837 |
| 5KW — 48V — LV — Three Phase | 1,22,505 |
| 8KW — 48V — LV — Three Phase | 1,55,515 |
| 10KW — 48V — LV — Three Phase | 1,61,384 |
| 12KW — 48V — LV — Three Phase | 1,66,519 |
| 15KW — 48V — LV — Three Phase | 2,12,000 |
| 20KW — 48V — LV — Three Phase | 2,70,685 |
| 30KW — HV | 3,74,117 |
| 40KW — HV | 4,47,473 |
| 50KW — HV | 4,54,809 |
| 60KW — HV | 6,27,196 |
| 70KW — HV | 6,60,206 |
| 80KW — HV | 7,18,891 |
| 100KW — HV | 7,77,576 |
| 125KW — HV | 8,94,946 |

**Deye warranty policy** (from the price list):

- On-grid inverters up to 10 kW — **10 years**
- On-grid inverters above 10 kW — **8 years**
- Hybrid inverters — **5 years**
- LiFePO4 batteries with 6000 cycles — 10 years
- Deye hybrid inverters bought with Deye batteries — 10-year combo warranty
  on both; batteries with 4000 cycles on 2.53 kWh alone carry a 5-year combo
  warranty. The Site Information Report must be submitted after installation
  to obtain the warranty certificate.

### Feston

Source: Feston ON GRID String Inverter price list (Aug) and Feston Hybrid
Inverter price list. Prices are **dealer prices, ex-GST**.

**On-grid string inverters** — new to the tool

| kW | Phase | Price | kW | Phase | Price |
|---|---|---|---|---|---|
| 2 | Single | 14,271 | 25 | Three | 64,821 |
| 3 | Single | 14,967 | 30 | Three | 76,584 |
| 4 | Single | 15,841 | 35 | Three | 80,985 |
| 5 | Single | 25,402 | 40 | Three | 99,031 |
| 5 | Three | 40,052 | 50 | Three | 1,09,300 |
| 6 | Three | 41,520 | 60 | Three | 1,23,239 |
| 8 | Three | 43,133 | 80 | Three | 2,05,398 |
| 10 | Three | 44,014 | 90 | Three | 2,39,115 |
| 12 | Three | 44,747 | 100 | Three | 2,46,318 |
| 15 | Three | 52,530 | 110 | Three | 2,53,519 |
| 20 | Three | 59,778 | 125 | Three | 2,96,733 |
| | | | 136 | Three | 3,11,137 |

**Hybrid inverters** — 10 years warranty

| Model | Price |
|---|---|
| Single Phase 3KW | 66,000 |
| Single Phase 3.6KW | 73,500 |
| Single Phase 5KW | 79,000 |
| Single Phase 6KW | 82,000 |
| Single Phase 8KW | 1,14,000 |
| Three Phase 5KW | 1,47,000 |
| Three Phase 8KW | 1,52,000 |
| Three Phase 10KW | 1,58,000 |
| Three Phase 12KW | 1,65,000 |
| Three Phase 15KW | 2,08,000 |
| Three Phase 20KW | 2,63,000 |
| Three Phase 30KW | 3,90,000 |

**Feston Lithium Ion Battery LV — 5 kWh** — ₹87,000 (Hybrid tool battery list).

> The Feston price sheets do not state a warranty for the on-grid string
> inverters, so those entries carry a neutral `10 Years*` in the catalogue.
> Correct them once Feston's terms are confirmed. The warranty field is not
> currently rendered anywhere in the quotation.

---

## 8. Known issues

Found while reviewing the code. None of them are fixed yet — they are recorded
here so they are not lost.

1. **Installation and Structure are quoted at 0% margin.** The code asks for
   `installation` / `structure` when applying a margin, but the form fields
   are named `install…` / `struct…`, so the lookup misses and the base price
   is used unchanged. AC cable, earthing cable and the lightning arrestor have
   no margin controls at all and are always at 0%. At a 20% margin this is
   roughly ₹13,000 on a 5 kW quote.
2. **The "Solar Panels" enable toggle does nothing.** The code looks for
   `#panelsCard` but the element is `#panelCard`, so the panel section always
   counts as enabled. The panels cannot be switched off, and the
   "inverter + battery without panels → 18%" branch of the GST rule is
   unreachable.
3. **An empty quotation still totals ₹4,248.** The `-- Select … --`
   placeholder option counts as a selection, so blank inverter / panel / ACDB
   / DCDB rows are added at ₹0, and the earthing set is added automatically.
   Until a panel is picked, the **Panel Quantity box also shows a nonsense
   number** — the placeholder has no wattage, so the count comes out as the
   full system wattage (e.g. `5000` for a 5 kW system). Pick a panel and it
   corrects itself.
4. **Switching off "Use Common Margin" silently drops the margin to 0%.**
   The custom margin defaults to `0`, so nothing warns you.
5. **A manually typed panel quantity is reverted** by the next recalculation
   (changing the margin, kW, or any override toggle).
6. **`installBase` and `installEditable` mean different things** — the first
   is the total (kW × rate), the second is used as a per-kW rate — but they
   are shown side by side as if they were the same number.
7. **Every quotation is numbered `VS/<year>/001`** in the three solar tools,
   and the B2B UPS tool uses a random number, so numbers can collide.
8. **Customer-entered text is not escaped** in the generated document.
9. **The quotation document depends on the network** — Tailwind and Font
   Awesome CDNs, Google Fonts, Unsplash photos and images pulled from this
   repo's GitHub raw URLs. Offline, the document renders unstyled.
10. **The B2B UPS print stylesheet can clip a long quotation** — the page is
    fixed at 297 mm with `overflow: hidden`, so a quote with many lines can
    lose its grand total row when printed.
11. **`fmt()` does not pad decimals**, so a price of 8,917.50 is printed as
    `₹8,917.5`.

---

## 9. Repository map

```
index.html              landing page — pick a quotation type
on-grid/                on-grid tool       (index.html, script.js, style.css)
off-grid/               off-grid tool      (index.html, script.js)
hybrid/                 hybrid tool        (index.html, script.js)
ups-b2b/                B2B UPS tool       (index.html, script.js, style.css)
assets/icons/           icon set
Uplodes/                images used in the generated documents

data/catalog.json       ← master product & price list (edit this)
tools/apply-prices.mjs  catalog.json → the four tool files
tools/extract-catalog.mjs  the four tool files → catalog.json
tools/validate-catalog.mjs catalog sanity checks
tools/smoke.mjs         golden quotation tests
tools/golden.json       recorded expected totals
tools/lib/              shared helpers
```

---

---

**V-Sustain Solar Solutions** — Bengaluru, Karnataka
vsustainsolarsolutions@gmail.com · +91 99-000-00476
