"use client";

import Link from "next/link";
import QuantitySelector from "@/components/ui/QuantitySelector";
import { calculateOrderTotals } from "@/lib/orderTotals";
import type { Cart, CheckoutContact, Address, Transaction } from "@/types/api";

interface PaymentStepProps {
  cart: Cart;
  contact: CheckoutContact;
  address: Address;
  onBack: () => void;
  onSubmit: () => Promise<void>;
  onQuantityChange: (productId: string, quantity: number) => void;
  updatingCart?: boolean;
  submitting: boolean;
  error: string;
  success: Transaction | null;
}

export default function PaymentStep({
  cart,
  contact,
  address,
  onBack,
  onSubmit,
  onQuantityChange,
  updatingCart = false,
  submitting,
  error,
  success,
}: PaymentStepProps) {
  const { tax, delivery, total } = calculateOrderTotals(cart.subtotal);

  if (success) {
    return (
      <div className="checkout-success space-y-8 text-center">
        <div className="checkout-success-icon" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M7 14L12 19L21 9"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div>
          <h2 className="step-heading">Order Confirmed</h2>
          <p className="step-copy mx-auto max-w-sm">
            Thank you. Your Layer Craft House order is confirmed and on its way.
          </p>
        </div>

        <div className="checkout-summary-card mx-auto max-w-md text-left">
          <p className="label-caps mb-2 text-gold">Transaction</p>
          <p className="font-serif text-xl text-ivory">{success.transactionId}</p>
          <p className="mt-3 text-sm text-warm-gray">
            Total paid: <span className="text-ivory">${success.total.toFixed(2)}</span>
          </p>
          <p className="mt-2 text-sm text-warm-gray">
            Delivery: <span className="text-gold">Free</span>
          </p>
        </div>

        <Link href="/orders" className="btn-primary inline-flex min-w-[220px]">
          View My Orders
        </Link>
        <Link href="/" className="btn-secondary mt-4 inline-flex min-w-[220px]">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="step-heading">Payment</h2>
        <p className="step-copy">Review your order and complete checkout.</p>
      </div>

      <div className="checkout-summary-card space-y-4">
        {cart.items.map((item) => (
          <div key={item.product._id} className="flex items-center justify-between gap-4 text-sm">
            <div className="min-w-0 flex-1">
              <p className="text-ivory">{item.product.name}</p>
              <p className="mt-1 text-warm-gray">${item.priceAtAdd.toFixed(2)} each</p>
            </div>

            <QuantitySelector
              value={item.quantity}
              min={1}
              max={item.product.stock}
              disabled={updatingCart || submitting}
              onChange={(quantity) => onQuantityChange(item.product._id, quantity)}
            />

            <p className="min-w-[72px] text-right font-medium text-ivory">
              ${(item.priceAtAdd * item.quantity).toFixed(2)}
            </p>
          </div>
        ))}

        <div className="checkout-divider" />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-warm-gray">
            <span>Subtotal</span>
            <span>${cart.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-warm-gray">
            <span>Delivery</span>
            <span className="text-gold">{delivery === 0 ? "Free" : `$${delivery.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between text-warm-gray">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between pt-2 text-base text-ivory">
            <span className="font-medium">Total</span>
            <span className="font-serif text-xl">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="checkout-delivery-badge">
        <p className="label-caps text-gold">Complimentary Delivery</p>
        <p className="mt-2 text-sm leading-relaxed text-warm-gray">
          Every Layer Craft House order ships free, directly to your door.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="checkout-info-card">
          <p className="label-caps mb-3 text-gold">Contact</p>
          <p className="text-sm text-ivory">{contact.email}</p>
          <p className="mt-1 text-sm text-warm-gray">{contact.phone}</p>
        </div>
        <div className="checkout-info-card">
          <p className="label-caps mb-3 text-gold">Address</p>
          <p className="text-sm text-ivory">{address.line1}</p>
          {address.line2 && <p className="text-sm text-ivory">{address.line2}</p>}
          <p className="mt-1 text-sm text-warm-gray">
            {address.city}, {address.state} {address.postalCode}
          </p>
          <p className="text-sm text-warm-gray">{address.country}</p>
        </div>
      </div>

      <div className="checkout-notice">
        <p className="label-caps mb-2 text-gold/80">Secure Payment</p>
        <p className="text-sm leading-relaxed text-warm-gray">
          You will complete payment with Razorpay. Cards, UPI, and netbanking are supported in test mode.
        </p>
      </div>

      {error && <p className="form-error">{error}</p>}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={onBack} disabled={submitting} className="btn-secondary flex-1">
          Back
        </button>
        <button type="button" onClick={onSubmit} disabled={submitting} className="btn-primary flex-1">
          {submitting ? "Opening Razorpay..." : "Pay with Razorpay"}
        </button>
      </div>
    </div>
  );
}
