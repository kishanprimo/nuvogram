"use client";

import type { ReactNode, MouseEventHandler } from "react";

type ButtonAnimationProps = {
  /** Where the button links to (ignored when onClick is provided) */
  href?: string;
  /** Left-hand icon */
  icon?: ReactNode;
  /** Small label above the main text */
  small?: string;
  /** Main label */
  big: string;
  /** Accent color for glow, orbit particle and liquid gradient */
  accent?: string;
  /** Optional extra classes */
  className?: string;
  /** Background variant */
  variant?: "solid" | "glass";
  /** Size preset */
  size?: "md" | "sm";
  /** When provided, renders a <button> instead of <a> */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** Disabled state (button mode only) */
  disabled?: boolean;
  /** Button type (button mode only) */
  type?: "button" | "submit";
};

export default function ButtonAnimation({
  href = "#",
  icon,
  small,
  big,
  accent = "#ffffff",
  className = "",
  variant = "glass",
  size = "md",
  onClick,
  disabled = false,
  type = "button",
}: ButtonAnimationProps) {
  const isButton = typeof onClick === "function";

  const surface =
    variant === "glass"
      ? "border border-white/40 bg-white/10 backdrop-blur-md text-white hover:border-white hover:bg-white hover:text-[#0b3b8c]"
      : "text-white";

  const baseClasses = `store-btn group relative inline-flex items-center gap-3 overflow-hidden transition-[transform,background-color,border-color,color,box-shadow] duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] hover:-translate-y-1 hover:scale-[1.03] hover:shadow-lg active:scale-[0.98] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:scale-100 ${
    size === "md" ? "h-14 rounded-xl px-5" : "h-9 rounded-full px-4 text-xs font-semibold"
  } ${surface} ${className}`;

  const inner = (
    <>
      <span
        aria-hidden="true"
        className={`store-ring pointer-events-none absolute -inset-px opacity-70 motion-reduce:animate-none ${
          size === "sm" ? "rounded-full" : "rounded-xl"
        }`}
      />
      <span
        aria-hidden="true"
        className={`store-liquid pointer-events-none absolute inset-0 motion-reduce:animate-none ${
          size === "sm" ? "rounded-full" : "rounded-xl"
        }`}
      />
      <span
        aria-hidden="true"
        className={`store-breathe pointer-events-none absolute rounded-full motion-reduce:animate-none ${
          size === "sm" ? "-inset-4 blur-xl" : "-inset-6 blur-2xl"
        }`}
      />
      <span
        aria-hidden="true"
        className="store-orbit pointer-events-none absolute inset-0 motion-reduce:animate-none"
      >
        <span className="bg-[var(--accent)] absolute top-0 left-1/2 size-1.5 -translate-x-1/2 rounded-full shadow-[0_0_8px_var(--accent)]" />
      </span>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-[900ms] ease-out group-hover:translate-x-[400%] motion-reduce:transition-none"
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ring-2 ring-white/0 transition-all duration-500 group-hover:ring-white/50 motion-reduce:transition-none ${
          size === "sm" ? "rounded-full" : "rounded-xl"
        }`}
      />

      {icon && (
        <span className="relative z-10 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-125 group-hover:rotate-[8deg] motion-reduce:transition-none">
          {icon}
        </span>
      )}

      <span
        className={`relative z-10 flex flex-col leading-none ${
          size === "sm" ? "items-center" : "items-start"
        }`}
      >
        {small && (
          <span className="text-[0.6rem] font-medium tracking-widest uppercase opacity-80">
            {small}
          </span>
        )}
        <span className={size === "sm" ? "text-xs font-semibold" : "text-base font-semibold"}>
          {big}
        </span>
      </span>
    </>
  );

  if (isButton) {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={baseClasses}
        style={{ ["--accent" as string]: accent }}
      >
        {inner}
      </button>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={baseClasses}
      style={{ ["--accent" as string]: accent }}
    >
      {inner}
    </a>
  );
}