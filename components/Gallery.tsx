"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import { EASE } from "@/lib/easing";

const categories = ["All", "Track & Field", "Cross Country", "Road Racing"];

const photos = [
  {
    id: 1,
    category: "Cross Country",
    aspect: "aspect-[3/2]",
    src: "/photos/20251004-DSC01534.jpg",
    alt: "Cross country race start",
  },
  {
    id: 2,
    category: "Track & Field",
    aspect: "aspect-[3/4]",
    src: "/photos/finals-11.JPG",
    alt: "Payton athlete celebrates at finish line",
  },
  {
    id: 3,
    category: "Track & Field",
    aspect: "aspect-[4/3]",
    src: "/photos/finals-19.JPG",
    alt: "Peoria Christian athlete portrait",
  },
  {
    id: 4,
    category: "Cross Country",
    aspect: "aspect-[4/3]",
    src: "/photos/20251010-DSC02484.jpg",
    alt: "Athlete smiling with teammates after race",
  },
  {
    id: 5,
    category: "Cross Country",
    aspect: "aspect-[3/4]",
    src: "/photos/20251108-DSC03732.jpg",
    alt: "Cross country athlete celebrates finish",
  },
  {
    id: 6,
    category: "Track & Field",
    aspect: "aspect-[3/4]",
    src: "/photos/finals-20.JPG",
    alt: "Athletes embrace after race",
  },
  {
    id: 7,
    category: "Cross Country",
    aspect: "aspect-[3/2]",
    src: "/photos/20251108-DSC03049.jpg",
    alt: "Cross country race in autumn foliage",
  },
  {
    id: 8,
    category: "Track & Field",
    aspect: "aspect-[3/4]",
    src: "/photos/finals-12.JPG",
    alt: "Payton athletes look to the sky after race",
  },
  {
    id: 9,
    category: "Road Racing",
    aspect: "aspect-[4/5]",
    src: "/photos/IMG_3786.JPG",
    alt: "Elite marathon runner",
  },
  {
    id: 10,
    category: "Track & Field",
    aspect: "aspect-[3/4]",
    src: "/photos/DSC09137.png",
    alt: "Long jumper soaring through the air",
  },
  {
    id: 11,
    category: "Track & Field",
    aspect: "aspect-[4/3]",
    src: "/photos/DSC09368.jpg",
    alt: "Kenwood relay team baton exchange",
  },
];

function PhotoCard({
  photo,
  index,
}: {
  photo: (typeof photos)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: EASE }}
      className="break-inside-avoid mb-3"
    >
      <div className="group relative overflow-hidden rounded-xl cursor-pointer">
        <div className={`${photo.aspect} relative overflow-hidden bg-[#111]`}>
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          {/* Category label */}
          <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-xs font-mono text-white/70 tracking-widest uppercase">
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
          <div className="h-px flex-1 bg-white/[0.06]" />
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
                    ? "bg-white text-black"
                    : "text-white/40 border border-white/[0.08] hover:text-white/70 hover:border-white/20"
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
              <PhotoCard key={photo.id} photo={photo} index={i} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
