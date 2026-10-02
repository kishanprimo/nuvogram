"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { FaCheck, FaLocationArrow } from "react-icons/fa";

type Feature = {
  id: string;
  name: string;
  img: string;
  title: string;
  body: string;
  points: string[];
};

/* Order = clockwise from the top of the circle */
const FEATURES: Feature[] = [
  {
    id: "story",
    name: "Story",
    img: "/images/story-1.png",
    title: "Story",
    body: "Share quick photos and videos as stories and keep your friends updated with what you are up to.",
    points: ["Photos & Videos", "Quick Sharing", "Friends Feed"],
  },
  {
    id: "reels",
    name: "Reels",
    img: "/images/Reels.png",
    title: "Reels",
    body: "Create and watch short videos. Add captions, hashtags, tag other users and pin a location.",
    points: ["Short Videos", "Hashtags", "User Tagging"],
  },
  {
    id: "video-conference",
    name: "Video Conference",
    img: "/images/Video-Conference.png",
    title: "Video Conference",
    body: "Bring several people into one video meeting for group catch-ups with friends, family or colleagues.",
    points: ["Group Meetings", "Multi-user Video", "Easy Invites"],
  },
  {
    id: "video-call",
    name: "Video Call",
    img: "/images/Video-Call.png",
    title: "Video Call",
    body: "Talk face to face with the people you follow, straight from your private chat.",
    points: ["One-to-one Video", "From Chat", "HD Calling"],
  },
  {
    id: "live-streaming",
    name: "Live Streaming",
    img: "/images/Live-Streaming.png",
    title: "Live Streaming",
    body: "Go live and broadcast to your followers in real time.",
    points: ["Go Live", "Real-time Audience", "Share Moments"],
  },
  {
    id: "advertisement",
    name: "Advertisement",
    img: "/images/Advertisement.png",
    title: "Advertisement",
    body: "Promote your products and reach more users on Nuvogram.",
    points: ["Promote Products", "Reach More Users", "In-app Ads"],
  },
  {
    id: "face-lock",
    name: "Face lock",
    img: "/images/Face-lock.png",
    title: "Face Lock",
    body: "Protect your account with face recognition so only you can open the app.",
    points: ["Face Recognition", "Private Access", "Secure Login"],
  },
  {
    id: "audio-call",
    name: "Audio Call",
    img: "/images/Audio-Call.png",
    title: "Audio Call",
    body: "Make clear voice calls to friends and family without leaving the app.",
    points: ["Voice Calls", "Clear Audio", "From Chat"],
  },
];

const HUB_IMG = "/images/Frame.png";
const R = 37; // orbit radius, % of the stage
const N = FEATURES.length;

const STEP_MS = 3200; // how long each feature stays in the centre during the tour
const INTRO_MS = 2600; // how long the "all features" overview shows between rounds
const RESUME_MS = 8000; // tour carries on this long after the last click

/* All colors come from color.css (--nuvo-*). No hex in this file. */
type Tone = "sky" | "blue" | "navy";
const tone = (t: Tone, a = 1) => `rgb(var(--nuvo-${t}-rgb) / ${a})`;
const EASE = "cubic-bezier(0.2,0.8,0.2,1)";
const pad = (n: number) => String(n).padStart(2, "0");

  

  

/** Fires once when the element scrolls into view */
function useInView<T extends HTMLElement>(threshold = 0.15) {
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
      {/* slowly panning dot grid, faded at the edges */}
      <div
        className="more-anim absolute inset-0"
        style={{
          color: tone("blue", 0.22),
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          WebkitMaskImage: "radial-gradient(ellipse at center, black, transparent 72%)",
          maskImage: "radial-gradient(ellipse at center, black, transparent 72%)",
          animation: "more-pan 30s linear infinite",
        }}
      />

  
    </div>
  );
}

