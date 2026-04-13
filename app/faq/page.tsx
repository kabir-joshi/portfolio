"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Navbar from "@/components/Navbar";
import { EASE } from "@/lib/easing";
import Link from "next/link";

const sections = [
  {
    title: "Booking",
    items: [
      {
        q: "How do I book a shoot?",
        a: "Fill out the booking form on the home page with your event details. I'll follow up within 24 hours to confirm availability and go over logistics.",
      },
      {
        q: "Do you require a deposit?",
        a: "Yes — a 50% deposit is required to hold your date. The remaining balance is due on the day of the shoot.",
      },
      {
        q: "What is your cancellation policy?",
        a: "Cancellations more than 7 days out receive a full deposit refund. Cancellations within 7 days forfeit the deposit. If I have to cancel, you'll receive a full refund.",
      },
      {
        q: "How far in advance should I book?",
        a: "For planned events, 2–4 weeks ahead is ideal. That said, reach out regardless — if I'm available I'll make it work.",
      },
    ],
  },
  {
    title: "Delivery",
    items: [
      {
        q: "How many photos will I receive?",
        a: "Event coverage typically yields 50–150 edited photos depending on the length of the event. Portrait sessions deliver 20–40 edited images.",
      },
      {
        q: "How long until I get my photos?",
        a: "Edited photos are delivered within 2 weeks of the shoot via a private online gallery.",
      },
      {
        q: "How will I receive my photos?",
        a: "Through a private Pixieset gallery link. You can view, download, and share directly from there. Full-resolution files are always included.",
      },
      {
        q: "Can I request re-edits?",
        a: "Minor adjustments (exposure, crop) are included. Major re-edits or style changes are handled case by case.",
      },
    ],
  },
  {
    title: "Usage",
    items: [
      {
        q: "Can I post the photos on social media?",
        a: "Yes — all packages include a personal use and social media license. Please credit @kabirjphoto when posting.",
      },
      {
        q: "Can my school or team use the photos?",
        a: "Personal and team social media use is included. For use on school websites, print materials, or merchandise, reach out to discuss licensing.",
      },
      {
        q: "Can photos be used commercially?",
        a: "Commercial usage licensing is available with the Commercial & Custom package, or can be added on to any package. Get in touch to discuss.",
      },
    ],
  },
  {
    title: "Logistics",
    items: [
      {
        q: "Do you travel?",
        a: "Yes — I cover events across the Chicago area. For events further out, travel fees may apply. Just ask.",
      },
      {
        q: "Do you shoot in bad weather?",
        a: "Yes. Rain, cold, and wind are part of the sport. If conditions are severe enough to cancel the event, we'll reschedule.",
      },
      {
        q: "Can I request specific shots?",
        a: "Absolutely. Let me know athletes to focus on, specific moments, or locations beforehand and I'll prioritize them.",
      },
    ],
  },
];

function FAQItem({ q, a, delay, inView }: { q: string; a: string; delay: number; inView: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className="border-b border-white/[0.06]"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
      >
        <span className="text-sm text-white/70 group-hover:text-white transition-colors duration-200">{q}</span>
        <motion.span
          animate={{ rotate: open ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-white/25 text-lg leading-none shrink-0 group-hover:text-white/50 transition-colors duration-200"
        >
          +
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="overflow-hidden"
          >
            <p className="text-sm text-white/40 leading-relaxed pb-5 max-w-2xl">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FAQSection({ section, sectionIndex }: { section: typeof sections[0]; sectionIndex: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: sectionIndex * 0.05, ease: EASE }}
      className="mb-12"
    >
      <h2 className="text-xs font-mono text-white/25 tracking-[0.3em] uppercase mb-2">{section.title}</h2>
      <div>
        {section.items.map((item, i) => (
          <FAQItem
            key={item.q}
            q={item.q}
            a={item.a}
            delay={i * 0.05}
            inView={inView}
          />
        ))}
      </div>
    </motion.div>
  );
}

export default function FAQPage() {
  return (
    <main className="bg-black min-h-screen">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 pt-36 pb-32">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-12"
        >
          <span className="text-xs font-mono text-white/25 tracking-[0.3em] uppercase">FAQ</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-4"
        >
          Questions.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="text-[#86868b] text-lg mb-20"
        >
          If something isn&apos;t covered here, just reach out.
        </motion.p>

        {/* Sections */}
        {sections.map((section, i) => (
          <FAQSection key={section.title} section={section} sectionIndex={i} />
        ))}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
          className="mt-16 pt-10 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        >
          <div>
            <p className="text-white font-semibold mb-1">Still have questions?</p>
            <p className="text-sm text-white/40">Email me directly at mail@kabirj.com</p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <Link
              href="/pricing"
              className="text-sm text-white/30 hover:text-white/60 transition-colors duration-200"
            >
              View pricing
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
