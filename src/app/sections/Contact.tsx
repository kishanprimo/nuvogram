"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  FaEnvelope,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaCheck,
  FaExclamationCircle,
  FaExternalLinkAlt,
  FaComments,
  FaClock,
} from "react-icons/fa";
import ButtonAnimation from "../common/ButtonAnimation";

/* ------------------------------------------------------------------ */
/* Props & theme helpers                                               */
/* ------------------------------------------------------------------ */
type ContactProps = {
  email?: string;
  addressLines?: string[];
  endpoint?: string;
};

const EMPTY = { name: "", email: "", subject: "", message: "" };
const DANGER = "rgb(var(--danger-rgb, 220 38 38))";
const EASE = "cubic-bezier(0.2,0.8,0.2,1)";

/* ------------------------------------------------------------------ */
/* Hook                                                                */
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
/* Component                                                           */
/* ------------------------------------------------------------------ */
export default function Contact({
  email = "support@ziogram.com",
  addressLines = ["Warrior Comics Inc", "PO Box 230610", "Las Vegas, NV 89105"],
  endpoint,
}: ContactProps) {
  const { ref, inView } = useInView<HTMLElement>(0.15);
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const errors = {
    name: values.name.trim().length < 2 ? "Please enter your name." : "",
    email: !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())
      ? "Enter a valid email address."
      : "",
    subject: values.subject.trim().length < 3 ? "Add a short subject." : "",
  };

  const valid = Object.values(errors).every((e) => !e);
  const completedFields = Object.values(errors).filter((e) => !e).length;

  const handleChange =
    (field: keyof typeof EMPTY) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((prev) => ({ ...prev, [field]: e.target.value }));

  const handleBlur = (field: string) => () =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, subject: true });
    if (!valid) return;
    setStatus("sending");
    try {
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (!res.ok) throw new Error();
      } else {
        await new Promise((r) => setTimeout(r, 1200));
      }
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  const handleReset = () => {
    setValues(EMPTY);
    setTouched({});
    setStatus("idle");
  };

  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    addressLines.join(", ")
  )}`;

  /* Focus ring via box-shadow → never shifts layout */
  const fieldCls = (bad: boolean) =>
    `w-full rounded-2xl border px-4 py-3 text-sm font-semibold outline-none transition-[border-color,box-shadow,background-color] duration-300 placeholder:text-muted focus:bg-white ${
      bad
        ? "border-danger/60 bg-danger/5 focus:border-danger focus:shadow-[0_0_0_4px_rgb(var(--danger-rgb,220_38_38)/0.15)]"
        : "border-brand-500/20 bg-white/70 focus:border-brand-500 focus:shadow-[0_0_0_4px_rgb(var(--brand-500-rgb)/0.15)]"
    }`;

  return (
    <section
      ref={ref}
      id="contact"
      className="text-foreground relative isolate w-full overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
    >
      {/* ---------- Animated backdrop ---------- */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <style>{`
          @keyframes ct-pan { to { background-position: 24px 24px; } }
          @keyframes ct-drift {
            0%,100% { transform: translate3d(0,0,0) scale(1); }
            50% { transform: translate3d(48px,32px,0) scale(1.12); }
          }
          @keyframes ct-rise {
            from { opacity: 0; transform: translateY(16px); filter: blur(6px); }
            to { opacity: 1; transform: none; filter: none; }
          }
          @keyframes ct-ping {
            0% { transform: scale(.92); opacity: .6; }
            75%,100% { transform: scale(1.4); opacity: 0; }
          }
          @keyframes ct-sweep { 0% { transform: translateX(-120%); } 100% { transform: translateX(420%); } }
          @keyframes ct-pop {
            0% { opacity: 0; transform: scale(.4) rotate(-12deg); }
            70% { opacity: 1; transform: scale(1.1) rotate(2deg); }
            100% { opacity: 1; transform: none; }
          }
          @media (prefers-reduced-motion: reduce) { .ct-anim { animation: none !important; } }
        `}</style>

        {/* More visible dots */}
        <div
          className="ct-anim absolute inset-0 text-brand-500/40"
          style={{
            backgroundImage: "radial-gradient(currentColor 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
            WebkitMaskImage: "radial-gradient(ellipse at center, black, transparent 80%)",
            maskImage: "radial-gradient(ellipse at center, black, transparent 80%)",
            animation: "ct-pan 30s linear infinite",
          }}
        />
        <div
          className="ct-anim absolute -top-40 -left-40 size-[28rem] rounded-full bg-brand-500/20 blur-3xl"
          style={{ animation: "ct-drift 18s ease-in-out infinite" }}
        />
        <div
          className="ct-anim absolute -right-40 bottom-0 size-[30rem] rounded-full bg-brand-500/15 blur-3xl"
          style={{ animation: "ct-drift 22s ease-in-out infinite", animationDelay: "-6s" }}
        />
        <div
          className="ct-anim absolute top-1/2 left-1/2 size-[22rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand-500/10 blur-3xl"
          style={{ animation: "ct-drift 26s ease-in-out infinite", animationDelay: "-12s" }}
        />
      </div>

      <div className="mx-auto w-full max-w-6xl 2xl:max-w-[80rem]">
        {/* ---------- Heading ---------- */}
        <div
          className="text-center"
          style={inView ? { animation: `ct-rise 800ms ${EASE} both` } : { opacity: 0 }}
        >
          <div className="border-brand-500/35 bg-brand-500/10 text-brand-600 mb-3 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-bold tracking-wider uppercase backdrop-blur-sm">
            <FaComments className="size-3.5" />
            <span>Get In Touch With Us</span>
          </div>

          <h2 className="relative mt-1 text-4xl font-extrabold tracking-tight uppercase sm:text-5xl md:text-6xl">
            <span className="text-brand-600">Contact </span>
            <span className="text-brand-500">Us</span>
            <span
              aria-hidden="true"
              className="from-brand-500 to-brand-600 absolute -bottom-3 left-1/2 h-1.5 -translate-x-1/2 rounded-full bg-gradient-to-r transition-all duration-1000 ease-out"
              style={{ width: inView ? "120px" : "0px" }}
            />
          </h2>

          <p className="text-muted mx-auto mt-6 max-w-2xl text-base font-medium sm:text-lg">
            Have questions or feedback? We&apos;d love to hear from you. Send us a message
            and we&apos;ll get back to you right away!
          </p>
        </div>

        {/* ---------- Content ---------- */}
        <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.3fr]">
          {/* ----- Info cards ----- */}
          <div className="flex flex-col gap-6">
            {/* Office */}
            <div
              className="group border-brand-500/25 from-brand-500/10 to-brand-600/5 relative overflow-hidden rounded-3xl border bg-gradient-to-br p-7 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              style={{
                boxShadow: "0 20px 40px -28px rgb(var(--brand-500-rgb)/0.5)",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(24px)",
                transitionDelay: "150ms",
              }}
            >
              <span className="bg-brand-500/40 pointer-events-none absolute -top-12 -right-12 size-40 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />

              <div className="relative flex items-start gap-5">
                <div className="relative grid size-14 shrink-0 place-items-center">
                  <span
                    className="ct-anim border-brand-500/55 absolute inset-0 rounded-2xl border-2"
                    style={{ animation: "ct-ping 2.6s ease-out infinite" }}
                  />
                  <span
                    className="from-brand-500 to-brand-600 relative grid size-14 place-items-center rounded-2xl bg-gradient-to-br text-white transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                    style={{ boxShadow: "0 12px 28px -14px rgb(var(--brand-500-rgb)/0.7)" }}
                  >
                    <FaMapMarkerAlt className="size-6" />
                  </span>
                </div>
                <div>
                  <h3 className="text-brand-600 text-xs font-extrabold tracking-widest uppercase">
                    Our Office
                  </h3>
                  <div className="mt-2 space-y-1">
                    {addressLines.map((line) => (
                      <p key={line} className="text-brand-600 text-base font-semibold">
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </div>

              <div className="relative mt-6">
                <ButtonAnimation
                  href={mapsHref}
                  big="Open in Google Maps"
                  icon={<FaExternalLinkAlt className="size-3" />}
                  variant="solid"
                  accent="#ffffff"
                  className="!h-10 !px-4 !text-xs from-brand-500 to-brand-600 !bg-gradient-to-r"
                />
              </div>
            </div>

            {/* Email */}
            <div
              className="group border-brand-500/25 from-brand-600/8 to-brand-500/12 relative overflow-hidden rounded-3xl border bg-gradient-to-br p-7 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              style={{
                boxShadow: "0 20px 40px -28px rgb(var(--brand-600-rgb)/0.5)",
                opacity: inView ? 1 : 0,
                transform: inView ? "translateY(0)" : "translateY(24px)",
                transitionDelay: "250ms",
              }}
            >
              <span className="bg-brand-500/40 pointer-events-none absolute -top-12 -right-12 size-40 rounded-full opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100" />

              <div className="relative flex items-start gap-5">
                <div className="relative grid size-14 shrink-0 place-items-center">
                  <span
                    className="ct-anim border-brand-500/55 absolute inset-0 rounded-2xl border-2"
                    style={{ animation: "ct-ping 2.6s ease-out 1.3s infinite" }}
                  />
                  <span
                    className="from-brand-500 to-brand-600 relative grid size-14 place-items-center rounded-2xl bg-gradient-to-br text-white transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3"
                    style={{ boxShadow: "0 12px 28px -14px rgb(var(--brand-500-rgb)/0.7)" }}
                  >
                    <FaEnvelope className="size-6" />
                  </span>
                </div>
                <div className="min-w-0 overflow-hidden">
                  <h3 className="text-brand-600 text-xs font-extrabold tracking-widest uppercase">
                    Email Us
                  </h3>
                  <p className="text-brand-600 mt-2 truncate text-base font-semibold">
                    {email}
                  </p>
                  <p className="text-muted mt-1 text-xs font-medium">
                    We usually respond within 24 hours.
                  </p>
                </div>
              </div>

              <div className="relative mt-6">
                <ButtonAnimation
                  href={`mailto:${email}`}
                  big="Send Email directly"
                  icon={<FaPaperPlane className="size-3" />}
                  variant="solid"
                  accent="#ffffff"
                  className="!h-10 !px-4 !text-xs from-brand-500 to-brand-600 !bg-gradient-to-r"
                />
              </div>
            </div>

            {/* Support hours */}
            <div
              className="border-brand-500/35 bg-brand-500/6 text-brand-600 flex items-center gap-3 rounded-2xl border border-dashed px-5 py-4 text-xs font-semibold"
              style={{
                opacity: inView ? 1 : 0,
                transition: `opacity 800ms ${EASE} 350ms`,
              }}
            >
              <FaClock className="text-brand-600 size-4 shrink-0" />
              <span>Customer Support Active: Monday – Friday (9AM – 6PM EST)</span>
            </div>
          </div>

          {/* ----- Form ----- */}
          <div
            className="border-brand-500/15 relative overflow-hidden rounded-3xl border bg-white/90 p-7 shadow-[0_30px_60px_-40px_rgba(15,23,42,0.25)] backdrop-blur-xl sm:p-9"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "translateY(0)" : "translateY(24px)",
              transition: `all 800ms ${EASE} 350ms`,
            }}
          >
            {/* sweeping top light */}
            <span className="pointer-events-none absolute inset-x-0 top-0 h-[2px] overflow-hidden">
              <span
                className="ct-anim from-brand-500 to-brand-600 absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r"
                style={{ animation: "ct-sweep 3.2s ease-in-out infinite" }}
              />
            </span>

            {status === "sent" ? (
              /* ---------- Success ---------- */
              <div className="flex min-h-[24rem] flex-col items-center justify-center text-center">
                <span
                  className="ct-anim from-brand-500 to-brand-600 grid size-20 place-items-center rounded-full bg-gradient-to-br text-white"
                  style={{
                    boxShadow: "0 20px 40px -18px rgb(var(--brand-500-rgb)/0.7)",
                    animation: `ct-pop 700ms ${EASE} both`,
                  }}
                >
                  <FaCheck className="size-9" />
                </span>
                <h3 className="text-brand-600 mt-6 text-2xl font-extrabold">
                  Message Sent Successfully!
                </h3>
                <p className="text-muted mt-2 text-sm font-medium">
                  Thank you for contacting us. A confirmation has been sent to{" "}
                  <span className="text-brand-600 font-bold">{values.email}</span>.
                </p>

                <div className="mt-8">
                  <ButtonAnimation
                    onClick={handleReset}
                    big="Send Another Message"
                    variant="solid"
                    accent="#ffffff"
                    className="!h-12 !px-8 from-brand-500 to-brand-600 !bg-gradient-to-r"
                  />
                </div>
              </div>
            ) : (
              /* ---------- Form ---------- */
              <form onSubmit={handleSubmit} noValidate className="relative">
                <div className="border-brand-500/10 flex items-center justify-between border-b pb-5">
                  <h3 className="text-brand-600 text-2xl font-extrabold">
                    Send Us a Message
                  </h3>
                  <span className="text-brand-600 text-xs font-semibold">
                    {completedFields === 3 ? "Ready" : `${completedFields} of 3`}
                  </span>
                </div>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <Field
                    id="name"
                    label="Your Name"
                    required
                    value={values.name}
                    onChange={handleChange("name")}
                    onBlur={handleBlur("name")}
                    placeholder="John Doe"
                    error={touched.name && errors.name}
                    className={fieldCls(!!(touched.name && errors.name))}
                  />
                  <Field
                    id="email"
                    label="Your Email"
                    required
                    type="email"
                    value={values.email}
                    onChange={handleChange("email")}
                    onBlur={handleBlur("email")}
                    placeholder="john@example.com"
                    error={touched.email && errors.email}
                    className={fieldCls(!!(touched.email && errors.email))}
                  />
                  <div className="sm:col-span-2">
                    <Field
                      id="subject"
                      label="Subject"
                      required
                      value={values.subject}
                      onChange={handleChange("subject")}
                      onBlur={handleBlur("subject")}
                      placeholder="How can we help you?"
                      error={touched.subject && errors.subject}
                      className={fieldCls(!!(touched.subject && errors.subject))}
                    />
                  </div>
                  <div className="grid gap-1.5 sm:col-span-2">
                    <label
                      htmlFor="message"
                      className="text-brand-600 text-xs font-bold tracking-wider uppercase"
                    >
                      Message{" "}
                      <span className="text-muted font-normal">(Optional)</span>
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={values.message}
                      onChange={handleChange("message")}
                      placeholder="Write your details here..."
                      className={`${fieldCls(false)} resize-y`}
                    />
                  </div>
                </div>

                {status === "error" && (
                  <p
                    className="border-danger/35 bg-danger/8 mt-4 flex items-center gap-2 rounded-2xl border px-4 py-3 text-xs font-bold"
                    style={{ color: DANGER }}
                  >
                    <FaExclamationCircle className="size-4 shrink-0" />
                    Failed to send message. Please try again or email us directly.
                  </p>
                )}

                <div className="mt-7 flex justify-end">
                  <ButtonAnimation
                    type="submit"
                    onClick={handleSubmit as unknown as React.MouseEventHandler<HTMLButtonElement>}
                    disabled={status === "sending"}
                    big={status === "sending" ? "Sending..." : "Send Message"}
                    icon={<FaPaperPlane className="size-4" />}
                    variant="solid"
                    accent="#ffffff"
                    className="!h-12 !px-8 from-brand-500 to-brand-600 !bg-gradient-to-r cursor-pointer"
                  />
                </div>
              </form>
            )}

            {/* progress bar */}
            {status !== "sent" && (
              <span className="bg-brand-500/10 absolute inset-x-0 bottom-0 h-[3px]">
                <span
                  className="from-brand-500 to-brand-600 absolute inset-0 origin-left bg-gradient-to-r transition-transform duration-500"
                  style={{
                    transform: `scaleX(${completedFields / 3})`,
                    transitionTimingFunction: EASE,
                  }}
                />
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Small reusable field                                                */
/* ------------------------------------------------------------------ */
function Field({
  id,
  label,
  required,
  type = "text",
  value,
  onChange,
  onBlur,
  placeholder,
  error,
  className,
}: {
  id: string;
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  placeholder: string;
  error?: string | false;
  className: string;
}) {
  return (
    <div className="relative pb-6 grid gap-1.5">
      <label
        htmlFor={id}
        className="text-brand-600 text-xs font-bold tracking-wider uppercase"
      >
        {label} {required && <span style={{ color: DANGER }}>*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={className}
      />
      {error && (
        <span
          className="absolute left-0 bottom-0 flex items-center gap-1 text-xs font-semibold"
          style={{ color: DANGER }}
        >
          <FaExclamationCircle className="size-3" /> {error}
        </span>
      )}
    </div>
  );
}