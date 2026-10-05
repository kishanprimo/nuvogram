"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import {
  FaArrowRight,
  FaArrowUp,
  FaBalanceScale,
  FaCheck,
  FaClipboardList,
  FaEnvelope,
  FaFileContract,
  FaGavel,
  FaHandshake,
  FaImage,
  FaLock,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaShieldAlt,
  FaUserCheck,
  FaUserCircle,
  FaUserShield,
} from "react-icons/fa";
import PageLayout from "../common/PageLayout";

/* ------------------------------------------------------------------ */
/* Content (Terms & Conditions)                                        */
/* ------------------------------------------------------------------ */
const LAST_UPDATED = "5 October 2026";
const EMAIL = "Support@ziogram.com";
const ADDRESS = ["Warrior Comics Inc", "PO Box 230610", "Las Vegas, NV 89105"];

type IconType = ComponentType<{ className?: string; style?: CSSProperties }>;

type Section = {
  title: string;
  Icon: IconType;
  paragraphs?: string[];
  items?: string[];
  itemIcons?: IconType[];
  contact?: boolean;
};

const SECTIONS: Section[] = [
  {
    title: "Acceptance of Terms",
    Icon: FaHandshake,
    paragraphs: [
      "By accessing or using the Nuvogram platform (“Service”), you agree to be bound by these Terms & Conditions (“Terms”). If you disagree with any part of these terms, you may not access the Service. These Terms apply to all visitors, users, and others who access or use the Service.",
    ],
  },
  {
    title: "Description of Service",
    Icon: FaClipboardList,
    paragraphs: [
      "Nuvogram is a social platform that enables users to connect, share content, and earn money through various features including:",
    ],
    items: [
      "Social networking and community features",
      "Content sharing and discovery",
      "Earning opportunities through engagement",
      "Profile customization and personalization",
      "Communication tools and messaging",
    ],
    itemIcons: [FaUserShield, FaImage, FaMoneyBillWave, FaUserCheck, FaEnvelope],
  },
  {
    title: "User Accounts",
    Icon: FaUserCheck,
    paragraphs: [
      "To use certain features of the Service, you must register for an account. You agree to:",
    ],
    items: [
      "Provide accurate, current, and complete information",
      "Maintain the security of your account credentials",
      "Accept responsibility for all activities under your account",
      "Notify us immediately of any unauthorized use",
      "Not share your account with others",
    ],
    itemIcons: [FaClipboardList, FaLock, FaUserShield, FaShieldAlt, FaUserCheck],
  },
  {
    title: "User Conduct",
    Icon: FaGavel,
    paragraphs: [
      "You agree not to use the Service to:",
    ],
    items: [
      "Post or share harmful, illegal, or offensive content",
      "Harass, abuse, or harm other users",
      "Impersonate any person or entity",
      "Violate any applicable laws or regulations",
      "Attempt to gain unauthorized access to the Service",
      "Use automated tools to scrape or harvest data",
      "Interfere with the operation of the Service",
    ],
    itemIcons: [FaLock, FaUserShield, FaUserCheck, FaGavel, FaShieldAlt, FaFileContract, FaBalanceScale],
  },
  {
    title: "Content and Intellectual Property",
    Icon: FaFileContract,
    paragraphs: [
      "You retain ownership of content you post to the Service. By posting content, you grant us a license to use, display, and distribute your content for the purpose of operating and improving the Service. You represent that you have the right to post such content and that it does not violate any third-party rights.",
      "The Service and its original content, features, and functionality are owned by Warrior Comics Inc and are protected by international copyright, trademark, and other intellectual property laws.",
    ],
  },
  {
    title: "Earnings and Payments",
    Icon: FaMoneyBillWave,
    paragraphs: [
      "Nuvogram offers opportunities for users to earn money through various activities. You agree that:",
    ],
    items: [
      "Earnings are subject to our terms and policies",
      "We reserve the right to modify earning structures",
      "Payments are processed according to our payment schedule",
      "Fraudulent activity will result in account termination",
      "Account balances are non-transferable",
    ],
    itemIcons: [FaMoneyBillWave, FaBalanceScale, FaClipboardList, FaGavel, FaLock],
  },
  {
    title: "Termination",
    Icon: FaUserShield,
    paragraphs: [
      "We reserve the right to suspend or terminate your account at any time for any reason, including but not limited to violation of these Terms, fraudulent activity, or misuse of the Service. Upon termination, your right to use the Service will immediately cease.",
    ],
  },
  {
    title: "Disclaimer of Warranties",
    Icon: FaShieldAlt,
    paragraphs: [
      "The Service is provided on an \"AS IS\" and \"AS AVAILABLE\" basis without warranties of any kind, either express or implied. We do not guarantee that the Service will be uninterrupted, secure, or error-free.",
    ],
  },
  {
    title: "Limitation of Liability",
    Icon: FaBalanceScale,
    paragraphs: [
      "To the maximum extent permitted by law, Warrior Comics Inc shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.",
    ],
  },
  {
    title: "Changes to Terms",
    Icon: FaFileContract,
    paragraphs: [
      "We reserve the right to modify these Terms at any time. We will notify users of material changes by posting the new Terms on the Service and updating the \"Last updated\" date. Your continued use of the Service after such changes constitutes acceptance of the new Terms.",
    ],
  },
  {
    title: "Contact Us",
    Icon: FaEnvelope,
    paragraphs: ["If you have any questions about these Terms & Conditions, please contact us:"],
    contact: true,
  },
];

