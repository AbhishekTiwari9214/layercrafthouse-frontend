"use client";

interface QuantitySelectorProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (quantity: number) => void;
  disabled?: boolean;
}

export default function QuantitySelector({
  value,
  min = 1,
  max,
  onChange,
  disabled = false,
}: QuantitySelectorProps) {
  const atMin = value <= min;
  const atMax = max !== undefined && value >= max;

  function decrement() {
    if (disabled || atMin) return;
    onChange(value - 1);
  }

  function increment() {
    if (disabled || atMax) return;
    onChange(value + 1);
  }

  return (
    <div className="quantity-selector" aria-label="Quantity selector">
      <button
        type="button"
        onClick={decrement}
        disabled={disabled || atMin}
        aria-label="Decrease quantity"
        className="quantity-selector-btn"
      >
        −
      </button>

      <span className="quantity-selector-value" aria-live="polite">
        {value}
      </span>

      <button
        type="button"
        onClick={increment}
        disabled={disabled || atMax}
        aria-label="Increase quantity"
        className="quantity-selector-btn"
      >
        +
      </button>
    </div>
  );
}
