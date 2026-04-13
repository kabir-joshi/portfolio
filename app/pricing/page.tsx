"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Navbar from "@/components/Navbar";
import { EASE } from "@/lib/easing";
import Link from "next/link";

const packages = [
  {
    name: "Event Coverage",
    tiers: [
      { label: "Half Day", duration: "Up to 4 hours", price: "$150" },
      { label: "Full Day", duration: "Up to 8 hours", price: "$275" },
    ],
    includes: [
      "50–150 edited photos",
      "Private online gallery",
      "Full-resolution downloads",
      "Delivered within 2 weeks",
    ],
    note: "Ideal for track meets, cross country races, and road races.",
  },
  {
    name: "Portrait Session",
    tiers: [
      { label: "Individual", duration: "1 hour", price: "$75" },
      { label: "Team", duration: "Up to 2 hours, 2–10 athletes", price: "$150" },
    ],
    includes: [
      "20–40 edited photos",
      "Outdoor or studio location",
      "Private online gallery",
      "Full-resolution downloads",
    ],
    note: "Great for athlete profiles, recruiting, and social media.",
  },
  {
    name: "Commercial & Custom",
    tiers: [
      { label: "Custom quote", duration: "Scoped to your project", price: "Let's talk" },
    ],
    includes: [
      "Flexible creative scope",
      "Usage licensing available",
      "Brand and editorial work",
      "Direct creative collaboration",
    ],
    note: "For brands, schools, and projects that need something unique.",
  },
];

const alwaysIncluded = [
  "Professional editing and color grading",
  "Private gallery delivery via Pixieset",
  "Full-resolution, export-ready files",
  "Personal use and social media license",
];

export default function PricingPage() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const includedRef = useRef<HTMLDivElement>(null);
  const includedInView = useInView(includedRef, { once: true, margin: "-60px" });

  return (
    <main className="bg-black min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-36 pb-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-12"
        >
          <span className="text-xs font-mono text-white/25 tracking-[0.3em] uppercase">Pricing</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-4"
        >
          Simple pricing.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="text-[#86868b] text-lg mb-20 max-w-xl"
        >
          No hidden fees. A 50% deposit holds your date — the balance is due on the day of the shoot.
        </motion.p>

        {/* Packages */}
        <div ref={ref} className="grid md:grid-cols-3 gap-4 mb-20">
          {packages.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
              className="flex flex-col p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
            >
              <h2 className="text-xl font-bold text-white mb-6">{pkg.name}</h2>

              <div className="space-y-3 mb-8">
                {pkg.tiers.map((tier) => (
                  <div key={tier.label} className="flex items-start justify-between gap-4 py-3 border-b border-white/[0.05] last:border-0">
                    <div>
                      <p className="text-sm font-medium text-white">{tier.label}</p>
                      <p className="text-xs text-white/35 font-mono mt-0.5">{tier.duration}</p>
                    </div>
                    <span className="text-sm font-mono text-white/80 shrink-0">{tier.price}</span>
                  </div>
                ))}
              </div>

              <ul className="space-y-2 mb-8 flex-1">
                {pkg.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-xs text-white/40 font-mono leading-snug">
                    <span className="text-white/20 mt-px shrink-0">—</span>
                    {item}
                  </li>
                ))}
              </ul>

              <p className="text-xs text-white/25 leading-relaxed italic">{pkg.note}</p>
            </motion.div>
          ))}
        </div>

        {/* Always included */}
        <motion.div
          ref={includedRef}
          initial={{ opacity: 0, y: 30 }}
          animate={includedInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: EASE }}
          className="mb-20 p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
        >
          <h3 className="text-xs font-mono text-white/25 tracking-[0.3em] uppercase mb-6">Always included</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {alwaysIncluded.map((item, i) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -10 }}
                animate={includedInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.07, ease: EASE }}
                className="flex items-center gap-3 text-sm text-white/60"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white/30 shrink-0" />
                {item}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Payment note + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={includedInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-8 border-t border-white/[0.06]"
        >
          <div className="space-y-1">
            <p className="text-xs font-mono text-white/25 tracking-widest uppercase">Payment</p>
            <p className="text-sm text-white/50">Venmo, Zelle, and PayPal accepted. 50% deposit to reserve your date.</p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <Link
              href="/faq"
              className="text-sm text-white/30 hover:text-white/60 transition-colors duration-200"
            >
              Read the FAQ
            </Link>
            <Link
              href="/#booking"
              className="px-6 py-3 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors duration-200"
            >
              Book a session
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
