"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollProvider } from "@/context/ScrollContext";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TheBag from "@/components/TheBag";
import Craftsmanship from "@/components/Craftsmanship";
import ProductDetails from "@/components/ProductDetails";
import Lifestyle from "@/components/Lifestyle";
import BrandStory from "@/components/BrandStory";
import CTA from "@/components/CTA";
import CheckoutPrompt from "@/components/CheckoutPrompt";
import LogoOutro from "@/components/LogoOutro";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import BrandLogo from "@/components/BrandLogo";
import ProductViewer from "@/components/ProductViewer";
import { LOGO_BOX_CLASS } from "@/constants/logoDisplay";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [craftProgress, setCraftProgress] = useState(0);
  const [lifestyleProgress, setLifestyleProgress] = useState(0);
  const [stampHoldActive, setStampHoldActive] = useState(false);
  const [logoHandoff, setLogoHandoff] = useState(0);
  const [logoAnchorY, setLogoAnchorY] = useState<number | null>(null);
  const [pastCraftBag, setPastCraftBag] = useState(false);
  const [bagShell, setBagShell] = useState({
    x: 0,
    y: 0,
    scale: 1,
    gallery: false,
    mode: "bag" as "bag" | "stamp",
  });
  const [hideForImages, setHideForImages] = useState(false);
  const craftImagesVisibleRef = useRef(false);
  const lifestyleImagesVisibleRef = useRef(false);
  const pastCraftBagRef = useRef(false);

  const syncHideForImages = useCallback(() => {
    setHideForImages(
      craftImagesVisibleRef.current || lifestyleImagesVisibleRef.current,
    );
  }, []);
  const mainRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const viewerShellRef = useRef<HTMLDivElement>(null);

  const handleProgress = useCallback((progress: number) => {
    setScrollProgress(progress);
  }, []);

  const handleCraftProgress = useCallback((progress: number) => {
    setCraftProgress(progress);
  }, []);

  const handleLifestyleProgress = useCallback((progress: number) => {
    setLifestyleProgress(progress);
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      /* ── Scroll-driven 3D rotation (hero only) ── */
      if (pinRef.current && contentRef.current) {
        ScrollTrigger.create({
          trigger: contentRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.4,
          onUpdate: (self) => handleProgress(self.progress),
        });
      }

      /* ── Craftsmanship: bag animates AFTER images, in background ── */
      ScrollTrigger.create({
        trigger: "#craft-bag-stage",
        start: "top 85%",
        end: "bottom 25%",
        scrub: 1.6,
        onUpdate: (self) => {
          if (self.isActive) {
            if (pastCraftBagRef.current) {
              pastCraftBagRef.current = false;
              setPastCraftBag(false);
            }
            handleCraftProgress(self.progress);
            return;
          }

          if (pastCraftBagRef.current) {
            handleCraftProgress(0);
          }
        },
        onEnterBack: () => {
          pastCraftBagRef.current = false;
          setPastCraftBag(false);
        },
        onLeave: () => {
          pastCraftBagRef.current = true;
          setPastCraftBag(true);
          handleCraftProgress(0);
        },
        onLeaveBack: () => {
          pastCraftBagRef.current = false;
          setPastCraftBag(false);
        },
      });

      /* ── Lifestyle: logo slides from left (same timing as craft bag) ── */
      ScrollTrigger.create({
        trigger: "#lifestyle-bag-stage",
        start: "top 85%",
        end: "bottom 25%",
        scrub: 1.6,
        onUpdate: (self) => {
          if (self.isActive) {
            handleLifestyleProgress(self.progress);
          }
        },
        onEnterBack: (self) => handleLifestyleProgress(self.progress),
        onLeaveBack: () => handleLifestyleProgress(0),
      });

      /* ── Lifestyle: keep logo centered through story + CTA ── */
      ScrollTrigger.create({
        trigger: "#lifestyle-bag-stage",
        start: "bottom 25%",
        endTrigger: "#cta",
        end: "bottom bottom",
        onEnter: () => setStampHoldActive(true),
        onEnterBack: () => setStampHoldActive(true),
        onLeaveBack: () => setStampHoldActive(false),
        onLeave: () => setStampHoldActive(false),
      });

      /* ── Hide fixed logo once static footer logo section enters ── */
      ScrollTrigger.create({
        trigger: "#logo-outro",
        start: "top 85%",
        onEnter: () => {
          setLogoHandoff(1);
          setLogoAnchorY(null);
        },
        onLeaveBack: () => {
          setLogoHandoff(0);
          setLogoAnchorY(null);
        },
      });

      /* ── Hide hero bag while image grids are in view ── */
      ScrollTrigger.create({
        trigger: "#craft-images",
        start: "top 70%",
        end: "bottom top",
        onEnter: () => {
          craftImagesVisibleRef.current = true;
          syncHideForImages();
        },
        onLeave: () => {
          craftImagesVisibleRef.current = false;
          syncHideForImages();
        },
        onEnterBack: () => {
          craftImagesVisibleRef.current = true;
          syncHideForImages();
        },
        onLeaveBack: () => {
          craftImagesVisibleRef.current = false;
          syncHideForImages();
        },
      });

      ScrollTrigger.create({
        trigger: "#lifestyle-images",
        start: "top 70%",
        end: "bottom top",
        onEnter: () => {
          lifestyleImagesVisibleRef.current = true;
          syncHideForImages();
        },
        onLeave: () => {
          lifestyleImagesVisibleRef.current = false;
          syncHideForImages();
        },
        onEnterBack: () => {
          lifestyleImagesVisibleRef.current = true;
          syncHideForImages();
        },
        onLeaveBack: () => {
          lifestyleImagesVisibleRef.current = false;
          syncHideForImages();
        },
      });

      /* ── Hero text reveals ── */
      gsap.from(".hero-headline", {
        y: 80,
        opacity: 0,
        duration: 1.4,
        ease: "power3.out",
        delay: 0.3,
      });

      gsap.from(".hero-sub", {
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.6,
      });

      gsap.from(".hero-cta", {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.9,
      });

      /* ── Section heading reveals ── */
      const headings = [
        ".the-bag-heading",
        ".craft-heading",
        ".lifestyle-heading",
        ".story-heading",
        ".cta-heading",
      ];

      headings.forEach((selector) => {
        gsap.from(selector, {
          scrollTrigger: {
            trigger: selector,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          y: 60,
          opacity: 0,
          duration: 1.2,
          ease: "power3.out",
        });
      });

      /* ── The Bag feature items ── */
      gsap.from(".the-bag-item", {
        scrollTrigger: {
          trigger: "#the-bag",
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
      });

      /* ── Craftsmanship image reveals ── */
      gsap.from(".craft-image", {
        scrollTrigger: {
          trigger: "#craftsmanship",
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
        y: 60,
        opacity: 0,
        duration: 1.2,
        stagger: 0.12,
        ease: "power3.out",
      });

      /* ── Product details ── */
      gsap.from(".detail-kicker", {
        scrollTrigger: {
          trigger: "#details",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: 24,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });

      gsap.from(".detail-heading", {
        scrollTrigger: {
          trigger: "#details",
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
        y: 48,
        opacity: 0,
        duration: 1.1,
        ease: "power3.out",
        delay: 0.08,
      });

      gsap.from(".detail-glow-core", {
        scrollTrigger: {
          trigger: ".details-stage",
          start: "top 75%",
          end: "bottom 25%",
          scrub: 1.4,
        },
        scale: 0.75,
        opacity: 0,
        ease: "power2.out",
      });

      gsap.from(".detail-glow-ring", {
        scrollTrigger: {
          trigger: ".details-stage",
          start: "top 70%",
          end: "bottom 30%",
          scrub: 1.6,
        },
        scale: 0.85,
        opacity: 0,
        rotate: -12,
        ease: "power2.out",
      });

      gsap.utils.toArray<SVGGeometryElement>(".detail-connector-path, .detail-connector-ring").forEach((path) => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(path, {
          scrollTrigger: {
            trigger: ".details-stage",
            start: "top 72%",
            toggleActions: "play none none reverse",
          },
          strokeDashoffset: 0,
          duration: 1.4,
          ease: "power2.inOut",
        });
      });

      gsap.from(".detail-connector-frame", {
        scrollTrigger: {
          trigger: ".details-stage",
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        duration: 1.2,
        ease: "power2.out",
      });

      gsap.from(".detail-connector-guide", {
        scrollTrigger: {
          trigger: ".details-stage",
          start: "top 74%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        duration: 1,
        stagger: 0.12,
        ease: "power2.out",
      });

      gsap.from(".detail-connector-dot, .detail-connector-logo, .detail-connector-center-ring", {
        scrollTrigger: {
          trigger: ".details-stage",
          start: "top 68%",
          toggleActions: "play none none reverse",
        },
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power2.out",
      });

      gsap.utils.toArray<HTMLElement>(".detail-callout").forEach((callout, index) => {
        const line = callout.querySelector(".detail-line");
        const num = callout.querySelector(".detail-num");
        const label = callout.querySelector(".detail-label");
        const fromX = callout.className.includes("right-") ? 28 : -28;

        gsap.from(callout, {
          scrollTrigger: {
            trigger: callout,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
          x: fromX,
          y: 24,
          opacity: 0,
          scale: 0.94,
          duration: 1,
          ease: "power3.out",
          delay: index * 0.05,
        });

        if (num) {
          gsap.from(num, {
            scrollTrigger: {
              trigger: callout,
              start: "top 86%",
              toggleActions: "play none none reverse",
            },
            opacity: 0,
            y: 12,
            duration: 0.7,
            ease: "power2.out",
            delay: 0.1 + index * 0.05,
          });
        }

        if (label) {
          gsap.from(label, {
            scrollTrigger: {
              trigger: callout,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
            opacity: 0,
            y: 16,
            duration: 0.8,
            ease: "power3.out",
            delay: 0.15 + index * 0.05,
          });
        }

        if (line) {
          gsap.from(line, {
            scrollTrigger: {
              trigger: callout,
              start: "top 84%",
              toggleActions: "play none none reverse",
            },
            scaleX: 0,
            opacity: 0,
            duration: 0.9,
            ease: "power2.inOut",
            delay: 0.25 + index * 0.05,
          });
        }
      });

      gsap.from(".detail-hint", {
        scrollTrigger: {
          trigger: ".details-stage",
          start: "top 55%",
          toggleActions: "play none none reverse",
        },
        y: 16,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out",
      });

      /* ── Lifestyle parallax ── */
      document.querySelectorAll(".lifestyle-parallax").forEach((el) => {
        gsap.to(el, {
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
          y: -40,
          ease: "none",
        });
      });

      gsap.from(".lifestyle-copy", {
        scrollTrigger: {
          trigger: ".lifestyle-heading",
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
      });

      /* ── Brand story ── */
      gsap.from(".story-copy", {
        scrollTrigger: {
          trigger: "#story",
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
        y: 40,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
      });

      gsap.from(".story-signature", {
        scrollTrigger: {
          trigger: ".story-signature",
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
        y: 20,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      /* ── CTA copy ── */
      gsap.from(".cta-copy", {
        scrollTrigger: {
          trigger: "#cta",
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.3,
      });

      /* ── Hero background parallax ── */
      gsap.to(".parallax-bg", {
        scrollTrigger: {
          trigger: mainRef.current,
          start: "top top",
          end: "30% top",
          scrub: 1,
        },
        y: 80,
        opacity: 0.4,
        ease: "none",
      });
    }, mainRef);

    return () => ctx.revert();
  }, [handleProgress, handleCraftProgress, handleLifestyleProgress, syncHideForImages]);

  const stampAnim = stampHoldActive ? 1 : lifestyleProgress;
  const logoPhaseActive = stampAnim > 0.02 || stampHoldActive;
  const showFixedLogo = logoPhaseActive && logoHandoff < 1;
  const showLogo = showFixedLogo;
  const craftActive = craftProgress > 0.02 && !pastCraftBag;

  useEffect(() => {
    if (showFixedLogo) {
      const entry = Math.min(stampAnim / 0.45, 1);
      const settled = stampAnim >= 0.98;
      const entryY = 56 + entry * 12;
      const y = logoAnchorY !== null ? logoAnchorY : settled ? 0 : entryY;

      setBagShell({
        x: settled ? 0 : -92 + entry * 92,
        y,
        scale: settled ? 1 : 0.88 + entry * 0.12,
        gallery: true,
        mode: "stamp",
      });
      return;
    }

    if (craftActive) {
      const entry = Math.min(craftProgress / 0.45, 1);
      const zoom = Math.min(Math.max((craftProgress - 0.35) / 0.65, 0), 1);
      setBagShell({
        x: 92 - entry * 92,
        y: entry * 28,
        scale: 1 + zoom * 0.18,
        gallery: true,
        mode: "bag",
      });
      return;
    }

    setBagShell({ x: 0, y: 0, scale: 1, gallery: false, mode: "bag" });
  }, [craftProgress, craftActive, stampAnim, showFixedLogo, logoAnchorY]);

  const craftGallery = craftActive;
  const lifestyleGallery = showLogo;
  const galleryActive = craftGallery || lifestyleGallery;
  const viewerVisible = galleryActive || (!hideForImages && !pastCraftBag);
  const viewerOpacity = galleryActive ? 0.62 : viewerVisible ? 1 : 0;
  const showHeroBag = !galleryActive && !pastCraftBag && !logoPhaseActive;

  return (
    <ScrollProvider
      progress={scrollProgress}
      craftProgress={craftProgress}
      lifestyleProgress={lifestyleProgress}
      stampHoldActive={stampHoldActive}
      pastCraftBag={pastCraftBag}
    >
      <div ref={mainRef} className="relative">
        <SmoothScroll />
        <CustomCursor />
        <Navbar />

        {/* Pinned 3D product viewer */}
        <div
          ref={pinRef}
          className={`pointer-events-none fixed inset-0 flex justify-center transition-opacity duration-500 ${
            galleryActive ? "z-[1]" : "z-[5]"
          } ${
            bagShell.gallery
              ? bagShell.mode === "stamp"
                ? "items-center"
                : "items-center md:items-center"
              : "items-start pt-[16vh] sm:pt-[22vh] md:items-center md:pt-0"
          }`}
          style={{ opacity: viewerOpacity }}
          aria-hidden="true"
        >
          <div
            ref={viewerShellRef}
            className={`relative will-change-transform ${
              bagShell.gallery
                ? bagShell.mode === "stamp"
                  ? LOGO_BOX_CLASS
                  : "h-[55vh] min-h-[300px] w-full max-w-2xl md:h-[70vh] md:max-w-4xl"
                : "h-[34vh] min-h-[240px] w-full max-w-sm sm:h-[38vh] sm:max-w-lg md:h-[60vh] md:min-h-[320px] lg:absolute lg:right-[6%] lg:top-1/2 lg:h-[72vh] lg:min-h-[480px] lg:max-w-none lg:w-[48vw] lg:-translate-y-1/2 xl:right-[10%]"
            }`}
            style={
              bagShell.gallery
                ? {
                    transform: `translate(${bagShell.x}vw, ${bagShell.y}px) scale(${bagShell.scale})`,
                  }
                : undefined
            }
          >
            {(showLogo || craftActive || showHeroBag) &&
              (showLogo ? (
                <BrandLogo className="h-full w-full" />
              ) : (
                <ProductViewer
                  className="h-full w-full"
                  variant="bag"
                  floating={showHeroBag}
                  floatIntensity={0.12}
                />
              ))}
          </div>
        </div>

        {/* Scrollable content */}
        <div ref={contentRef} className="relative z-10">
          <Hero />
          <TheBag />
          <CheckoutPrompt copy="Your duffel is ready to order." />
          <Craftsmanship />
          <CheckoutPrompt copy="Crafted for the journey ahead." />
          <ProductDetails />
          <CheckoutPrompt copy="Every detail, ready when you are." />
          <Lifestyle />
          <CheckoutPrompt copy="Wherever you're going, carry it forward." />
          <BrandStory />
          <CTA />
          <LogoOutro />
          <Footer />
        </div>
      </div>
    </ScrollProvider>
  );
}
