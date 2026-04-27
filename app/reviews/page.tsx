"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { EASE } from "@/lib/easing";
import Link from "next/link";

interface Review {
  id: string;
  name: string;
  rating: number;
  body: string;
  event: string | null;
  createdAt: string;
}

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`text-xl leading-none ${star <= value ? "text-white" : "text-white/15"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function ReviewCard({ review, index, inView }: { review: Review; index: number; inView: boolean }) {
  const date = new Date(review.createdAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: (index % 12) * 0.05, ease: EASE }}
      className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
    >
      <div className="flex items-start justify-between mb-3">
        <StarRating value={review.rating} />
        <span className="text-xs font-mono text-white/20">{date}</span>
      </div>
      <p className="text-white/60 text-sm leading-relaxed mb-4">&ldquo;{review.body}&rdquo;</p>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-mono text-white/30">— {review.name}</span>
        {review.event && (
          <span className="text-xs font-mono text-white/20 truncate">{review.event}</span>
        )}
      </div>
    </motion.div>
  );
}

export default function ReviewsPage() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });
  const gridRef = useRef<HTMLDivElement>(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-60px" });

  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchReviews = useCallback(async () => {
    const res = await fetch("/api/reviews");
    if (res.ok) setReviews(await res.json());
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <main className="bg-black min-h-screen">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-36 pb-32">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-4 mb-12"
        >
          <span className="text-xs font-mono text-white/25 tracking-[0.3em] uppercase">Reviews</span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </motion.div>

        <div className="flex items-end justify-between mb-16 gap-4 flex-wrap">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-white"
          >
            What people say.
          </motion.h1>
          {reviews.length > 0 && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xs font-mono text-white/25 tracking-widest uppercase"
            >
              {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </motion.span>
          )}
        </div>

        <div ref={gridRef}>
          {reviews.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={gridInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6 }}
              className="text-white/25 text-sm font-mono"
            >
              No reviews yet.
            </motion.p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((review, i) => (
                <ReviewCard key={review.id} review={review} index={i} inView={gridInView} />
              ))}
            </div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={gridInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 pt-8 border-t border-white/[0.06]"
        >
          <Link
            href="/#reviews"
            className="text-sm text-white/30 hover:text-white/60 transition-colors duration-200 font-mono"
          >
            ← Leave a review
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
