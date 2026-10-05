"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const LINKS = [
  { id: "features", label: "Features" },
  { id: "earn-money", label: "Earn Money" },
  { id: "special-features", label: "More Features" },
  { id: "explore", label: "Explore Nuvogram" },
  { id: "contact", label: "Contact Us" },
] as const;

type LinkId = (typeof LINKS)[number]["id"];
type NavbarProps = { logoSrc?: string };

/* ---------- Timings ---------- */
const DUR = 420;
const OPEN_BLUE_DELAY = 0;
const OPEN_WHITE_DELAY = 120;
const CLOSE_WHITE_DELAY = 0;
const CLOSE_BLUE_DELAY = 120;

export default function Navbar({ logoSrc = "/images/Logo.png" }: NavbarProps) {
  const [ready, setReady] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /** Panel mount state. false = not in DOM. */
  const [mounted, setMounted] = useState(false);
  /**
   * Visual open state. When true, panels slide to translate-x-0.
   * Starts false every time we mount so the first painted frame is off-screen.
   */
  const [shown, setShown] = useState(false);

  const [active, setActive] = useState<LinkId | null>(null);
  const [hovered, setHovered] = useState<LinkId | null>(null);
  const [pill, setPill] = useState({ x: 0, w: 0, show: false });

  const listRef = useRef<HTMLUListElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Partial<Record<LinkId, HTMLAnchorElement | null>>>({});
  const timers = useRef<number[]>([]);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  /* One-time entrance */
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  /* Scroll: compact + reading progress */
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(window.scrollY > 8);
      // Written straight to the DOM so scrolling doesn't re-render the navbar
      if (progressRef.current) {
        const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
        progressRef.current.style.transform = `scaleX(${p})`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* Scroll-spy */
  useEffect(() => {
    const sections = LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id as LinkId));
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  /* Sliding pill */
  const target = hovered ?? active;
  const measure = useCallback(() => {
    const el = target ? itemRefs.current[target] : null;
    const list = listRef.current;
    if (!el || !list) {
      setPill((p) => ({ ...p, show: false }));
      return;
    }
    const a = el.getBoundingClientRect();
    const b = list.getBoundingClientRect();
    setPill({ x: a.left - b.left, w: a.width, show: true });
  }, [target]);
  useLayoutEffect(measure, [measure]);
  useEffect(() => {
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  /* ---------- Open ---------- */
  const openMenu = useCallback(() => {
    if (mounted) return;
    clearTimers();

    // 1. Mount with panels still off-screen. `shown` starts false.
    setShown(false);
    setMounted(true);

    // 2. Two rAFs: give the browser two paint opportunities to render the
    //    off-screen start state, then flip `shown = true` to trigger transitions.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setShown(true);
      });
    });
  }, [mounted]);

  /* ---------- Close ---------- */
  const closeMenu = useCallback(() => {
    if (!mounted) return;
    clearTimers();

    // 1. Flip `shown` to false → panels begin their slide-out transitions.
    setShown(false);

    // 2. Unmount after the SLOWER of the two leave-timings has finished.
    const total = CLOSE_BLUE_DELAY + DUR + 60;
    const id = window.setTimeout(() => setMounted(false), total);
    timers.current.push(id);
  }, [mounted]);

  const toggle = useCallback(() => {
    if (mounted) closeMenu();
    else openMenu();
  }, [mounted, openMenu, closeMenu]);

  /* Lock scroll + Escape while mounted */
  useEffect(() => {
    if (!mounted) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeMenu();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [mounted, closeMenu]);

  /* Clean up timers on unmount */
  useEffect(() => () => clearTimers(), []);

  const compact = scrolled || mounted;
  const onDark = !compact;

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50 border-b transition-[translate,opacity,box-shadow,border-color,background-color,backdrop-filter] duration-700 ease-out motion-reduce:transition-none",
          ready ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0",
          compact
            ? "border-border bg-background/90 shadow-[0_6px_24px_-12px_rgb(var(--shadow-color)/0.35)] backdrop-blur-lg"
            : "border-transparent bg-transparent shadow-none",
        ].join(" ")}
      >
        <nav
          aria-label="Primary"
          className={[
            "mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 transition-[height] duration-500 ease-out sm:px-6 lg:px-8 motion-reduce:transition-none",
            compact ? "h-[4.25rem]" : "h-24",
          ].join(" ")}
        >
          <a href="#" aria-label="Nuvogram home" className="shrink-0 rounded-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logoSrc}
              alt="Nuvogram"
              className={[
                "w-auto transition-[height] duration-500 ease-out motion-reduce:transition-none",
                compact ? "h-11" : "h-16",
              ].join(" ")}
            />
          </a>

          <ul
            ref={listRef}
            onMouseLeave={() => setHovered(null)}
            className="relative ml-auto hidden h-10 items-center lg:flex"
          >
            <span
              aria-hidden="true"
              className={`${
                onDark ? "bg-white/15 ring-white/25" : "bg-brand-500/10 ring-brand-500/20"
              } pointer-events-none absolute top-0 left-0 h-10 rounded-full ring-1 transition-[transform,width,opacity,background-color] duration-300 ease-out motion-reduce:transition-none`}
              style={{
                width: pill.w,
                transform: `translateX(${pill.x}px)`,
                opacity: pill.show ? 1 : 0,
              }}
            />

            {LINKS.map(({ id, label }, i) => {
              const isActive = active === id;
              return (
                <li
                  key={id}
                  className={`transition-[opacity,translate] duration-500 ease-out motion-reduce:transition-none ${
                    ready ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                  }`}
                  style={{ transitionDelay: ready ? `${250 + i * 70}ms` : "0ms" }}
                >
                  <a
                    ref={(el) => {
                      itemRefs.current[id] = el;
                    }}
                    href={`#${id}`}
                    aria-current={isActive ? "location" : undefined}
                    onMouseEnter={() => setHovered(id)}
                    onFocus={() => setHovered(id)}
                    onBlur={() => setHovered(null)}
                    className={[
                      "relative flex h-10 items-center rounded-full px-4 text-[15px] font-medium transition-colors duration-200",
                      onDark
                        ? "text-on-hero/90 hover:text-on-hero"
                        : isActive
                          ? "text-brand-text"
                          : "text-foreground hover:text-brand-text",
                    ].join(" ")}
                  >
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            onClick={toggle}
            aria-expanded={mounted}
            aria-controls="mobile-menu"
            aria-label={mounted ? "Close menu" : "Open menu"}
            className={`${
              onDark
                ? "border-white/40 text-on-hero hover:bg-white/10"
                : "border-border text-foreground hover:bg-surface"
            } grid size-11 place-items-center rounded-full border transition-colors lg:hidden`}
          >
            <span className="relative block h-3.5 w-5" aria-hidden="true">
              <span
                className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-all duration-300 motion-reduce:transition-none ${
                  mounted ? "top-[6px] rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute top-[6px] left-0 h-0.5 w-5 rounded bg-current transition-all duration-200 ${
                  mounted ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 h-0.5 w-5 rounded bg-current transition-all duration-300 motion-reduce:transition-none ${
                  mounted ? "top-[6px] -rotate-45" : "top-3"
                }`}
              />
            </span>
          </button>
        </nav>

        <div
          aria-hidden="true"
          ref={progressRef}
          className="bg-brand-gradient absolute bottom-[-1px] left-0 h-[2px] w-full origin-left"
          style={{ transform: "scaleX(0)", opacity: scrolled ? 1 : 0 }}
        />
      </header>

      {/* ---------- Mobile drawer ---------- */}
      {mounted && (
        <div className="fixed inset-0 z-40 lg:hidden" aria-hidden={!shown}>
          {/* Click-away */}
          <button
            type="button"
            tabIndex={-1}
            aria-hidden="true"
            onClick={closeMenu}
            className="absolute inset-0 cursor-default bg-transparent"
          />

          {/* Layer 1: BLUISH shade — leads on open, trails on close */}
          <div
            aria-hidden="true"
            className={[
              "pointer-events-none absolute inset-y-0 left-0 w-[88%] max-w-[26rem]",
              "transition-transform motion-reduce:transition-none",
              shown ? "translate-x-0" : "-translate-x-full",
            ].join(" ")}
            style={{
              transitionDuration: `${DUR}ms`,
              transitionDelay: `${shown ? OPEN_BLUE_DELAY : CLOSE_BLUE_DELAY}ms`,
              transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
              background:
                "linear-gradient(135deg, rgba(6,15,34,0.95) 0%, rgba(15,40,90,0.92) 45%, rgba(6,15,34,0.95) 100%)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
          >
            <div
              className="absolute -top-24 -left-24 size-64 rounded-full opacity-40 blur-3xl"
              style={{ background: "rgb(var(--brand-500-rgb) / 0.6)" }}
            />
          </div>

          {/* Layer 2: THEME (white) — trails on open, leads on close */}
          <aside
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className={[
              "border-border bg-background absolute inset-y-0 left-0 w-[78%] max-w-[22rem] border-r shadow-2xl",
              "transition-transform motion-reduce:transition-none",
              shown ? "translate-x-0" : "-translate-x-full",
            ].join(" ")}
            style={{
              transitionDuration: `${DUR}ms`,
              transitionDelay: `${
                shown ? OPEN_WHITE_DELAY : CLOSE_WHITE_DELAY
              }ms`,
              transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <div className="border-border flex h-[4.25rem] items-center justify-between border-b px-5">
              <a
                href="#"
                onClick={closeMenu}
                aria-label="Nuvogram home"
                className="shrink-0 rounded-md"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={logoSrc} alt="Nuvogram" className="h-11 w-auto" />
              </a>

              <button
                type="button"
                onClick={closeMenu}
                aria-label="Close menu"
                className="border-border text-foreground hover:bg-surface grid size-10 place-items-center rounded-full border transition-colors"
              >
                <span className="relative block size-4">
                  <span className="absolute top-1/2 left-0 h-0.5 w-4 -translate-y-1/2 rotate-45 rounded bg-current" />
                  <span className="absolute top-1/2 left-0 h-0.5 w-4 -translate-y-1/2 -rotate-45 rounded bg-current" />
                </span>
              </button>
            </div>

            <div
              className="bg-brand-gradient h-[2px] w-full origin-left transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none"
              style={{
                transform: `scaleX(${shown ? 1 : 0})`,
                transitionDelay: shown ? "300ms" : "0ms",
              }}
            />

            <nav aria-label="Mobile primary" className="px-2 py-3">
              <ul className="divide-border divide-y">
                {LINKS.map(({ id, label }, i) => {
                  const isActive = active === id;
                  return (
                    <li
                      key={id}
                      className={[
                        "transition-[opacity,translate] ease-out motion-reduce:transition-none",
                        shown
                          ? "translate-x-0 opacity-100"
                          : "-translate-x-3 opacity-0",
                      ].join(" ")}
                      style={{
                        transitionDuration: "400ms",
                        transitionDelay: shown ? `${300 + i * 60}ms` : "0ms",
                      }}
                    >
                      <a
                        href={`#${id}`}
                        onClick={closeMenu}
                        aria-current={isActive ? "location" : undefined}
                        className={[
                          "group flex items-center justify-between px-4 py-4 text-base font-medium transition-colors",
                          isActive
                            ? "text-brand-text"
                            : "text-foreground hover:text-brand-text",
                        ].join(" ")}
                      >
                        <span className="inline-flex items-center gap-3">
                          <span
                            className={[
                              "from-brand-500 to-brand-600 h-4 w-0.5 rounded-full bg-gradient-to-b transition-all duration-300",
                              isActive
                                ? "w-1"
                                : "w-0.5 opacity-40 group-hover:w-1 group-hover:opacity-100",
                            ].join(" ")}
                          />
                          {label}
                        </span>

                        <span
                          aria-hidden="true"
                          className={[
                            "bg-brand-500 size-2 rounded-full transition-opacity",
                            isActive ? "opacity-100" : "opacity-0",
                          ].join(" ")}
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="border-border absolute inset-x-0 bottom-0 border-t px-5 py-4">
              <p className="text-muted text-xs font-medium">
                © {new Date().getFullYear()} Nuvogram
              </p>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}