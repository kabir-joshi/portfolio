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

function GalleryCard({ gallery, index }: { gallery: Gallery; index: number }) {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  const date = new Date(gallery.created_at).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

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
      window.open(url, "_blank", "noopener,noreferrer");
      setShowPasswordForm(false);
      setInput("");
    } else {
      setError("Wrong password.");
    }
    setChecking(false);
  };

  if (!gallery.has_password && gallery.url) {
    return (
      <motion.a
        href={gallery.url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.07, ease: EASE }}
        className="group block p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300"
      >
        <div className="flex items-start justify-between mb-8">
          <span className="text-xs font-mono text-white/20">{date}</span>
          <svg className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors duration-200 -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
        <h2 className="text-white font-semibold tracking-tight text-lg">{gallery.title}</h2>
        <p className="text-xs font-mono text-white/30 mt-1">View gallery →</p>
      </motion.a>
    );
  }

  return (
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
