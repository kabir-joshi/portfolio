"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { EASE } from "@/lib/easing";

const services = [
  {
    number: "01",
    title: "Portrait Session",
    description:
      "Individual, couple, or family portraits. Studio or on location. Focused on capturing genuine emotion and connection.",
    details: ["1–2 hours", "Outdoor or studio", "Edited gallery delivered"],
    cta: "Book a session",
  },
  {
    number: "02",
    title: "Event Coverage",
    description:
      "Half-day or full-day coverage. Weddings, graduations, brand activations — every moment documented.",
    details: ["Half or full day", "Multiple locations", "Turnaround within 2 weeks"],
    cta: "Book a session",
  },
  {
    number: "03",
    title: "Commercial & Custom",
    description:
      "Brand shoots, editorial, product, and custom projects. Let's build something together from the ground up.",
    details: ["Custom scope", "Usage licensing available", "Creative collaboration"],
    cta: "Get in touch",
  },
];

export default function Services() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="services" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="text-xs font-mono text-white/25 tracking-[0.3em] uppercase">
            03 / Services
          </span>
          <div className="h-px flex-1 bg-white/5" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-12"
        >
          What I offer
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-4">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: i * 0.12, ease: EASE }}
              whileHover={{ y: -4 }}
              className="group relative p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 overflow-hidden cursor-default"
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{
                  background:
                    "radial-gradient(300px circle at 50% 0%, rgba(167,139,250,0.06), transparent 60%)",
                }}
              />

              <span className="text-xs font-mono text-white/15 mb-6 block">
                {service.number}
              </span>
              <h3 className="text-2xl font-bold text-white mb-3">
                {service.title}
              </h3>
              <p className="text-white/40 text-sm leading-relaxed mb-6">
                {service.description}
              </p>

              <ul className="space-y-2 mb-8">
                {service.details.map((detail) => (
                  <li
                    key={detail}
                    className="flex items-center gap-2 text-xs text-white/25 font-mono"
                  >
                    <span className="w-px h-3 bg-violet-500/40 shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>

              <a
                href="#booking"
                className="inline-flex items-center gap-2 text-sm text-white/40 group-hover:text-white/70 transition-colors duration-200"
              >
                {service.cta}
                <span className="transform group-hover:translate-x-1 transition-transform duration-200">
                  →
                </span>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
