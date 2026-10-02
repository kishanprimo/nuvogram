"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { FaGooglePlay, FaApple } from "react-icons/fa";
import ButtonAnimation from "../common/ButtonAnimation";

type HeroProps = {
  /** Phones artwork (PNG). */
  imageSrc?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

const HEADLINE = ["Connect, share & shop", "trends with friends."];

/** Softens the hard edges of the artwork so it blends into the gradient */
const EDGE_FADE =
  "linear-gradient(to right, transparent 0, black 14%), linear-gradient(to bottom, transparent 0, black 6%)";

/** Fade-and-rise wrapper used for the paragraph and button */
function Rise({
  ready,
  delay,
  children,
  className = "",
}: {
  ready: boolean;
  delay: number;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`transition-[opacity,translate] duration-700 ease-out motion-reduce:transition-none ${
        ready ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
      style={{ transitionDelay: ready ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
 

 
export default function Hero({
  imageSrc = "/images/Hero_section.png",
  ctaHref = "#features",
  ctaLabel = "Click here",
}: HeroProps) {
  const [ready, setReady] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  /* Start the entrance sequence right after first paint */
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  /* Tell CSS the artwork's real aspect ratio so it can be sized to fit the screen */
  const syncRatio = () => {
    const img = imgRef.current;
    const el = sectionRef.current;
    if (img && el && img.naturalWidth && img.naturalHeight) {
      el.style.setProperty("--img-ratio", String(img.naturalWidth / img.naturalHeight));
    }
  };
  useEffect(syncRatio, []);

  /* Pointer + scroll parallax, written to CSS variables (no re-renders) */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;

    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.setProperty("--mx", cx.toFixed(3));
      el.style.setProperty("--my", cy.toFixed(3));
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.002 ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ty = ((e.clientY - r.top) / r.height) * 2 - 1;
      kick();
    };
    const onLeave = () => {
      tx = 0;
      ty = 0;
      kick();
    };
    const onScroll = () => {
      el.style.setProperty("--sy", String(Math.min(window.scrollY, 900)));
    };

    onScroll();
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="bg-hero-gradient relative z-10 flex flex-col overflow-x-clip lg:min-h-[100svh]"
    >
      {/* Soft drifting glows */}
      <div
        aria-hidden="true"
        className="bg-on-hero/15 animate-drift pointer-events-none absolute -top-44 -left-44 -z-10 size-[34rem] rounded-full blur-3xl motion-reduce:animate-none"
      />
      <div
        aria-hidden="true"
        className="bg-brand-950/30 animate-drift pointer-events-none absolute -right-40 -bottom-48 -z-10 size-[36rem] rounded-full blur-3xl motion-reduce:animate-none"
        style={{ animationDelay: "-9s" }}
      />



      {/* Copy */}
      <div className="relative z-20 flex flex-1 items-center">
        <div
          className="mx-auto w-full max-w-7xl px-4 pt-28 pb-14 sm:px-6 sm:pt-32 sm:pb-16 lg:px-8 lg:pt-28 lg:pb-24"
          style={{
            opacity: "calc(1 - var(--sy, 0) / 650)",
            transform: "translateY(calc(var(--sy, 0) * -0.12px))",
          }}
        >
          <div className="max-w-3xl">
            <h1 className="text-on-hero text-[2.5rem] leading-[1.08] font-bold tracking-tight sm:text-6xl xl:text-[4.25rem]">
              {HEADLINE.map((line, i) => (
                <span key={line} className="block overflow-hidden pb-1.5 lg:whitespace-nowrap">
                  <span
                    className={`block transition-transform duration-[900ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none ${
                      ready ? "translate-y-0" : "translate-y-full"
                    }`}
                    style={{ transitionDelay: ready ? `${200 + i * 130}ms` : "0ms" }}
                  >
                    {line}
                  </span>
                </span>
              ))}
            </h1>

            <Rise ready={ready} delay={600} className="mt-6">
              <p className="text-on-hero/90 max-w-xl text-lg leading-relaxed">
                Seamlessly connect with friends, share your moments, and explore the latest
                shopping trends all in one place.
              </p>
            </Rise>

            <Rise ready={ready} delay={760} className="mt-9">
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={ctaHref}
                  className="group text-brand-700 bg-on-hero relative inline-flex h-14 items-center overflow-hidden rounded-lg px-8 text-base font-semibold shadow-[0_14px_34px_-12px_rgb(var(--shadow-color)/0.7)] transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-12px_rgb(var(--shadow-color)/0.8)] active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  <span
                    aria-hidden="true"
                    className="bg-brand-500/15 absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 transition-transform duration-700 group-hover:translate-x-[550%] motion-reduce:transition-none"
                  />
                  <span className="relative">{ctaLabel}</span>
                </a>

                <ButtonAnimation
                  href="https://play.google.com/store"
                  icon={<FaGooglePlay className="size-6" />}
                  small="GET IT ON"
                  big="Google Play"
                  accent="#00F076"
                  variant="solid"
                />
                <ButtonAnimation
                  href="https://www.apple.com/app-store/"
                  icon={<FaApple className="size-6" />}
                  small="AVAILABLE ON THE"
                  big="App Store"
                  accent="#A78BFA"
                  variant="solid"
                />
              </div>
            </Rise>
          </div>
        </div>
      </div>

      {/* Phones artwork: hidden on phones & tablets, shown from lg up */}
      <div className="pointer-events-none relative z-10 hidden lg:absolute lg:-right-10 lg:top-0 lg:block lg:mt-0 lg:mb-0 lg:ml-0 lg:mr-0 lg:w-[min(75vw,90rem)] 2xl:-right-24 2xl:w-[min(95vw,130rem)]">
        <div
          className="will-change-transform"
          style={{
            transform:
              "perspective(1400px) translate3d(calc(var(--mx, 0) * -10px), calc(var(--sy, 0) * 0.06px), 0) rotateY(calc(var(--mx, 0) * -3deg)) rotateX(calc(var(--my, 0) * 2deg))",
          }}
        >
          <div
            className={`transition-[opacity,translate,rotate] duration-[1200ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none ${
              ready ? "translate-x-0 rotate-0 opacity-100" : "translate-x-24 rotate-2 opacity-0"
            }`}
            style={{ transitionDelay: ready ? "350ms" : "0ms" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Nuvogram app screens showing the feed, stories and chat"
              fetchPriority="high"
              draggable={false}
              onLoad={syncRatio}
              className="block h-auto w-full select-none"
              style={{
                WebkitMaskImage: EDGE_FADE,
                maskImage: EDGE_FADE,
                WebkitMaskComposite: "source-in",
                maskComposite: "intersect",
              }}
            />
          </div>
        </div>
      </div>

      {/* Corner wedge — only relevant on lg+ where the artwork sits */}
      <div
        aria-hidden="true"
        className={`bg-background absolute bottom-0 left-0 z-20 hidden origin-bottom-left transition-transform duration-[900ms] ease-out motion-reduce:transition-none lg:z-30 lg:block lg:size-72 [clip-path:polygon(0_0,100%_100%,0_100%)] ${
          ready ? "scale-100" : "scale-0"
        }`}
        style={{ transitionDelay: ready ? "700ms" : "0ms" }}
      />
    </section>
  );
}