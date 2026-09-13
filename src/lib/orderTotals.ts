export function calculateOrderTotals(subtotal: number) {
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const delivery = 0;
  const total = Math.round((subtotal + tax + delivery) * 100) / 100;

  return { subtotal, tax, delivery, total };
}
