"use client";

import Image from "next/image";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* Content                                                            */
/* ------------------------------------------------------------------ */
const FEATURES = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Earn Money", href: "#earn-money" },
  { label: "Explore", href: "#explore" },
  { label: "Contact Us", href: "#contact" },
];

const SUPPORT = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & condition", href: "/terms" },
];

const SOCIALS = [
  { Icon: FaFacebookF, href: "https://facebook.com", label: "Facebook" },
  { Icon: FaTwitter, href: "https://twitter.com", label: "Twitter" },
  { Icon: FaLinkedinIn, href: "https://linkedin.com", label: "LinkedIn" },
  { Icon: FaInstagram, href: "https://instagram.com", label: "Instagram" },
];

/* ------------------------------------------------------------------ */
/* Reveal hook                                                        */
/* ------------------------------------------------------------------ */
function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/* ------------------------------------------------------------------ */
/* Component                                                          */
/* ------------------------------------------------------------------ */
export default function Footer() {
  const { ref, inView } = useInView<HTMLElement>(0.1);
  const year = new Date().getFullYear();

  return (
    <footer
      ref={ref}
      className="text-foreground relative isolate w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgb(6 15 34) 0%, rgb(4 11 26) 45%, rgb(2 7 18) 100%)",
      }}
    >
      {/* ---------- Animated backdrop (Dotted pattern only, center SVG rings removed) ---------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <style>{`
          @keyframes ft-pan { to { background-position: 24px 24px; } }
          @keyframes ft-drift {
            0%,100% { transform: translate3d(0,0,0) scale(1); }
            50% { transform: translate3d(48px,32px,0) scale(1.12); }
          }
          @keyframes ft-rise {
            from { opacity: 0; transform: translateY(16px); filter: blur(6px); }
            to { opacity: 1; transform: none; filter: none; }
          }
          @keyframes ft-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(420%); } }
          @media (prefers-reduced-motion: reduce) {
            .ft-anim { animation: none !important; }
          }
        `}</style>

        {/* Dotted Grid Pattern */}
        <div
          className="ft-anim absolute inset-0 text-sky-400/25"
          style={{
            backgroundImage: "radial-gradient(currentColor 1.2px, transparent 1.2px)",
            backgroundSize: "24px 24px",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black, transparent 80%)",
            maskImage:
              "radial-gradient(ellipse at center, black, transparent 80%)",
            animation: "ft-pan 30s linear infinite",
          }}
        />

        {/* Ambient Glows */}
        <div
          className="ft-anim absolute -top-40 -left-40 size-[32rem] rounded-full bg-sky-500/20 blur-3xl"
          style={{ animation: "ft-drift 18s ease-in-out infinite" }}
        />
        <div
          className="ft-anim absolute -right-40 -bottom-40 size-[34rem] rounded-full bg-cyan-500/15 blur-3xl"
          style={{ animation: "ft-drift 22s ease-in-out infinite", animationDelay: "-6s" }}
        />

        {/* Top Glowing Border Animation */}
        <span className="absolute inset-x-0 top-0 h-px overflow-hidden">
          <span
            className="ft-anim from-sky-400 via-sky-300 to-sky-400 absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r"
            style={{ animation: "ft-sweep 4s ease-in-out infinite" }}
          />
        </span>

        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)",
          }}
        />
      </div>

      {/* ---------- Main content ---------- */}
      <div
        className="relative mx-auto w-full max-w-[1400px] px-6 pt-14 pb-10 sm:px-10 lg:px-16"
        style={
          inView
            ? { animation: `ft-rise 800ms cubic-bezier(0.2,0.8,0.2,1) both` }
            : { opacity: 0 }
        }
      >
        {/* Three-column links adjusted for max-w-[1400px] with enlarged visible typography */}
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 md:justify-items-center">
          {/* ----- Contact Info ----- */}
          <div className="w-full max-w-sm">
            <h3 className="mb-5 text-base font-extrabold tracking-wider uppercase text-[#00a2e8] drop-shadow-[0_0_12px_rgba(0,162,232,0.4)]">
              Contact Info
            </h3>

            <div className="space-y-4 text-sm font-medium sm:text-base">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 size-4 shrink-0 text-[#00a2e8]" />
                <p className="leading-relaxed text-slate-200">
                  Warrior Comics Inc
                  <br />
                  PO Box 230610
                  <br />
                  Las Vegas, NV 89105
                </p>
              </div>

              <a
                href="mailto:Support@ziogram.com"
                className="group flex items-center gap-3 text-slate-200 transition-colors hover:text-[#00a2e8]"
              >
                <FaEnvelope className="size-4 shrink-0 text-[#00a2e8]" />
                <span className="group-hover:underline">Support@ziogram.com</span>
              </a>
            </div>
          </div>

          {/* ----- Features ----- */}
          <div className="w-full max-w-sm">
            <h3 className="mb-5 text-base font-extrabold tracking-wider uppercase text-[#00a2e8] drop-shadow-[0_0_12px_rgba(0,162,232,0.4)]">
              Features
            </h3>
            <ul className="space-y-3 text-sm font-semibold sm:text-base">
              {FEATURES.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="group inline-flex items-center gap-2 text-slate-200 transition-colors hover:text-[#00a2e8]"
                  >
                    <span className="h-px w-0 bg-gradient-to-r from-[#00a2e8] to-cyan-300 transition-all duration-300 group-hover:w-3.5" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ----- Support ----- */}
          <div className="w-full max-w-sm">
            <h3 className="mb-5 text-base font-extrabold tracking-wider uppercase text-[#00a2e8] drop-shadow-[0_0_12px_rgba(0,162,232,0.4)]">
              Support
            </h3>
            <ul className="space-y-3 text-sm font-semibold sm:text-base">
              {SUPPORT.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="group inline-flex items-center gap-2 text-slate-200 transition-colors hover:text-[#00a2e8]"
                  >
                    <span className="h-px w-0 bg-gradient-to-r from-[#00a2e8] to-cyan-300 transition-all duration-300 group-hover:w-3.5" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---------- Glowing Divider ---------- */}
        <div className="relative mt-14 h-px w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-400/40 to-transparent" />
        </div>

        {/* ---------- Bottom Bar ---------- */}
        <div className="mt-10 flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          {/* Logo */}
          <a
            href="#home"
            className="inline-flex shrink-0 items-center justify-center p-1 transition-transform hover:scale-105"
          >
            <Image
              src="/images/Logo.png"
              alt="Nuvogram"
              width={180}
              height={180}
              className="h-16 w-auto object-contain sm:h-20 lg:h-24"
              priority
            />
          </a>

          {/* Copyright */}
          <p className="text-center text-xs font-semibold text-slate-400 sm:text-sm">
            © Copyright {year} by Plus Warrior Comics Inc
          </p>

          {/* Socials */}
          <ul className="flex items-center gap-3">
            {SOCIALS.map(({ Icon, href, label }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group relative grid size-10 place-items-center overflow-hidden rounded-full border border-sky-400/30 bg-white/5 text-[#00a2e8] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[#00a2e8] hover:bg-[#00a2e8] hover:text-white"
                >
                  <span className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-[400%]" />
                  <Icon className="relative size-4 transition-transform duration-300 group-hover:scale-110" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}