"use client";

import PurchaseButton from "@/components/PurchaseButton";

interface CheckoutPromptProps {
  copy?: string;
  className?: string;
}

export default function CheckoutPrompt({
  copy = "Ready to carry yours?",
  className = "",
}: CheckoutPromptProps) {
  return (
    <div className={`section-padding relative z-10 py-10 md:py-14 ${className}`}>
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 border-y border-ivory/8 py-10 text-center md:gap-6 md:py-12">
        {copy ? (
          <p className="label-caps text-[0.625rem] tracking-[0.22em] text-warm-gray">
            {copy}
          </p>
        ) : null}
        <PurchaseButton className="label-caps inline-flex h-12 min-w-[220px] items-center justify-center border border-gold/40 bg-gold/10 px-10 text-gold transition-all duration-500 hover:border-gold hover:bg-gold/20">
          Buy Now
        </PurchaseButton>
      </div>
    </div>
  );
}
