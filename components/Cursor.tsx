"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion";

export default function Cursor() {
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const [label, setLabel] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const springCfg = { stiffness: 600, damping: 40, mass: 0.4 };
  const x = useSpring(mouseX, springCfg);
  const y = useSpring(mouseY, springCfg);

  useEffect(() => {
    setMounted(true);

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    const onEnter = (e: Event) => setLabel((e as CustomEvent<string>).detail);
    const onLeave = () => setLabel(null);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("cursor:enter", onEnter);
    window.addEventListener("cursor:leave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("cursor:enter", onEnter);
      window.removeEventListener("cursor:leave", onLeave);
    };
  }, [mouseX, mouseY]);

  if (!mounted) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 z-[999] pointer-events-none"
      style={{ x, y }}
    >
      <AnimatePresence mode="wait">
        {label ? (
          <motion.div
            key="pill"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.15 }}
            className="absolute -translate-x-1/2 -translate-y-1/2 bg-white text-black text-[11px] font-medium px-3.5 py-1.5 rounded-full whitespace-nowrap"
          >
            {label}
          </motion.div>
        ) : (
          <motion.div
            key="dot"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.15 }}
            className="absolute w-2.5 h-2.5 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
