"use client";

import { motion, useInView, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { EASE } from "@/lib/easing";

function WordSpan({
  word,
  progress,
  threshold,
}: {
  word: string;
  progress: MotionValue<number>;
  threshold: number;
}) {
  const opacity = useTransform(
    progress,
    [threshold - 0.05, threshold, threshold + 0.05],
    [0.22, 1, 1]
  );
  return (
    <motion.span style={{ opacity }} className="inline">
      {word}{" "}
    </motion.span>
  );
}

function ReadingText({
  text,
  progress,
  start,
  end,
}: {
  text: string;
  progress: MotionValue<number>;
  start: number;
  end: number;
}) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <>
      {words.map((word, i) => {
        const t = start + (i / Math.max(words.length - 1, 1)) * (end - start);
        return <WordSpan key={i} word={word} progress={progress} threshold={t} />;
      })}
    </>
  );
}

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

function useCounter(target: number, inView: boolean, duration = 1400) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let startTime: number | null = null;
    const tick = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
      else setCount(target);
    };
    const id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, [inView, target, duration]);
  return count;
}

const stats = [
  { target: 50, suffix: "+", label: "shoots covered" },
  { target: 200, suffix: "+", label: "athletes photographed" },
  { target: 100, suffix: "+", label: "events documented" },
];

function StatCounter({ target, suffix, label, inView }: { target: number; suffix: string; label: string; inView: boolean }) {
  const count = useCounter(target, inView);
  return (
    <div>
      <div className="text-2xl font-bold text-white mb-1 font-mono tabular-nums">
        {count}{suffix}
      </div>
      <div className="text-xs text-[#86868b] font-mono leading-snug">{label}</div>
    </div>
  );
}

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const bodyRef = useRef<HTMLDivElement>(null);
  const bodyInView = useInView(bodyRef, { once: true, margin: "-60px" });

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  return (
    <section id="about" ref={sectionRef} className="py-32 px-6">
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
          {/* Photo with clip-path reveal */}
          <div className="aspect-[3/4] rounded-2xl overflow-hidden relative">
            <Image
              src="/photos/finals-11.JPG"
              alt="Athlete celebrates at the finish line"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            {/* Wipe reveal overlay */}
            <motion.div
              className="absolute inset-0 bg-[#080808] z-10"
              initial={{ x: "0%" }}
              animate={inView ? { x: "101%" } : {}}
              transition={{ duration: 1.1, delay: 0.1, ease: EASE }}
            />
          </div>

          {/* Text */}
          <div ref={bodyRef} className="flex flex-col justify-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-8 leading-tight">
              <RevealLine delay={0.05} inView={bodyInView}>
                I shoot what
              </RevealLine>
              <RevealLine delay={0.15} inView={bodyInView}>
                <span className="text-[#86868b]">moves me.</span>
              </RevealLine>
            </h2>

            <div className="space-y-5 text-[#86868b] leading-relaxed mb-12">
              <RevealLine delay={0.25} inView={bodyInView}>
                <ReadingText
                  text="I specialize in track & field, cross country, and road racing — the grit, the glory, the split-second moments that define competition."
                  progress={scrollYProgress}
                  start={0.25}
                  end={0.48}
                />
              </RevealLine>
              <RevealLine delay={0.35} inView={bodyInView}>
                <ReadingText
                  text="Whether it's a state championship or a local 5K, I bring the same attention to light, timing, and story to every event I cover."
                  progress={scrollYProgress}
                  start={0.42}
                  end={0.62}
                />
              </RevealLine>
            </div>

            {/* Animated stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={bodyInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.5, ease: EASE }}
              className="grid grid-cols-3 gap-4 pt-8 border-t border-white/[0.06]"
            >
              {stats.map((stat) => (
                <StatCounter key={stat.label} {...stat} inView={bodyInView} />
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
