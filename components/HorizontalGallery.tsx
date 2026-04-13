"use client";

import { useRef, useEffect, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
  useInView,
} from "framer-motion";
import Image from "next/image";
import { EASE } from "@/lib/easing";

const photos = [
  { id: 1, src: "/photos/20251004-DSC01534.jpg", alt: "Cross country race start", category: "Cross Country", ratio: 4 / 3 },
  { id: 2, src: "/photos/finals-11.JPG", alt: "Payton athlete celebrates at finish", category: "Track & Field", ratio: 3 / 4 },
  { id: 3, src: "/photos/20251108-DSC03049.jpg", alt: "Cross country race in autumn", category: "Cross Country", ratio: 3 / 2 },
  { id: 4, src: "/photos/finals-19.JPG", alt: "Peoria Christian athlete", category: "Track & Field", ratio: 4 / 3 },
  { id: 5, src: "/photos/finals-12.JPG", alt: "Payton athletes look to the sky", category: "Track & Field", ratio: 3 / 4 },
  { id: 6, src: "/photos/20251010-DSC02484.jpg", alt: "Athlete celebrates with teammates", category: "Cross Country", ratio: 4 / 3 },
  { id: 7, src: "/photos/IMG_3786.JPG", alt: "Elite marathon runner", category: "Road Racing", ratio: 4 / 5 },
  { id: 8, src: "/photos/finals-20.JPG", alt: "Athletes embrace after race", category: "Track & Field", ratio: 3 / 4 },
  { id: 9, src: "/photos/20251108-DSC03732.jpg", alt: "Cross country finish celebration", category: "Cross Country", ratio: 4 / 3 },
];

