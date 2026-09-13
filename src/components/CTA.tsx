"use client";

import PurchaseButton from "@/components/PurchaseButton";
import { useMagneticButton } from "@/hooks/useMagneticButton";

export default function CTA() {
  const ctaRef = useMagneticButton<HTMLButtonElement>({ strength: 0.3 });

  return (
    <section id="cta" className="relative overflow-hidden py-24 md:py-32">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,155,103,0.06)_0%,transparent_60%)]" />

      <div className="section-padding relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="cta-heading editorial-headline text-[clamp(2.5rem,5vw,4.5rem)] text-ivory">
            Carry It Forward.
          </h2>

          <p className="cta-copy mt-6 text-base text-warm-gray md:text-lg">
            Discover the Layer Craft House duffel.
          </p>

          <PurchaseButton
            ref={ctaRef}
            className="magnetic-btn label-caps mt-12 inline-flex h-14 min-w-[220px] items-center justify-center border border-gold/40 bg-gold/10 px-10 text-gold transition-all duration-500 hover:border-gold hover:bg-gold/20"
          >
            Buy Now
          </PurchaseButton>
        </div>
      </div>
    </section>
  );
}
