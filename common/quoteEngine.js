/* =====================================
   SHARED QUOTE ENGINE
===================================== */

export const n = v => isNaN(parseFloat(v)) ? 0 : parseFloat(v);
export const round2 = v => Math.round((v + Number.EPSILON) * 100) / 100;

/* 🔒 GST logic kept SAME as on-grid for now */
export function getGstPercent() {
  return 18;
}

/* MAIN TOTAL CALCULATOR */
export function calculateTotals(items) {
  let subtotal = 0;
  let totalGst = 0;

  items.forEach(it => {
    const amount = round2(it.baseRate * it.qty);
    const gstAmt = round2(amount * getGstPercent() / 100);
    subtotal += amount;
    totalGst += gstAmt;
  });

  return {
    items,
    subtotal: round2(subtotal),
    totalGst: round2(totalGst),
    grandTotal: round2(subtotal + totalGst)
  };
}
