"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { EASE } from "@/lib/easing";

const R = 21;
const CIRC = 2 * Math.PI * R; // ~131.9

export default function ScrollToTop() {
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const strokeDashoffset = useTransform(smooth, [0, 1], [CIRC, 0]);

  const [visible, setVisible] = useState(false);
  useEffect(() => {
    return scrollYProgress.on("change", (v) => setVisible(v > 0.15));
  }, [scrollYProgress]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3, ease: EASE }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Scroll to top"
          className="fixed bottom-8 right-8 z-[200] w-12 h-12 flex items-center justify-center text-white light:text-black hover:opacity-80 transition-opacity duration-200"
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            className="absolute inset-0 -rotate-90"
            aria-hidden
          >
            {/* Track */}
            <circle
              cx="24"
              cy="24"
              r={R}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.15}
              strokeWidth="1.5"
            />
            {/* Progress arc */}
            <motion.circle
              cx="24"
              cy="24"
              r={R}
              fill="none"
              stroke="currentColor"
              strokeOpacity={0.55}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={CIRC}
              style={{ strokeDashoffset }}
            />
          </svg>
          <span className="relative z-10 text-sm leading-none opacity-60">↑</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
