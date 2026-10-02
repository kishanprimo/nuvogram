"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import ButtonAnimation from "../common/ButtonAnimation";

type Feature = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  tags: string[];
  imageSrc: string;
  imageAlt: string;
};

const FEATURES: Feature[] = [
  {
    id: "home-screen",
    eyebrow: "Home Screen",
    title: "Post Feeds in Home",
    body:
      'The "post feed" on Nuvogram refers to the main grid of photos and videos that appear on a user\'s profile. When you upload a photo or video to Instagram and share it with your followers, it becomes part of your post feed. Each post typically includes an image or video, a caption, and may also include hashtags, tags of other users, and a location.',
    tags: ["Photo & Video Grid", "Captions & Hashtags", "User Tagging", "Location Pins"],
    imageSrc: "/images/post_feeds.png",
    imageAlt: "Nuvogram Home screen showing the post feed",
  },
  {
    id: "profile-screen",
    eyebrow: "Profile Screen",
    title: "Profile post, reels, threads",
    body:
      "This is the traditional type of content that appears on your Nuvogram profile grid. Profile posts can include photos or videos (up to 60 seconds long), along with captions, hashtags, tags of other users, and location tags, same is for reels the short video is termed as reels, and in thread you can post image with text and single text post.",
    tags: ["Photos & Videos", "Reels", "Threads", "Location Tags"],
    imageSrc: "/images/profile.png",
    imageAlt: "Nuvogram Profile screen",
  },
  {
    id: "chat-screen",
    eyebrow: "Chat Screen",
    title: "Chat / Messages",
    body:
      "Messaging on Nuvogram is a way to have private conversations with other users, separate from your public profile and posts. It's a key feature for staying connected with friends, family, colleagues, and other users on the platform.",
    tags: ["Private Chats", "Unread Badges", "Voice Notes", "Emoji & Attachments"],
    imageSrc: "/images/Message.png",
    imageAlt: "Nuvogram Chat and messages screens",
  },
  {
    id: "follow-screen",
    eyebrow: "Explore follow screen",
    title: "Follow/Following",
    body:
      "Following someone on Nuvogram is a fundamental aspect of engagement and interaction on the platform. It allows users to curate their feed by choosing to see content from accounts they are interested in, whether they are friends, influencers, brands, or organizations.",
    tags: ["Followers", "Following", "Quick Follow", "Search People"],
    imageSrc: "/images/Follow_following.png",
    imageAlt: "Nuvogram Followers and Following screens",
  },
];

const AUTOPLAY_MS = 6000;

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
 
/** Content swap: blur-rise in, quick fade out */
function Swap({
  active,
  delay = 0,
  y = 24,
  className = "",
  children,
}: {
  active: boolean;
  delay?: number;
  y?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`transition-[opacity,transform,filter] ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none ${className}`}
      style={{
        opacity: active ? 1 : 0,
        transform: active ? "translateY(0)" : `translateY(${y}px)`,
        filter: active ? "blur(0px)" : "blur(6px)",
        transitionDuration: active ? "800ms" : "300ms",
        transitionDelay: active ? `${delay}ms` : "0ms",
      }}
    >
      {children}
    </div>
  );
}

function paintBars(bars: (HTMLSpanElement | null)[], a: number, p: number) {
  bars.forEach((b, i) => {
    if (b) b.style.transform = `scaleX(${i < a ? 1 : i === a ? p : 0})`;
  });
}

