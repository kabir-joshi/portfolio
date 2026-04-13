"use client";

import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import type { Variants } from "framer-motion";
import Image from "next/image";
import { EASE } from "@/lib/easing";
import { useEffect, useRef, useState } from "react";

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
};

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

  const [scrambleActive, setScrambleActive] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setScrambleActive(true), 480);
    return () => clearTimeout(t);
  }, []);
  const heroName = useScramble("Kabir Joshi", scrambleActive);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Hero photo with parallax zoom */}
      <motion.div className="absolute inset-0" style={{ scale: imageScale }}>
        <Image
          src="/photos/IMG_3786.JPG"
          alt="Elite marathon runner"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
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
          <span className="inline-block text-xs font-mono text-white/50 tracking-[0.35em] uppercase mb-10 px-4 py-2 rounded-full border border-white/15">
            available for bookings
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
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
