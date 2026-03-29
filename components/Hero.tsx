"use client";

import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { EASE } from "@/lib/easing";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE },
  },
};

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6">
      {/* Subtle top glow — like a light source above */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 900px 500px at 50% -60px, rgba(255,255,255,0.05) 0%, transparent 70%)",
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto text-center"
      >
        <motion.div variants={itemVariants}>
          <span className="inline-block text-xs font-mono text-white/30 tracking-[0.35em] uppercase mb-10 px-4 py-2 rounded-full border border-white/8">
            available for bookings
          </span>
        </motion.div>

        <motion.h1
          variants={itemVariants}
          className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter leading-none mb-5 text-white"
        >
          Kabir Joshi
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-sm font-mono text-[#86868b] tracking-[0.5em] uppercase mb-8"
        >
          Photography
        </motion.p>

        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-[#86868b] max-w-md mx-auto leading-relaxed mb-12"
        >
          Capturing moments. Creating stories.
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <a
            href="#gallery"
            className="px-8 py-3.5 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors duration-200"
          >
            View gallery
          </a>
          <a
            href="#booking"
            className="px-8 py-3.5 rounded-full border border-white/20 text-white/70 text-sm font-medium hover:border-white/40 hover:text-white transition-all duration-200"
          >
            Book a session
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          variants={itemVariants}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs text-white/20 tracking-widest uppercase font-mono">
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
