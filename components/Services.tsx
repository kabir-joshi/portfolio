"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { useCallback, useRef } from "react";
import { EASE } from "@/lib/easing";

function TiltCard({ children, className }: { children: React.ReactNode; className: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springX = useSpring(rotateX, { stiffness: 220, damping: 22 });
  const springY = useSpring(rotateY, { stiffness: 220, damping: 22 });

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(x * 10);
    rotateX.set(-y * 10);
  }, [rotateX, rotateY]);

  const onLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  return (
    <div style={{ perspective: 900 }} className="h-full">
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX: springX, rotateY: springY, transformStyle: "preserve-3d" }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  );
}

const services = [
  {
    number: "01",
    title: "Event Coverage",
    price: "From $150",
    description:
      "Track & field meets, cross country races, road races. Half-day or full-day. Every key moment documented.",
    details: ["Half or full day", "Multiple events/locations", "Turnaround within 2 weeks"],
    cta: "Book a session",
  },
  {
    number: "02",
    title: "Portrait Session",
    price: "From $75",
    description:
      "Individual or team athlete portraits. Studio or on location. Built around your story.",
    details: ["1–2 hours", "Outdoor or studio", "Edited gallery delivered"],
    cta: "Book a session",
  },
  {
    number: "03",
    title: "Commercial & Custom",
    price: "Custom pricing",
    description:
      "Brand shoots, editorial, and custom projects. Let's build something together from the ground up.",
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
            04 / Services
          </span>
          <div className="h-px flex-1 bg-white/[0.06]" />
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
              className="h-full"
            >
            <TiltCard className="group relative flex flex-col h-full p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all duration-300 cursor-default">
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono text-white/20">{service.number}</span>
                <span className="text-xs font-mono text-white/40">{service.price}</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {service.title}
              </h3>
              <p className="text-[#86868b] text-sm leading-relaxed mb-6">
                {service.description}
              </p>

              <ul className="space-y-2 mb-8 flex-1">
                {service.details.map((detail) => (
                  <li
                    key={detail}
                    className="flex items-center gap-2 text-xs text-white/30 font-mono"
                  >
                    <span className="w-px h-3 bg-white/20 shrink-0" />
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
            </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
