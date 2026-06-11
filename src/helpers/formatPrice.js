/**
 * Formats an ABSOLUTE rupee amount into a readable Indian-format string.
 *
 * Prices are stored in absolute rupees (e.g. 37500000), so a value must never be
 * concatenated directly with a "Cr"/"L" suffix. This converts to the correct
 * Crore (Cr) / Lakh (L) / rupee display.
 *
 *   formatPrice(37500000) => "₹3.75 Cr"
 *   formatPrice(5000000)  => "₹50 L"
 *   formatPrice(45000)    => "₹45,000"
 *   formatPrice(null)     => "N/A"
 */
const trim = (n) => parseFloat(n.toFixed(2)).toString();

export const formatPrice = (amount) => {
  if (amount === null || amount === undefined || amount === "") return "N/A";
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  if (!isFinite(value) || isNaN(value)) return "N/A";

  const abs = Math.abs(value);
  if (abs >= 1e7) return `₹${trim(value / 1e7)} Cr`;
  if (abs >= 1e5) return `₹${trim(value / 1e5)} L`;
  return `₹${value.toLocaleString("en-IN")}`;
};

export default formatPrice;
