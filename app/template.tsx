"use client";

import { motion } from "framer-motion";

const CURTAIN_EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      {/* Black curtain that sweeps off to the right on every page enter */}
      <motion.div
        className="fixed inset-0 z-[9000] bg-black pointer-events-none origin-right"
        initial={{ scaleX: 1 }}
        animate={{ scaleX: 0 }}
        transition={{ duration: 0.75, ease: CURTAIN_EASE, delay: 0.05 }}
      />
    </>
  );
}
