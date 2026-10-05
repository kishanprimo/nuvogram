"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BottomToTop from "./BottomToTop";

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Handle hash scroll when navigating to home page with a hash
    if (pathname === "/") {
      const hash = window.location.hash.slice(1);
      if (hash) {
        const element = document.getElementById(hash);
        if (element) {
          // Small delay to ensure the page is fully rendered
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth" });
          }, 100);
        }
      }
    }
  }, [pathname, searchParams]);

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <BottomToTop />
    </>
  );
}
