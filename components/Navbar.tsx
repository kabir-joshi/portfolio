"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { EASE } from "@/lib/easing";
import Link from "next/link";

const SECTIONS = [
  { id: "gallery",  num: "01", label: "Gallery"  },
  { id: "about",    num: "02", label: "About"     },
  { id: "services", num: "04", label: "Services"  },
  { id: "reviews",  num: "05", label: "Reviews"   },
  { id: "booking",  num: "06", label: "Booking"   },
];

const links = [
  { label: "Portfolio", href: "/portfolio" },
  { label: "Pricing", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "Client Galleries", href: "/galleries" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<{ num: string; label: string } | null>(null);
  const pathname = usePathname();
  const { scrollYProgress } = useScroll();
  const progressScaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    if (pathname !== "/") return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const match = SECTIONS.find((s) => s.id === entry.target.id);
            if (match) setActiveSection(match);
          }
        }
      },
      { rootMargin: "-30% 0px -30% 0px", threshold: 0 }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href;

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/80 backdrop-blur-xl border-b border-white/[0.06]"
          : "bg-transparent"
      }`}
    >
      {/* Scroll progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-px w-full bg-white/30 origin-left"
        style={{ scaleX: progressScaleX }}
      />
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="text-white font-semibold tracking-tight text-lg hover:opacity-70 transition-opacity"
          >
            kj.
          </Link>
          <AnimatePresence mode="wait">
            {scrolled && activeSection && (
              <motion.span
                key={activeSection.num}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="hidden md:flex items-center gap-2 text-xs font-mono text-white/25 tracking-[0.25em] pointer-events-none"
              >
                <span className="text-white/10">·</span>
                {activeSection.num} / {activeSection.label.toUpperCase()}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors duration-200 relative group ${
                isActive(link.href) ? "text-white" : "text-white/50 hover:text-white"
              }`}
            >
              {link.label}
              {isActive(link.href) && (
                <motion.span
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-px bg-white/50"
                  transition={{ duration: 0.25, ease: EASE }}
                />
              )}
            </Link>
          ))}
          <Link
            href="/#booking"
            className="text-sm px-4 py-2 rounded-full border border-white/10 text-white/70 hover:text-white hover:border-white/30 transition-all duration-200"
          >
            Book a session
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-px bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-px bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-px bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#080808]/95 backdrop-blur-xl border-b border-white/5"
          >
            <nav className="flex flex-col px-6 py-6 gap-5">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`transition-colors text-lg ${
                    isActive(link.href) ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/#booking"
                onClick={() => setMenuOpen(false)}
                className="text-white/60 hover:text-white transition-colors text-lg"
              >
                Book a session
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
