"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { EASE } from "@/lib/easing";

const steps = [
  {
    number: "01",
    title: "Reach out",
    description:
      "Fill out the booking form with your event details and vision. I'll respond within 24 hours to confirm availability and discuss the shoot.",
  },
  {
    number: "02",
    title: "We align",
    description:
      "A quick call or message to go over logistics — schedule, locations, key moments you want captured, and any specific shots you have in mind.",
  },
  {
    number: "03",
    title: "I shoot",
    description:
      "On the day, I handle everything. You focus on competing or cheering. I handle positioning, timing, and light — the technical stuff stays invisible.",
  },
  {
    number: "04",
    title: "You receive",
    description:
      "Edited, export-ready photos delivered via private gallery within two weeks. Full-resolution files, yours to keep.",
  },
];

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-32 px-6 border-t border-white/[0.04] light:border-black/[0.04]">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="text-xs font-mono text-white/25 light:text-black/25 tracking-[0.3em] uppercase">
            03 / How it works
          </span>
          <div className="h-px flex-1 bg-white/[0.06] light:bg-black/[0.06]" />
        </motion.div>

        {/* Animated connecting line */}
        <div className="hidden md:block h-px mb-8 bg-white/[0.04] light:bg-black/[0.04] overflow-hidden relative">
          <motion.div
            className="absolute inset-0 bg-white/25 light:bg-black/25 origin-left"
            initial={{ scaleX: 0 }}
            animate={inView ? { scaleX: 1 } : {}}
            transition={{ duration: 1.4, delay: 0.1, ease: EASE }}
          />
        </div>

        <div className="grid md:grid-cols-4 gap-px bg-white/[0.04] light:bg-black/[0.04] rounded-2xl overflow-hidden">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
              className="bg-black light:bg-[#f5f0eb] p-8 flex flex-col gap-6"
            >
              <span className="text-xs font-mono text-white/15 light:text-black/15">{step.number}</span>
              <div>
                <h3 className="text-lg font-semibold text-white light:text-black mb-3">{step.title}</h3>
                <p className="text-sm text-white/40 light:text-black/40 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
