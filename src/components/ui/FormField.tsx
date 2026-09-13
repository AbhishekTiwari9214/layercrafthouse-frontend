import type { InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  onValueChange?: (value: string) => void;
}

export default function FormField({
  label,
  id,
  onValueChange,
  className = "",
  onChange,
  ...props
}: FormFieldProps) {
  return (
    <label className="form-field" htmlFor={id}>
      <span className="form-label">{label}</span>
      <input
        id={id}
        className={`form-input ${className}`}
        onChange={(event) => {
          onChange?.(event);
          onValueChange?.(event.target.value);
        }}
        {...props}
      />
    </label>
  );
}