const ORBIT: { label: string; Icon: IconType }[] = [
  { label: "Account", Icon: FaUserCircle },
  { label: "Rules", Icon: FaGavel },
  { label: "Content", Icon: FaImage },
  { label: "Earnings", Icon: FaMoneyBillWave },
  { label: "Safety", Icon: FaShieldAlt },
];

const GLANCE: { to: number; Icon: IconType; title: string; text: string }[] = [
  { to: 1, Icon: FaUserCheck, title: "Account Responsibility", text: "You are responsible for maintaining the security of your account and all activities under it." },
  { to: 5, Icon: FaMoneyBillWave, title: "Earnings & Payments", text: "Earnings are subject to our policies. Fraudulent activity leads to termination." },
  { to: 7, Icon: FaGavel, title: "User Conduct", text: "You agree not to post harmful content, harass others, or violate any laws." },
];

const BG_ICONS = [
  { Icon: FaGavel, left: "8%", size: 24, delay: 0, dur: 18 },
  { Icon: FaShieldAlt, left: "24%", size: 26, delay: 5, dur: 21 },
  { Icon: FaBalanceScale, left: "42%", size: 22, delay: 9, dur: 19 },
  { Icon: FaFileContract, left: "60%", size: 26, delay: 2, dur: 20 },
  { Icon: FaMoneyBillWave, left: "78%", size: 24, delay: 7, dur: 17 },
  { Icon: FaLock, left: "92%", size: 20, delay: 11, dur: 22 },
];

/* ------------------------------------------------------------------ */
/* Theme & Animation Helpers (Mapped to color.css)                     */
/* ------------------------------------------------------------------ */
const EASE = "cubic-bezier(0.2,0.8,0.2,1)";
const N = SECTIONS.length;
const RING = 2 * Math.PI * 20;

const sid = (i: number) => `tc-s${i + 1}`;
const pad = (i: number) => String(i + 1).padStart(2, "0");
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const prefersReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const CSS = `
@keyframes tc-pan { to { background-position: 24px 24px; } }
@keyframes tc-floatup { 0% { transform: translateY(0) rotate(0deg); opacity: 0; } 15% { opacity: .5; } 85% { opacity: .5; } 100% { transform: translateY(-620px) rotate(24deg); opacity: 0; } }
@keyframes tc-spin { to { transform: rotate(360deg); } }
@keyframes tc-ring { 0% { transform: scale(.85); opacity: .6; } 75%,100% { transform: scale(1.55); opacity: 0; } }
@keyframes tc-rise { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
@keyframes tc-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }

.tc-orbit { animation: tc-spin 90s linear infinite; }
.tc-orbit-rev { animation: tc-spin 90s linear infinite reverse; }
.tc-orbit-box:hover .tc-orbit,
.tc-orbit-box:hover .tc-orbit-rev { animation-play-state: paused; }

.tc-chips { scrollbar-width: none; }
.tc-chips::-webkit-scrollbar { display: none; }

@media (prefers-reduced-motion: reduce) {
  .tc-anim, .tc-orbit, .tc-orbit-rev { animation: none !important; }
}
`;

