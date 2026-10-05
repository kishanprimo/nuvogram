"use client";

import { useEffect, Suspense } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import BottomToTop from "./BottomToTop";

interface PageLayoutProps {
  children: React.ReactNode;
}

function PageLayoutContent({ children }: PageLayoutProps) {
  const pathname = usePathname();

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
  }, [pathname]);

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <BottomToTop />
    </>
  );
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <Suspense fallback={null}>
      <PageLayoutContent>{children}</PageLayoutContent>
    </Suspense>
  );
}
