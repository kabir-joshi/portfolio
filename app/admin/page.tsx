"use client";

import { useEffect, useState, useCallback } from "react";

interface Review {
  id: string;
  name: string;
  rating: number;
  body: string;
  createdAt: string;
}

interface Gallery {
  id: string;
  title: string;
  url: string;
  pin: string | null;
  created_at: string;
}

const inputClass =
  "w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-white/80 text-sm placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors";

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [reviews, setReviews] = useState<Review[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);

  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newPin, setNewPin] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchData = useCallback(async () => {
    const [rv, gv] = await Promise.all([
      fetch("/api/reviews").then((r) => r.json()),
      fetch("/api/galleries").then((r) => r.json()),
    ]);
    setReviews(rv);
    // Fetch galleries with pins for admin
    const withPins = await fetch("/api/admin/galleries").then((r) => r.json()).catch(() => gv);
    setGalleries(withPins);
  }, []);

  useEffect(() => {
    fetch("/api/admin/check").then((r) => {
      if (r.ok) {
        setAuthed(true);
        fetchData();
      } else {
        setAuthed(false);
      }
    });
  }, [fetchData]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      setAuthed(true);
      fetchData();
    } else {
      setLoginError("Wrong password.");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setPassword("");
  };

  const deleteReview = async (id: string) => {
    await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const deleteGallery = async (id: string) => {
    await fetch(`/api/galleries/${id}`, { method: "DELETE" });
    setGalleries((prev) => prev.filter((g) => g.id !== id));
  };

  const addGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    const res = await fetch("/api/galleries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, url: newUrl, pin: newPin }),
    });
    if (res.ok) {
      const gallery = await res.json();
      setGalleries((prev) => [gallery, ...prev]);
      setNewTitle("");
      setNewUrl("");
      setNewPin("");
    }
    setAdding(false);
  };

  if (authed === null) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white/20 text-sm font-mono">Loading...</div>;
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
          <h1 className="text-white font-semibold text-xl mb-6">Admin</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={inputClass}
            autoFocus
          />
          {loginError && <p className="text-red-400/70 text-xs font-mono">{loginError}</p>}
          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
          >
            Sign in
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-16">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Admin</h1>
          <button
            onClick={handleLogout}
            className="text-xs font-mono text-white/30 hover:text-white/60 transition-colors"
          >
            Sign out
          </button>
        </div>

        {/* Galleries */}
        <section>
          <h2 className="text-lg font-semibold mb-6">Galleries</h2>

          <form onSubmit={addGallery} className="grid sm:grid-cols-3 gap-3 mb-8">
            <input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Title"
              required
              className={inputClass}
            />
            <input
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              placeholder="Pixieset URL"
              required
              className={inputClass}
            />
            <input
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="Download pin (optional)"
              className={inputClass}
            />
            <button
              type="submit"
              disabled={adding}
              className="sm:col-span-3 py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-40"
            >
              {adding ? "Adding..." : "Add gallery"}
            </button>
          </form>

          <div className="space-y-3">
            {galleries.length === 0 && (
              <p className="text-white/20 text-sm font-mono">No galleries yet.</p>
            )}
            {galleries.map((g) => (
              <div
                key={g.id}
                className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]"
              >
                <div>
                  <p className="text-sm font-medium text-white">{g.title}</p>
                  <p className="text-xs font-mono text-white/30 mt-0.5">{g.url}</p>
                  {g.pin && (
                    <p className="text-xs font-mono text-white/40 mt-0.5">Pin: {g.pin}</p>
                  )}
                </div>
                <button
                  onClick={() => deleteGallery(g.id)}
                  className="text-xs font-mono text-red-400/50 hover:text-red-400 transition-colors ml-4 shrink-0"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section>
          <h2 className="text-lg font-semibold mb-6">Reviews</h2>
          <div className="space-y-3">
            {reviews.length === 0 && (
              <p className="text-white/20 text-sm font-mono">No reviews yet.</p>
            )}
            {reviews.map((r) => (
              <div
                key={r.id}
                className="flex items-start justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-sm font-medium text-white">{r.name}</span>
                    <span className="text-xs font-mono text-white/30">{"★".repeat(r.rating)}</span>
                  </div>
                  <p className="text-xs text-white/40 leading-relaxed">{r.body}</p>
                </div>
                <button
                  onClick={() => deleteReview(r.id)}
                  className="text-xs font-mono text-red-400/50 hover:text-red-400 transition-colors ml-4 shrink-0"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
