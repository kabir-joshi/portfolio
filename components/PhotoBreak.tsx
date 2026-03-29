"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { EASE } from "@/lib/easing";

interface PhotoBreakProps {
  src: string;
  alt: string;
  caption?: string;
  subcaption?: string;
}

export default function PhotoBreak({
  src,
  alt,
  caption,
  subcaption,
}: PhotoBreakProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1.06, 1.0]);
  const captionY = useTransform(scrollYProgress, [0.4, 0.9], [20, 0]);
  const captionOpacity = useTransform(scrollYProgress, [0.4, 0.7], [0, 1]);

  return (
    <section ref={ref} className="relative h-[70vh] md:h-screen overflow-hidden">
      <motion.div className="absolute inset-0" style={{ scale }}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="100vw"
          onMouseEnter={() =>
            window.dispatchEvent(
              new CustomEvent("cursor:enter", { detail: "View" })
            )
          }
          onMouseLeave={() =>
            window.dispatchEvent(new Event("cursor:leave"))
          }
        />
      </motion.div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Caption */}
      {caption && (
        <motion.div
          style={{ y: captionY, opacity: captionOpacity }}
          transition={{ ease: EASE }}
          className="absolute bottom-10 left-10 md:bottom-16 md:left-16"
        >
          {subcaption && (
            <p className="text-white/35 text-xs font-mono tracking-[0.3em] uppercase mb-2">
              {subcaption}
            </p>
          )}
          <p className="text-white text-3xl md:text-5xl font-bold tracking-tight leading-tight">
            {caption}
          </p>
        </motion.div>
      )}
    </section>
  );
}
