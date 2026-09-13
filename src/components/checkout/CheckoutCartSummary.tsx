"use client";

import { calculateOrderTotals } from "@/lib/orderTotals";
import type { Cart } from "@/types/api";

interface CheckoutCartSummaryProps {
  cart: Cart;
}

export default function CheckoutCartSummary({ cart }: CheckoutCartSummaryProps) {
  const { tax, total } = calculateOrderTotals(cart.subtotal);

  return (
    <div className="checkout-cart-summary mb-8">
      {cart.items.map((item) => (
        <div key={item.product._id} className="checkout-cart-item">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-charcoal">
            {item.product.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.product.image}
                alt={item.product.name}
                className="h-full w-full object-cover"
              />
            ) : null}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-ivory">{item.product.name}</p>
            <p className="mt-1 text-xs text-warm-gray">
              Qty {item.quantity} · ${item.priceAtAdd.toFixed(2)} each
            </p>
          </div>

          <p className="checkout-cart-line-total">
            ${(item.priceAtAdd * item.quantity).toFixed(2)}
          </p>
        </div>
      ))}

      <div className="checkout-divider" />

      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between text-warm-gray">
          <span>Delivery</span>
          <span className="text-gold">Free</span>
        </div>
        <div className="flex items-center justify-between text-warm-gray">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
      </div>

      <div className="checkout-divider" />

      <div className="flex items-center justify-between text-sm">
        <span className="text-warm-gray">Estimated total</span>
        <span className="font-serif text-xl text-ivory">${total.toFixed(2)}</span>
      </div>
    </div>
  );
}
