"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring, useVelocity } from "framer-motion";
import type { Variants } from "framer-motion";
import Image from "next/image";
import { EASE } from "@/lib/easing";
import { useCallback, useEffect, useRef, useState } from "react";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(6px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, ease: EASE } },
};

const HERO_TICKER = [
  "IHSA State XC", "Chicago Marathon", "Cross Country",
  "Track & Field", "Road Racing", "2025 Season",
  "Golden Hour", "Finish Line",
];

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

function useScramble(text: string, active: boolean) {
  const [output, setOutput] = useState(text);
  useEffect(() => {
    if (!active) return;
    let frame = 0;
    const total = 28;
    const id = setInterval(() => {
      setOutput(
        text.split("").map((char, i) => {
          if (char === " ") return " ";
          if (frame >= (i / text.length) * total + 5) return char;
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }).join("")
      );
      frame++;
      if (frame > total + 6) clearInterval(id);
    }, 32);
    return () => clearInterval(id);
  }, [active, text]);
  return output;
}

function MagneticButton({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16 });
  const sy = useSpring(y, { stiffness: 220, damping: 16 });

  const onMove = (e: React.MouseEvent) => {
    const rect = ref.current!.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.32);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.32);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
    >
      {children}
    </motion.a>
  );
}

export default function Hero() {
  const { scrollY } = useScroll();
  const imageScale = useTransform(scrollY, [0, 700], [1, 1.1]);
  const textOpacity = useTransform(scrollY, [0, 350], [1, 0]);
  const textY = useTransform(scrollY, [0, 350], [0, -50]);

  // Scroll-velocity skew on hero heading
  const scrollVelocity = useVelocity(scrollY);
  const skewX = useTransform(scrollVelocity, [-3000, 0, 3000], [3, 0, -3]);
  const smoothSkewX = useSpring(skewX, { stiffness: 150, damping: 30 });

  const [scrambleActive, setScrambleActive] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setScrambleActive(true), 480);
    return () => clearTimeout(t);
  }, []);
  const heroName = useScramble("Kabir Joshi", scrambleActive);

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const imageParallaxX = useSpring(useTransform(mouseX, [-0.5, 0.5], [18, -18]), { stiffness: 50, damping: 18 });
  const imageParallaxY = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), { stiffness: 50, damping: 18 });

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - left) / width - 0.5);
    mouseY.set((e.clientY - top) / height - 0.5);
  }, [mouseX, mouseY]);

  const onMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <section
      className="relative h-screen overflow-hidden"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      {/* Hero photo with parallax zoom + mouse parallax */}
      <motion.div
        className="absolute inset-0"
        style={{ scale: imageScale, x: imageParallaxX, y: imageParallaxY }}
      >
        <Image
          src="/photos/IMG_3786.JPG"
          alt="Elite marathon runner"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
          data-cursor-view
        />
      </motion.div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/15" />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ opacity: textOpacity, y: textY }}
        className="relative z-10 h-full flex flex-col items-center justify-center px-6 text-center"
      >
        <motion.div variants={itemVariants}>
          <motion.span
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
            className="inline-block text-xs font-mono text-white/50 tracking-[0.35em] uppercase mb-10 px-4 py-2 rounded-full border border-white/15"
          >
            available for bookings
          </motion.span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          style={{ skewX: smoothSkewX }}
          className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter leading-none mb-4 text-white font-mono"
        >
          {heroName}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-sm font-mono text-white/50 tracking-[0.5em] uppercase mb-8"
        >
          Photography
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-white/60 max-w-md mx-auto leading-relaxed mb-12"
        >
          Every stride, every finish, every story worth telling.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <MagneticButton
            href="#gallery"
            className="px-8 py-3.5 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors duration-200"
          >
            View gallery
          </MagneticButton>
          <MagneticButton
            href="#booking"
            className="px-8 py-3.5 rounded-full border border-white/30 text-white text-sm font-medium hover:border-white/60 transition-colors duration-200"
          >
            Book a session
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Bottom ticker — opposite direction to top Marquee */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1.2 }}
        style={{ opacity: textOpacity }}
        className="absolute bottom-16 left-0 right-0 overflow-hidden z-10 pointer-events-none"
      >
        <div className="flex whitespace-nowrap animate-marquee-reverse">
          {[0, 1].map((copy) => (
            <span key={copy} className="flex shrink-0 items-center">
              {HERO_TICKER.map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-8 mx-8 text-[10px] font-mono text-white/15 tracking-[0.35em] uppercase"
                >
                  {item}
                  <span className="text-white/8">·</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        style={{ opacity: textOpacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
      >
        <span className="text-xs text-white/30 tracking-widest uppercase font-mono">
          scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent"
        />
      </motion.div>
    </section>
  );
}
