const features = [
  {
    num: "01",
    title: "FORM",
    description: "Structured silhouette designed to maintain its shape.",
  },
  {
    num: "02",
    title: "MATERIAL",
    description: "Premium materials selected for texture, durability, and character.",
  },
  {
    num: "03",
    title: "HARDWARE",
    description: "Refined metal hardware engineered for everyday movement.",
  },
  {
    num: "04",
    title: "INTERIOR",
    description: "Thoughtfully organized interior without unnecessary complexity.",
  },
];

export default function TheBag() {
  return (
    <section id="the-bag" className="relative py-32 md:py-48">
      <div className="section-padding">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24">
          <div className="the-bag-heading text-center md:text-left lg:sticky lg:top-32 lg:self-start">
            <h2 className="editorial-headline text-[clamp(2.5rem,5vw,4.5rem)] text-ivory">
              One Bag.
              <br />
              Considered From
              <br />
              Every Angle.
            </h2>
          </div>

          <div className="flex flex-col gap-16 md:gap-20">
            {features.map((feature) => (
              <article
                key={feature.num}
                className="the-bag-item group border-t border-ivory/8 pt-8 text-center md:text-left"
              >
                <div className="flex items-baseline justify-center gap-6 md:justify-start">
                  <span className="label-caps text-gold">{feature.num}</span>
                  <h3 className="label-caps text-ivory">{feature.title}</h3>
                </div>
                <p className="mx-auto mt-4 max-w-sm text-base leading-relaxed text-warm-gray md:mx-0 md:pl-12">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
