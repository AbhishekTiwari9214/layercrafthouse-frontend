"use client";

interface BrandStampProps {
  className?: string;
  progress?: number;
}

export default function BrandStamp({ className = "", progress = 0 }: BrandStampProps) {
  const rotation = -12 + progress * 8;
  const stampScale = 0.85 + progress * 0.35;

  return (
    <div
      className={`flex h-full w-full items-center justify-center ${className}`}
      style={{ transform: `rotate(${rotation}deg) scale(${stampScale})` }}
    >
      <div className="relative flex h-[min(280px,55vw)] w-[min(280px,55vw)] items-center justify-center md:h-[min(360px,40vw)] md:w-[min(360px,40vw)]">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border border-gold/30" />
        <div className="absolute inset-[6px] rounded-full border border-gold/20" />

        {/* Stamp body */}
        <div className="absolute inset-[14px] flex flex-col items-center justify-center rounded-full border-2 border-gold/50 bg-matte-black/40 backdrop-blur-sm">
          <svg
            viewBox="0 0 200 200"
            className="absolute inset-0 h-full w-full text-gold/70"
            aria-hidden="true"
          >
            <defs>
              <path
                id="stampCircleTop"
                d="M 100,100 m -72,0 a 72,72 0 1,1 144,0 a 72,72 0 1,1 -144,0"
              />
            </defs>
            <text fill="currentColor" fontSize="11" letterSpacing="3">
              <textPath href="#stampCircleTop" startOffset="50%" textAnchor="middle">
                LAYER CRAFT HOUSE
              </textPath>
            </text>
          </svg>

          <div className="relative z-10 flex flex-col items-center gap-3 px-8 text-center">
            <span className="label-caps text-[0.55rem] text-gold/80 md:text-[0.625rem]">
              Est. MMXXVI
            </span>
            <span className="font-serif text-xl italic text-ivory/90 md:text-2xl">
              Crafted with
              <br />
              Intention
            </span>
            <div className="mt-1 h-px w-12 bg-gold/40" />
            <span className="label-caps text-[0.5rem] text-warm-gray md:text-[0.5625rem]">
              Premium Duffel
            </span>
          </div>
        </div>

        {/* Worn stamp texture overlay */}
        <div className="pointer-events-none absolute inset-[14px] rounded-full opacity-[0.07] mix-blend-overlay [background-image:radial-gradient(circle_at_30%_20%,#fff_0%,transparent_50%),radial-gradient(circle_at_70%_80%,#fff_0%,transparent_40%)]" />
      </div>
    </div>
  );
}
