"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  FaGooglePlay,
  FaApple,
  FaHeart,
  FaCommentDots,
  FaStar,
} from "react-icons/fa";
import ButtonAnimation from "../common/ButtonAnimation";

const IMAGE_SRC = "/images/socialconnect.png";

const CHIPS = [
  { Icon: FaHeart, color: "#ff5d8f", pos: "top-4 left-4", delay: "0s" },
  { Icon: FaCommentDots, color: "#5eead4", pos: "top-1/3 right-4", delay: "-1.6s" },
  { Icon: FaStar, color: "#fde047", pos: "bottom-5 left-8", delay: "-3.2s" },
];

export default function SocialConnect() {
  const sectionRef = useRef<HTMLElement>(null);
  const bannerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 3D tilt
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = bannerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    el.style.setProperty("--ry", `${((x / r.width) * 2 - 1) * 8}deg`);
    el.style.setProperty("--rx", `${-((y / r.height) * 2 - 1) * 8}deg`);
  };

  const onLeave = () => {
    const el = bannerRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <section
      ref={sectionRef}
      id="download"
      aria-label="Download the Nuvogram app"
      className="text-foreground relative isolate w-full overflow-hidden px-4 py-16 sm:px-6  lg:px-8 "
    >
      <div className="mx-auto w-full max-w-7xl 2xl:max-w-[96rem]">
        {/* ---------- Banner Outer Container ---------- */}
        <div
          ref={bannerRef}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          className="group relative overflow-hidden rounded-[2.5rem] shadow-2xl transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)]"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(32px)",
            background: "linear-gradient(135deg, #00b4e6 0%, #0079b3 30%, #0a2540 100%)",
          }}
        >
          {/* --- Animated Grid Boxes Background --- */}
          <div
            aria-hidden="true"
            className="sc-anim pointer-events-none absolute inset-0 -z-0 opacity-25"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
              WebkitMaskImage:
                "radial-gradient(ellipse at 50% 50%, black 20%, transparent 75%)",
              maskImage:
                "radial-gradient(ellipse at 50% 50%, black 20%, transparent 75%)",
              animation: "sc-grid-pan 24s linear infinite",
            }}
          />

          {/* --- Light Sweep --- */}
          <div
            aria-hidden="true"
            className="sc-anim pointer-events-none absolute inset-0 -z-0 opacity-40"
            style={{
              background:
                "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.05) 55%, transparent 70%)",
              backgroundSize: "200% 100%",
              animation: "sweep 8s ease-in-out infinite",
            }}
          />

          {/* --- Travelling light beam on the border --- */}
          <div
            aria-hidden="true"
            className="sc-beam sc-anim pointer-events-none absolute inset-0 z-20 rounded-[2.5rem]"
          />

          <div className="relative z-10 grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:p-16">
            {/* ---- Left: Copy + Store Buttons ---- */}
            <div className="text-left">
              <h2 className="max-w-[20ch] text-3xl font-extrabold leading-[1.15] text-white drop-shadow-lg sm:text-4xl md:text-5xl lg:text-5xl">
                Let&apos;s start your Social connect, Download your app today
              </h2>

              <p className="mt-4 max-w-[40ch] text-sm text-white/80 sm:text-base">
                Connect with friends, share your moments, and earn rewards — all in one place.
              </p>

              <div className="relative mt-8 flex flex-wrap items-center gap-4 sm:mt-10">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -inset-x-10 -inset-y-6 -z-10 rounded-full blur-3xl"
                  style={{ background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)" }}
                />
                <ButtonAnimation
                  href="https://play.google.com/store"
                  icon={<FaGooglePlay className="size-6" />}
                  small="GET IT ON"
                  big="Google Play"
                  accent="#00F076"
                  variant="glass"
                />
                <ButtonAnimation
                  href="https://www.apple.com/app-store/"
                  icon={<FaApple className="size-6" />}
                  small="AVAILABLE ON THE"
                  big="Apple Store"
                  accent="#A78BFA"
                  variant="glass"
                />
              </div>
            </div>

            {/* ---- Right: Glossy Glass Card with Illustration ---- */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="group relative w-full max-w-md overflow-hidden rounded-3xl transition-transform duration-500 hover:scale-[1.02] sm:max-w-lg lg:absolute lg:top-1/2 lg:-right-4 lg:w-[115%] lg:max-w-xl lg:-translate-y-1/2">
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute inset-0 bg-white/10 backdrop-blur-xl" />
                <div className="absolute inset-0 rounded-3xl border border-white/20" />

                {/* Tilting layer */}
                <div
                  className="relative p-4 sm:p-6"
                  style={{
                    transform:
                      "perspective(900px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
                    transition: "transform 200ms ease-out",
                    transformStyle: "preserve-3d",
                  }}
                >
                  <Image
                    src={IMAGE_SRC}
                    alt="People connecting through the Nuvogram app"
                    width={640}
                    height={657}
                    sizes="(min-width: 1024px) 36rem, 28rem"
                    draggable={false}
                    className="h-auto w-full select-none object-contain"
                  />

                  {/* Floating social chips */}
                  {CHIPS.map(({ Icon, color, pos, delay }, i) => (
                    <span
                      key={i}
                      aria-hidden="true"
                      className={`sc-anim pointer-events-none absolute ${pos} grid size-10 place-items-center rounded-full border border-white/30 bg-white/15 shadow-lg backdrop-blur-md`}
                      style={{
                        animation: "sc-bob 5s ease-in-out infinite",
                        animationDelay: delay,
                        transform: "translateZ(40px)",
                      }}
                    >
                      <Icon className="size-4" style={{ color }} />
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @property --sc-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes sweep {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes sc-spin {
          to { --sc-angle: 360deg; }
        }
        @keyframes sc-bob {
          0%, 100% { translate: 0 0; rotate: -4deg; }
          50% { translate: 0 -12px; rotate: 6deg; }
        }
        @keyframes sc-grid-pan {
          0% { background-position: 0 0; }
          100% { background-position: 28px 28px; }
        }
        .sc-beam {
          padding: 2px;
          background: conic-gradient(
            from var(--sc-angle),
            transparent 0 72%,
            rgba(165, 243, 252, 0.9) 88%,
            #ffffff 100%
          );
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
          animation: sc-spin 5s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .sc-anim { animation: none !important; }
        }
      `}</style>
    </section>
  );
}