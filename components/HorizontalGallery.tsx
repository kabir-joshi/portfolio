"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  AnimatePresence,
  useInView,
  MotionValue,
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

interface GalleryPhotoProps {
  photo: (typeof photos)[number];
  index: number;
  x: MotionValue<number>;
  inView: boolean;
  onClick: () => void;
}

function GalleryPhoto({ photo, index, x, inView, onClick }: GalleryPhotoProps) {
  const depthAmount = Math.sin(index * 1.3) * 20;
  const yParallax = useTransform(x, (xVal) => (xVal / 1400) * depthAmount);
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      className="shrink-0 relative overflow-hidden rounded-2xl group cursor-pointer"
      style={{
        height: "62vh",
        width: `calc(62vh * ${photo.ratio})`,
        y: yParallax,
      }}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay: 0.05 + index * 0.07, ease: EASE }}
      onClick={onClick}
    >
      {/* Skeleton shimmer while loading */}
      {!loaded && (
        <div className="absolute inset-0 shimmer rounded-2xl z-10" />
      )}

      <motion.div
        className="absolute inset-0"
        whileHover={{
          scale: 1.05,
          filter: [
            "brightness(1) saturate(1)",
            "brightness(1.35) saturate(0.8) hue-rotate(6deg)",
            "brightness(0.95) saturate(1.15) hue-rotate(-4deg)",
            "brightness(1.07) saturate(1.08)",
          ],
        }}
        transition={{
          scale: { duration: 0.5, ease: EASE },
          filter: { duration: 0.4, times: [0, 0.15, 0.5, 1] },
        }}
      >
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          className="object-cover"
          sizes="60vw"
          onLoad={() => setLoaded(true)}
        />
      </motion.div>

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-400" />

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
  );
}

