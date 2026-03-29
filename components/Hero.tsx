"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { EASE } from "@/lib/easing";
import { useEffect, useRef } from "react";

function GradientOrb({
  className,
  delay = 0,
}: {
  className: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 2, delay, ease: "easeOut" }}
      className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
    />
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
      containerRef.current.style.setProperty("--mouse-x", `${x}px`);
      containerRef.current.style.setProperty("--mouse-y", `${y}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.12, delayChildren: 0.3 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: EASE },
    },
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6"
    >
      {/* Background orbs */}
      <GradientOrb
        className="w-[500px] h-[500px] bg-violet-600/15 -top-32 -left-32"
        delay={0}
      />
      <GradientOrb
        className="w-[400px] h-[400px] bg-indigo-600/10 bottom-0 right-0"
        delay={0.5}
      />
      <GradientOrb
        className="w-[300px] h-[300px] bg-purple-500/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        delay={1}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto text-center"
      >
        <motion.div variants={itemVariants}>
          <span className="inline-block text-xs font-mono text-white/30 tracking-[0.3em] uppercase mb-8 px-4 py-2 rounded-full border border-white/5 bg-white/2">
            available for bookings
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter leading-none mb-4"
        >
          <span className="text-white">Kabir</span>
          <br />
          <span
            className="text-transparent bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #a78bfa 0%, #818cf8 50%, #c084fc 100%)",
            }}
          >
            Joshi
          </span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-xs font-mono text-white/20 tracking-[0.5em] uppercase mb-8"
        >
          Photography
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-white/40 max-w-lg mx-auto leading-relaxed mb-12"
        >
          Capturing moments. Creating stories.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#gallery"
            className="group relative px-8 py-4 rounded-full bg-white text-black text-sm font-medium overflow-hidden transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10">View gallery</span>
            <div className="absolute inset-0 bg-gradient-to-r from-violet-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </a>
          <a
            href="#booking"
            className="px-8 py-4 rounded-full border border-white/10 text-white/70 text-sm font-medium hover:border-white/30 hover:text-white transition-all duration-300 hover:scale-105"
          >
            Book a session
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={itemVariants}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-white/20 tracking-widest uppercase">
            scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-px h-8 bg-gradient-to-b from-white/20 to-transparent"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
