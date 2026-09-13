"use client";

import type { Order } from "@/types/api";

interface OrderListProps {
  orders: Order[];
  selectedId: string | null;
  onSelect: (orderId: string) => void;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function OrderList({ orders, selectedId, onSelect }: OrderListProps) {
  return (
    <div className="order-list space-y-4">
      {orders.map((order) => {
        const primaryItem = order.items[0];
        const isSelected = selectedId === order.id;

        return (
          <button
            key={order.id}
            type="button"
            onClick={() => onSelect(order.id)}
            className={`order-card w-full text-left transition-all duration-500 ${
              isSelected ? "order-card-active" : ""
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="order-card-thumb">
                {primaryItem?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={primaryItem.image} alt={primaryItem.name} className="h-full w-full object-cover" />
                ) : (
                  <span className="text-xs text-warm-gray">LCH</span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-ivory">{primaryItem?.name || "Layer Craft Order"}</p>
                    <p className="mt-1 text-xs text-warm-gray">
                      {order.items.length > 1
                        ? `${order.items.length} items`
                        : `Qty ${primaryItem?.quantity || 1}`}
                    </p>
                  </div>
                  <p className="font-serif text-lg text-ivory">${order.total.toFixed(2)}</p>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <span className="order-status-pill">{order.tracking.currentLabel}</span>
                  <span className="text-[0.65rem] uppercase tracking-[0.18em] text-warm-gray">
                    {formatDate(order.createdAt)}
                  </span>
                </div>

                <p className="mt-3 text-xs text-warm-gray">
                  Tracking: <span className="text-gold">{order.tracking.trackingNumber}</span>
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
