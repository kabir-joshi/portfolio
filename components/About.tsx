"use client";

import { motion, useInView } from "framer-motion";
import type { Variants } from "framer-motion";
import { useRef } from "react";
import { EASE } from "@/lib/easing";

const skills = [
  "TypeScript",
  "Python",
  "Swift",
  "React",
  "Next.js",
  "Flask",
  "SpriteKit",
  "SwiftUI",
  "Tailwind CSS",
  "Git",
];

export default function About() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  return (
    <section id="about" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          ref={ref}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="text-xs font-mono text-white/25 tracking-[0.3em] uppercase">
            01 / About
          </span>
          <div className="h-px flex-1 bg-white/5" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-8 leading-tight">
              I build things
              <br />
              <span className="text-white/30">for the web & beyond.</span>
            </h2>
            <div className="space-y-5 text-white/50 leading-relaxed">
              <p>
                I&apos;m a developer with a passion for crafting clean,
                performant experiences. Whether it&apos;s a web app, a game, or
                a data tool — I care about the details.
              </p>
              <p>
                When I&apos;m not writing code, I&apos;m probably thinking about
                design, running, or finding the next problem worth solving.
              </p>
            </div>
          </motion.div>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
          >
            <p className="text-xs font-mono text-white/25 tracking-[0.2em] uppercase mb-6">
              Technologies
            </p>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              className="flex flex-wrap gap-2"
            >
              {skills.map((skill) => (
                <motion.span
                  key={skill}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, borderColor: "rgba(167,139,250,0.4)" }}
                  className="px-4 py-2 rounded-full text-sm text-white/60 border border-white/8 bg-white/2 cursor-default transition-colors duration-200 hover:text-white/90"
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
