"use client";

import { motion } from "framer-motion";
import { useEffect, useLayoutEffect, useState } from "react";
import { EASE } from "@/lib/easing";

const INTRO_KEY = "kj-intro-done";
const CURTAIN_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

// SSR-safe layout effect
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function Intro() {
  const [phase, setPhase] = useState<"show" | "exiting" | "done">("show");

  // Runs before paint — removes overlay instantly on revisits (no flash)
  useIsomorphicLayoutEffect(() => {
    if (sessionStorage.getItem(INTRO_KEY)) {
      setPhase("done");
    }
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem(INTRO_KEY)) return;

    document.body.style.overflow = "hidden";

    const exitTimer = setTimeout(() => setPhase("exiting"), 1600);
    const doneTimer = setTimeout(() => {
      setPhase("done");
      sessionStorage.setItem(INTRO_KEY, "1");
      document.body.style.overflow = "";
    }, 2600);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
      animate={{ y: phase === "exiting" ? "-100%" : "0%" }}
      transition={{ duration: 1.0, ease: CURTAIN_EASE }}
    >
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: phase === "exiting" ? 0 : 1,
          y: phase === "exiting" ? -10 : 0,
        }}
        transition={{ duration: 0.5, ease: EASE }}
        className="text-white font-bold text-7xl font-mono tracking-tight"
      >
        kj.
      </motion.span>
    </motion.div>
  );
}
