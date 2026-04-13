"use client";

import { useEffect, useState, useCallback } from "react";

interface Review {
  id: string;
  name: string;
  rating: number;
  body: string;
  createdAt: string;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  session_type: string;
  preferred_date: string | null;
  message: string | null;
  created_at: string;
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
  onUpdate,
}: {
  gallery: Gallery;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updated: Partial<Gallery>) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(gallery.title);
  const [url, setUrl] = useState(gallery.url ?? "");
  const [pin, setPin] = useState(gallery.pin ?? "");
  const [galleryPassword, setGalleryPassword] = useState(gallery.gallery_password ?? "");
  const [date, setDate] = useState(new Date(gallery.created_at).toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const res = await fetch(`/api/galleries/${gallery.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, url, pin, gallery_password: galleryPassword, date }),
    });
    if (res.ok) {
      onUpdate(gallery.id, {
        title,
        url,
        pin: pin || null,
        gallery_password: galleryPassword || null,
        created_at: new Date(date).toISOString(),
      });
      setEditing(false);
    }
    setSaving(false);
  };

  const cancel = () => {
    setTitle(gallery.title);
    setUrl(gallery.url ?? "");
    setPin(gallery.pin ?? "");
    setGalleryPassword(gallery.gallery_password ?? "");
    setDate(new Date(gallery.created_at).toISOString().slice(0, 10));
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="p-4 rounded-xl border border-white/[0.12] bg-white/[0.03] space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className={inputClass} />
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Pixieset URL" className={inputClass} />
          <input value={pin} onChange={(e) => setPin(e.target.value)} placeholder="Download pin (optional)" className={inputClass} />
          <input value={galleryPassword} onChange={(e) => setGalleryPassword(e.target.value)} placeholder="Access password (optional)" className={inputClass} />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
        </div>
        <div className="flex gap-2">
          <button
            onClick={save}
            disabled={saving || !title || !url}
            className="px-4 py-2 rounded-lg bg-white text-black text-xs font-medium hover:bg-white/90 transition-colors disabled:opacity-40"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={cancel}
            className="px-4 py-2 rounded-lg border border-white/10 text-white/40 text-xs hover:text-white/70 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{gallery.title}</p>
        <p className="text-xs font-mono text-white/30 mt-0.5 truncate">{gallery.url}</p>
        {gallery.pin && <p className="text-xs font-mono text-white/40 mt-0.5">Download pin: {gallery.pin}</p>}
        {gallery.gallery_password && <p className="text-xs font-mono text-white/40 mt-0.5">Access password: {gallery.gallery_password}</p>}
        <p className="text-xs font-mono text-white/25 mt-0.5">
          {new Date(gallery.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
        </p>
      </div>
      <div className="flex items-center gap-4 ml-4 shrink-0">
        <button onClick={() => setEditing(true)} className="text-xs font-mono text-white/30 hover:text-white/60 transition-colors">
          Edit
        </button>
        <button onClick={() => onDelete(gallery.id)} className="text-xs font-mono text-red-400/50 hover:text-red-400 transition-colors">
          Delete
        </button>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [reviews, setReviews] = useState<Review[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newPin, setNewPin] = useState("");
  const [newGalleryPassword, setNewGalleryPassword] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchData = useCallback(async () => {
    const [rv, gv, iq] = await Promise.all([
      fetch("/api/reviews").then((r) => r.json()),
      fetch("/api/galleries").then((r) => r.json()),
      fetch("/api/contact").then((r) => r.json()),
    ]);
    setReviews(rv);
    const withPins = await fetch("/api/admin/galleries").then((r) => r.json()).catch(() => gv);
    setGalleries(withPins);
    setInquiries(iq);
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
                onUpdate={(id, updated) =>
                  setGalleries((prev) =>
                    prev.map((x) => (x.id === id ? { ...x, ...updated } : x))
                  )
                }
              />
            ))}
          </div>
        </section>

        {/* Inquiries */}
        <section>
          <h2 className="text-lg font-semibold mb-6">Booking Inquiries</h2>
          <div className="space-y-3">
            {inquiries.length === 0 && (
              <p className="text-white/20 text-sm font-mono">No inquiries yet.</p>
            )}
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-white">{inq.name}</span>
                  <span className="text-xs font-mono text-white/25">
                    {new Date(inq.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
                <p className="text-xs font-mono text-white/40">{inq.email}</p>
                <p className="text-xs font-mono text-white/30">{inq.session_type}{inq.preferred_date ? ` · ${inq.preferred_date}` : ""}</p>
                {inq.message && <p className="text-xs text-white/40 leading-relaxed pt-1">{inq.message}</p>}
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
