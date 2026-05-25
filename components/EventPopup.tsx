"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Announcement {
  id: string;
  title: string;
  subtitle?: string;
  event_date?: string;
  location?: string;
  cta_text?: string;
  cta_link?: string;
}


export default function EventPopup() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const key = "event_popup_last_shown";
    const last = localStorage.getItem(key);
    const today = new Date().toDateString();
    if (last === today) return;

    fetch("/api/announcement")
      .then((r) => r.json())
      .then((data) => {
        if (data?.id) {
          setAnnouncement(data);
          setTimeout(() => setVisible(true), 1200);
          localStorage.setItem(key, today);
        }
      })
      .catch(() => {});
  }, []);

  const dismiss = () => {
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && announcement && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={dismiss}
            className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-md"
          />

          {/* Card */}
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none px-5"
          >
            <div className="pointer-events-auto w-full max-w-lg bg-[#0d0d0d] border border-white/[0.1] rounded-3xl overflow-hidden shadow-2xl">

              {/* Top accent line */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />

              {/* Header band */}
              <div className="flex items-center justify-between px-8 pt-7 pb-0">
                <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.22em]">
                  Upcoming event
                </span>
                <button
                  onClick={dismiss}
                  className="text-white/25 hover:text-white/70 transition-colors text-2xl leading-none -mr-1 -mt-1"
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <div className="px-8 py-7">
                {/* Title */}
                <h2 className="text-3xl font-bold text-white leading-tight mb-3">
                  {announcement.title}
                </h2>

                {/* Subtitle */}
                {announcement.subtitle && (
                  <p className="text-base text-white/50 leading-relaxed mb-6">
                    {announcement.subtitle}
                  </p>
                )}

                {/* Meta pills */}
                {(announcement.event_date || announcement.location) && (
                  <div className="flex flex-wrap gap-2.5 mb-8">
                    {announcement.event_date && (
                      <span className="inline-flex items-center gap-2 text-sm font-mono text-white/55 bg-white/[0.05] border border-white/[0.08] rounded-full px-4 py-1.5">
                        <span>📅</span>
                        {announcement.event_date}
                      </span>
                    )}
                    {announcement.location && (
                      <span className="inline-flex items-center gap-2 text-sm font-mono text-white/55 bg-white/[0.05] border border-white/[0.08] rounded-full px-4 py-1.5">
                        <span>📍</span>
                        {announcement.location}
                      </span>
                    )}
                  </div>
                )}

                {/* CTA — always goes to booking section */}
                <div className="flex items-center gap-3">
                  <a
                    href="/#booking"
                    onClick={dismiss}
                    className="flex-1 text-center py-3.5 rounded-2xl bg-white text-black text-base font-semibold hover:bg-white/90 transition-colors"
                  >
                    {announcement.cta_text || "Book now"}
                  </a>
                  <button
                    onClick={dismiss}
                    className="px-5 py-3.5 rounded-2xl border border-white/[0.08] text-white/35 text-base hover:text-white/60 hover:border-white/[0.18] transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>

              {/* Bottom accent */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
