"use client";

import type { Order } from "@/types/api";

interface OrderTrackerProps {
  order: Order;
}

function formatDateTime(value: string | null) {
  if (!value) return null;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function OrderTracker({ order }: OrderTrackerProps) {
  const primaryItem = order.items[0];

  return (
    <div className="order-tracker space-y-8">
      <div>
        <p className="label-caps mb-3 text-gold/80">Order Tracking</p>
        <h2 className="step-heading">{primaryItem?.name || "Your Order"}</h2>
        <p className="step-copy">
          Tracking number{" "}
          <span className="text-gold">{order.tracking.trackingNumber}</span>
          {order.tracking.courierName ? (
            <>
              {" "}
              · {order.tracking.courierName}
            </>
          ) : null}
        </p>
      </div>

      <div className="checkout-info-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="label-caps mb-2 text-gold">Current Status</p>
            <p className="font-serif text-2xl text-ivory">{order.tracking.currentLabel}</p>
          </div>
          <div className="text-right">
            <p className="label-caps mb-2 text-warm-gray">Estimated Delivery</p>
            <p className="text-sm text-ivory">
              {formatDateTime(order.tracking.estimatedDelivery) || "Updating soon"}
            </p>
          </div>
        </div>
      </div>

      <ol className="tracking-timeline">
        {order.tracking.steps.map((step, index) => (
          <li
            key={step.key}
            className={`tracking-step ${step.isComplete ? "is-complete" : ""} ${
              step.isCurrent ? "is-current" : ""
            }`}
          >
            <div className="tracking-step-marker" aria-hidden="true">
              {step.isComplete ? (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 6L5 9L10 3"
                    stroke="currentColor"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <span>{index + 1}</span>
              )}
            </div>

            <div className="tracking-step-content">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-ivory">{step.label}</p>
                {step.completedAt && (
                  <p className="text-xs text-warm-gray">{formatDateTime(step.completedAt)}</p>
                )}
              </div>
              <p className="mt-1 text-sm leading-relaxed text-warm-gray">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="checkout-info-card">
          <p className="label-caps mb-3 text-gold">Shipping To</p>
          <p className="text-sm text-ivory">{order.shippingAddress?.line1}</p>
          {order.shippingAddress?.line2 && (
            <p className="text-sm text-ivory">{order.shippingAddress.line2}</p>
          )}
          <p className="mt-1 text-sm text-warm-gray">
            {order.shippingAddress?.city}, {order.shippingAddress?.state}{" "}
            {order.shippingAddress?.postalCode}
          </p>
        </div>

        <div className="checkout-info-card">
          <p className="label-caps mb-3 text-gold">Order Summary</p>
          <p className="text-sm text-warm-gray">
            Order ID: <span className="text-ivory">{order.transactionId}</span>
          </p>
          <p className="mt-2 text-sm text-warm-gray">
            Total: <span className="text-ivory">${order.total.toFixed(2)}</span>
          </p>
          <p className="mt-2 text-sm text-warm-gray">
            Items: <span className="text-ivory">{order.items.length}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
