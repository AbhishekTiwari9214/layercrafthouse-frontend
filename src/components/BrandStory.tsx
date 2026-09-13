export default function BrandStory() {
  return (
    <section id="story" className="relative py-32 md:py-48">
      <div className="section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="story-heading editorial-headline text-[clamp(2.5rem,5vw,4.5rem)] text-ivory">
            Less, But Better.
          </h2>

          <p className="story-copy mx-auto mt-10 max-w-xl text-base leading-[1.8] text-warm-gray md:text-lg">
            Layer Craft House was created around a simple belief: the things we carry
            should be made with intention. Every proportion, material, stitch, and detail
            exists for a reason.
          </p>

          <div className="story-signature mt-20 flex flex-col items-center gap-3 border-t border-ivory/8 pt-16">
            <span className="label-caps text-ivory/70">Layer Craft House</span>
            <span className="font-serif text-lg italic text-gold/80 md:text-xl">
              Crafted with Intention
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
