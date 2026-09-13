import Image from "next/image";

const craftImages = [
  {
    src: "/gallery/craft-1.jpg",
    caption: "HAND-FINISHED DETAILS",
    alt: "Handcrafted brown leather duffel bag with refined finish",
  },
  {
    src: "/gallery/craft-2.jpg",
    caption: "PRECISION STITCHING",
    alt: "Close look at precision stitching on a leather duffel",
  },
  {
    src: "/gallery/craft-3.jpg",
    caption: "SELECTED MATERIALS",
    alt: "Premium leather duffel bag crafted from selected materials",
  },
  {
    src: "/gallery/craft-4.jpg",
    caption: "BUILT FOR YEARS, NOT SEASONS",
    alt: "Durable travel duffel bag built for lasting use",
  },
];

export default function Craftsmanship() {
  return (
    <section id="craftsmanship" className="relative py-32 md:py-48">
      <div className="section-padding mb-20 text-center md:mb-32 md:text-left">
        <h2 className="craft-heading editorial-headline mx-auto max-w-3xl text-[clamp(2.5rem,5vw,4.5rem)] text-ivory md:mx-0">
          Made Slowly.
          <br />
          Made to Last.
        </h2>
      </div>

      <div id="craft-images" className="craft-images-grid relative z-10 grid grid-cols-1 gap-px bg-ivory/5 md:grid-cols-2">
        {craftImages.map((image, i) => (
          <figure
            key={image.caption}
            className={`craft-image group relative aspect-[4/3] overflow-hidden bg-charcoal ${
              i === 0 ? "md:col-span-2 md:aspect-[21/9]" : ""
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-matte-black/70 via-transparent to-transparent" />
            <figcaption className="label-caps absolute bottom-6 left-6 text-ivory/80 md:bottom-10 md:left-10">
              {image.caption}
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Bag animation plays here — after images, in background */}
      <div id="craft-bag-stage" className="relative z-10 h-[50vh] md:h-[60vh]" aria-hidden="true" />
    </section>
  );
}
