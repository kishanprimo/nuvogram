"use client";

import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

/**
 * Floating "back to top" button.
 * Appears after scrolling down 400px; scrolls smoothly to top on click.
 * Styled with the Nuvogram brand gradient, plus a rotating conic ring,
 * breathing glow and orbiting particle — same language as ButtonAnimation.
 */
export default function BottomToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      className={`group cursor-pointer fixed right-5 bottom-5 z-50 grid size-12 place-items-center overflow-hidden rounded-full text-white shadow-lg transition-all duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-1 hover:scale-110 active:scale-95 motion-reduce:transition-none sm:right-8 sm:bottom-8 sm:size-14 ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
      style={{
        background: "var(--nuvo-gradient, linear-gradient(135deg, #0ea5e9, #1d4ed8))",
        boxShadow:
          "0 16px 32px -14px rgb(var(--brand-500-rgb, 14 165 233) / 0.75)",
      }}
    >
      <style>{`
        @keyframes btt-ring { to { transform: rotate(360deg); } }
        @keyframes btt-orbit { to { transform: rotate(360deg); } }
        @keyframes btt-breathe {
          0%,100% { transform: scale(1);   opacity: .55; }
          50%     { transform: scale(1.25); opacity: .25; }
        }
        @media (prefers-reduced-motion: reduce) {
          .btt-anim { animation: none !important; }
        }
      `}</style>

      {/* breathing radial glow */}
      <span
        aria-hidden="true"
        className="btt-anim bg-brand-500/60 pointer-events-none absolute -inset-2 rounded-full blur-xl"
        style={{ animation: "btt-breathe 3s ease-in-out infinite" }}
      />

      {/* rotating conic border ring */}
      <span
        aria-hidden="true"
        className="btt-anim pointer-events-none absolute -inset-[2px] rounded-full opacity-90"
        style={{
          background:
            "conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.9) 90deg, transparent 180deg)",
          animation: "btt-ring 3s linear infinite",
          WebkitMask:
            "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))",
          mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 2px))",
        }}
      />

      {/* orbiting particle */}
      <span
        aria-hidden="true"
        className="btt-anim pointer-events-none absolute inset-0"
        style={{ animation: "btt-orbit 3s linear infinite" }}
      >
        <span className="absolute top-0 left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-white shadow-[0_0_8px_#fff]" />
      </span>

      {/* hover shine sweep */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-[400%] motion-reduce:transition-none"
      />

      {/* icon */}
      <FaArrowUp className="relative z-10 size-4 transition-transform duration-300 group-hover:-translate-y-0.5 sm:size-5" />
    </button>
  );
}