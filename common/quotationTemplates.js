/* ============================================
   SHARED QUOTATION TEMPLATES (ALL SYSTEMS)
   SAME HTML FOR ON-GRID / OFF-GRID / HYBRID
============================================ */

/* Utility */
const n = v => isNaN(parseFloat(v)) ? 0 : parseFloat(v);
const round2 = v => Math.round((v + Number.EPSILON) * 100) / 100;
const fmt = v => "₹" + round2(v).toLocaleString("en-IN");

/* ==================================================
   🔽 PASTE YOUR FULL ON-GRID HTML FUNCTIONS BELOW
   NO EDITING INSIDE THESE FUNCTIONS
================================================== */

export function buildDetailedQuotationHtml(totals, systemType) {
  /* ⛔ PASTE YOUR FULL ON-GRID buildDetailedQuotationHtml BODY HERE ⛔ */
}

export function buildSummaryQuotationHtml(totals, systemType) {
  /* ⛔ PASTE YOUR FULL ON-GRID buildSummaryQuotationHtml BODY HERE ⛔ */
}

export function buildShortQuotationHtml(totals, systemType) {
  /* ⛔ PASTE YOUR FULL ON-GRID buildShortQuotationHtml BODY HERE ⛔ */
}
