import Image from "next/image";

const lifestyleImages = [
  {
    src: "/gallery/lifestyle-1.jpg",
    alt: "Brown leather duffel bag ready for travel beside a chair",
  },
  {
    src: "/gallery/lifestyle-2.jpg",
    alt: "Leather duffel bag on the open road",
  },
  {
    src: "/gallery/lifestyle-3.jpg",
    alt: "Traveler carrying a large brown leather duffel bag",
  },
  {
    src: "/gallery/lifestyle-4.jpg",
    alt: "Black duffle bag packed for departure",
  },
];

export default function Lifestyle() {
  return (
    <section className="relative py-32 md:py-48">
      <div className="section-padding mb-16 text-center md:mb-24 md:text-left">
        <h2 className="lifestyle-heading editorial-headline text-[clamp(2.5rem,5vw,4.5rem)] text-ivory">
          Wherever You&apos;re Going.
        </h2>
        <p className="lifestyle-copy mx-auto mt-8 max-w-lg text-base leading-relaxed text-warm-gray md:mx-0 md:text-lg">
          Designed for departures, arrivals, and everything worth carrying between them.
        </p>
      </div>

      <div id="lifestyle-images" className="relative z-10 flex flex-col gap-px">
        {lifestyleImages.map((image, i) => (
          <figure
            key={image.src}
            className={`lifestyle-image group relative overflow-hidden ${
              i % 2 === 0 ? "aspect-[16/9] md:aspect-[21/9]" : "aspect-[16/10] md:aspect-[16/7]"
            }`}
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="100vw"
              className="lifestyle-parallax object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-[1.02]"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-matte-black/30" />
          </figure>
        ))}
      </div>

      <div id="lifestyle-bag-stage" className="relative z-10 h-[45vh] md:h-[55vh]" aria-hidden="true" />
    </section>
  );
}
