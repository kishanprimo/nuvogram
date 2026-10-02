"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";

/* Images live in /public/images. If a file isn't .png, change it here only. */
const img = (name: string) => `/images/${name}.png`;

const TABS = [
  {
    label: "Social Post",
    img: img("Social-post"),
    text: "Share photos and videos, follow friends and keep up with everything in your feed.",
  },
  {
    label: "Products & Orders",
    img: img("product_order"),
    text: "List your products, get orders from users and track every delivery inside the app.",
  },
  {
    label: "Wallet",
    img: img("wallet-1"),
    text: "Top up your wallet and pay for orders without leaving Nuvogram.",
  },
  {
    label: "Audio/Video Call",
    img: img("video_call"),
    text: "Call the people you follow with clear voice or face-to-face video, straight from chat.",
  },
  {
    label: "Face Recognition",
    img: img("face_id"),
    text: "Lock your account with your face so only you can open the app.",
  },
];

const N = TABS.length;
const STEP_MS = 4500; // time each tab stays active
const EASE = "cubic-bezier(0.2,0.8,0.2,1)";

/* Colors come from color.css (--nuvo-*). No hex in this file. */
const tone = (t: "sky" | "blue" | "navy", a = 1) => `rgb(var(--nuvo-${t}-rgb) / ${a})`;

/* shortest signed distance on the loop: -2..2 for 5 items */
const circ = (i: number, a: number) => {
  let d = (((i - a) % N) + N) % N;
  if (d > N / 2) d -= N;
  return d;
};