function FeatureCarousel({
  features,
  inView,
}: {
  features: Feature[];
  inView: boolean;
}) {
  const baseDelay = 200;
  const count = features.length;

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const progress = useRef(0);
  const bars = useRef<(HTMLSpanElement | null)[]>([]);

  const go = (i: number) => {
    progress.current = 0;
    setActive(i);
  };
  const next = () => go((active + 1) % count);
  const prev = () => go((active - 1 + count) % count);

  useEffect(() => {
    paintBars(bars.current, active, progress.current);
  }, [active]);

  useEffect(() => {
    if (
      !inView ||
      paused ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      progress.current += (now - last) / AUTOPLAY_MS;
      last = now;
      if (progress.current >= 1) {
        progress.current = 0;
        setActive((active + 1) % count);
        return;
      }
      paintBars(bars.current, active, progress.current);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, paused, active, count]);

  /* Interactive Mouse Hover Tilt Effect (unchanged) */
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handleTiltMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setTilt({ x, y });
  };
  const handleTiltLeave = () => setTilt({ x: 0, y: 0 });

  const [cur, setCur] = useState({
    x: 0,
    y: 0,
    side: "next" as "next" | "prev",
    show: false,
  });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const overControl = !!(e.target as HTMLElement).closest("a,button");
    setCur({
      x: px,
      y: e.clientY - rect.top,
      side: px < rect.width / 2 ? "prev" : "next",
      show: !overControl,
    });
  };
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("a,button")) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (e.clientX - rect.left < rect.width / 2) prev();
    else next();
  };

  return (
    <div
      className="relative grid items-center gap-8 hover:cursor-none sm:gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20 2xl:gap-28 [&_a]:cursor-pointer [&_button]:cursor-pointer"
      onMouseEnter={() => setPaused(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        setPaused(false);
        setCur((c) => ({ ...c, show: false }));
      }}
      onClick={handleClick}
    >
      {/* ---- Artwork ---- */}
      <Reveal
        inView={inView}
        delay={baseDelay}
        y={40}
        className="relative order-1 lg:order-1"
      >
        <div
          className="relative mx-auto w-full max-w-md sm:max-w-lg lg:max-w-none"
          onMouseMove={handleTiltMove}
          onMouseLeave={handleTiltLeave}
        >
          {/* Dashed orbit ellipse */}
          <svg
            aria-hidden="true"
            viewBox="0 0 400 400"
            preserveAspectRatio="xMidYMid meet"
            className="text-brand-500/40 pointer-events-none absolute inset-0 size-full"
            fill="none"
          >
            <ellipse
              cx="200"
              cy="200"
              rx="150"
              ry="180"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="2 8"
              className="features-orbit-line"
              style={{
                strokeDashoffset: inView ? 0 : 600,
                transition: "stroke-dashoffset 1600ms ease-out 400ms",
              }}
            />
          </svg>

          {/* Corner concentric rings */}
          <div
            aria-hidden="true"
            className="text-brand-500/30 pointer-events-none absolute -top-4 right-2 size-16 sm:right-6 sm:size-20 lg:size-24"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "scale(1)" : "scale(0.7)",
              transition: "all 1200ms cubic-bezier(0.2,0.8,0.2,1) 500ms",
            }}
          >
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor">
              <circle cx="50" cy="50" r="46" strokeWidth="1" strokeDasharray="2 6" />
              <circle cx="50" cy="50" r="30" strokeWidth="1" strokeDasharray="2 6" />
              <circle cx="50" cy="50" r="14" strokeWidth="1" strokeDasharray="2 6" />
            </svg>
          </div>

          {/* Phone tilt wrapper (unchanged) — images stack inside */}
          <div
            className="relative will-change-transform transition-transform duration-200 ease-out"
            style={{
              transform: inView
                ? `perspective(1200px) rotateY(${-4 + tilt.x}deg) rotateX(${2 + tilt.y}deg)`
                : "perspective(1200px) rotateY(-14deg) rotateX(6deg)",
            }}
          >
            <div className="grid items-center">
              {features.map((f, i) => {
                const isActive = i === active;
                const dir = Math.sign(i - active) || 1;
                return (
                  <div
                    key={f.id}
                    aria-hidden={!isActive}
                    className="transition-[opacity,transform,filter] duration-[900ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none"
                    style={{
                      gridArea: "1 / 1",
                      opacity: isActive ? 1 : 0,
                      transform: isActive
                        ? "translateX(0) scale(1)"
                        : `translateX(${dir * 56}px) scale(0.9)`,
                      filter: isActive ? "blur(0px)" : "blur(10px)",
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={f.imageSrc}
                      alt={f.imageAlt}
                      loading={i === 0 ? "lazy" : "eager"}
                      draggable={false}
                      className="mx-auto block h-auto w-full max-w-68 select-none drop-shadow-2xl sm:max-w-[22rem] md:max-w-[26rem] lg:max-w-[28rem] xl:max-w-136 2xl:max-w-[42rem]"
                    />
                  </div>
                );
              })}
                    </div>
          </div>

      

      
          {/* Dotted pattern bottom-right */}
          <div
            aria-hidden="true"
            className="features-dots text-brand-500/40 pointer-events-none absolute -right-2 -bottom-2 size-14 sm:right-0 sm:bottom-0 sm:size-20"
            style={{
              opacity: inView ? 1 : 0,
              transition: "opacity 900ms ease-out 700ms",
            }}
          />
        </div>
      </Reveal>

      {/* ---- Copy Section ---- */}
      <div className="order-2 w-full max-w-xl lg:order-2 2xl:max-w-2xl">
        <Reveal inView={inView} delay={baseDelay + 120}>
          <div className="relative grid">
            {features.map((f, i) => {
              const on = i === active;
              return (
                <div
                  key={f.id}
                  aria-hidden={!on}
                  className={`lg:[grid-area:1/1] ${
                    on
                      ? ""
                      : "pointer-events-none max-lg:absolute max-lg:inset-x-0 max-lg:top-0"
                  }`}
                >
                  <Swap active={on} delay={0}>
                    <p className="text-foreground text-2xl leading-tight font-bold tracking-tight sm:text-3xl md:text-4xl 2xl:text-5xl">
                      {f.eyebrow}
                    </p>
                  </Swap>

                  <Swap active={on} delay={100} className="mt-1">
                    <h3 className="text-brand-600 relative inline-block text-3xl leading-tight font-bold tracking-tight sm:text-4xl md:text-5xl 2xl:text-6xl">
                      {f.title}
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 220 12"
                        preserveAspectRatio="none"
                        className="text-brand-500 absolute -bottom-3 left-0 h-2.5 w-40 sm:h-3 sm:w-56"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      >
                        <path
                          d="M2 6 Q 12 0, 22 6 T 42 6 T 62 6 T 82 6 T 102 6 T 142 6 T 162 6 T 182 6 T 202 6 T 218 6"
                          className="features-wave"
                          style={{
                            strokeDasharray: 400,
                            strokeDashoffset: on ? 0 : 400,
                            transition: on
                              ? "stroke-dashoffset 1400ms ease-out 400ms"
                              : "none",
                          }}
                        />
                      </svg>
                    </h3>
                  </Swap>

                  <Swap active={on} delay={220} className="mt-6 sm:mt-8">
                    <p className="text-muted text-sm leading-relaxed sm:text-base 2xl:text-lg">
                      {f.body}
                    </p>
                  </Swap>

                  <div className="mt-6 flex flex-wrap gap-2 2xl:gap-3">
                    {f.tags.map((tag, t) => (
                      <Swap key={tag} active={on} delay={340 + t * 90} y={16}>
                        <ButtonAnimation
                          href="#features"
                          icon={null}
                          small=""
                          big={tag}
                          accent="var(--brand-500)"
                          variant="solid"
                          size="sm"
                        />
                      </Swap>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* Progress rail */}
        <Reveal inView={inView} delay={baseDelay + 520} className="mt-8">
          <div className="flex items-center gap-4">
            {/* <span className="text-brand-600 font-mono text-sm font-bold tabular-nums">
              0{active + 1}
              <span className="text-muted font-normal"> / 0{count}</span>
            </span> */}
            <div className="flex max-w-xs flex-1 gap-2">
              {features.map((f, i) => (
                <button
                  key={f.id}
                  type="button"
                  aria-label={`Show ${f.eyebrow}`}
                  onClick={() => go(i)}
                  className="group flex h-6 flex-1 items-center"
                >
                  <span className="bg-brand-500/20 relative h-1 w-full overflow-hidden rounded-full transition-all duration-300 group-hover:h-1.5">
                    <span
                      ref={(el) => {
                        bars.current[i] = el;
                      }}
                      className="bg-brand-500 absolute inset-0 origin-left rounded-full [transform:scaleX(0)]"
                    />
                  </span>
                </button>
              ))}
            </div>
       
          </div>
        </Reveal>
      </div>

      {/* Prev/Next pill cursor (whole section) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-30 -translate-x-1/2 -translate-y-1/2 rounded-full border border-black/5 bg-white px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-neutral-900 shadow-xl transition-[opacity,scale] duration-300"
        style={{
          left: cur.x,
          top: cur.y,
          opacity: cur.show ? 1 : 0,
          scale: cur.show ? 1 : 0.7,
        }}
      >
        {cur.side === "prev" ? "Previous" : "Next"}
      </div>
    </div>
  );
}

export default function Features() {
  const { ref, inView } = useInView<HTMLElement>(0.15);

  return (
    <section
      ref={ref}
      id="features"
      className="text-foreground relative isolate z-0 2xl:z-20 overflow-x-clip mb-0 2xl:mt-14"
    >
      {/* ============================================================
          Content Container
          ============================================================ */}
      <div className="mx-auto w-full max-w-7xl px-4 pt-8 pb-2 sm:px-6 sm:pt-10 sm:pb-4 lg:px-8 lg:pt-10 lg:pb-4 2xl:max-w-[96rem] 2xl:pt-12 2xl:pb-6">
        {/* Heading */}
        <Reveal inView={inView} className="relative">
          <div className="relative mt-2 inline-block">
            <h2 className="text-brand-600 relative text-4xl leading-none font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              FEATURES
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
              className="border-brand-500/30 absolute -top-6 -right-20 hidden size-20 rounded-full border md:block lg:-right-24 lg:size-24"
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

        {/* Feature rows - Reduced top space */}
        <div className="mt-2 sm:mt-4 lg:mt-4">
          <FeatureCarousel features={FEATURES} inView={inView} />
        </div>
      </div>
    </section>
  );
}

function FeatureRow({
  feature,
  inView,
  index,
}: {
  feature: Feature;
  inView: boolean;
  index: number;
}) {
  const isEven = index % 2 === 0;
  const baseDelay = 200 + index * 120;

  /* Interactive Mouse Hover Tilt Effect */
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-20 2xl:gap-28">
      {/* ---- Artwork ---- */}
      <Reveal
        inView={inView}
        delay={baseDelay}
        y={40}
        className={`relative order-1 ${isEven ? "lg:order-1" : "lg:order-2"}`}
      >
        <div 
          className="relative mx-auto w-full max-w-md sm:max-w-lg lg:max-w-none"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Dashed orbit ellipse */}
          <svg
            aria-hidden="true"
            viewBox="0 0 400 400"
            preserveAspectRatio="xMidYMid meet"
            className="text-brand-500/40 pointer-events-none absolute inset-0 size-full"
            fill="none"
          >
            <ellipse
              cx="200"
              cy="200"
              rx="150"
              ry="180"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeDasharray="2 8"
              className="features-orbit-line"
              style={{
                strokeDashoffset: inView ? 0 : 600,
                transition: "stroke-dashoffset 1600ms ease-out 400ms",
              }}
            />
          </svg>

          {/* Corner concentric rings */}
          <div
            aria-hidden="true"
            className="text-brand-500/30 pointer-events-none absolute -top-4 right-2 size-16 sm:right-6 sm:size-20 lg:size-24"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "scale(1)" : "scale(0.7)",
              transition: "all 1200ms cubic-bezier(0.2,0.8,0.2,1) 500ms",
            }}
          >
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor">
              <circle cx="50" cy="50" r="46" strokeWidth="1" strokeDasharray="2 6" />
              <circle cx="50" cy="50" r="30" strokeWidth="1" strokeDasharray="2 6" />
              <circle cx="50" cy="50" r="14" strokeWidth="1" strokeDasharray="2 6" />
            </svg>
          </div>

          {/* The Phone Image - Expanded sizing for 2XL */}
          <div
            className="relative will-change-transform transition-transform duration-200 ease-out"
            style={{
              transform: inView
                ? `perspective(1200px) rotateY(${-4 + tilt.x}deg) rotateX(${2 + tilt.y}deg)`
                : "perspective(1200px) rotateY(-14deg) rotateX(6deg)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={feature.imageSrc}
              alt={feature.imageAlt}
              loading="lazy"
              draggable={false}
              className="mx-auto block h-auto w-full max-w-68 select-none drop-shadow-2xl sm:max-w-[22rem] md:max-w-[26rem] lg:max-w-[28rem] xl:max-w-136 2xl:max-w-[42rem]"
            />
          </div>

          {/* Dotted pattern bottom-right */}
          <div
            aria-hidden="true"
            className="features-dots text-brand-500/40 pointer-events-none absolute -right-2 -bottom-2 size-14 sm:right-0 sm:bottom-0 sm:size-20"
            style={{
              opacity: inView ? 1 : 0,
              transition: "opacity 900ms ease-out 700ms",
            }}
          />
        </div>
      </Reveal>

      {/* ---- Copy Section ---- */}
      <div className={`order-2 w-full max-w-xl 2xl:max-w-2xl ${isEven ? "lg:order-2" : "lg:order-1"}`}>
        <Reveal inView={inView} delay={baseDelay + 120}>
          <p className="text-foreground text-2xl leading-tight font-bold tracking-tight sm:text-3xl md:text-4xl 2xl:text-5xl">
            {feature.eyebrow}
          </p>
        </Reveal>

        <Reveal inView={inView} delay={baseDelay + 220} className="mt-1">
          <h3 className="text-brand-600 relative inline-block text-3xl leading-tight font-bold tracking-tight sm:text-4xl md:text-5xl 2xl:text-6xl">
            {feature.title}
            <svg
              aria-hidden="true"
              viewBox="0 0 220 12"
              preserveAspectRatio="none"
              className="text-brand-500 absolute -bottom-3 left-0 h-2.5 w-40 sm:h-3 sm:w-56"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path
                d="M2 6 Q 12 0, 22 6 T 42 6 T 62 6 T 82 6 T 102 6 T 142 6 T 162 6 T 182 6 T 202 6 T 218 6"
                className="features-wave"
                style={{
                  strokeDasharray: 400,
                  strokeDashoffset: inView ? 0 : 400,
                  transition: "stroke-dashoffset 1400ms ease-out 500ms",
                }}
              />
            </svg>
          </h3>
        </Reveal>

        <Reveal inView={inView} delay={baseDelay + 320} className="mt-6 sm:mt-8">
          <p className="text-muted text-sm leading-relaxed sm:text-base 2xl:text-lg">
            {feature.body}
          </p>
        </Reveal>

        {/* Feature Tags — same extraordinary idle + hover animation as the hero store buttons */}
        <Reveal inView={inView} delay={baseDelay + 420} className="mt-6">
          <div className="flex flex-wrap gap-2 2xl:gap-3">
            {feature.tags.map((tag) => (
              <ButtonAnimation
                key={tag}
                href="#features"
                icon={null}
                small=""
                big={tag}
                accent="var(--brand-500)"
                variant="solid"
                size="sm"
              />
            ))}
          </div>
        </Reveal>
      </div>
    </div>
  );
}