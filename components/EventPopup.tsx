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

const STORAGE_KEY = "event_popup_dismissed";
const DISMISS_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export default function EventPopup() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (dismissed && Date.now() - Number(dismissed) < DISMISS_DURATION_MS) return;

    fetch("/api/announcement")
      .then((r) => r.json())
      .then((data) => {
        if (data?.id) {
          setAnnouncement(data);
          // Slight delay so the page settles first
          setTimeout(() => setVisible(true), 1200);
        }
      })
      .catch(() => {});
  }, []);

  const dismiss = () => {
    setVisible(false);
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
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
            className="fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
          />

          {/* Card */}
          <motion.div
            key="card"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none px-6"
          >
            <div className="pointer-events-auto w-full max-w-sm bg-[#0d0d0d] border border-white/[0.1] rounded-2xl overflow-hidden shadow-2xl">

              {/* Top accent line */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              <div className="p-7">
                {/* Label */}
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[10px] font-mono text-white/30 uppercase tracking-[0.2em]">
                    Upcoming event
                  </span>
                  <button
                    onClick={dismiss}
                    className="text-white/25 hover:text-white/60 transition-colors text-lg leading-none -mr-1"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-white leading-snug mb-2">
                  {announcement.title}
                </h2>

                {/* Subtitle */}
                {announcement.subtitle && (
                  <p className="text-sm text-white/45 leading-relaxed mb-5">
                    {announcement.subtitle}
                  </p>
                )}

                {/* Meta pills */}
                {(announcement.event_date || announcement.location) && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {announcement.event_date && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-white/50 bg-white/[0.04] border border-white/[0.07] rounded-full px-3 py-1">
                        <span className="text-white/25">📅</span>
                        {announcement.event_date}
                      </span>
                    )}
                    {announcement.location && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-mono text-white/50 bg-white/[0.04] border border-white/[0.07] rounded-full px-3 py-1">
                        <span className="text-white/25">📍</span>
                        {announcement.location}
                      </span>
                    )}
                  </div>
                )}

                {/* CTA */}
                <div className="flex items-center gap-3">
                  {announcement.cta_link ? (
                    <a
                      href={announcement.cta_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center py-2.5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-white/90 transition-colors"
                    >
                      {announcement.cta_text || "Book now"}
                    </a>
                  ) : (
                    <div className="flex-1 text-center py-2.5 rounded-xl bg-white/10 text-white/60 text-sm font-semibold">
                      {announcement.cta_text || "Stay tuned"}
                    </div>
                  )}
                  <button
                    onClick={dismiss}
                    className="px-4 py-2.5 rounded-xl border border-white/[0.08] text-white/30 text-sm hover:text-white/60 hover:border-white/[0.15] transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>

              {/* Bottom accent */}
              <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
