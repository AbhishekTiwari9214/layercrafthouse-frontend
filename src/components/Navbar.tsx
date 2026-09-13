"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import PurchaseButton from "@/components/PurchaseButton";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { label: "The Bag", href: "#the-bag" },
  { label: "Craftsmanship", href: "#craftsmanship" },
  { label: "Details", href: "#details" },
  { label: "Story", href: "#story" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? "bg-matte-black/90 backdrop-blur-md border-b border-ivory/5"
            : "bg-transparent"
        }`}
      >
        <nav className="section-padding flex h-20 items-center justify-between md:h-24">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-ivory/90 transition-colors duration-500 hover:text-gold sm:gap-3"
          >
            <span className="relative block h-8 w-8 shrink-0 sm:h-9 sm:w-9">
              <Image
                src="/models/logo.png"
                alt=""
                fill
                sizes="36px"
                className="object-contain opacity-90"
                priority
              />
            </span>
            <span className="label-caps">Layer Craft House</span>
          </Link>

          <ul className="hidden items-center gap-10 lg:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="label-caps text-[0.625rem] text-warm-gray transition-colors duration-500 hover:text-ivory"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-8 lg:flex">
            <PurchaseButton className="label-caps text-[0.625rem] text-ivory/80 transition-colors duration-500 hover:text-gold">
              Buy Now
            </PurchaseButton>
            {user ? (
              <>
                <Link
                  href="/orders"
                  className="label-caps text-[0.625rem] text-ivory/80 transition-colors duration-500 hover:text-gold"
                >
                  My Orders
                </Link>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="label-caps text-[0.625rem] text-warm-gray transition-colors duration-500 hover:text-ivory"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login?redirect=/checkout"
                className="label-caps text-[0.625rem] text-warm-gray transition-colors duration-500 hover:text-ivory"
              >
                Sign In
              </Link>
            )}
          </div>

          <button
            className="relative z-50 flex h-10 w-10 flex-col items-center justify-center gap-1.5 lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span
              className={`block h-px w-6 bg-ivory transition-all duration-500 ${
                menuOpen ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-6 bg-ivory transition-all duration-500 ${
                menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
              }`}
            />
          </button>
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center bg-matte-black transition-all duration-700 lg:hidden ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <ul className="flex flex-col items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-serif text-3xl font-light text-ivory transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <PurchaseButton
              onClick={() => setMenuOpen(false)}
              className="label-caps mt-4 text-gold"
            >
              Buy Now
            </PurchaseButton>
          </li>
          {user ? (
            <>
              <li>
                <Link
                  href="/orders"
                  onClick={() => setMenuOpen(false)}
                  className="label-caps text-ivory/80"
                >
                  My Orders
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="label-caps text-warm-gray"
                >
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link
                href="/login?redirect=/checkout"
                onClick={() => setMenuOpen(false)}
                className="label-caps text-warm-gray"
              >
                Sign In
              </Link>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}
