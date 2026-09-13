"use client";

import Link from "next/link";
import PurchaseButton from "@/components/PurchaseButton";
import { useMagneticButton } from "@/hooks/useMagneticButton";

export default function Hero() {
  const ctaRef = useMagneticButton<HTMLAnchorElement>({ strength: 0.25 });

  return (
    <section className="relative flex min-h-screen flex-col justify-end overflow-hidden pb-16 pt-[50vh] sm:pt-[48vh] md:pt-32 md:pb-24 lg:pt-32">
      <div className="hero-bg parallax-bg pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_70%_50%,rgba(184,155,103,0.06)_0%,transparent_60%)]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ivory/10 to-transparent" />
      </div>

      <div className="section-padding relative z-10 grid grid-cols-1 items-end gap-8 lg:grid-cols-2 lg:gap-16">
        <div className="mx-auto max-w-xl text-center md:mx-0 md:text-left">
          <h1 className="hero-headline editorial-headline text-[clamp(2.75rem,7vw,5.5rem)] text-ivory">
            Crafted to Carry
            <br />
            <span className="text-ivory/90">What Matters.</span>
          </h1>

          <p className="hero-sub mx-auto mt-8 max-w-md text-base leading-relaxed text-warm-gray md:mx-0 md:text-lg">
            A modern duffel, shaped by craftsmanship and designed for the journey.
          </p>

          <div className="hero-cta mt-10 flex flex-col items-center gap-4 md:items-start">
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
              <PurchaseButton className="label-caps inline-flex h-12 min-w-[200px] items-center justify-center border border-gold/40 bg-gold/10 px-8 text-gold transition-all duration-500 hover:border-gold hover:bg-gold/20">
                Buy Now
              </PurchaseButton>
              <Link
                ref={ctaRef}
                href="#the-bag"
                className="magnetic-btn label-caps inline-flex h-12 min-w-[200px] items-center justify-center border border-ivory/20 bg-ivory/5 px-8 text-ivory transition-all duration-500 hover:border-gold/50 hover:bg-gold/10 hover:text-gold"
              >
                Discover the Bag
              </Link>
            </div>
            <Link
              href="#craftsmanship"
              className="label-caps text-[0.625rem] text-warm-gray transition-colors duration-500 hover:text-gold"
            >
              Explore the craftsmanship ↓
            </Link>
          </div>
        </div>

        <div className="hidden lg:block" aria-hidden="true" />
      </div>
    </section>
  );
}
