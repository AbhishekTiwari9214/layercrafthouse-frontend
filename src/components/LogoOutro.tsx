import BrandLogo from "@/components/BrandLogo";
import { LOGO_BOX_CLASS } from "@/constants/logoDisplay";

export default function LogoOutro() {
  return (
    <section
      id="logo-outro"
      className="relative z-10 flex justify-center px-6 pb-10 pt-8 md:pb-12 md:pt-10"
      aria-label="Layer Craft House logo"
    >
      <div id="logo-outro-inner" className={`relative ${LOGO_BOX_CLASS}`}>
        <BrandLogo settled className="h-full w-full" />
      </div>
    </section>
  );
}
