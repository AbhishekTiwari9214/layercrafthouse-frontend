"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import OrderList from "@/components/orders/OrderList";
import OrderTracker from "@/components/orders/OrderTracker";
import LoadingScreen from "@/components/ui/LoadingScreen";
import PageShell from "@/components/ui/PageShell";
import { useAuth } from "@/context/AuthContext";
import { api, ApiError } from "@/lib/api";
import type { Order } from "@/types/api";

function OrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/login?redirect=/orders");
      return;
    }

    async function loadOrders() {
      try {
        const result = await api.getOrders();
        const nextOrders = result.data.orders;
        setOrders(nextOrders);

        const requestedId = searchParams.get("order");
        if (requestedId && nextOrders.some((order) => order.id === requestedId)) {
          setSelectedId(requestedId);
        } else if (nextOrders.length > 0) {
          setSelectedId(nextOrders[0].id);
        }
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Unable to load orders");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [authLoading, user, router, searchParams]);

  const selectedOrder = orders.find((order) => order.id === selectedId) || null;

  function handleSelect(orderId: string) {
    setSelectedId(orderId);
    router.replace(`/orders?order=${orderId}`, { scroll: false });
  }

  if (authLoading || loading) {
    return <LoadingScreen message="Loading your orders..." />;
  }

  if (!user) {
    return null;
  }

  return (
    <PageShell maxWidth="xl">
      <Link
        href="/"
        className="label-caps mb-8 inline-flex items-center gap-2 text-warm-gray transition-colors duration-500 hover:text-gold"
      >
        <span aria-hidden="true">←</span>
        Back to home
      </Link>

      <div className="mb-10">
        <p className="label-caps mb-4 text-gold/80">My Orders</p>
        <h1 className="editorial-headline text-4xl md:text-5xl">Track Your Pieces</h1>
        <p className="mt-4 text-sm text-warm-gray">
          View your Layer Craft House orders and follow delivery progress in real time.
        </p>
      </div>

      {error && <p className="form-error mb-6">{error}</p>}

      {orders.length === 0 ? (
        <div className="app-card py-12 text-center">
          <p className="step-heading text-2xl">No orders yet</p>
          <p className="step-copy mx-auto mt-3 max-w-md">
            When you complete checkout, your orders and tracking details will appear here.
          </p>
          <Link href="/checkout" className="btn-primary mt-8 inline-flex">
            Buy Now
          </Link>
        </div>
      ) : (
        <div className="orders-layout">
          <div className="app-card">
            <p className="label-caps mb-6 text-warm-gray">Your Orders</p>
            <OrderList orders={orders} selectedId={selectedId} onSelect={handleSelect} />
          </div>

          <div className="app-card">
            {selectedOrder ? (
              <OrderTracker order={selectedOrder} />
            ) : (
              <p className="text-sm text-warm-gray">Select an order to view tracking.</p>
            )}
          </div>
        </div>
      )}
    </PageShell>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<LoadingScreen message="Loading your orders..." />}>
      <OrdersContent />
    </Suspense>
  );
}
