"use client";

import dynamic from "next/dynamic";

const DuffelBagScene = dynamic(() => import("./DuffelBagScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-px w-16 animate-pulse bg-gold/30" />
    </div>
  ),
});

interface ProductViewerProps {
  className?: string;
  floating?: boolean;
  floatIntensity?: number;
  variant?: "bag";
}

export default function ProductViewer(props: ProductViewerProps) {
  return <DuffelBagScene {...props} />;
}
