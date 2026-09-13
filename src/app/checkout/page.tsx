"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddressStep from "@/components/checkout/AddressStep";
import CheckoutCartSummary from "@/components/checkout/CheckoutCartSummary";
import CheckoutStepper from "@/components/checkout/CheckoutStepper";
import ContactStep from "@/components/checkout/ContactStep";
import PaymentStep from "@/components/checkout/PaymentStep";
import LoadingScreen from "@/components/ui/LoadingScreen";
import PageShell from "@/components/ui/PageShell";
import { useAuth } from "@/context/AuthContext";
import { api, ApiError } from "@/lib/api";
import type { Address, Cart, CheckoutContact, Transaction } from "@/types/api";

const DEFAULT_PRODUCT_SLUG = "layer-craft-duffel";

const emptyAddress = (): Address => ({
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
});

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading, updateProfile } = useAuth();

  const [step, setStep] = useState(1);
  const [cart, setCart] = useState<Cart | null>(null);
  const [bootstrapping, setBootstrapping] = useState(true);
  const [contact, setContact] = useState<CheckoutContact>({ email: "", phone: "" });
  const [address, setAddress] = useState<Address>(emptyAddress());
  const [submitting, setSubmitting] = useState(false);
  const [updatingCart, setUpdatingCart] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<Transaction | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.replace("/login?redirect=/checkout");
      return;
    }

    setContact({
      email: user.email || "",
      phone: user.phone || "",
    });

    if (user.address?.line1) {
      setAddress({
        line1: user.address.line1 || "",
        line2: user.address.line2 || "",
        city: user.address.city || "",
        state: user.address.state || "",
        postalCode: user.address.postalCode || "",
        country: user.address.country || "",
      });
    }

    async function bootstrapCart() {
      try {
        const cartResponse = await api.getCart();
        let currentCart = cartResponse.data.cart;

        if (currentCart.items.length === 0) {
          const productsResponse = await api.getProducts();
          const product = productsResponse.data.products.find(
            (item) => item.slug === DEFAULT_PRODUCT_SLUG,
          );

          if (product) {
            const added = await api.addToCart(product._id, 1);
            currentCart = added.data.cart;
          }
        }

        setCart(currentCart);
      } catch (err) {
        setError(err instanceof ApiError ? err.message : "Unable to load cart");
      } finally {
        setBootstrapping(false);
      }
    }

    bootstrapCart();
  }, [authLoading, user, router]);

  async function handleContactNext() {
    setError("");
    setSubmitting(true);

    try {
      await updateProfile({
        email: contact.email,
        phone: contact.phone,
      });
      setStep(2);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to save contact details");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAddressNext() {
    setError("");

    if (
      !address.line1.trim() ||
      !address.city.trim() ||
      !address.state.trim() ||
      !address.country.trim() ||
      address.postalCode.replace(/\D/g, "").length !== 6
    ) {
      setError("Complete your address and a valid pincode before payment");
      return;
    }

    setSubmitting(true);

    try {
      await updateProfile({ address });
      setStep(3);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to save address");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleQuantityChange(productId: string, quantity: number) {
    if (quantity < 1) return;

    setError("");
    setUpdatingCart(true);

    try {
      const result = await api.updateCartItem(productId, quantity);
      setCart(result.data.cart);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Unable to update quantity");
    } finally {
      setUpdatingCart(false);
    }
  }

  async function handleCheckout() {
    if (!cart) return;

    if (
      !address.line1.trim() ||
      !address.city.trim() ||
      !address.state.trim() ||
      !address.country.trim() ||
      address.postalCode.replace(/\D/g, "").length !== 6
    ) {
      setError("Complete your shipping address before payment");
      setStep(2);
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const result = await api.checkout({
        contactEmail: contact.email,
        contactPhone: contact.phone,
        shippingAddress: address,
        paymentMethod: "razorpay",
      });

      const { transaction, razorpay } = result.data;
      const { openRazorpayCheckout } = await import("@/lib/razorpay");

      const payment = await openRazorpayCheckout({
        key: razorpay.keyId,
        amount: razorpay.amount,
        currency: razorpay.currency,
        name: razorpay.name,
        description: razorpay.description,
        order_id: razorpay.orderId,
        prefill: razorpay.prefill,
      });

      const verified = await api.verifyPayment({
        transactionId: transaction.transactionId,
        razorpayOrderId: payment.razorpay_order_id,
        razorpayPaymentId: payment.razorpay_payment_id,
        razorpaySignature: payment.razorpay_signature,
      });

      setSuccess(verified.data.transaction);
      setCart({ ...cart, items: [], subtotal: 0, itemCount: 0 });
    } catch (err) {
      if (err instanceof Error && err.message === "Payment cancelled") {
        setError("Payment was cancelled. You can try again when ready.");
      } else {
        setError(err instanceof ApiError ? err.message : err instanceof Error ? err.message : "Checkout failed");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || bootstrapping) {
    return <LoadingScreen message="Preparing checkout..." />;
  }

  if (!user) {
    return null;
  }

  return (
    <PageShell maxWidth="md">
      <Link
        href="/"
        className="label-caps mb-8 inline-flex items-center gap-2 text-warm-gray transition-colors duration-500 hover:text-gold"
      >
        <span aria-hidden="true">←</span>
        Back to home
      </Link>

      <div className="mb-10">
        <p className="label-caps mb-4 text-gold/80">Checkout</p>
        <h1 className="editorial-headline text-4xl md:text-5xl">Complete Your Order</h1>
        <p className="mt-4 text-sm text-warm-gray">
          Signed in as <span className="text-ivory">{user.name}</span>
        </p>
      </div>

      <CheckoutStepper currentStep={step} completed={Boolean(success)} />

      {cart && cart.items.length > 0 && !success && step < 3 && (
        <CheckoutCartSummary cart={cart} />
      )}

      {error && !success && <p className="form-error mb-6">{error}</p>}

      <div className="app-card">
        {step === 1 && (
          <ContactStep
            value={contact}
            onChange={setContact}
            onNext={handleContactNext}
            submitting={submitting}
          />
        )}

        {step === 2 && (
          <AddressStep
            value={address}
            onChange={setAddress}
            onBack={() => setStep(1)}
            onNext={handleAddressNext}
            submitting={submitting}
          />
        )}

        {step === 3 && cart && (
          <PaymentStep
            cart={cart}
            contact={contact}
            address={address}
            onBack={() => setStep(2)}
            onSubmit={handleCheckout}
            onQuantityChange={handleQuantityChange}
            updatingCart={updatingCart}
            submitting={submitting}
            error={error}
            success={success}
          />
        )}

        {step === 3 && !cart && !success && (
          <div className="py-6 text-center">
            <p className="text-sm text-warm-gray">Your cart is empty.</p>
            <Link href="/" className="btn-primary mt-6 inline-flex">
              Return Home
            </Link>
          </div>
        )}
      </div>
    </PageShell>
  );
}
