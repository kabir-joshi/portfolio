"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { EASE } from "@/lib/easing";

function SplitText({ text, inView, baseDelay = 0.1 }: { text: string; inView: boolean; baseDelay?: number }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block overflow-hidden mr-[0.3em]">
          <motion.span
            className="inline-block"
            initial={{ y: "110%", filter: "blur(4px)" }}
            animate={inView ? { y: "0%", filter: "blur(0px)" } : {}}
            transition={{ duration: 0.7, delay: baseDelay + i * 0.1, ease: EASE }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </>
  );
}

interface Review {
  id: string;
  name: string;
  rating: number;
  body: string;
  event: string | null;
  createdAt: string;
}

const inputClass =
  "w-full bg-white/[0.03] light:bg-black/[0.03] border border-white/[0.08] light:border-black/[0.08] rounded-xl px-4 py-3 text-white/80 light:text-black/80 text-sm placeholder-white/20 light:placeholder-black/20 focus:outline-none focus:border-white/30 light:focus:border-black/30 focus:bg-white/[0.05] light:focus:bg-black/[0.05] transition-all duration-200";

function StarRating({
  value,
  onChange,
}: {
  value: number;
  onChange?: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  const interactive = !!onChange;

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (interactive ? hovered || value : value);
        return (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => interactive && setHovered(star)}
            onMouseLeave={() => interactive && setHovered(0)}
            className={`text-xl leading-none transition-colors duration-150 ${
              interactive ? "cursor-pointer" : "cursor-default"
            } ${filled ? "text-white" : "text-white/15"}`}
            aria-label={interactive ? `Rate ${star} star${star > 1 ? "s" : ""}` : undefined}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}

function ReviewCard({
  review,
  index,
  inView,
}: {
  review: Review;
  index: number;
  inView: boolean;
}) {
  const date = new Date(review.createdAt).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: EASE }}
      className="p-6 rounded-2xl border border-white/[0.06] light:border-black/[0.06] bg-white/[0.02] light:bg-black/[0.02]"
    >
      <div className="flex items-start justify-between mb-3">
        <StarRating value={review.rating} />
        <span className="text-xs font-mono text-white/20 light:text-black/20">{date}</span>
      </div>
      <p className="text-white/60 light:text-black/60 text-sm leading-relaxed mb-4">&ldquo;{review.body}&rdquo;</p>
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-mono text-white/30 light:text-black/30">— {review.name}</span>
        {review.event && (
          <span className="text-xs font-mono text-white/20 light:text-black/20 truncate">{review.event}</span>
        )}
      </div>
    </motion.div>
  );
}

export default function Reviews() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [reviews, setReviews] = useState<Review[]>([]);
  const [name, setName] = useState("");
  const [event, setEvent] = useState("");
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  const fetchReviews = useCallback(async () => {
    const res = await fetch("/api/reviews");
    if (res.ok) setReviews(await res.json());
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, rating, body, event }),
      });
      if (!res.ok) throw new Error();
      const newReview: Review = await res.json();
      setReviews((prev) => [newReview, ...prev]);
      setName("");
      setEvent("");
      setRating(0);
      setBody("");
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="reviews" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="text-xs font-mono text-white/25 light:text-black/25 tracking-[0.3em] uppercase">
            05 / Reviews
          </span>
          <div className="h-px flex-1 bg-white/[0.06] light:bg-black/[0.06]" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left: existing reviews */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white light:text-black mb-12">
              <SplitText text="What people say" inView={inView} />
            </h2>

            {reviews.length === 0 ? (
              <motion.p
                initial={{ opacity: 0 }}
                animate={inView ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-white/25 light:text-black/25 text-sm font-mono"
              >
                No reviews yet. Be the first.
              </motion.p>
            ) : (
              <div className="space-y-4">
                {reviews.slice(0, 3).map((review, i) => (
                  <ReviewCard key={review.id} review={review} index={i} inView={inView} />
                ))}
                {reviews.length > 3 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <Link
                      href="/reviews"
                      className="text-xs font-mono text-white/30 light:text-black/30 hover:text-white/60 light:hover:text-black/60 transition-colors duration-200 tracking-widest uppercase"
                    >
                      View All Reviews ({reviews.length})
                    </Link>
                  </motion.div>
                )}
              </div>
            )}
          </div>

          {/* Right: form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-mono text-white/25 light:text-black/25 tracking-widest uppercase mb-2">
                Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-white/25 light:text-black/25 tracking-widest uppercase mb-2">
                Event <span className="normal-case text-white/15">(optional)</span>
              </label>
              <input
                type="text"
                value={event}
                onChange={(e) => setEvent(e.target.value)}
                placeholder="e.g. IHSA State XC, Oct 2025"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-white/25 light:text-black/25 tracking-widest uppercase mb-2">
                Rating
              </label>
              <StarRating value={rating} onChange={setRating} />
            </div>

            <div>
              <label className="block text-xs font-mono text-white/25 light:text-black/25 tracking-widest uppercase mb-2">
                Review
              </label>
              <textarea
                required
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Share your experience..."
                rows={5}
                className={`${inputClass} resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={status === "submitting" || rating === 0}
              className="w-full py-4 rounded-xl bg-white light:bg-black text-black light:text-white text-sm font-medium hover:bg-white/90 light:hover:bg-black/90 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? "Submitting..." : "Leave a review"}
            </button>

            {status === "done" && (
              <p className="text-xs font-mono text-white/40 light:text-black/40 text-center">
                Thanks for your review!
              </p>
            )}
            {status === "error" && (
              <p className="text-xs font-mono text-red-400/60 text-center">
                Something went wrong. Please try again.
              </p>
            )}
          </motion.form>
        </div>
      </div>
    </section>
  );
}
