"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  FaStore,
  FaBoxOpen,
  FaClipboardList,
  FaTruck,
  FaHeart,
  FaCommentDots,
  FaTag,
} from "react-icons/fa";

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */
type Step = {
  title: string;
  body: string;
  tags: string[];
  Icon: React.ComponentType<{ className?: string }>;
};

const STEPS: Step[] = [
  {
    title: "Become Seller",
    body: "Become a best seller on Nuvogram ecommerce platform",
    tags: ["Seller Profile", "Store Setup"],
    Icon: FaStore,
  },
  {
    title: "Add Products",
    body: "Add/Manage Products to sell in app",
    tags: ["Product Catalog", "Photos & Videos", "Manage Stock"],
    Icon: FaBoxOpen,
  },
  {
    title: "Orders",
    body: "Get orders from users",
    tags: ["In-app Orders", "Order Alerts"],
    Icon: FaClipboardList,
  },
  {
    title: "Deliver",
    body: "Delivered orders and earn",
    tags: ["Order Tracking", "Earnings"],
    Icon: FaTruck,
  },
];

const STEP_MS = 2600;

/* Floating icons in the background: social + shop themes of Nuvogram */
const BG_ICONS = [
  { Icon: FaStore, left: "6%", size: 28, delay: 0, dur: 16 },
  { Icon: FaHeart, left: "18%", size: 22, delay: 5, dur: 19 },
  { Icon: FaBoxOpen, left: "32%", size: 26, delay: 9, dur: 17 },
  { Icon: FaCommentDots, left: "47%", size: 24, delay: 2, dur: 21 },
  { Icon: FaTag, left: "61%", size: 24, delay: 7, dur: 18 },
  { Icon: FaClipboardList, left: "75%", size: 28, delay: 11, dur: 20 },
  { Icon: FaTruck, left: "88%", size: 26, delay: 4, dur: 17 },
];

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
/** Fires once when the element scrolls into view */
function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
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

