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
import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

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
  const router = useRouter();
  const pathname = usePathname();
  const { ref, inView } = useInView<HTMLElement>(0.1);
  const year = new Date().getFullYear();

  const handleNavigation = useCallback((href: string) => {
    if (href.startsWith("#")) {
      const id = href.slice(1);
      if (pathname === "/") {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        router.push(`/${href}`);
      }
    } else {
      router.push(href);
    }
  }, [pathname, router]);

  return (
    <footer
      ref={ref}
      className="text-foreground relative isolate w-full overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, rgb(6 15 34) 0%, rgb(4 11 26) 45%, rgb(2 7 18) 100%)",
      }}
    >
      {/* ---------- Animated backdrop ---------- */}
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

        {/* Dotted Grid */}
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

        {/* Top Glowing Border */}
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
        {/* Four-column grid */}
        <div className="mx-auto grid w-full max-w-6xl gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* ----- Contact Info ----- */}
          <div className="w-full text-center sm:text-left">
            <h3 className="mb-5 text-base font-extrabold tracking-wider uppercase text-[#00a2e8] drop-shadow-[0_0_12px_rgba(0,162,232,0.4)]">
              Contact Info
            </h3>

            <div className="space-y-4 text-sm font-medium sm:text-base">
              <div className="flex items-start justify-center gap-3 sm:justify-start">
                <FaMapMarkerAlt className="mt-1 size-4 shrink-0 text-[#00a2e8]" />
                <p className="text-left leading-relaxed text-slate-200">
                  Warrior Comics Inc
                  <br />
                  PO Box 230610
                  <br />
                  Las Vegas, NV 89105
                </p>
              </div>

              <a
                href="mailto:Support@ziogram.com"
                className="group flex items-center justify-center gap-3 text-slate-200 transition-colors hover:text-[#00a2e8] sm:justify-start"
              >
                <FaEnvelope className="size-4 shrink-0 text-[#00a2e8]" />
                <span className="group-hover:underline">Support@ziogram.com</span>
              </a>
            </div>
          </div>

          {/* ----- Features ----- */}
          <div className="w-full text-center sm:text-left">
            <h3 className="mb-5 text-base font-extrabold tracking-wider uppercase text-[#00a2e8] drop-shadow-[0_0_12px_rgba(0,162,232,0.4)]">
              Features
            </h3>
            <ul className="space-y-3 text-sm font-semibold sm:text-base">
              {FEATURES.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation(href);
                    }}
                    className="group relative inline-flex items-center text-slate-200 transition-colors hover:text-[#00a2e8]"
                  >
                    <span className="pointer-events-none absolute left-0 -bottom-0.5 h-px w-0 bg-gradient-to-r from-[#00a2e8] to-cyan-300 transition-all duration-300 group-hover:w-full" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ----- Support ----- */}
          <div className="w-full text-center sm:text-left">
            <h3 className="mb-5 text-base font-extrabold tracking-wider uppercase text-[#00a2e8] drop-shadow-[0_0_12px_rgba(0,162,232,0.4)]">
              Support
            </h3>
            <ul className="space-y-3 text-sm font-semibold sm:text-base">
              {SUPPORT.map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation(href);
                    }}
                    className="group relative inline-flex items-center text-slate-200 transition-colors hover:text-[#00a2e8]"
                  >
                    <span className="pointer-events-none absolute left-0 -bottom-0.5 h-px w-0 bg-gradient-to-r from-[#00a2e8] to-cyan-300 transition-all duration-300 group-hover:w-full" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ----- Follow Us (socials moved here) ----- */}
          <div className="w-full text-center sm:text-left">
            <h3 className="mb-5 text-base font-extrabold tracking-wider uppercase text-[#00a2e8] drop-shadow-[0_0_12px_rgba(0,162,232,0.4)]">
              Follow Us
            </h3>
            <ul className="flex items-center justify-center gap-3 sm:justify-start">
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

        {/* ---------- Glowing Divider (slimmer) ---------- */}
        <div className="relative mt-10 h-px w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-sky-400/10 via-sky-400/40 to-sky-400/10" />
        </div>

        {/* ---------- Bottom Bar (logo left · copyright right) ---------- */}
        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              handleNavigation("#home");
            }}
            className="inline-flex shrink-0 items-center justify-center p-1 transition-transform hover:scale-105"
          >
            <Image
              src="/images/Logo.png"
              alt="Nuvogram"
              width={1798}
              height={937}
              sizes="12rem"
              className="h-14 w-auto object-contain sm:h-16 lg:h-20"
            />
          </a>

          {/* Copyright — pushed to the right */}
          <p className="text-center text-xs font-semibold text-slate-400 sm:text-sm sm:text-right">
            © Copyright {year} by Plus Warrior Comics Inc
          </p>
        </div>
      </div>
    </footer>
  );
}