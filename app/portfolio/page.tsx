"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { EASE } from "@/lib/easing";

const photos = [
  { src: "/photos/20251004-DSC01534.jpg", alt: "Cross country race start", category: "Cross Country", ratio: 4 / 3 },
  { src: "/photos/finals-11.JPG", alt: "Payton athlete celebrates at finish", category: "Track & Field", ratio: 3 / 4 },
  { src: "/photos/20251108-DSC03049.jpg", alt: "Cross country race in autumn", category: "Cross Country", ratio: 3 / 2 },
  { src: "/photos/finals-19.JPG", alt: "Peoria Christian athlete", category: "Track & Field", ratio: 4 / 3 },
  { src: "/photos/finals-12.JPG", alt: "Payton athletes look to the sky", category: "Track & Field", ratio: 3 / 4 },
  { src: "/photos/20251010-DSC02484.jpg", alt: "Athlete celebrates with teammates", category: "Cross Country", ratio: 4 / 3 },
  { src: "/photos/IMG_3786.JPG", alt: "Elite marathon runner", category: "Road Racing", ratio: 4 / 5 },
  { src: "/photos/finals-20.JPG", alt: "Athletes embrace after race", category: "Track & Field", ratio: 3 / 4 },
  { src: "/photos/20251108-DSC03732.jpg", alt: "Cross country finish celebration", category: "Cross Country", ratio: 4 / 3 },
];

const categories = ["All", "Cross Country", "Track & Field", "Road Racing"];

export default function PortfolioPage() {
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const touchStartX = useRef(0);

  const filtered = active === "All" ? photos : photos.filter((p) => p.category === active);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => i !== null ? (i + 1) % filtered.length : null);
      if (e.key === "ArrowLeft") setLightbox((i) => i !== null ? (i - 1 + filtered.length) % filtered.length : null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, filtered.length]);

  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

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
          <span className="text-xs font-mono text-white/25 tracking-[0.3em] uppercase">Portfolio</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-4"
        >
          The work.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="text-[#86868b] text-lg mb-12"
        >
          Track & field, cross country, and road racing.
        </motion.p>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-wrap gap-2 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-2 rounded-full text-xs font-mono tracking-widest uppercase transition-all duration-200 ${
                active === cat
                  ? "bg-white text-black"
                  : "border border-white/10 text-white/40 hover:border-white/30 hover:text-white/70"
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Masonry grid */}
        <motion.div layout className="columns-2 md:columns-3 gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((photo, i) => (
              <motion.div
                key={photo.src}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35, delay: i * 0.04, ease: EASE }}
                className="break-inside-avoid mb-3 cursor-pointer group"
                onClick={() => setLightbox(i)}
              >
                <div
                  className="relative overflow-hidden rounded-xl"
                  style={{ aspectRatio: photo.ratio }}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-xs font-mono text-white/60 tracking-widest uppercase">
                      {photo.category}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[500] bg-black/95 flex items-center justify-center"
            onClick={() => setLightbox(null)}
            onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              const delta = touchStartX.current - e.changedTouches[0].clientX;
              if (Math.abs(delta) > 50) {
                e.stopPropagation();
                setLightbox((i) =>
                  i !== null
                    ? delta > 0 ? (i + 1) % filtered.length : (i - 1 + filtered.length) % filtered.length
                    : null
                );
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
              className="relative max-w-[92vw] max-h-[88vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={filtered[lightbox].src}
                alt={filtered[lightbox].alt}
                width={1800}
                height={1400}
                className="object-contain max-h-[88vh] w-auto rounded-lg"
              />
              <p className="mt-3 text-center text-xs font-mono text-white/30 tracking-widest uppercase">
                {filtered[lightbox].category}
              </p>
            </motion.div>

            <button
              aria-label="Previous"
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 hover:text-white text-2xl transition-colors"
              onClick={(e) => { e.stopPropagation(); setLightbox((i) => i !== null ? (i - 1 + filtered.length) % filtered.length : null); }}
            >←</button>
            <button
              aria-label="Next"
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white/30 hover:text-white text-2xl transition-colors"
              onClick={(e) => { e.stopPropagation(); setLightbox((i) => i !== null ? (i + 1) % filtered.length : null); }}
            >→</button>
            <button
              aria-label="Close"
              className="absolute top-6 right-6 text-white/30 hover:text-white text-xs font-mono tracking-widest uppercase transition-colors"
              onClick={() => setLightbox(null)}
            >ESC</button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
