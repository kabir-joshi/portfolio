"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { EASE } from "@/lib/easing";

function RevealLine({
  children,
  delay = 0,
  inView,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  inView: boolean;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "105%" }}
        animate={inView ? { y: "0%" } : {}}
        transition={{ duration: 0.8, delay, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}

const stats = [
  { value: "50+", label: "shoots covered" },
  { value: "200+", label: "athletes photographed" },
  { value: "100+", label: "events documented" },
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const bodyRef = useRef<HTMLDivElement>(null);
  const bodyInView = useInView(bodyRef, { once: true, margin: "-60px" });

  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="text-xs font-mono text-white/25 tracking-[0.3em] uppercase">
            02 / About
          </span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Photo placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          >
            <div className="aspect-[3/4] rounded-2xl relative overflow-hidden">
              <Image
                src="/photos/finals-11.JPG"
                alt="Athlete celebrates at the finish line"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            </div>
          </motion.div>

          {/* Text */}
          <div ref={bodyRef} className="flex flex-col justify-center">
            {/* Heading with line reveals */}
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-8 leading-tight">
              <RevealLine delay={0.05} inView={bodyInView}>
                I shoot what
              </RevealLine>
              <RevealLine delay={0.15} inView={bodyInView}>
                <span className="text-[#86868b]">moves me.</span>
              </RevealLine>
            </h2>

            {/* Body text with line reveals */}
            <div className="space-y-5 text-[#86868b] leading-relaxed mb-12">
              <RevealLine delay={0.25} inView={bodyInView}>
                I specialize in track & field, cross country, and road racing —
                the grit, the glory, the split-second moments that define
                competition.
              </RevealLine>
              <RevealLine delay={0.35} inView={bodyInView}>
                Whether it&apos;s a state championship or a local 5K, I bring
                the same attention to light, timing, and story to every event I
                cover.
              </RevealLine>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={bodyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
              className="grid grid-cols-3 gap-4 pt-8 border-t border-white/[0.06]"
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-[#86868b] font-mono leading-snug">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
