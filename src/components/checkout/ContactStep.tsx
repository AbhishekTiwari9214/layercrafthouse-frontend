"use client";

import FormField from "@/components/ui/FormField";
import type { CheckoutContact } from "@/types/api";

interface ContactStepProps {
  value: CheckoutContact;
  onChange: (value: CheckoutContact) => void;
  onNext: () => void | Promise<void>;
  submitting?: boolean;
}

export default function ContactStep({ value, onChange, onNext, submitting }: ContactStepProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onNext();
      }}
      className="space-y-6"
    >
      <div>
        <h2 className="step-heading">Contact Details</h2>
        <p className="step-copy">We&apos;ll use this for order updates and delivery notifications.</p>
      </div>

      <FormField
        label="Email"
        id="contact-email"
        type="email"
        required
        value={value.email}
        onValueChange={(email) => onChange({ ...value, email })}
        autoComplete="email"
        placeholder="you@example.com"
      />

      <FormField
        label="Phone"
        id="contact-phone"
        type="tel"
        required
        value={value.phone}
        onValueChange={(phone) => onChange({ ...value, phone })}
        autoComplete="tel"
        placeholder="+1 (555) 000-0000"
      />

      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? "Saving..." : "Continue to Address"}
      </button>
    </form>
  );
}
