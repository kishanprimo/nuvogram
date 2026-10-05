"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FaGooglePlay, FaApple } from "react-icons/fa";
import ButtonAnimation from "../common/ButtonAnimation";

const IMAGE_SRC = "/images/socialconnect.png";

 

export default function SocialConnect() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="download"
      aria-label="Download the Nuvogram app"
      className="text-foreground relative isolate w-full overflow-hidden px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32"
    >
      <div className="mx-auto w-full max-w-7xl 2xl:max-w-[96rem]">
        {/* ---------- Banner Outer Container ---------- */}
        <div
          className="relative rounded-[2rem] bg-gradient-to-r from-[#0099ff] via-[#0066eb] to-[#0a2540] p-8 shadow-2xl transition-all duration-1000 ease-[cubic-bezier(0.2,0.8,0.2,1)] sm:p-12 lg:p-16"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(32px)",
          }}
        >
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
            {/* ---- Left: Copy + Store Buttons ---- */}
            <div className="z-10 text-left">
              <h2 className="max-w-[20ch] text-3xl font-extrabold leading-[1.15] text-white sm:text-4xl md:text-5xl lg:text-5xl">
                Let&apos;s start your Social connect, Download your app today
              </h2>

              <div className="mt-8 flex flex-wrap items-center gap-4 sm:mt-10">
                <ButtonAnimation
                  href="https://play.google.com/store"
                  icon={<FaGooglePlay className="size-6" />}
                  small="GET IT ON"
                  big="Google Play"
                  accent="#00F076"
                  variant="glass"
                />
                <ButtonAnimation
                  href="https://www.apple.com/app-store/"
                  icon={<FaApple className="size-6" />}
                  small="AVAILABLE ON THE"
                  big="Apple Store"
                  accent="#A78BFA"
                  variant="glass"
                />
              </div>
            </div>

            {/* ---- Right: White Floating Card with Illustration ---- */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-md rounded-3xl bg-white p-4 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] transition-transform duration-500 hover:scale-[1.02] sm:p-6 lg:absolute lg:top-1/2 lg:-right-4 lg:w-[115%] lg:max-w-xl lg:-translate-y-1/2">
                <Image
                  src={IMAGE_SRC}
                  alt="People connecting through the Nuvogram app"
                  width={640}
                  height={657}
                  sizes="(min-width: 1024px) 36rem, 28rem"
                  draggable={false}
                  className="h-auto w-full select-none object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}