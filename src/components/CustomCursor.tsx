"use client";

import { useEffect } from "react";

export default function CustomCursor() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    if (reduced || touch) return;

    const cursor = document.createElement("div");
    cursor.className =
      "fixed top-0 left-0 w-3 h-3 rounded-full border border-gold/50 pointer-events-none z-[9999] mix-blend-difference transition-transform duration-300 ease-out hidden md:block";
    cursor.style.transform = "translate(-50%, -50%)";
    document.body.appendChild(cursor);

    const onMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };

    const onEnter = () => {
      cursor.style.width = "40px";
      cursor.style.height = "40px";
      cursor.style.borderColor = "rgba(184, 155, 103, 0.8)";
    };

    const onLeave = () => {
      cursor.style.width = "12px";
      cursor.style.height = "12px";
      cursor.style.borderColor = "rgba(184, 155, 103, 0.5)";
    };

    window.addEventListener("mousemove", onMove);

    const interactives = document.querySelectorAll("a, button");
    interactives.forEach((el) => {
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", onLeave);
    });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cursor.remove();
      interactives.forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
    };
  }, []);

  return null;
}
