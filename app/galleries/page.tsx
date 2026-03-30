"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EASE } from "@/lib/easing";
import Navbar from "@/components/Navbar";
import Cursor from "@/components/Cursor";

interface Gallery {
  id: string;
  title: string;
  url: string;
  created_at: string;
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
      <Cursor />
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
                <motion.a
                  key={gallery.id}
                  href={gallery.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
                  className="group block p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-8">
                    <span className="text-xs font-mono text-white/20">
                      {new Date(gallery.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <svg
                      className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors duration-200 -rotate-45"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                  <h2 className="text-white font-semibold tracking-tight text-lg group-hover:text-white transition-colors">
                    {gallery.title}
                  </h2>
                  <p className="text-xs font-mono text-white/30 mt-1">View gallery →</p>
                </motion.a>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