/* ------------------------------------------------------------------ */
/* UI Components                                                       */
/* ------------------------------------------------------------------ */
function useInView<T extends HTMLElement>(threshold = 0.12) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); io.disconnect(); } },
      { threshold, rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function SpotCard({ className = "", style, children }: { className?: string; style?: CSSProperties; children: ReactNode }) {
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--sx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--sy", `${e.clientY - r.top}px`);
  };

  return (
    <div
      onPointerMove={onMove}
      className={`group relative overflow-hidden rounded-2xl border border-slate-200/60 bg-gradient-to-br from-white via-white to-sky-50/60 shadow-sm backdrop-blur-md transition-all duration-500 hover:border-sky-300 hover:shadow-md ${className}`}
      style={style}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: `radial-gradient(360px circle at var(--sx, 50%) var(--sy, 50%), rgba(0, 152, 216, 0.12), transparent 65%)` }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[52rem] overflow-hidden">
      <div
        className="tc-anim absolute inset-0"
        style={{
          color: "rgba(0, 152, 216, 0.22)",
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          WebkitMaskImage: "radial-gradient(ellipse at 50% 30%, black, transparent 72%)",
          maskImage: "radial-gradient(ellipse at 50% 30%, black, transparent 72%)",
          animation: "tc-pan 30s linear infinite",
        }}
      />
      {BG_ICONS.map(({ Icon, left, size, delay, dur }, i) => (
        <Icon key={i} className="tc-anim absolute bottom-0 opacity-0" style={{ left, width: size, height: size, color: "var(--brand-500)", animation: `tc-floatup ${dur}s linear ${delay}s infinite` }} />
      ))}
    </div>
  );
}

function Orbit({ ready }: { ready: boolean }) {
  const R = 38;
  return (
    <div
      aria-hidden="true"
      className={`tc-orbit-box relative mx-auto aspect-square w-full max-w-[22rem] transition-[opacity,scale] duration-[1200ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none lg:max-w-[28rem] ${ready ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}
      style={{ transitionDelay: ready ? "300ms" : "0ms" }}
    >
      <div className="absolute inset-[18%] rounded-full" style={{ background: `radial-gradient(circle, rgba(0, 152, 216, 0.3), transparent 70%)` }} />
      <div className="tc-orbit absolute inset-0">
        <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" fill="none">
          <circle cx="50" cy="50" r="38" stroke="rgba(10, 95, 143, 0.3)" strokeWidth="0.3" strokeDasharray="0.8 1.4" />
          <circle cx="50" cy="50" r="27" stroke="rgba(10, 95, 143, 0.22)" strokeWidth="0.3" strokeDasharray="0.8 1.4" />
        </svg>
        {ORBIT.map(({ label, Icon }, k) => {
          const a = ((-90 + k * 72) * Math.PI) / 180;
          return (
            <span key={label} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${50 + R * Math.cos(a)}%`, top: `${50 + R * Math.sin(a)}%` }}>
              <span className="tc-orbit-rev flex flex-col items-center gap-1.5">
                <span className="grid size-11 place-items-center rounded-2xl border sm:size-14" style={{ background: "rgba(255, 255, 255, 0.85)", borderColor: "rgba(0, 152, 216, 0.4)", color: "var(--brand-500)", boxShadow: `0 12px 22px -12px rgba(10, 95, 143, 0.5)` }}>
                  <Icon className="size-5 sm:size-6" />
                </span>
                <span className="text-[11px] font-semibold whitespace-nowrap sm:text-xs" style={{ color: "var(--brand-950)" }}>{label}</span>
              </span>
            </span>
          );
        })}
      </div>
      <span className="absolute top-1/2 left-1/2 grid size-[26%] -translate-x-1/2 -translate-y-1/2 place-items-center">
        {[0, 1].map((i) => (
          <span key={i} className="tc-anim absolute inset-0 rounded-full border-2" style={{ borderColor: "rgba(0, 152, 216, 0.55)", opacity: 0, animation: `tc-ring 2.8s ease-out ${i * 1.4}s infinite` }} />
        ))}
        <span className="tc-anim grid size-full place-items-center rounded-full" style={{ background: "var(--gradient-brand)", color: "var(--on-brand)", boxShadow: `0 18px 34px -14px rgba(10, 95, 143, 0.7)`, animation: "tc-bob 5s ease-in-out infinite" }}>
          <FaGavel className="size-[42%]" />
        </span>
      </span>
    </div>
  );
}

