import Image from "next/image";

const callouts = [
  {
    num: "01",
    label: "Reinforced Handles",
    position: "top-[18%] left-[8%] md:left-[12%]",
    lineDirection: "right" as const,
    anchor: { x: 14, y: 20 },
  },
  {
    num: "02",
    label: "Precision Hardware",
    position: "top-[35%] right-[5%] md:right-[10%]",
    lineDirection: "left" as const,
    anchor: { x: 86, y: 34 },
  },
  {
    num: "03",
    label: "Structured Base",
    position: "bottom-[28%] left-[6%] md:left-[14%]",
    lineDirection: "right" as const,
    anchor: { x: 16, y: 72 },
  },
  {
    num: "04",
    label: "Spacious Interior",
    position: "bottom-[20%] right-[8%] md:right-[12%]",
    lineDirection: "left" as const,
    anchor: { x: 84, y: 78 },
  },
] as const;

const CENTER = { x: 50, y: 50 };

function elbowPath(ax: number, ay: number, cx: number, cy: number) {
  return `M ${ax} ${ay} H ${cx} V ${cy}`;
}

export default function ProductDetails() {
  return (
    <section id="details" className="relative overflow-hidden py-32 md:py-48">
      <div className="section-padding mb-16 text-center md:mb-24">
        <p className="detail-kicker label-caps text-gold">Product Details</p>
        <h2 className="detail-heading editorial-headline mt-6 text-[clamp(2rem,4vw,3.5rem)] text-ivory">
          Every Detail, Considered
        </h2>
      </div>

      <div className="details-stage relative mx-auto h-[520px] max-w-5xl sm:h-[560px] md:h-[640px]">
        <svg
          className="detail-connectors pointer-events-none absolute inset-0 z-[1] h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <rect
            className="detail-connector-frame"
            x="14"
            y="10"
            width="72"
            height="80"
            rx="0.2"
            fill="none"
          />

          <line className="detail-connector-guide" x1="50" y1="10" x2="50" y2="90" />
          <line className="detail-connector-guide" x1="14" y1="50" x2="86" y2="50" />

          <path
            className="detail-connector-ring"
            d="M 14 20 L 86 34 L 84 78 L 16 72 Z"
            fill="none"
          />

          {callouts.map((callout) => (
            <g key={`link-${callout.num}`}>
              <path
                className="detail-connector-path"
                d={elbowPath(callout.anchor.x, callout.anchor.y, CENTER.x, CENTER.y)}
                fill="none"
              />
              <circle className="detail-connector-dot" cx={callout.anchor.x} cy={callout.anchor.y} r="0.55" />
            </g>
          ))}

          <circle className="detail-connector-center-ring" cx={CENTER.x} cy={CENTER.y} r="3.2" fill="none" />
        </svg>

        <div
          className="detail-connector-logo relative pointer-events-none absolute left-1/2 top-1/2 z-[3] h-11 w-11 -translate-x-1/2 -translate-y-1/2 sm:h-14 sm:w-14 md:h-16 md:w-16"
          aria-hidden="true"
        >
          <Image
            src="/models/logo.png"
            alt=""
            fill
            sizes="64px"
            className="object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
          />
        </div>

        <div className="detail-glow pointer-events-none absolute inset-0 z-[2] flex items-center justify-center">
          <div className="detail-glow-core h-48 w-48 rounded-full bg-gold/5 blur-3xl sm:h-64 sm:w-64 md:h-96 md:w-96" />
          <div className="detail-glow-ring absolute h-56 w-56 rounded-full border border-gold/10 sm:h-72 sm:w-72 md:h-[28rem] md:w-[28rem]" />
        </div>

        {callouts.map((callout) => (
          <div
            key={callout.num}
            className={`detail-callout absolute z-10 max-w-[140px] sm:max-w-none ${callout.position}`}
          >
            <div
              className={`flex items-center gap-3 ${
                callout.lineDirection === "left" ? "flex-row-reverse text-right" : ""
              }`}
            >
              <span className="detail-num label-caps text-gold">{callout.num}</span>
              <div className="flex flex-col gap-1">
                <span className="detail-label text-sm text-ivory md:text-base">{callout.label}</span>
                <span
                  className={`detail-line h-px bg-gold/45 ${
                    callout.lineDirection === "left"
                      ? "origin-right ml-auto w-16 md:w-24"
                      : "origin-left w-16 md:w-24"
                  }`}
                />
              </div>
            </div>
          </div>
        ))}

        <p className="detail-hint absolute bottom-0 left-1/2 z-10 -translate-x-1/2 text-center text-sm text-warm-gray">
          Scroll to explore each detail
        </p>
      </div>
    </section>
  );
}
