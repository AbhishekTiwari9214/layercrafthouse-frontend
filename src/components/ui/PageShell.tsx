import Link from "next/link";
import type { ReactNode } from "react";

interface PageShellProps {
  children: ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
  showBrand?: boolean;
}

const widthClass = {
  sm: "max-w-lg",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
};

export default function PageShell({
  children,
  maxWidth = "md",
  showBrand = true,
}: PageShellProps) {
  return (
    <div className="app-page">
      <div className="app-page-glow pointer-events-none" aria-hidden="true" />
      <div className="app-page-grid pointer-events-none" aria-hidden="true" />

      <div
        className={`section-padding relative z-10 mx-auto flex min-h-screen flex-col py-12 md:py-20 ${widthClass[maxWidth]}`}
      >
        {showBrand && (
          <header className="mb-10 flex items-center justify-between border-b border-ivory/5 pb-6 md:mb-14">
            <Link
              href="/"
              className="label-caps text-ivory/90 transition-colors duration-500 hover:text-gold"
            >
              Layer Craft House
            </Link>
            <span className="label-caps hidden text-[0.55rem] text-warm-gray sm:inline">
              Quiet Luxury
            </span>
          </header>
        )}

        {children}
      </div>
    </div>
  );
}
