import Link from "next/link";

const footerLinks = [
  { label: "The Bag", href: "#the-bag" },
  { label: "Craftsmanship", href: "#craftsmanship" },
  { label: "Story", href: "#story" },
  { label: "Contact", href: "#" },
  { label: "Instagram", href: "#" },
];

export default function Footer() {
  return (
    <footer id="footer" className="border-t border-ivory/8 py-10 md:py-12">
      <div className="section-padding">
        <div className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:items-center md:text-left">
          <Link href="#" className="label-caps text-ivory/80 transition-colors hover:text-gold">
            Layer Craft House
          </Link>

          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-4 md:justify-start">
            {footerLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="label-caps text-[0.625rem] text-warm-gray transition-colors duration-500 hover:text-ivory"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 text-center text-xs text-warm-gray/60 md:text-left">
          © 2026 Layer Craft House. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
