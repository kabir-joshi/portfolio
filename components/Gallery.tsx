"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { EASE } from "@/lib/easing";

const categories = ["All", "Portraits", "Events", "Street"];

const photos = [
  { id: 1, category: "Portraits", aspect: "aspect-[3/4]" },
  { id: 2, category: "Events", aspect: "aspect-[4/3]" },
  { id: 3, category: "Street", aspect: "aspect-[3/4]" },
  { id: 4, category: "Portraits", aspect: "aspect-square" },
  { id: 5, category: "Events", aspect: "aspect-[3/4]" },
  { id: 6, category: "Street", aspect: "aspect-[4/3]" },
  { id: 7, category: "Portraits", aspect: "aspect-[4/3]" },
  { id: 8, category: "Events", aspect: "aspect-square" },
  { id: 9, category: "Street", aspect: "aspect-[3/4]" },
];

function PhotoPlaceholder({
  photo,
  index,
}: {
  photo: (typeof photos)[0];
  index: number;
}) {
  return (
    <motion.div
      key={photo.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: EASE }}
      className="break-inside-avoid mb-3"
    >
      <div className="group relative overflow-hidden rounded-xl cursor-pointer">
        <div
          className={`${photo.aspect} relative overflow-hidden`}
          style={{ background: "linear-gradient(160deg, #141414 0%, #0a0a0a 100%)" }}
        >
          {/* Camera icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              className="text-white/10"
            >
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-violet-600/0 group-hover:bg-violet-600/5 transition-colors duration-300" />
          <div className="absolute inset-0 border border-white/0 group-hover:border-white/8 rounded-xl transition-colors duration-300" />

          {/* Category label */}
          <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-xs font-mono text-white/35 tracking-widest uppercase">
              {photo.category}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Gallery() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [active, setActive] = useState("All");

  const filtered =
    active === "All" ? photos : photos.filter((p) => p.category === active);

  return (
    <section id="gallery" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="text-xs font-mono text-white/25 tracking-[0.3em] uppercase">
            01 / Gallery
          </span>
          <div className="h-px flex-1 bg-white/5" />
        </motion.div>

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-white"
          >
            Selected work
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex gap-2 flex-wrap"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`text-xs px-4 py-2 rounded-full font-mono transition-all duration-200 ${
                  active === cat
                    ? "bg-white/10 text-white border border-white/20"
                    : "text-white/30 border border-white/5 hover:text-white/60 hover:border-white/15"
                }`}
              >
                {cat}
              </button>
            ))}
          </motion.div>
        </div>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((photo, i) => (
              <PhotoPlaceholder key={photo.id} photo={photo} index={i} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
