const formatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

/** 1499 -> "₹1,499" */
export default function formatPrice(amount) {
  return formatter.format(Number(amount) || 0);
}