export default function Explore() {
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const swipe = useRef<number | null>(null);

  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState(false); // has entered the screen once
  const [visible, setVisible] = useState(false); // on screen right now
  const [hover, setHover] = useState(false);
  const [reduce, setReduce] = useState(false);

  const running = visible;
  const go = (i: number) => setActive(((i % N) + N) % N);

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting);
        if (e.isIntersecting) setSeen(true);
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* auto-advance; clicking a tab or card changes `active`, which restarts the timer */
  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => setActive((a) => (a + 1) % N), STEP_MS);
    return () => clearTimeout(id);
  }, [running, active]);

  /* keep the active tab centred in the scrollable tab row (phones) */
  useEffect(() => {
    const r = railRef.current;
    const t = tabRefs.current[active];
    if (r && t)
      r.scrollTo({
        left: t.offsetLeft - (r.clientWidth - t.clientWidth) / 2,
        behavior: "smooth",
      });
  }, [active]);

  const rise = (delay: number): CSSProperties => ({
    opacity: seen ? 1 : 0,
    transform: seen ? "none" : "translateY(24px)",
    transition: `opacity 900ms ${EASE} ${delay}ms, transform 900ms ${EASE} ${delay}ms`,
  });

  return (
    <section
      ref={sectionRef}
      id="explore"
      className="text-foreground relative isolate w-full overflow-hidden"
    >
      <style>{`
        .ex { --cw: min(78vw, 440px); --gap: 24px; --step: calc(var(--cw) * .89 + var(--gap)); }
        @media (min-width: 768px) { .ex { --cw: min(56vw, 780px); --gap: 40px; } }
        @media (min-width: 1536px) { .ex { --cw: min(50vw, 920px); --gap: 56px; } }
        @keyframes ex-rise { from { opacity: 0; transform: translateY(14px); filter: blur(6px); } to { opacity: 1; transform: none; filter: none; } }
        @keyframes ex-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes ex-spin { to { transform: rotate(360deg); } }
        @keyframes ex-ping { 0% { transform: scale(.6); opacity: .5; } 100% { transform: scale(1.15); opacity: 0; } }
 
 
        @media (prefers-reduced-motion: reduce) { .ex-anim { animation: none !important; } }
      `}</style>

 

      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20 2xl:max-w-[96rem]">
        {/* ---------- Heading ---------- */}
        <div className="text-center" style={rise(0)}>
          <p className="text-foreground text-2xl leading-tight font-bold tracking-tight sm:text-4xl md:text-5xl">
            What&apos;s Special About
          </p>
          <h2
            className="relative mt-1 inline-block text-5xl leading-none font-extrabold tracking-tight sm:text-7xl md:text-8xl"
            style={{ color: "var(--nuvo-sky)" }}
          >
            NUVOGRAM
            <span
              aria-hidden="true"
              className="absolute -bottom-2 left-0 h-1 w-full origin-left rounded-full transition-transform duration-[1200ms] ease-out motion-reduce:transition-none"
              style={{
                background: "var(--nuvo-gradient)",
                transform: seen ? "scaleX(1)" : "scaleX(0)",
                transitionDelay: "300ms",
              }}
            />
          </h2>
        </div>

        {/* ---------- Tabs (with live progress underline) ---------- */}
        <div
          ref={railRef}
          role="tablist"
          aria-label="Nuvogram features"
          className="relative mt-10 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          style={rise(150)}
        >
          <div className="mx-auto flex w-max gap-x-8 px-2 sm:gap-x-12 lg:gap-x-16">
            {TABS.map((t, i) => {
              const on = i === active;
              return (
                <button
                  key={t.label}
                  ref={(el) => {
                    tabRefs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={on}
                  onClick={() => go(i)}
                  className={`relative shrink-0 cursor-pointer pb-3 text-base whitespace-nowrap transition-colors duration-300 sm:text-xl lg:text-2xl ${
                    on ? "font-bold" : "text-muted font-medium hover:text-[color:var(--nuvo-blue)]"
                  }`}
                  style={on ? { color: "var(--nuvo-navy)" } : undefined}
                >
                  {t.label}
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-[3px] overflow-hidden rounded-full"
                    style={{ background: on ? tone("blue", 0.15) : "transparent" }}
                  >
                    {on && (
                      <span
                        key={`${i}-${running}`}
                        className="ex-anim absolute inset-0 origin-left rounded-full"
                        style={{
                          background: "var(--nuvo-gradient)",
                          transform: running ? undefined : "scaleX(1)",
                          animation: running ? `ex-progress ${STEP_MS}ms linear both` : "none",
                        }}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ---------- Carousel ---------- */}
        <div
          className="ex relative mt-10 [perspective:1600px] [touch-action:pan-y] sm:mt-12"
          style={{ height: "calc(var(--cw) * 0.69)", ...rise(300) }}
          onPointerDown={(e) => (swipe.current = e.clientX)}
          onPointerUp={(e) => {
            if (swipe.current === null) return;
            const dx = e.clientX - swipe.current;
            swipe.current = null;
            if (Math.abs(dx) > 50) go(active + (dx < 0 ? 1 : -1));
          }}
        >
          {/* halo behind the active card: glow, slow dashed ring, ping on change */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 aspect-square h-[125%] -translate-x-1/2 -translate-y-1/2"
          >
            <div
              className="absolute inset-[12%] rounded-full"
              style={{ background: `radial-gradient(circle, ${tone("sky", 0.28)}, transparent 70%)` }}
            />
            <div
              className="ex-anim absolute inset-[6%] rounded-full border border-dashed"
              style={{ borderColor: tone("blue", 0.28), animation: "ex-spin 90s linear infinite" }}
            />
            <span
              key={active}
              className="ex-anim absolute inset-[18%] rounded-full border-2"
              style={{ borderColor: tone("sky", 0.55), animation: "ex-ping 1.4s ease-out both" }}
            />
          </div>

          {TABS.map((t, i) => {
            const d = circ(i, active);
            const a = Math.abs(d);
            return (
              <div
                key={t.label}
                aria-hidden={a > 0}
                onClick={() => a > 0 && go(i)}
                className="absolute top-0 left-1/2 aspect-[16/11] w-[var(--cw)] will-change-transform"
                style={{
                  transform: `translate3d(calc(-50% + ${d} * var(--step)),0,0) rotateY(${d * 10}deg) scale(${a ? 0.78 : 1})`,
                  opacity: a === 0 ? 1 : a === 1 ? 0.5 : 0,
                  zIndex: 10 - a,
                  pointerEvents: a > 1 ? "none" : "auto",
                  cursor: a === 1 ? "pointer" : "default",
                  transition: `transform 800ms ${EASE}, opacity 600ms`,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img
                  src={t.img}
                  alt={t.label}
                  draggable={false}
                  loading="lazy"
                  className="h-full w-full object-contain select-none"
                  style={{
                    filter: `drop-shadow(0 24px 30px ${tone("blue", 0.22)})`,
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* ---------- Caption ---------- */}
        <div
          key={active}
          className="ex-anim mx-auto mt-8 max-w-xl text-center sm:mt-10"
          style={{ animation: seen ? `ex-rise 700ms ${EASE} both` : "none" }}
        >
          <h3
            className="text-xl font-bold tracking-tight capitalize sm:text-2xl 2xl:text-3xl"
            style={{ color: "var(--nuvo-navy)" }}
          >
            {TABS[active].label}
          </h3>
          <p className="text-muted mt-2 text-sm leading-relaxed sm:text-base 2xl:text-lg">
            {TABS[active].text}
          </p>
        </div>
      </div>
    </section>
  );
}