export default function HorizontalGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const filmstripRef = useRef<HTMLDivElement>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const prevSelected = useRef<number | null>(null);
  const [shutterFlash, setShutterFlash] = useState(false);
  const overflowRef = useRef(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const lightboxTouchStartX = useRef(0);
  const isHorizGesture = useRef(false);
  const horizLockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const inView = useInView(headerRef, { once: true });

  const x = useMotionValue(0);

  const progressRaw = useTransform(x, (val) =>
    overflowRef.current > 0 ? Math.max(0, Math.min(1, -val / overflowRef.current)) : 0
  );
  const progressScaleX = useSpring(progressRaw, { stiffness: 120, damping: 30 });

  // Shutter flash when lightbox first opens
  useEffect(() => {
    if (selectedPhoto !== null && prevSelected.current === null) {
      setShutterFlash(true);
      const t = setTimeout(() => setShutterFlash(false), 180);
      return () => clearTimeout(t);
    }
    prevSelected.current = selectedPhoto;
  }, [selectedPhoto]);

  // Scroll filmstrip to keep active thumbnail centered
  useEffect(() => {
    if (selectedPhoto === null || !filmstripRef.current) return;
    const thumb = filmstripRef.current.children[selectedPhoto] as HTMLElement;
    if (thumb) thumb.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [selectedPhoto]);

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      const tw = trackRef.current.scrollWidth;
      const ww = window.innerWidth;
      const ov = Math.max(0, tw - ww);
      overflowRef.current = ov;
      const clamped = Math.max(-ov, Math.min(0, x.get()));
      x.set(clamped);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [x]);

  const handleWheel = useCallback(
    (e: WheelEvent) => {
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);

      if (!isHorizGesture.current && absX > absY && absX > 2) {
        isHorizGesture.current = true;
      }

      if (isHorizGesture.current && absX > 0) {
        e.preventDefault();
        const next = Math.max(-overflowRef.current, Math.min(0, x.get() - e.deltaX));
        x.set(next);

        if (horizLockTimer.current) clearTimeout(horizLockTimer.current);
        horizLockTimer.current = setTimeout(() => {
          isHorizGesture.current = false;
        }, 150);
      }
    },
    [x]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let locked: "x" | "y" | null = null;

    const onTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
      locked = null;
    };

    const onTouchMove = (e: TouchEvent) => {
      const dx = touchStartX.current - e.touches[0].clientX;
      const dy = touchStartY.current - e.touches[0].clientY;

      if (!locked) {
        locked = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      }

      if (locked === "x") {
        e.preventDefault();
        const next = Math.max(-overflowRef.current, Math.min(0, x.get() - dx));
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
        x.set(next);
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
    };
  }, [x]);

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
        className="relative hidden md:flex md:flex-col h-screen overflow-hidden"
      >
        {/* Header */}
        <div
          ref={headerRef}
          className="flex items-center justify-between px-10 pt-10 pb-6 shrink-0"
        >
          <motion.span
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-xs font-mono text-white/25 light:text-black/25 tracking-[0.3em] uppercase"
          >
            01 / Gallery
          </motion.span>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex items-center gap-2 text-xs font-mono text-white/20 light:text-black/20 tracking-widest uppercase"
          >
            scroll sideways
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
              <GalleryPhoto
                key={photo.id}
                photo={photo}
                index={i}
                x={x}
                inView={inView}
                onClick={() => setSelectedPhoto(i)}
              />
            ))}
            <div className="shrink-0 w-[10vw]" />
          </motion.div>
        </div>

        {/* Progress bar + gallery link */}
        <div className="flex items-center gap-6 mx-10 mb-8 shrink-0">
          <div className="h-px flex-1 bg-white/[0.06] light:bg-black/[0.06]">
            <motion.div
              className="h-full bg-white/25 light:bg-black/25 origin-left"
              style={{ scaleX: progressScaleX }}
            />
          </div>
          <a
            href="/galleries"
            className="text-xs font-mono text-white/25 light:text-black/25 tracking-widest uppercase hover:text-white/60 light:hover:text-black/60 transition-colors duration-200 shrink-0"
          >
            Client galleries →
          </a>
        </div>
      </section>

      {/* ─── Mobile: vertical masonry ─── */}
      <section id="gallery" className="md:hidden py-24 px-5">
        <div className="flex items-center gap-4 mb-12">
          <span className="text-xs font-mono text-white/25 light:text-black/25 tracking-[0.3em] uppercase">
            01 / Gallery
          </span>
          <div className="h-px flex-1 bg-white/[0.06] light:bg-black/[0.06]" />
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
            className="text-xs font-mono text-white/25 light:text-black/25 tracking-widest uppercase hover:text-white/60 light:hover:text-black/60 transition-colors duration-200"
          >
            Client galleries →
          </a>
        </div>
      </section>

      {/* ─── Shutter flash ─── */}
      <AnimatePresence>
        {shutterFlash && (
          <motion.div
            className="fixed inset-0 z-[600] bg-white pointer-events-none"
            initial={{ opacity: 0.55 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          />
        )}
      </AnimatePresence>

      {/* ─── Lightbox ─── */}
      <AnimatePresence>
        {selectedPhoto !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[500] bg-black/75 light:bg-white/75 backdrop-blur-2xl flex items-center justify-center"
            onClick={() => setSelectedPhoto(null)}
            onTouchStart={(e) => { lightboxTouchStartX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
              const delta = lightboxTouchStartX.current - e.changedTouches[0].clientX;
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
              className="relative max-w-[92vw] max-h-[88vh] sm:max-h-[74vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={photos[selectedPhoto].src}
                alt={photos[selectedPhoto].alt}
                width={1800}
                height={1400}
                className="object-contain max-h-[88vh] sm:max-h-[74vh] w-auto rounded-lg"
              />
              <div className="mt-3 flex items-center justify-center gap-6">
                <p className="text-xs font-mono text-white/30 light:text-black/30 tracking-widest uppercase">
                  {photos[selectedPhoto].category}
                </p>
                <span className="text-xs font-mono text-white/20 light:text-black/20 tabular-nums">
                  {String(selectedPhoto + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
                </span>
              </div>
            </motion.div>

            {/* Filmstrip */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.3, delay: 0.12 }}
              className="absolute bottom-5 left-0 right-0 hidden sm:flex justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                ref={filmstripRef}
                className="flex gap-1.5 overflow-x-auto px-6 py-1.5"
                style={{ scrollbarWidth: "none" }}
              >
                {photos.map((p, i) => (
                  <motion.button
                    key={p.id}
                    onClick={(e) => { e.stopPropagation(); setSelectedPhoto(i); }}
                    whileHover={{ scale: 1.12 }}
                    transition={{ duration: 0.15 }}
                    className={`relative shrink-0 overflow-hidden rounded-md focus:outline-none transition-opacity duration-200 ${
                      i === selectedPhoto
                        ? "ring-1 ring-white/60 light:ring-black/60 opacity-100"
                        : "opacity-30 hover:opacity-65"
                    }`}
                    style={{ width: 52, height: 38 }}
                    aria-label={`View photo ${i + 1}`}
                  >
                    <Image src={p.src} alt={p.alt} fill className="object-cover" sizes="52px" />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <button
              aria-label="Previous photo"
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 light:text-black/30 hover:text-white light:hover:text-black text-2xl transition-colors"
              onClick={(e) => { e.stopPropagation(); setSelectedPhoto((p) => p !== null ? (p - 1 + photos.length) % photos.length : null); }}
            >←</button>
            <button
              aria-label="Next photo"
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white/30 light:text-black/30 hover:text-white light:hover:text-black text-2xl transition-colors"
              onClick={(e) => { e.stopPropagation(); setSelectedPhoto((p) => p !== null ? (p + 1) % photos.length : null); }}
            >→</button>
            <button
              aria-label="Close lightbox"
              className="absolute top-6 right-6 text-white/30 light:text-black/30 hover:text-white light:hover:text-black text-xs font-mono tracking-widest uppercase transition-colors"
              onClick={() => setSelectedPhoto(null)}
            >ESC</button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
