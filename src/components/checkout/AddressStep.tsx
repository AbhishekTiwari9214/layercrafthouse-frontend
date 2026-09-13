"use client";

import { useEffect, useRef, useState } from "react";
import FormField from "@/components/ui/FormField";
import { api, ApiError } from "@/lib/api";
import type { Address } from "@/types/api";

interface AddressStepProps {
  value: Address;
  onChange: (value: Address) => void;
  onBack: () => void;
  onNext: () => void | Promise<void>;
  submitting?: boolean;
}

type ServiceabilityState =
  | { status: "idle" }
  | { status: "checking" }
  | {
      status: "ok" | "unavailable" | "error";
      message: string;
      estimatedDays?: number | null;
      courierName?: string | null;
      city?: string;
      state?: string;
      country?: string;
    };

function normalizePincode(value: string) {
  return value.replace(/\D/g, "").slice(0, 6);
}

function hasCompleteLocation(address: Pick<Address, "city" | "state" | "country">) {
  return (
    Boolean(address.city?.trim()) &&
    Boolean(address.state?.trim()) &&
    Boolean(address.country?.trim())
  );
}

export default function AddressStep({
  value,
  onChange,
  onBack,
  onNext,
  submitting,
}: AddressStepProps) {
  const [serviceability, setServiceability] = useState<ServiceabilityState>({
    status: "idle",
  });
  const [localError, setLocalError] = useState("");
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    const pincode = normalizePincode(value.postalCode);

    if (pincode.length !== 6) {
      setServiceability({ status: "idle" });
      const current = valueRef.current;
      if (current.city || current.state || current.country) {
        onChange({
          ...current,
          city: "",
          state: "",
          country: "",
        });
      }
      return;
    }

    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      setServiceability({
        status: "error",
        message: "Enter a valid 6-digit Indian pincode",
      });
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      setServiceability({ status: "checking" });

      try {
        const result = await api.checkPincodeServiceability(pincode);
        if (cancelled) return;

        const city = (result.data.city || "").trim();
        const state = (result.data.state || "").trim();
        const country = (result.data.country || "India").trim();
        const locationComplete = hasCompleteLocation({ city, state, country });

        const current = valueRef.current;
        onChange({
          ...current,
          city,
          state,
          country,
        });

        if (!result.data.serviceable) {
          setServiceability({
            status: "unavailable",
            message: result.data.message,
            estimatedDays: result.data.estimatedDays,
            courierName: result.data.courierName,
            city,
            state,
            country,
          });
          return;
        }

        if (!locationComplete) {
          setServiceability({
            status: "error",
            message:
              "Could not resolve city, state, and country for this pincode. Try another pincode.",
            city,
            state,
            country,
          });
          return;
        }

        setServiceability({
          status: "ok",
          message: result.data.message,
          estimatedDays: result.data.estimatedDays,
          courierName: result.data.courierName,
          city,
          state,
          country,
        });
      } catch (err) {
        if (cancelled) return;

        const current = valueRef.current;
        onChange({
          ...current,
          city: "",
          state: "",
          country: "",
        });

        setServiceability({
          status: "error",
          message:
            err instanceof ApiError
              ? err.message
              : "Unable to verify this pincode right now",
        });
      }
    }, 450);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [value.postalCode, onChange]);

  const locationReady = hasCompleteLocation(value);
  const canContinue =
    serviceability.status === "ok" &&
    !submitting &&
    Boolean(value.line1.trim()) &&
    locationReady &&
    normalizePincode(value.postalCode).length === 6;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setLocalError("");

        if (!value.line1.trim()) {
          setLocalError("Enter your street address to continue");
          return;
        }

        if (normalizePincode(value.postalCode).length !== 6) {
          setLocalError("Enter a valid 6-digit pincode to continue");
          return;
        }

        if (serviceability.status === "checking") {
          setLocalError("Please wait while we check delivery for this pincode");
          return;
        }

        if (serviceability.status !== "ok") {
          setLocalError(
            serviceability.status === "unavailable" || serviceability.status === "error"
              ? serviceability.message
              : "Enter a valid pincode to continue",
          );
          return;
        }

        if (!locationReady) {
          setLocalError(
            "City, state, and country must be filled from your pincode before payment",
          );
          return;
        }

        onNext();
      }}
      className="space-y-6"
    >
      <div>
        <h2 className="step-heading">Shipping Address</h2>
        <p className="step-copy">
          Enter your address and pincode. City, state, and country are filled automatically.
        </p>
      </div>

      <FormField
        label="Address Line 1"
        id="address-line1"
        required
        value={value.line1}
        onValueChange={(line1) => onChange({ ...value, line1 })}
        autoComplete="address-line1"
        placeholder="Street address"
      />

      <FormField
        label="Address Line 2"
        id="address-line2"
        value={value.line2}
        onValueChange={(line2) => onChange({ ...value, line2 })}
        autoComplete="address-line2"
        placeholder="Apartment, suite, etc. (optional)"
        required={false}
      />

      <div>
        <FormField
          label="Pincode"
          id="address-postal"
          required
          inputMode="numeric"
          maxLength={6}
          value={value.postalCode}
          onValueChange={(postalCode) =>
            onChange({ ...value, postalCode: normalizePincode(postalCode) })
          }
          autoComplete="postal-code"
          placeholder="6-digit pincode"
        />

        {serviceability.status === "checking" && (
          <p className="mt-2 text-xs text-warm-gray">
            Checking delivery and filling city details…
          </p>
        )}
        {serviceability.status === "ok" && (
          <p className="mt-2 text-xs text-gold">
            {serviceability.message}
            {serviceability.courierName ? ` · ${serviceability.courierName}` : ""}
            {serviceability.city
              ? ` · ${serviceability.city}${serviceability.state ? `, ${serviceability.state}` : ""}`
              : ""}
          </p>
        )}
        {(serviceability.status === "unavailable" ||
          serviceability.status === "error") && (
          <p className="mt-2 text-xs text-red-300/90">{serviceability.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <FormField
          label="City"
          id="address-city"
          required
          value={value.city}
          readOnly
          tabIndex={-1}
          autoComplete="off"
          placeholder="Filled from pincode"
          className="cursor-not-allowed opacity-80"
        />
        <FormField
          label="State"
          id="address-state"
          required
          value={value.state}
          readOnly
          tabIndex={-1}
          autoComplete="off"
          placeholder="Filled from pincode"
          className="cursor-not-allowed opacity-80"
        />
      </div>

      <FormField
        label="Country"
        id="address-country"
        required
        value={value.country}
        readOnly
        tabIndex={-1}
        autoComplete="off"
        placeholder="Filled from pincode"
        className="cursor-not-allowed opacity-80"
      />

      {localError && <p className="form-error">{localError}</p>}

      <div className="flex flex-col gap-3 pt-2 sm:flex-row">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="btn-secondary flex-1"
        >
          Back
        </button>
        <button type="submit" disabled={!canContinue} className="btn-primary flex-1">
          {submitting ? "Saving..." : "Continue to Payment"}
        </button>
      </div>
    </form>
  );
}
