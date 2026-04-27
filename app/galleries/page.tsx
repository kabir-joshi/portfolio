"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASE } from "@/lib/easing";
import Navbar from "@/components/Navbar";

interface Gallery {
  id: string;
  title: string;
  url: string | null;
  has_password: boolean;
  created_at: string;
}

function TermsModal({ onAccept, onDecline }: { onAccept: () => void; onDecline: () => void }) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [followedInstagram, setFollowedInstagram] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewBody, setReviewBody] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const handleAccept = async () => {
    if (reviewName.trim() && reviewRating > 0 && reviewBody.trim() && !reviewSubmitted) {
      await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: reviewName.trim(), rating: reviewRating, body: reviewBody.trim() }),
      });
    }
    onAccept();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onDecline}
    >
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.97 }}
        transition={{ duration: 0.3, ease: EASE }}
        className="relative w-full max-w-md bg-[#0a0a0a] border border-white/[0.08] rounded-2xl p-8 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-xs font-mono text-white/25 tracking-[0.3em] uppercase">Before you continue</span>
        <h2 className="text-2xl font-bold tracking-tight text-white mt-3 mb-6">A quick note</h2>

        <p className="text-sm text-white/55 leading-relaxed mb-6">
          These photos were made for you, and I put real care into every one of them. Please read the below before accessing your gallery.
        </p>

        <div className="space-y-3 mb-6">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div
              onClick={() => setAgreedToTerms(!agreedToTerms)}
              className={`mt-0.5 w-5 h-5 shrink-0 rounded-md border transition-all duration-200 flex items-center justify-center ${
                agreedToTerms
                  ? "bg-white border-white"
                  : "border-white/20 bg-white/[0.03] group-hover:border-white/40"
              }`}
            >
              {agreedToTerms && (
                <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span
              onClick={() => setAgreedToTerms(!agreedToTerms)}
              className="text-sm text-white/50 leading-relaxed select-none group-hover:text-white/70 transition-colors"
            >
              I agree to tag{" "}
              <span className="text-white/80 font-medium">@kabirjphoto</span> whenever I post these photos. I understand that failing to do so may result in being declined for future photos, paid or free.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <div
              onClick={() => setFollowedInstagram(!followedInstagram)}
              className={`mt-0.5 w-5 h-5 shrink-0 rounded-md border transition-all duration-200 flex items-center justify-center ${
                followedInstagram
                  ? "bg-white border-white"
                  : "border-white/20 bg-white/[0.03] group-hover:border-white/40"
              }`}
            >
              {followedInstagram && (
                <svg className="w-3 h-3 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span
              onClick={() => setFollowedInstagram(!followedInstagram)}
              className="text-sm text-white/50 leading-relaxed select-none group-hover:text-white/70 transition-colors"
            >
              I&apos;m following{" "}
              <a
                href="https://www.instagram.com/kabirjphoto/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/70 underline underline-offset-2 hover:text-white transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                @kabirjphoto on Instagram
              </a>
              . It means the world and helps more than you know.
            </span>
          </label>
        </div>

        {/* Review section */}
        <div className="border-t border-white/[0.06] pt-6 mb-6">
          <p className="text-xs font-mono text-white/25 uppercase tracking-[0.2em] mb-4">Leave a review <span className="normal-case tracking-normal">(optional)</span></p>
          <div className="space-y-3">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                  className={`text-xl leading-none transition-colors ${star <= reviewRating ? "text-white" : "text-white/15 hover:text-white/40"}`}
                >
                  ★
                </button>
              ))}
            </div>
            <input
              type="text"
              value={reviewName}
              onChange={(e) => setReviewName(e.target.value)}
              placeholder="Your name"
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-white/80 text-sm placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
            />
            <textarea
              value={reviewBody}
              onChange={(e) => setReviewBody(e.target.value)}
              placeholder="How was your experience?"
              rows={3}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-white/80 text-sm placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors resize-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleAccept}
            disabled={!agreedToTerms}
            className="w-full py-3 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {reviewName.trim() && reviewRating > 0 && reviewBody.trim() ? "Submit review & view gallery" : "View my gallery"}
          </button>
          <button
            onClick={onDecline}
            className="w-full py-2 text-white/25 text-xs font-mono hover:text-white/50 transition-colors"
          >
            Go back
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function GalleryCard({ gallery, index }: { gallery: Gallery; index: number }) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  const date = new Date(gallery.created_at).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  const openWithTerms = (url: string) => {
    setPendingUrl(url);
    setShowTerms(true);
  };

  const handleTermsAccept = () => {
    if (pendingUrl) window.open(pendingUrl, "_blank", "noopener,noreferrer");
    fetch(`/api/galleries/${gallery.id}`, { method: "PUT" });
    setShowTerms(false);
    setPendingUrl(null);
    setShowPasswordForm(false);
    setInput("");
  };

  const handleTermsDecline = () => {
    setShowTerms(false);
    setPendingUrl(null);
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setChecking(true);
    setError("");
    const res = await fetch(`/api/galleries/${gallery.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: input }),
    });
    if (res.ok) {
      const { url } = await res.json();
      openWithTerms(url);
    } else {
      setError("Wrong password.");
    }
    setChecking(false);
  };

  if (!gallery.has_password && gallery.url) {
    return (
      <>
        <AnimatePresence>
          {showTerms && (
            <TermsModal onAccept={handleTermsAccept} onDecline={handleTermsDecline} />
          )}
        </AnimatePresence>
        <motion.button
          onClick={() => openWithTerms(gallery.url!)}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.07, ease: EASE }}
          className="group block w-full text-left p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300"
        >
          <div className="flex items-start justify-between mb-8">
            <span className="text-xs font-mono text-white/20">{date}</span>
            <svg className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors duration-200 -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
          <h2 className="text-white font-semibold tracking-tight text-lg">{gallery.title}</h2>
          <p className="text-xs font-mono text-white/30 mt-1">View gallery →</p>
        </motion.button>
      </>
    );
  }

  return (
    <>
      <AnimatePresence>
        {showTerms && (
          <TermsModal onAccept={handleTermsAccept} onDecline={handleTermsDecline} />
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.07, ease: EASE }}
        className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
      >
        <div className="flex items-start justify-between mb-8">
          <span className="text-xs font-mono text-white/20">{date}</span>
          <span className="text-xs font-mono text-white/20">Private</span>
        </div>
        <h2 className="text-white font-semibold tracking-tight text-lg mb-4">{gallery.title}</h2>

        <AnimatePresence mode="wait">
          {!showPasswordForm ? (
            <motion.button
              key="unlock-btn"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPasswordForm(true)}
              className="text-xs font-mono text-white/40 hover:text-white/70 transition-colors"
            >
              Enter password →
            </motion.button>
          ) : (
            <motion.form
              key="unlock-form"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              onSubmit={handleUnlock}
              className="space-y-2"
            >
              <input
                type="password"
                value={input}
                onChange={(e) => { setInput(e.target.value); setError(""); }}
                placeholder="Password"
                autoFocus
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-lg px-3 py-2 text-white/80 text-sm placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
              />
              {error && <p className="text-xs font-mono text-red-400/60">{error}</p>}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={checking || !input}
                  className="flex-1 py-2 rounded-lg bg-white text-black text-xs font-medium hover:bg-white/90 transition-colors disabled:opacity-40"
                >
                  {checking ? "Checking..." : "View gallery"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowPasswordForm(false); setInput(""); setError(""); }}
                  className="px-3 py-2 rounded-lg border border-white/10 text-white/30 text-xs hover:text-white/60 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

export default function GalleriesPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/galleries")
      .then((r) => r.json())
      .then((data) => {
        setGalleries(data);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <main className="bg-black min-h-screen">
        <Navbar />
        <div className="max-w-6xl mx-auto px-6 pt-40 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <span className="text-xs font-mono text-white/25 tracking-[0.3em] uppercase">
              Client Galleries
            </span>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mt-4 mb-4">
              Your photos.
            </h1>
            <p className="text-white/40 text-sm max-w-md mb-16">
              Find your gallery below. To download your photos, contact me to receive your download pin after completing payment.
            </p>
          </motion.div>

          {loading ? (
            <p className="text-white/20 text-sm font-mono">Loading...</p>
          ) : galleries.length === 0 ? (
            <p className="text-white/20 text-sm font-mono">No galleries yet.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleries.map((gallery, i) => (
                <GalleryCard key={gallery.id} gallery={gallery} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
