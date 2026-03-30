"use client";

import { useEffect, useState, useCallback } from "react";
import Cursor from "@/components/Cursor";

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
  gallery_password: string | null;
  created_at: string;
}

const inputClass =
  "w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-white/80 text-sm placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors";

function GalleryRow({
  gallery,
  onDelete,
  onDateChange,
}: {
  gallery: Gallery;
  onDelete: (id: string) => void;
  onDateChange: (id: string, date: string) => void;
}) {
  const [editingDate, setEditingDate] = useState(false);
  const [dateInput, setDateInput] = useState(
    new Date(gallery.created_at).toISOString().slice(0, 10)
  );
  const [saving, setSaving] = useState(false);

  const saveDate = async () => {
    setSaving(true);
    const res = await fetch(`/api/galleries/${gallery.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date: dateInput }),
    });
    if (res.ok) {
      onDateChange(gallery.id, new Date(dateInput).toISOString());
      setEditingDate(false);
    }
    setSaving(false);
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{gallery.title}</p>
        <p className="text-xs font-mono text-white/30 mt-0.5 truncate">{gallery.url}</p>
        {gallery.pin && (
          <p className="text-xs font-mono text-white/40 mt-0.5">Download pin: {gallery.pin}</p>
        )}
        {gallery.gallery_password && (
          <p className="text-xs font-mono text-white/40 mt-0.5">Access password: {gallery.gallery_password}</p>
        )}
        <div className="flex items-center gap-2 mt-1.5">
          {editingDate ? (
            <>
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="bg-white/[0.04] border border-white/10 rounded px-2 py-0.5 text-xs text-white/70 focus:outline-none focus:border-white/30"
              />
              <button
                onClick={saveDate}
                disabled={saving}
                className="text-xs font-mono text-white/60 hover:text-white transition-colors disabled:opacity-40"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditingDate(false)}
                className="text-xs font-mono text-white/30 hover:text-white/60 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditingDate(true)}
              className="text-xs font-mono text-white/25 hover:text-white/50 transition-colors"
            >
              {new Date(gallery.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })} · Edit date
            </button>
          )}
        </div>
      </div>
      <button
        onClick={() => onDelete(gallery.id)}
        className="text-xs font-mono text-red-400/50 hover:text-red-400 transition-colors ml-4 shrink-0"
      >
        Delete
      </button>
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [reviews, setReviews] = useState<Review[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);

  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newPin, setNewPin] = useState("");
  const [newGalleryPassword, setNewGalleryPassword] = useState("");
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
      body: JSON.stringify({ title: newTitle, url: newUrl, pin: newPin, gallery_password: newGalleryPassword }),
    });
    if (res.ok) {
      const gallery = await res.json();
      setGalleries((prev) => [gallery, ...prev]);
      setNewTitle("");
      setNewUrl("");
      setNewPin("");
      setNewGalleryPassword("");
    }
    setAdding(false);
  };

  if (authed === null) {
    return <><Cursor /><div className="min-h-screen bg-black flex items-center justify-center text-white/20 text-sm font-mono">Loading...</div></>;
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <Cursor />
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
      <Cursor />
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

          <form onSubmit={addGallery} className="grid sm:grid-cols-2 gap-3 mb-8">
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
            <input
              value={newGalleryPassword}
              onChange={(e) => setNewGalleryPassword(e.target.value)}
              placeholder="Gallery access password (optional)"
              className={inputClass}
            />
            <button
              type="submit"
              disabled={adding}
              className="sm:col-span-2 py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-40"
            >
              {adding ? "Adding..." : "Add gallery"}
            </button>
          </form>

          <div className="space-y-3">
            {galleries.length === 0 && (
              <p className="text-white/20 text-sm font-mono">No galleries yet.</p>
            )}
            {galleries.map((g) => (
              <GalleryRow
                key={g.id}
                gallery={g}
                onDelete={deleteGallery}
                onDateChange={(id, date) =>
                  setGalleries((prev) =>
                    prev.map((x) => (x.id === id ? { ...x, created_at: date } : x))
                  )
                }
              />
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
