"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { EASE } from "@/lib/easing";

const socials = [
  { label: "GitHub", href: "https://github.com/kabir-joshi" },
  { label: "LinkedIn", href: "#" },
  { label: "Twitter", href: "#" },
  { label: "Email", href: "mailto:hello@kabirj.com" },
];

export default function Contact() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="contact" className="py-32 px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-violet-600/5 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          ref={ref}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="text-xs font-mono text-white/25 tracking-[0.3em] uppercase">
            03 / Contact
          </span>
          <div className="h-px flex-1 bg-white/5" />
        </motion.div>

        <div className="max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
            className="text-5xl md:text-7xl font-bold tracking-tight leading-none mb-8"
          >
            <span className="text-white">Let&apos;s build</span>
            <br />
            <span className="text-white/20">something.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white/40 text-lg mb-12 leading-relaxed"
          >
            Have a project in mind or just want to chat? My inbox is always
            open.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap gap-4 mb-16"
          >
            <a
              href="mailto:hello@kabirj.com"
              className="group px-8 py-4 rounded-full bg-white text-black text-sm font-medium hover:bg-violet-300 transition-all duration-300 hover:scale-105"
            >
              Send an email
            </a>
          </motion.div>

          {/* Socials */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex flex-wrap gap-6"
          >
            {socials.map((social, i) => (
              <motion.a
                key={social.label}
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  social.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
                className="text-sm text-white/30 hover:text-white transition-colors duration-200 underline-offset-4 hover:underline"
              >
                {social.label}
              </motion.a>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="max-w-6xl mx-auto mt-32 pt-8 border-t border-white/5 flex items-center justify-between"
      >
        <span className="text-xs text-white/15 font-mono">
          © {new Date().getFullYear()} Kabir Joshi
        </span>
        <span className="text-xs text-white/15 font-mono">kabirj.com</span>
      </motion.div>
    </section>
  );
}