export default function MoreFeatures() {
  const { ref, inView } = useInView<HTMLElement>(0.15);
  const sectionRef = useRef<HTMLElement | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [paused, setPaused] = useState(false); // hover / focus
  const [userPaused, setUserPaused] = useState(false); // user took over or pressed pause
  const [reduce, setReduce] = useState(false);
  const [nudged, setNudged] = useState(false); // has auto-scrolled once

  const hasSel = selected !== null;
  const current = hasSel ? FEATURES[selected] : null;
  const running = inView && !paused && !userPaused && !reduce;
  const stepDur = hasSel ? STEP_MS : INTRO_MS;

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  /* Gentle auto-scroll when the user has scrolled near the section so the
     orbit stage lands in view. Only fires once, and only when we're already
     reasonably close (so it never feels like the page hijacks the scroll). */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || nudged) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        // Only auto-scroll if the section top is between -10% and +40% of the viewport
        const top = el.getBoundingClientRect().top;
        const vh = window.innerHeight;
        if (top > -vh * 0.1 && top < vh * 0.4) {
          setNudged(true);
          const target =
            el.getBoundingClientRect().top + window.scrollY - vh * 0.08;
          window.scrollTo({ top: target, behavior: "smooth" });
        }
      },
      { threshold: 0.35, rootMargin: "0px 0px -20% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [nudged]);

  /* Auto tour: overview -> each feature in turn -> overview -> repeat */
  useEffect(() => {
    if (!running) return;
    const id = setTimeout(
      () =>
        setSelected((s) => (s === null ? 0 : s >= N - 1 ? null : s + 1)),
      stepDur
    );
    return () => clearTimeout(id);
  }, [running, selected, stepDur]);

  /* A manual choice pauses the tour briefly, then it carries on by itself */
  const pick = (i: number | null) => {
    setUserPaused(true);
    setSelected(i);
  };

  useEffect(() => {
    if (!userPaused) return;
    const id = setTimeout(() => setUserPaused(false), RESUME_MS);
    return () => clearTimeout(id);
  }, [userPaused, selected]);

  /* Where each badge sits: on the orbit, or in the centre when selected */
  const others = FEATURES.map((_, i) => i).filter((i) => i !== selected);
  const place = (i: number) => {
    if (!inView) return { x: 50, y: 50, s: 0 };
    if (i === selected) return { x: 50, y: 50, s: 1.6 };
    const slots = hasSel ? N - 1 : N;
    const k = hasSel ? others.indexOf(i) : i;
    const a = ((-90 + (360 / slots) * k) * Math.PI) / 180;
    return { x: 50 + R * Math.cos(a), y: 50 + R * Math.sin(a), s: 1 };
  };

  return (
    <section
      ref={(el) => {
        if (ref) ref.current = el;
        sectionRef.current = el;
      }}
      id="special-features"
      className="text-foreground relative isolate w-full min-w-0 shrink-0 overflow-hidden"
    >
      <style>{`
        @keyframes more-spin { to { transform: rotate(360deg); } }
        @keyframes more-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        @keyframes more-ripple { 0% { transform: translate(-50%,-50%) scale(.5); opacity: .55; } 100% { transform: translate(-50%,-50%) scale(2.2); opacity: 0; } }
        @keyframes more-rise { from { opacity: 0; transform: translateY(16px); filter: blur(6px); } to { opacity: 1; transform: none; filter: none; } }
        @keyframes more-pop { 0% { opacity: 0; transform: scale(.4) rotate(-12deg); } 70% { opacity: 1; transform: scale(1.1) rotate(2deg); } 100% { opacity: 1; transform: none; } }
        @keyframes more-drift { 0%,100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(40px,28px,0) scale(1.1); } }
        @keyframes more-pan { to { background-position: 24px 24px; } }
        @keyframes more-floatup { 0% { transform: translateY(0) rotate(0deg); opacity: 0; } 15% { opacity: .5; } 85% { opacity: .5; } 100% { transform: translateY(-620px) rotate(24deg); opacity: 0; } }
        @keyframes more-ping { 0% { transform: scale(.92); opacity: .6; } 75%,100% { transform: scale(1.4); opacity: 0; } }
        @keyframes more-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(420%); } }
        @keyframes more-progress { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes more-bob { 0%,100% { transform: translate(0,0); } 50% { transform: translate(4px,-6px); } }
        @media (prefers-reduced-motion: reduce) { .more-anim { animation: none !important; } }
      `}</style>

      <Backdrop />

      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20 2xl:max-w-[96rem]">
        {/* ---------- Heading (same style as FEATURES) ---------- */}
        <Reveal inView={inView} className="relative">
          <p className="text-foreground text-xl leading-tight font-bold tracking-tight sm:text-2xl md:text-3xl 2xl:text-4xl">
            What Makes This App Special
          </p>
          <div className="relative mt-2 inline-block">
            <h2
              className="relative text-4xl leading-none font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
              style={{ color: "var(--nuvo-blue)" }}
            >
              FEATURES
              <span
                aria-hidden="true"
                className="absolute -bottom-2 left-0 h-1 w-full origin-left rounded-full transition-transform duration-[1200ms] ease-out motion-reduce:transition-none"
                style={{
                  background: "var(--nuvo-gradient)",
                  transform: inView ? "scaleX(1)" : "scaleX(0)",
                  transitionDelay: "300ms",
                }}
              />
            </h2>
            <span
              aria-hidden="true"
              className="absolute -bottom-5 left-0 h-[2px] w-20 [background-image:repeating-linear-gradient(to_right,currentColor_0_4px,transparent_4px_8px)] sm:w-24"
              style={{ color: "var(--nuvo-sky)" }}
            />
         
          </div>
        </Reveal>

        <div
          className=" mt-6 sm:mt-0 grid items-center gap-10  lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-14 2xl:gap-24"
          onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
          onPointerLeave={() => setPaused(false)}
          onFocusCapture={(e) =>
            (e.target as HTMLElement).matches(":focus-visible") && setPaused(true)
          }
          onBlurCapture={() => setPaused(false)}
        >
          {/* ---------- Detail panel ---------- */}
          <Reveal inView={inView} delay={300} className="order-2 lg:order-1">
            <div
              className="relative flex min-h-[22rem] w-full flex-col overflow-hidden rounded-2xl border p-6 sm:min-h-[24rem] sm:p-8"
              style={{
                borderColor: hasSel ? tone("sky", 0.4) : tone("blue", 0.12),
                background:
                  "color-mix(in srgb, var(--surface-raised) 85%, transparent)",
                boxShadow: hasSel
                  ? `0 24px 40px -24px ${tone("sky", 0.5)}`
                  : "0 1px 2px rgb(15 23 42 / 0.05)",
                transition: "border-color 500ms, box-shadow 500ms",
              }}
            >
              {/* drifting glow in the corner */}
              <div
                aria-hidden="true"
                className="more-anim pointer-events-none absolute -top-16 -right-16 size-56 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${tone("sky", 0.35)}, transparent 70%)`,
                  animation: "more-drift 14s ease-in-out infinite",
                }}
              />

              {/* light that keeps sweeping along the top edge */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-[2px] overflow-hidden"
              >
                <span
                  className="more-anim absolute inset-y-0 left-0 w-1/4"
                  style={{
                    background: "var(--nuvo-gradient)",
                    animation: "more-sweep 3.2s ease-in-out infinite",
                  }}
                />
              </span>

          

              <div className="relative flex-1">
                {/* top row: position + tour control */}
                <div className="flex items-center justify-between gap-3">
                  <span
                    className="text-xs font-semibold tracking-wide"
                    style={{ color: "var(--nuvo-blue)" }}
                  >
                    {hasSel ? `Feature ${selected + 1} of ${N}` : `${N} features`}
                  </span>
                </div>

                {/* content swaps with a rise-in each time the feature changes */}
                <div
                  key={current?.id ?? "intro"}
                  className="more-anim mt-5"
                  style={{
                    animation: inView ? `more-rise 700ms ${EASE} both` : "none",
                  }}
                >
                  <div className="flex items-center gap-4">
                    {current && (
                      <span className="relative grid size-14 shrink-0 place-items-center sm:size-16">
                        <span
                          aria-hidden="true"
                          className="more-anim absolute inset-0 rounded-full border-2"
                          style={{
                            borderColor: tone("sky", 0.6),
                            opacity: 0,
                            animation: "more-ping 2.4s ease-out infinite",
                          }}
                        />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={current.img}
                          alt=""
                          aria-hidden="true"
                          draggable={false}
                          className="more-anim relative size-full object-contain select-none"
                          style={{ animation: `more-pop 700ms ${EASE} both` }}
                        />
                      </span>
                    )}
                    <h3
                      className="text-2xl leading-tight font-bold tracking-tight sm:text-3xl 2xl:text-4xl"
                      style={{ color: "var(--nuvo-navy)" }}
                    >
                      {current ? current.title : "Everything in one app"}
                    </h3>
                  </div>

                  <p className="text-muted mt-3 line-clamp-4 text-sm leading-relaxed sm:text-base 2xl:text-lg">
                    {current
                      ? current.body
                      : "Connect, share and shop with friends. Tap any feature around the circle to see how it works."}
                  </p>

                  {current ? (
                    <ul className="mt-5 flex flex-col gap-3">
                      {current.points.map((p, i) => (
                        <li
                          key={p}
                          className="more-anim flex items-center gap-3 text-sm font-semibold sm:text-base"
                          style={{
                            color: "var(--nuvo-navy)",
                            animation: `more-rise 600ms ${EASE} ${250 + i * 110}ms backwards`,
                          }}
                        >
                          <span
                            aria-hidden="true"
                            className="grid size-5 shrink-0 place-items-center rounded-full"
                            style={{
                              background: tone("sky", 0.15),
                              color: tone("blue"),
                            }}
                          >
                            <FaCheck className="size-3" />
                          </span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div
                      className="mt-5 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
                      style={{
                        borderColor: tone("sky", 0.4),
                        background: tone("sky", 0.12),
                        color: "var(--nuvo-blue)",
                      }}
                    >
                      <FaLocationArrow
                        className="more-anim size-3.5"
                        style={{ animation: "more-bob 1.6s ease-in-out infinite" }}
                        aria-hidden="true"
                      />
                      Tap a feature to explore
                    </div>
                  )}
                </div>
              </div>

              {/* progress bar: fills while the tour is on this step */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-[3px]"
                style={{ background: tone("blue", 0.1) }}
              >
                <span
                  key={`${selected}-${running}`}
                  className="more-anim absolute inset-0 origin-left"
                  style={{
                    background: "var(--nuvo-gradient)",
                    transform: running ? undefined : "scaleX(0)",
                    animation: running
                      ? `more-progress ${stepDur}ms linear both`
                      : "none",
                  }}
                />
              </span>
            </div>
          </Reveal>

          {/* ---------- Orbit stage ---------- */}
          <Reveal inView={inView} delay={200} y={40} className="order-1 lg:order-2">
            <div className="relative mx-auto aspect-square w-full max-w-[34rem] lg:max-w-none">
              {/* soft glow that opens behind the centred feature */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-1/2 size-[50%] rounded-full"
                style={{
                  background: `radial-gradient(circle, ${tone("sky", 0.3)}, transparent 70%)`,
                  opacity: hasSel ? 1 : 0,
                  transform: `translate(-50%,-50%) scale(${hasSel ? 1.3 : 0.5})`,
                  transition: `opacity 800ms, transform 900ms ${EASE}`,
                }}
              />

              {/* dashed rings, slowly turning in opposite directions */}
              <svg
                aria-hidden="true"
                viewBox="0 0 100 100"
                className="pointer-events-none absolute inset-0 size-full overflow-visible"
                fill="none"
              >
                {[
                  { r: 37, dur: 120, rev: false, dot: 0 },
                  { r: 27, dur: 90, rev: true, dot: 140 },
                  { r: 17, dur: 70, rev: false, dot: 250 },
                ].map((ring) => (
                  <g
                    key={ring.r}
                    className="more-anim"
                    style={{
                      transformOrigin: "50% 50%",
                      transformBox: "view-box",
                      animation: `more-spin ${ring.dur}s linear infinite ${
                        ring.rev ? "reverse" : "normal"
                      }`,
                    }}
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r={ring.r}
                      stroke={tone("blue", 0.28)}
                      strokeWidth="0.25"
                      strokeDasharray="0.7 1.3"
                    />
                    <circle
                      cx={50 + ring.r * Math.cos((ring.dot * Math.PI) / 180)}
                      cy={50 + ring.r * Math.sin((ring.dot * Math.PI) / 180)}
                      r="1.3"
                      fill={tone("sky", 0.35)}
                    />
                  </g>
                ))}
              </svg>

              {/* ripple each time a feature lands in the centre */}
              {hasSel && (
                <span
                  key={selected}
                  aria-hidden="true"
                  className="more-anim pointer-events-none absolute top-1/2 left-1/2 size-[40%] rounded-full border-2 [animation:more-ripple_1.3s_ease-out_both]"
                  style={{ borderColor: tone("sky", 0.6) }}
                />
              )}

              {/* centre hub (idle state) */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={HUB_IMG}
                alt=""
                aria-hidden="true"
                draggable={false}
                className="more-anim pointer-events-none absolute top-1/2 left-1/2 w-[24%] select-none [animation:more-float_6s_ease-in-out_infinite]"
                style={{
                  opacity: hasSel || !inView ? 0 : 1,
                  translate: "-50% -50%",
                  scale: hasSel ? 0.6 : 1,
                  transition: `opacity 600ms, scale 800ms ${EASE}`,
                }}
              />

              {/* "tap me" hint under the hub while nothing is selected */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-[68%] left-1/2 z-[5] -translate-x-1/2"
                style={{
                  opacity: hasSel || !inView ? 0 : 1,
                  transition: "opacity 500ms",
                }}
              >
                <span
                  className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-semibold whitespace-nowrap sm:text-xs"
                  style={{
                    borderColor: tone("sky", 0.5),
                    background: tone("sky", 0.12),
                    color: "var(--nuvo-blue)",
                  }}
                >
                  <FaLocationArrow
                    className="more-anim size-3.5"
                    style={{ animation: "more-bob 1.6s ease-in-out infinite" }}
                    aria-hidden="true"
                  />
                  Tap any feature
                </span>
              </div>

              {/* feature badges */}
              {FEATURES.map((f, i) => {
                const p = place(i);
                const isSel = i === selected;
                return (
                  <button
                    key={f.id}
                    type="button"
                    aria-label={f.name}
                    aria-pressed={isSel}
                    onClick={() => pick(isSel ? null : i)}
                    className="group absolute w-[18%] cursor-pointer focus-visible:outline-none sm:w-[15%]"
                    style={{
                      left: `${p.x}%`,
                      top: `${p.y}%`,
                      transform: `translate(-50%,-50%) scale(${p.s})`,
                      opacity: p.s ? 1 : 0,
                      zIndex: isSel ? 20 : 10,
                      transition: `left 900ms ${EASE}, top 900ms ${EASE}, transform 900ms ${EASE}, opacity 600ms`,
                      transitionDelay: `${i * 40}ms`,
                    }}
                  >
                    {/* pulsing ring: tells people the badge is clickable */}
                    <span
                      aria-hidden="true"
                      className="more-anim pointer-events-none absolute inset-0 rounded-full border-2"
                      style={{
                        borderColor: tone("sky", 0.7),
                        opacity: 0,
                        animation:
                          isSel || !inView
                            ? "none"
                            : `more-ping 2.6s ease-out ${i * 0.33}s infinite`,
                      }}
                    />

                    <span
                      className={`more-anim block rounded-full transition-transform duration-300 group-hover:scale-110 group-focus-visible:ring-2 group-focus-visible:ring-[var(--nuvo-sky)] group-focus-visible:ring-offset-2 ${
                        isSel ? "" : "[animation:more-float_5s_ease-in-out_infinite]"
                      }`}
                      style={{
                        animationDelay: `${i * -0.7}s`,
                        filter: `drop-shadow(0 10px 14px ${tone("blue", 0.2)})`,
                      }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={f.img}
                        alt={f.name}
                        draggable={false}
                        loading="lazy"
                        className="block h-auto w-full select-none"
                      />
                    </span>

                    {/* name under each badge */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute top-full left-1/2 mt-1 -translate-x-1/2 text-[9px] leading-tight font-semibold whitespace-nowrap transition-colors duration-300 group-hover:text-[color:var(--nuvo-sky)] sm:text-[11px] lg:text-xs"
                      style={{
                        color: "var(--nuvo-navy)",
                        opacity: isSel ? 0 : 1,
                        transition: "opacity 400ms, color 300ms",
                      }}
                    >
                      {f.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}