function Reveal({
  inView,
  delay = 0,
  y = 24,
  className = "",
  children,
}: {
  inView: boolean;
  delay?: number;
  y?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none ${className}`}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : `translateY(${y}px)`,
        transitionDelay: inView ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}

/** Animated section background (decorative, behind everything) */
function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <style>{`
        @keyframes earn-drift {
          0%, 100% { transform: translate3d(0,0,0) scale(1); }
          50% { transform: translate3d(48px,32px,0) scale(1.12); }
        }
        @keyframes earn-pan { to { background-position: 24px 24px; } }
        @keyframes earn-float {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          15% { opacity: .55; }
          85% { opacity: .55; }
          100% { transform: translateY(-520px) rotate(24deg); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .earn-anim { animation: none !important; }
        }
      `}</style>

      {/* slowly panning dot grid, faded at the edges */}
      <div className="earn-anim text-brand-500/25 absolute inset-0 [-webkit-mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)] [animation:earn-pan_30s_linear_infinite] [background-image:radial-gradient(currentColor_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />

      {/* drifting dashed orbit rings (same language as the Features section) */}
      <svg
        viewBox="0 0 400 400"
        className="text-brand-500/20 earn-anim absolute top-1/2 left-1/2 size-[46rem] -translate-x-1/2 -translate-y-1/2 [animation:earn-drift_26s_ease-in-out_infinite]"
        fill="none"
      >
        <ellipse cx="200" cy="200" rx="170" ry="130" stroke="currentColor" strokeWidth="1" strokeDasharray="2 8" />
        <ellipse cx="200" cy="200" rx="120" ry="90" stroke="currentColor" strokeWidth="1" strokeDasharray="2 8" />
      </svg>

      {/* floating app icons rising through the section */}
      {BG_ICONS.map(({ Icon, left, size, delay, dur }, i) => (
        <Icon
          key={i}
          className="earn-anim text-brand-500 absolute bottom-0 opacity-0"
          style={{
            left,
            width: size,
            height: size,
            animation: `earn-float ${dur}s linear ${delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
export default function EarnMoney() {
  const { ref, inView } = useInView<HTMLElement>(0.2);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const last = STEPS.length - 1;

  /* Order "travels" through the steps, then restarts */
  useEffect(() => {
    if (!inView || paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(last);
      return;
    }
    const id = setTimeout(
      () => setActive((a) => (a >= last ? 0 : a + 1)),
      active >= last ? STEP_MS + 1200 : STEP_MS
    );
    return () => clearTimeout(id);
  }, [inView, paused, active, last]);

  return (
    <section
      ref={ref}
      id="earn-money"
      className="text-foreground relative isolate overflow-hidden"
    >
      <Backdrop />

      <div className="mx-auto w-full max-w-[1600px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {/* ---------- Heading ---------- */}
        <Reveal inView={inView} className="relative">
          <div className="relative mt-2 inline-block max-w-full">
            <h2 className="text-brand-600 relative text-3xl leading-tight font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              WHAT&apos;S SPECIAL ABOUT NUVOGRAM
              <span
                aria-hidden="true"
                className="bg-brand-500 absolute -bottom-2 left-0 h-1 w-full origin-left rounded-full transition-transform duration-[1200ms] ease-out motion-reduce:transition-none"
                style={{
                  transform: inView ? "scaleX(1)" : "scaleX(0)",
                  transitionDelay: "300ms",
                }}
              />
            </h2>
            <span
              aria-hidden="true"
              className="text-brand-500 absolute -bottom-5 left-0 h-[2px] w-20 [background-image:repeating-linear-gradient(to_right,currentColor_0_4px,transparent_4px_8px)] sm:w-24"
            />
            <span
              aria-hidden="true"
              className="border-brand-500/30 absolute -top-6 -right-20 hidden size-20 rounded-full border xl:block 2xl:-right-24 2xl:size-24"
              style={{
                transform: inView ? "scale(1)" : "scale(0.6)",
                opacity: inView ? 1 : 0,
                transition: "all 1000ms cubic-bezier(0.2,0.8,0.2,1) 400ms",
              }}
            >
              <span className="border-brand-500/20 absolute inset-3 rounded-full border" />
              <span className="border-brand-500/15 absolute inset-6 rounded-full border" />
            </span>
          </div>
        </Reveal>

        <Reveal inView={inView} delay={200} className="mt-10">
          <p className="text-muted max-w-2xl text-sm leading-relaxed sm:text-base 2xl:text-lg">
            Sell on Nuvogram in four simple steps: set up your store, list your
            products, receive orders from users and earn on every delivery.
          </p>
        </Reveal>

        {/* ---------- Journey ---------- */}
        <ol
          className="mt-12 grid grid-cols-1 lg:mt-16 lg:grid-cols-4"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {STEPS.map((step, i) => {
            const reached = i <= active;
            const on = i === active;
            const done = i < active; // line to the next step is filled
            const hasNext = i < last;
            const { Icon } = step;

            return (
              <li key={step.title} onMouseEnter={() => setActive(i)}>
                <Reveal
                  inView={inView}
                  delay={300 + i * 140}
                  className="relative flex gap-5 pb-8 lg:flex-col lg:items-center lg:gap-6 lg:px-3 lg:pb-0 lg:text-center"
                >
                  {/* Connector: vertical on mobile */}
                  {hasNext && (
                    <span
                      aria-hidden="true"
                      className="bg-brand-500/15 absolute top-16 bottom-0 left-8 w-px -translate-x-1/2 lg:hidden"
                    >
                      <span
                        className="from-brand-500 to-brand-600 absolute inset-0 origin-top bg-gradient-to-b transition-transform duration-[1200ms] ease-out motion-reduce:transition-none"
                        style={{ transform: `scaleY(${done ? 1 : 0})` }}
                      />
                    </span>
                  )}

                  {/* Connector: horizontal on desktop */}
                  {hasNext && (
                    <span
                      aria-hidden="true"
                      className="bg-brand-500/15 absolute top-8 left-1/2 hidden h-px w-full lg:block"
                    >
                      <span
                        className="from-brand-500 to-brand-600 absolute inset-0 origin-left bg-gradient-to-r transition-transform duration-[1200ms] ease-out motion-reduce:transition-none"
                        style={{ transform: `scaleX(${done ? 1 : 0})` }}
                      />
                      <span
                        className="bg-brand-500 absolute top-1/2 left-0 size-2 -translate-y-1/2 rounded-full shadow-[0_0_10px_var(--brand-500)] transition-[left,opacity] duration-[1200ms] ease-out motion-reduce:transition-none"
                        style={{
                          left: done ? "100%" : "0%",
                          opacity: done && i === active - 1 ? 1 : 0,
                        }}
                      />
                    </span>
                  )}

                  {/* Node */}
                  <div className="relative z-10 size-16 shrink-0">
                    {on && (
                      <span
                        aria-hidden="true"
                        className="bg-brand-500/30 absolute inset-0 animate-ping rounded-full motion-reduce:animate-none"
                      />
                    )}
                    <span
                      className={`relative grid size-16 place-items-center rounded-full border text-2xl font-light transition-all duration-700 motion-reduce:transition-none ${
                        reached
                          ? "from-brand-500 to-brand-600 shadow-brand-500/30 border-transparent bg-gradient-to-br text-white shadow-lg"
                          : "border-brand-500/40 text-muted bg-white"
                      } ${on ? "scale-110" : "scale-100"}`}
                    >
                      {i + 1}
                    </span>
                  </div>

                  {/* Card */}
                  <div
                    className={`relative min-w-0 flex-1 overflow-hidden rounded-2xl border bg-white/80 p-5 text-left backdrop-blur-md transition-all duration-500 motion-reduce:transition-none lg:w-full lg:flex-none lg:p-6 lg:text-center ${
                      on
                        ? "border-brand-500/40 shadow-brand-500/10 shadow-xl lg:-translate-y-2"
                        : "border-brand-500/10 shadow-sm"
                    }`}
                  >
                    <span
                      className={`mb-4 inline-grid size-10 place-items-center rounded-xl transition-colors duration-500 ${
                        on ? "bg-brand-500 text-white" : "bg-brand-500/10 text-brand-600"
                      }`}
                    >
                      <Icon className="size-5" />
                    </span>

                    <h3 className="text-brand-600 text-lg font-semibold tracking-tight 2xl:text-xl">
                      {step.title}
                    </h3>
                    <p className="text-muted mt-2 text-sm leading-relaxed 2xl:text-base">
                      {step.body}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5 lg:justify-center">
                      {step.tags.map((t) => (
                        <span
                          key={t}
                          className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors duration-500 2xl:text-xs ${
                            on
                              ? "border-brand-500/30 bg-brand-500/10 text-brand-600"
                              : "text-muted border-brand-500/10 bg-transparent"
                          }`}
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* progress bar: fills while this step is live */}
                    <span
                      aria-hidden="true"
                      className="bg-brand-500 absolute bottom-0 left-0 h-0.5 w-full origin-left"
                      style={{
                        transform: on ? "scaleX(1)" : "scaleX(0)",
                        transition: on
                          ? `transform ${paused ? 400 : STEP_MS}ms linear`
                          : "transform 300ms ease-out",
                      }}
                    />
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}