"use client";

import { forwardRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface PurchaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  redirectTo?: string;
  authPath?: "login" | "signup";
}

const PurchaseButton = forwardRef<HTMLButtonElement, PurchaseButtonProps>(
  function PurchaseButton(
    {
      children,
      className = "",
      redirectTo = "/checkout",
      authPath = "signup",
      disabled,
      onClick,
      ...props
    },
    ref,
  ) {
    const router = useRouter();
    const { user, loading } = useAuth();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      if (event.defaultPrevented || loading) return;

      if (user) {
        router.push(redirectTo);
        return;
      }

      router.push(`/${authPath}?redirect=${encodeURIComponent(redirectTo)}`);
    };

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        disabled={loading || disabled}
        className={className}
        {...props}
      >
        {children}
      </button>
    );
  },
);

export default PurchaseButton;
