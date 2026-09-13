"use client";

import Image from "next/image";
import { useScrollProgress } from "@/context/ScrollContext";
import { LOGO_BOX_CLASS, LOGO_IMAGE_SIZES } from "@/constants/logoDisplay";

interface BrandLogoProps {
  className?: string;
  settled?: boolean;
}

/** Matches animated logo at full hold — static, same craft/softness */
function SettledBrandLogo({ className = "" }: { className?: string }) {
  return (
    <div className={`relative flex h-full w-full items-center justify-center ${className}`}>
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,155,103,0.14)_0%,transparent_68%)]"
        aria-hidden="true"
      />

      <div className="logo-settled-image-wrap relative h-full w-full">
        <Image
          src="/models/logo.png"
          alt="Layer Craft House"
          fill
          sizes={LOGO_IMAGE_SIZES}
          className="object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.45)]"
          priority
        />
      </div>
    </div>
  );
}

function AnimatedBrandLogo({ className = "" }: { className?: string }) {
  const { lifestyleProgress, stampHoldActive } = useScrollProgress();
  const stampAnim = stampHoldActive ? 1 : lifestyleProgress;
  const entry = Math.min(stampAnim / 0.45, 1);
  const rotateY = (1 - entry) * -42;
  const opacity = 0.35 + entry * 0.65;

  return (
    <div className={`relative flex h-full w-full items-center justify-center ${className}`}>
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,155,103,0.14)_0%,transparent_68%)]"
        aria-hidden="true"
      />

      <div
        className={`relative will-change-transform ${LOGO_BOX_CLASS}`}
        style={{
          transform: `perspective(900px) rotateY(${rotateY}deg)`,
          opacity,
        }}
      >
        <Image
          src="/models/logo.png"
          alt="Layer Craft House"
          fill
          sizes={LOGO_IMAGE_SIZES}
          className="object-contain drop-shadow-[0_24px_48px_rgba(0,0,0,0.45)]"
          priority
        />
      </div>
    </div>
  );
}

export default function BrandLogo({ className = "", settled = false }: BrandLogoProps) {
  if (settled) {
    return <SettledBrandLogo className={className} />;
  }

  return <AnimatedBrandLogo className={className} />;
}