export default function HorizontalGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [containerHeight, setContainerHeight] = useState("600vh");
  const [overflow, setOverflow] = useState(0);
  const touchStartX = useRef(0);

  const inView = useInView(headerRef, { once: true });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Ease-in/out at the start and end so it doesn't jerk
  const rawX = useTransform(
    scrollYProgress,
    [0, 0.04, 0.96, 1],
    [0, 0, -overflow, -overflow]
  );

  // Spring adds inertia — feels like the track has weight
  const x = useSpring(rawX, { stiffness: 80, damping: 22, mass: 0.6, restDelta: 0.5 });

  const progressScaleX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1]),
    { stiffness: 80, damping: 22, mass: 0.6 }
  );

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      const tw = trackRef.current.scrollWidth;
      const ww = window.innerWidth;
      const wh = window.innerHeight;
      const ov = Math.max(0, tw - ww);
      setOverflow(ov);
      // Extra vh so last photo fully rests before scroll resumes
      setContainerHeight(`${ov + wh * 1.4}px`);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedPhoto(null);
      if (selectedPhoto !== null) {
        if (e.key === "ArrowRight") setSelectedPhoto((p) => p !== null ? (p + 1) % photos.length : null);
        if (e.key === "ArrowLeft") setSelectedPhoto((p) => p !== null ? (p - 1 + photos.length) % photos.length : null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedPhoto]);

  useEffect(() => {
    document.body.style.overflow = selectedPhoto !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedPhoto]);

  return (
    <>
      {/* ─── Desktop: horizontal scroll ─── */}
      <section
        id="gallery"
        ref={containerRef}
        style={{ height: containerHeight }}
        className="relative hidden md:block"
      >
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
          {/* Header */}
          <div
            ref={headerRef}
            className="flex items-center justify-between px-10 pt-10 pb-6 shrink-0"
          >
            <motion.span
              initial={{ opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="text-xs font-mono text-white/25 tracking-[0.3em] uppercase"
            >
              01 / Gallery
            </motion.span>

            {/* Animated scroll hint */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex items-center gap-2 text-xs font-mono text-white/20 tracking-widest uppercase"
            >
              scroll
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              >
                →
              </motion.span>
            </motion.div>
          </div>

          {/* Track */}
          <div className="flex-1 flex items-center overflow-hidden">
            <motion.div
              ref={trackRef}
              className="flex gap-5 pl-[10vw]"
              style={{ x }}
            >
              {photos.map((photo, i) => (
                <motion.div
                  key={photo.id}
                  className="shrink-0 relative overflow-hidden rounded-2xl group cursor-pointer"
                  style={{
                    height: "62vh",
                    width: `calc(62vh * ${photo.ratio})`,
                  }}
                  initial={{ opacity: 0, y: 40 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.05 + i * 0.07, ease: EASE }}
                  onClick={() => setSelectedPhoto(i)}
                >
                  {/* Image scales on hover, not the card */}
                  <motion.div
                    className="absolute inset-0"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5, ease: EASE }}
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      className="object-cover"
                      sizes="60vw"
                    />
                  </motion.div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-400" />

                  {/* Category label */}
                  <motion.div
                    className="absolute bottom-4 left-4"
                    initial={{ opacity: 0, y: 6 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span className="text-xs font-mono text-white/70 tracking-widest uppercase">
                      {photo.category}
                    </span>
                  </motion.div>
                </motion.div>
              ))}
              {/* Trailing spacer */}
              <div className="shrink-0 w-[10vw]" />
            </motion.div>
          </div>

          {/* Progress bar + gallery link */}
          <div className="flex items-center gap-6 mx-10 mb-8 shrink-0">
            <div className="h-px flex-1 bg-white/[0.06]">
              <motion.div
                className="h-full bg-white/25 origin-left"
                style={{ scaleX: progressScaleX }}
              />
            </div>
            <a
              href="/galleries"
              className="text-xs font-mono text-white/25 tracking-widest uppercase hover:text-white/60 transition-colors duration-200 shrink-0"
            >
              Client galleries →
            </a>
          </div>
        </div>
      </section>

      {/* ─── Mobile: vertical masonry ─── */}
      <section id="gallery" className="md:hidden py-24 px-5">
        <div className="flex items-center gap-4 mb-12">
          <span className="text-xs font-mono text-white/25 tracking-[0.3em] uppercase">
            01 / Gallery
          </span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </div>
        <div className="columns-2 gap-3">
          {photos.map((photo, i) => (
            <motion.div
              key={photo.id}
              className="break-inside-avoid mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: EASE }}
              onClick={() => setSelectedPhoto(i)}
            >
              <div
                className="relative overflow-hidden rounded-xl"
                style={{ aspectRatio: photo.ratio }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  className="object-cover"
                  sizes="50vw"
                />
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a
            href="/galleries"
            className="text-xs font-mono text-white/25 tracking-widest uppercase hover:text-white/60 transition-colors duration-200"
          >
            Client galleries →
          </a>
        </div>
      </section>

      {/* ─── Lightbox ─── */}
      <AnimatePresence>
        {selectedPhoto !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[500] bg-black/95 flex items-center justify-center"
            onClick={() => setSelectedPhoto(null)}
            onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              const delta = touchStartX.current - e.changedTouches[0].clientX;
              if (Math.abs(delta) > 50) {
                e.stopPropagation();
                setSelectedPhoto((p) =>
                  p !== null
                    ? delta > 0 ? (p + 1) % photos.length : (p - 1 + photos.length) % photos.length
                    : null
                );
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="relative max-w-[92vw] max-h-[88vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={photos[selectedPhoto].src}
                alt={photos[selectedPhoto].alt}
                width={1800}
                height={1400}
                className="object-contain max-h-[88vh] w-auto rounded-lg"
              />
              <p className="mt-3 text-center text-xs font-mono text-white/30 tracking-widest uppercase">
                {photos[selectedPhoto].category}
              </p>
            </motion.div>

            <button
              aria-label="Previous photo"
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 hover:text-white text-2xl transition-colors"
              onClick={(e) => { e.stopPropagation(); setSelectedPhoto((p) => p !== null ? (p - 1 + photos.length) % photos.length : null); }}
            >←</button>
            <button
              aria-label="Next photo"
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white/30 hover:text-white text-2xl transition-colors"
              onClick={(e) => { e.stopPropagation(); setSelectedPhoto((p) => p !== null ? (p + 1) % photos.length : null); }}
            >→</button>
            <button
              aria-label="Close lightbox"
              className="absolute top-6 right-6 text-white/30 hover:text-white text-xs font-mono tracking-widest uppercase transition-colors"
              onClick={() => setSelectedPhoto(null)}
            >ESC</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