function SectionCard({ s, i, active }: { s: Section; i: number; active: boolean }) {
  const { ref, inView } = useInView<HTMLElement>(0.12);
  const { Icon } = s;
  const stagger = (k: number): CSSProperties => (inView ? { animation: `tc-rise 600ms ${EASE} ${220 + k * 80}ms both` } : { opacity: 0 });

  return (
    <section ref={ref} id={sid(i)} data-tc-sec data-i={i} aria-labelledby={`${sid(i)}-h`} className="scroll-mt-36 lg:scroll-mt-28">
      <div className="transition-[opacity,transform] duration-[900ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none" style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(32px)" }}>
        <SpotCard className={active ? "border-sky-400 shadow-[0_24px_40px_-28px_rgba(0,152,216,0.55)]" : ""}>
          <div className="p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <span className="relative grid size-12 shrink-0 place-items-center">
                <span className={`grid size-12 place-items-center rounded-full border text-base font-bold tabular-nums transition-all duration-500 ${active ? "border-transparent bg-[image:var(--gradient-brand)] text-white" : "border-sky-200 text-sky-700"}`}>
                  {pad(i)}
                </span>
              </span>
              <h2 id={`${sid(i)}-h`} className="min-w-0 flex-1 self-center text-xl leading-tight font-bold tracking-tight sm:text-2xl" style={{ color: "var(--brand-950)" }}>
                <span className="relative inline-block">
                  {s.title}
                  <span aria-hidden="true" className={`absolute -bottom-1.5 left-0 h-[2px] rounded-full transition-all duration-700 ease-out ${active ? "w-full" : "w-0"}`} style={{ background: "var(--gradient-brand)" }} />
                </span>
              </h2>
              <span aria-hidden="true" className="hidden size-11 shrink-0 place-items-center rounded-xl sm:grid" style={{ background: "rgba(0, 152, 216, 0.12)", color: "var(--brand-500)" }}>
                <Icon className="size-5" />
              </span>
            </div>
            <div className="mt-6 space-y-4">
              {s.paragraphs?.map((p, k) => <p key={k} className="tc-anim text-slate-600 text-sm leading-relaxed sm:text-base sm:leading-7" style={stagger(k)}>{p}</p>)}
              {s.items && (
                <ul className="grid gap-3 pt-1 sm:grid-cols-2">
                  {s.items.map((item, k) => {
                    const ItemIcon = s.itemIcons?.[k] ?? FaCheck;
                    return (
                      <li key={item} className="tc-anim flex items-start gap-3 rounded-xl border border-sky-100 bg-white/50 px-4 py-3 transition-colors duration-300 hover:border-sky-300 hover:bg-sky-50/50" style={stagger((s.paragraphs?.length ?? 0) + k)}>
                        <span aria-hidden="true" className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-lg" style={{ background: "rgba(0, 152, 216, 0.14)", color: "var(--brand-500)" }}><ItemIcon className="size-3.5" /></span>
                        <span className="text-slate-700 text-sm leading-relaxed sm:text-[15px]">{item}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
              {s.contact && (
                <>
                  <div className="grid gap-3 pt-1 sm:grid-cols-2">
                    <a href={`mailto:${EMAIL}`} className="tc-anim group/c flex items-start gap-3 rounded-xl border border-sky-100 bg-white/50 px-4 py-4 transition-colors duration-300 hover:border-sky-300 hover:bg-sky-50/50" style={stagger(1)}>
                      <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-lg" style={{ background: "var(--gradient-brand)", color: "var(--on-brand)" }}><FaEnvelope className="size-4" /></span>
                      <span className="min-w-0">
                        <span className="text-slate-500 block text-xs font-semibold">Email</span>
                        <span className="block text-sm font-semibold break-all sm:text-base" style={{ color: "var(--brand-950)" }}>{EMAIL}</span>
                      </span>
                    </a>
                    <div className="tc-anim flex items-start gap-3 rounded-xl border border-sky-100 bg-white/50 px-4 py-4" style={stagger(2)}>
                      <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-lg" style={{ background: "var(--gradient-brand)", color: "var(--on-brand)" }}><FaMapMarkerAlt className="size-4" /></span>
                      <span className="min-w-0">
                        <span className="text-slate-500 block text-xs font-semibold">Address</span>
                        <span className="block text-sm leading-snug font-semibold sm:text-base" style={{ color: "var(--brand-950)" }}>{ADDRESS.map((l) => <span key={l} className="block">{l}</span>)}</span>
                      </span>
                    </div>
                  </div>
                  <div className="tc-anim pt-2" style={stagger(3)}>
                    <Link href="/#contact" className="group/btn text-white relative inline-flex h-12 items-center gap-3 overflow-hidden rounded-xl px-6 text-sm font-semibold transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0" style={{ background: "var(--gradient-brand)", boxShadow: `0 14px 28px -14px rgba(10, 95, 143, 0.75)` }}>
                      <span aria-hidden="true" className="bg-white/25 absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 transition-transform duration-700 group-hover/btn:translate-x-[500%] motion-reduce:transition-none" />
                      <span className="relative">Open the contact form</span>
                      <FaArrowRight className="relative size-3.5 transition-transform duration-300 group-hover/btn:translate-x-1" aria-hidden="true" />
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </SpotCard>
      </div>
    </section>
  );
}

export default function TermsAndConditions() {
  const articleRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState(0);
  const [pct, setPct] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const art = articleRef.current;
      if (!art) return;
      const r = art.getBoundingClientRect();
      const vh = window.innerHeight;
      const v = Math.round(clamp((vh * 0.45 - r.top) / r.height) * 100);
      setPct((prev) => (prev === v ? prev : v));
      setShowTop(window.scrollY > vh * 0.6);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { if (raf) cancelAnimationFrame(raf); window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); };
  }, []);

  useEffect(() => {
    const secs = document.querySelectorAll<HTMLElement>("[data-tc-sec]");
    if (!secs.length) return;
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i ?? 0)); }), { rootMargin: "-30% 0px -60% 0px" });
    secs.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const box = chipsRef.current;
    const chip = box?.children[active] as HTMLElement | undefined;
    if (!box || !chip) return;
    box.scrollTo({ left: chip.offsetLeft - (box.clientWidth - chip.clientWidth) / 2, behavior: prefersReduced() ? "auto" : "smooth" });
  }, [active]);

  const go = useCallback((i: number) => {
    document.getElementById(sid(i))?.scrollIntoView({ behavior: prefersReduced() ? "auto" : "smooth", block: "start" });
    setActive(i);
  }, []);

  const toTop = () => window.scrollTo({ top: 0, behavior: prefersReduced() ? "auto" : "smooth" });

  const rise = (d: number): CSSProperties => ({ transitionDelay: ready ? `${d}ms` : "0ms" });
  const riseCls = (on: boolean) => `transition-[opacity,translate] duration-700 ease-out motion-reduce:transition-none ${on ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`;

  return (
    <PageLayout>
      <div className="text-foreground relative isolate min-h-screen overflow-x-clip">
        <style>{CSS}</style>
        <Backdrop />

        <div className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-8 2xl:max-w-[96rem]">
          {/* HERO */}
          <header className="grid items-center gap-10 pt-32 pb-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-16 lg:pt-40 lg:pb-16">
            <div>
              <p className={`text-foreground text-xl leading-tight font-bold tracking-tight sm:text-2xl md:text-3xl 2xl:text-4xl ${riseCls(ready)}`} style={rise(100)}>Your agreement with us</p>
              <h1 className="mt-2 text-5xl leading-[1.02] font-extrabold tracking-tight sm:text-6xl lg:text-7xl" style={{ color: "var(--brand-950)" }}>
                {["TERMS &", "CONDITIONS"].map((w, i) => (
                  <span key={w} className="block overflow-hidden pb-1.5">
                    <span className={`block transition-transform duration-[900ms] ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none ${ready ? "translate-y-0" : "translate-y-full"}`} style={rise(200 + i * 130)}>{w}</span>
                  </span>
                ))}
              </h1>
              <span aria-hidden="true" className="mt-3 block h-1 w-40 origin-left rounded-full transition-transform duration-[1200ms] ease-out motion-reduce:transition-none sm:w-56" style={{ background: "var(--gradient-brand)", transform: ready ? "scaleX(1)" : "scaleX(0)", transitionDelay: "600ms" }} />
              <span aria-hidden="true" className="mt-3 block h-[2px] w-20 [background-image:repeating-linear-gradient(to_right,currentColor_0_4px,transparent_4px_8px)] sm:w-24" style={{ color: "var(--brand-500)" }} />
              <p className={`text-slate-500 mt-8 max-w-xl text-sm leading-relaxed sm:text-base 2xl:text-lg ${riseCls(ready)}`} style={rise(650)}>Please read these terms carefully before using Nuvogram. By using our platform, you agree to these rules.</p>
              <div className={`mt-6 flex flex-wrap items-center gap-3 ${riseCls(ready)}`} style={rise(780)}>
                <span className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold" style={{ borderColor: "rgba(0, 152, 216, 0.4)", background: "rgba(0, 152, 216, 0.12)", color: "var(--brand-500)" }}>
                  <span className="relative grid size-2 place-items-center">
                    <span aria-hidden="true" className="tc-anim absolute inset-0 rounded-full" style={{ background: "var(--brand-500)", animation: "tc-ring 2s ease-out infinite" }} />
                    <span className="relative size-2 rounded-full" style={{ background: "var(--brand-500)" }} />
                  </span>
                  Last updated {LAST_UPDATED}
                </span>
                <span className="text-slate-500 text-xs font-semibold">{N} sections</span>
              </div>
            </div>
            <Orbit ready={ready} />
          </header>

          {/* AT A GLANCE */}
          <ul className="grid gap-4 pb-12 sm:grid-cols-3 sm:gap-5 lg:pb-16">
            {GLANCE.map(({ to, Icon, title, text }, i) => (
              <li key={title} className={riseCls(ready)} style={rise(900 + i * 120)}>
                <SpotCard className="h-full transition-[translate,border-color] duration-500 hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                  <button type="button" onClick={() => go(to)} className="cursor-pointer flex h-full w-full flex-col items-start gap-3 p-5 text-left sm:p-6">
                    <span className="grid size-11 place-items-center rounded-xl" style={{ background: "var(--gradient-brand)", color: "var(--on-brand)" }}><Icon className="size-5" /></span>
                    <span className="text-base font-bold" style={{ color: "var(--brand-950)" }}>{title}</span>
                    <span className="text-slate-500 text-sm leading-relaxed">{text}</span>
                    <span className="mt-auto inline-flex items-center gap-2 pt-1 text-xs font-semibold" style={{ color: "var(--brand-500)" }}>
                      Read section {to + 1}
                      <FaArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
                    </span>
                  </button>
                </SpotCard>
              </li>
            ))}
          </ul>

          {/* MOBILE JUMP BAR */}
          <div className="sticky top-[4.25rem] z-30 -mx-4 mb-6 border-b px-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:hidden" style={{ borderColor: "rgba(0, 152, 216, 0.12)", background: "rgba(255, 255, 255, 0.85)" }}>
            <div ref={chipsRef} className="tc-chips relative flex gap-2 overflow-x-auto py-3" role="tablist" aria-label="Jump to section">
              {SECTIONS.map((s, i) => {
                const on = i === active;
                return (
                  <button key={s.title} type="button" role="tab" aria-selected={on} onClick={() => go(i)} className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all duration-300 ${on ? "border-transparent bg-[image:var(--gradient-brand)] text-white" : "border-slate-200 text-brand-950"}`}>
                    <span className="tabular-nums opacity-70">{pad(i)}</span>
                    {s.title}
                  </button>
                );
              })}
            </div>
            <span aria-hidden="true" className="absolute bottom-[-1px] left-0 h-[2px] w-full origin-left" style={{ background: "var(--gradient-brand)", transform: `scaleX(${pct / 100})` }} />
          </div>

          {/* CONTENTS + POLICY */}
          <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12 2xl:gap-16">
            <aside className="hidden lg:block">
              <nav aria-label="Terms and conditions contents" className="sticky top-28">
                <p className="mb-4 text-sm font-bold" style={{ color: "var(--brand-950)" }}>On this page</p>
                <ol className="relative">
                  <span aria-hidden="true" className="absolute top-[22px] bottom-[22px] left-[13px] w-px" style={{ background: "rgba(0, 152, 216, 0.18)" }}>
                    <span className="absolute inset-x-0 top-0 transition-[height] duration-700 ease-out motion-reduce:transition-none" style={{ height: `${(active / (N - 1)) * 100}%`, background: "var(--gradient-brand)" }} />
                  </span>
                  {SECTIONS.map((s, i) => {
                    const on = i === active;
                    const done = i < active;
                    return (
                      <li key={s.title}>
                        <button type="button" onClick={() => go(i)} aria-current={on ? "true" : undefined} className="group/t relative flex h-11 w-full items-center gap-3 rounded-lg text-left">
                          <span className="relative grid size-7 shrink-0 place-items-center">
                            {/* FIX: Number visibility logic */}
                            <span
                              className={`relative grid size-7 place-items-center rounded-full border text-[11px] font-bold tabular-nums transition-all duration-500 ${
                                on || done
                                  ? "border-transparent bg-[image:var(--gradient-brand)] text-white"
                                  : "bg-white border-slate-300 text-sky-700 group-hover/t:border-sky-400"
                              } ${on ? "scale-110" : ""}`}
                            >
                              {done ? <FaCheck className="size-3" aria-hidden="true" /> : i + 1}
                            </span>
                          </span>
                          <span className={`text-[13px] leading-snug transition-all duration-300 ${on ? "translate-x-0.5 font-semibold" : "text-slate-500 group-hover/t:text-brand-950"}`} style={on ? { color: "var(--brand-950)" } : undefined}>{s.title}</span>
                        </button>
                      </li>
                    );
                  })}
                </ol>
                <p className="text-slate-500 mt-5 pl-1 text-xs font-semibold tabular-nums">{pct}% read</p>
              </nav>
            </aside>

            <div ref={articleRef} className="min-w-0 max-w-4xl space-y-6">
              {SECTIONS.map((s, i) => <SectionCard key={s.title} s={s} i={i} active={i === active} />)}
            </div>
          </div>
        </div>

        {/* BACK TO TOP */}
        <button type="button" onClick={toTop} aria-label="Back to top" className={`fixed right-5 bottom-5 z-40 grid size-12 place-items-center rounded-full border shadow-lg backdrop-blur-md transition-all duration-500 hover:-translate-y-0.5 hover:border-sky-400 sm:right-8 sm:bottom-8 ${showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"}`} style={{ borderColor: "rgba(0, 152, 216, 0.2)", background: "rgba(255, 255, 255, 0.85)", color: "var(--brand-500)" }}>
          <svg aria-hidden="true" viewBox="0 0 48 48" className="absolute inset-0 -rotate-90">
            <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="2" />
            <circle cx="24" cy="24" r="20" fill="none" stroke="var(--brand-500)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray={RING} style={{ strokeDashoffset: RING * (1 - pct / 100), transition: "stroke-dashoffset 300ms linear" }} />
          </svg>
          <FaArrowUp className="relative size-4" aria-hidden="true" />
        </button>
      </div>
    </PageLayout>
  );
}