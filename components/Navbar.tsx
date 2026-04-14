"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import { EASE } from "@/lib/easing";
import Link from "next/link";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$";

function useLogoScramble() {
  const [text, setText] = useState("kj.");
  useEffect(() => {
    const target = "kj.";
    let frame = 0;
    const total = 14;
    const id = setInterval(() => {
      setText(
        target.split("").map((char, i) => {
          if (char === ".") return ".";
          if (frame >= (i / target.length) * total + 4) return char;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }).join("")
      );
      frame++;
      if (frame > total + 5) clearInterval(id);
    }, 40);
    return () => clearInterval(id);
  }, []);
  return text;
}

function useHoverScramble(text: string) {
  const [output, setOutput] = useState(text);
  const animating = useRef(false);

  const scramble = useCallback(() => {
    if (animating.current) return;
    animating.current = true;
    let frame = 0;
    const total = 10;
    const id = setInterval(() => {
      setOutput(
        text.split("").map((char, i) => {
          if (char === " ") return " ";
          if (frame >= (i / text.length) * total + 3) return char;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }).join("")
      );
      frame++;
      if (frame > total + 4) {
        clearInterval(id);
        setOutput(text);
        animating.current = false;
      }
    }, 30);
  }, [text]);

  return { output, scramble };
}

function NavLink({
  label,
  href,
  active,
}: {
  label: string;
  href: string;
  active: boolean;
}) {
  const { output, scramble } = useHoverScramble(label);
  return (
    <Link
      href={href}
      onMouseEnter={scramble}
      className={`text-sm transition-colors duration-200 relative ${
        active
          ? "text-white light:text-black"
          : "text-white/50 light:text-black/50 hover:text-white light:hover:text-black"
      }`}
    >
      {output}
      {active && (
        <motion.span
          layoutId="nav-indicator"
          className="absolute -bottom-1 left-0 right-0 h-px bg-white/50 light:bg-black/50"
          transition={{ duration: 0.25, ease: EASE }}
        />
      )}
    </Link>
  );
}

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
  const [isLight, setIsLight] = useState(false);

  // Easter egg: 5 logo clicks → expanding rings
  const [logoClicks, setLogoClicks] = useState(0);
  const [easterEgg, setEasterEgg] = useState(false);
  const eggTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    // Only count rapid clicks (reset after 2s of no clicks)
    if (eggTimeout.current) clearTimeout(eggTimeout.current);
    setLogoClicks((c) => {
      const next = c + 1;
      if (next >= 5) {
        setEasterEgg(true);
        setTimeout(() => setEasterEgg(false), 1000);
        return 0;
      }
      eggTimeout.current = setTimeout(() => setLogoClicks(0), 2000);
      return next;
    });
    // Still navigate if it's the 5th click
    if (logoClicks < 4) e.preventDefault();
  }, [logoClicks]);

  useEffect(() => {
    const saved = localStorage.getItem("kj-theme");
    if (saved === "light") {
      setIsLight(true);
      document.documentElement.classList.add("light");
    }
  }, []);

  const toggleTheme = () => {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.classList.toggle("light", next);
    localStorage.setItem("kj-theme", next ? "light" : "dark");
  };
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
  const logoText = useLogoScramble();

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/80 light:bg-white/80 backdrop-blur-xl border-b border-white/[0.06] light:border-black/[0.06]"
          : "bg-transparent"
      }`}
    >
      {/* Scroll progress bar */}
      <motion.div
        className="absolute bottom-0 left-0 h-px w-full bg-white/30 light:bg-black/30 origin-left"
        style={{ scaleX: progressScaleX }}
      />
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="relative flex items-center gap-4">
          {/* Easter egg rings */}
          <AnimatePresence>
            {easterEgg && [0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute left-0 top-1/2 w-8 h-8 rounded-full border border-white/60 light:border-black/60 pointer-events-none"
                initial={{ scale: 1, opacity: 0.8, x: "-0%", y: "-50%" }}
                animate={{ scale: 5, opacity: 0, x: "-0%", y: "-50%" }}
                exit={{}}
                transition={{ duration: 0.8, delay: i * 0.14, ease: "easeOut" }}
              />
            ))}
          </AnimatePresence>

          <Link
            href="/"
            onClick={handleLogoClick}
            className="text-white light:text-black font-semibold tracking-tight text-lg hover:opacity-70 transition-opacity font-mono relative z-10"
          >
            {logoText}
          </Link>
          <AnimatePresence mode="wait">
            {scrolled && activeSection && (
              <motion.span
                key={activeSection.num}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="hidden md:flex items-center gap-2 text-xs font-mono text-white/25 light:text-black/25 tracking-[0.25em] pointer-events-none"
              >
                <span className="text-white/10 light:text-black/10">·</span>
                {activeSection.num} / {activeSection.label.toUpperCase()}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <NavLink
              key={link.href}
              label={link.label}
              href={link.href}
              active={isActive(link.href)}
            />
          ))}
          <button
            onClick={toggleTheme}
            aria-label="Toggle light mode"
            className="text-white/30 light:text-black/30 hover:text-white/70 light:hover:text-black/70 transition-colors duration-200 text-base leading-none"
            title={isLight ? "Switch to dark" : "Switch to light"}
          >
            {isLight ? "●" : "○"}
          </button>
          <Link
            href="/#booking"
            className="text-sm px-4 py-2 rounded-full border border-white/10 light:border-black/10 text-white/70 light:text-black/70 hover:text-white light:hover:text-black hover:border-white/30 light:hover:border-black/30 transition-all duration-200"
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
          <span className={`block w-5 h-px bg-white light:bg-black transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block w-5 h-px bg-white light:bg-black transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-px bg-white light:bg-black transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
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
            className="md:hidden bg-[#080808]/95 light:bg-white/95 backdrop-blur-xl border-b border-white/5 light:border-black/5"
          >
            <nav className="flex flex-col px-6 py-6 gap-5">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className={`transition-colors text-lg ${
                    isActive(link.href)
                      ? "text-white light:text-black"
                      : "text-white/60 light:text-black/60 hover:text-white light:hover:text-black"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/#booking"
                onClick={() => setMenuOpen(false)}
                className="text-white/60 light:text-black/60 hover:text-white light:hover:text-black transition-colors text-lg"
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
