"use client";

import { useEffect, useState, useCallback } from "react";

interface Announcement {
  id: string;
  title: string;
  subtitle: string | null;
  event_date: string | null;
  location: string | null;
  cta_text: string | null;
  cta_link: string | null;
  active: boolean;
  created_at: string;
}

interface Analytics {
  totals: { today: string; week: string; month: string; all_time: string };
  topPages: { path: string; views: string }[];
  recent: { path: string; referrer: string; ua: string; ip: string; created_at: string }[];
}

interface Review {
  id: string;
  name: string;
  rating: number;
  body: string;
  event: string | null;
  createdAt: string;
}

interface Inquiry {
  id: string;
  name: string;
  email: string;
  session_type: string;
  preferred_date: string | null;
  message: string | null;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  admin_notes: string | null;
  created_at: string;
}

interface Gallery {
  id: string;
  title: string;
  url: string;
  pin: string | null;
  gallery_password: string | null;
  created_at: string;
  view_count: number;
}

const inputClass =
  "w-full bg-white/[0.04] border border-white/10 rounded-lg px-3 py-2 text-white/80 text-sm placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors";

// ─── Status config ───────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    badge: "text-amber-400/90 bg-amber-400/[0.08] border-amber-400/25",
    dot: "bg-amber-400",
  },
  confirmed: {
    label: "Confirmed",
    badge: "text-emerald-400/90 bg-emerald-400/[0.08] border-emerald-400/25",
    dot: "bg-emerald-400",
  },
  completed: {
    label: "Completed",
    badge: "text-sky-400/90 bg-sky-400/[0.08] border-sky-400/25",
    dot: "bg-sky-400",
  },
  cancelled: {
    label: "Cancelled",
    badge: "text-red-400/60 bg-red-400/[0.06] border-red-400/20",
    dot: "bg-red-400/60",
  },
} as const;

type StatusFilter = "all" | Inquiry["status"];

// ─── Action button ────────────────────────────────────────────────────────────

function ActionBtn({
  children,
  onClick,
  disabled,
  variant,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
  variant: "confirm" | "cancel" | "complete" | "reopen";
}) {
  const styles = {
    confirm:
      "text-emerald-400/80 border-emerald-400/25 hover:bg-emerald-400/10",
    cancel: "text-red-400/60 border-red-400/20 hover:bg-red-400/10",
    complete: "text-sky-400/80 border-sky-400/25 hover:bg-sky-400/10",
    reopen: "text-white/40 border-white/10 hover:bg-white/[0.05]",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-1.5 rounded-lg border text-[11px] font-mono transition-colors disabled:opacity-40 ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

// ─── Booking card ─────────────────────────────────────────────────────────────

function BookingCard({
  inquiry,
  onDelete,
  onUpdate,
}: {
  inquiry: Inquiry;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updated: Partial<Inquiry>) => void;
}) {
  const [notes, setNotes] = useState(inquiry.admin_notes ?? "");
  const [showNotes, setShowNotes] = useState(!!inquiry.admin_notes);
  const [savingNotes, setSavingNotes] = useState(false);
  const [busy, setBusy] = useState(false);

  const changeStatus = async (status: Inquiry["status"]) => {
    setBusy(true);
    const res = await fetch(`/api/contact/${inquiry.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) onUpdate(inquiry.id, { status });
    setBusy(false);
  };

  const saveNotes = async () => {
    setSavingNotes(true);
    await fetch(`/api/contact/${inquiry.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ admin_notes: notes }),
    });
    onUpdate(inquiry.id, { admin_notes: notes.trim() || null });
    setSavingNotes(false);
  };

  const cfg = STATUS_CONFIG[inquiry.status];
  const notesDirty = notes !== (inquiry.admin_notes ?? "");

  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
      {/* Top bar */}
      <div className="px-5 py-4 space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
              <span className="text-sm font-semibold text-white">{inquiry.name}</span>
              <span
                className={`inline-flex items-center gap-1.5 text-[10px] font-mono px-2 py-0.5 rounded-full border ${cfg.badge}`}
              >
                <span className={`w-1 h-1 rounded-full ${cfg.dot}`} />
                {cfg.label}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap text-xs font-mono text-white/35">
              <a
                href={`mailto:${inquiry.email}?subject=Re: Your booking inquiry`}
                className="hover:text-white/70 transition-colors underline underline-offset-2 decoration-white/15"
              >
                {inquiry.email}
              </a>
              <span className="text-white/15">·</span>
              <span>{inquiry.session_type}</span>
              {inquiry.preferred_date && (
                <>
                  <span className="text-white/15">·</span>
                  <span>{inquiry.preferred_date}</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <span className="text-[11px] font-mono text-white/20">
              {new Date(inquiry.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <button
              onClick={() => onDelete(inquiry.id)}
              className="text-[11px] font-mono text-red-400/35 hover:text-red-400/80 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>

        {inquiry.message && (
          <p className="text-xs text-white/35 leading-relaxed pl-3 border-l border-white/[0.06]">
            {inquiry.message}
          </p>
        )}
      </div>

      {/* Notes */}
      {showNotes && (
        <div className="px-5 pb-3 space-y-2 border-t border-white/[0.04] pt-3">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Private notes (only visible to you)..."
            rows={2}
            className={`${inputClass} resize-none text-xs`}
          />
          {notesDirty && (
            <button
              onClick={saveNotes}
              disabled={savingNotes}
              className="px-3 py-1.5 rounded-lg bg-white/[0.06] text-white/50 text-[11px] font-mono hover:bg-white/[0.1] transition-colors disabled:opacity-40"
            >
              {savingNotes ? "Saving..." : "Save notes"}
            </button>
          )}
        </div>
      )}

      {/* Action bar */}
      <div className="px-5 py-3 border-t border-white/[0.04] flex items-center justify-between gap-3 flex-wrap bg-white/[0.01]">
        <div className="flex items-center gap-2 flex-wrap">
          {inquiry.status === "pending" && (
            <>
              <ActionBtn onClick={() => changeStatus("confirmed")} disabled={busy} variant="confirm">
                Confirm
              </ActionBtn>
              <ActionBtn onClick={() => changeStatus("cancelled")} disabled={busy} variant="cancel">
                Cancel
              </ActionBtn>
            </>
          )}
          {inquiry.status === "confirmed" && (
            <>
              <ActionBtn onClick={() => changeStatus("completed")} disabled={busy} variant="complete">
                Mark complete
              </ActionBtn>
              <ActionBtn onClick={() => changeStatus("cancelled")} disabled={busy} variant="cancel">
                Cancel
              </ActionBtn>
            </>
          )}
          {(inquiry.status === "completed" || inquiry.status === "cancelled") && (
            <ActionBtn onClick={() => changeStatus("pending")} disabled={busy} variant="reopen">
              Reopen
            </ActionBtn>
          )}
        </div>
        <button
          onClick={() => setShowNotes((v) => !v)}
          className={`text-[11px] font-mono transition-colors ${
            showNotes || inquiry.admin_notes
              ? "text-white/40 hover:text-white/60"
              : "text-white/20 hover:text-white/40"
          }`}
        >
          {showNotes ? "Hide notes" : inquiry.admin_notes ? "Notes ↑" : "Add notes"}
        </button>
      </div>
    </div>
  );
}

// ─── Gallery row ──────────────────────────────────────────────────────────────

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
        <p className="text-xs font-mono text-white/30 mt-0.5">
          {gallery.view_count ?? 0} {(gallery.view_count ?? 0) === 1 ? "open" : "opens"}
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

// ─── Review row ───────────────────────────────────────────────────────────────

function ReviewRow({
  review,
  onDelete,
  onUpdate,
}: {
  review: Review;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updated: Partial<Review>) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(review.name);
  const [body, setBody] = useState(review.body);
  const [event, setEvent] = useState(review.event ?? "");
  const [rating, setRating] = useState(review.rating);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    const res = await fetch(`/api/reviews/${review.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, body, rating, event }),
    });
    if (res.ok) {
      onUpdate(review.id, { name, body, rating, event: event || null });
      setEditing(false);
    }
    setSaving(false);
  };

  const cancel = () => {
    setName(review.name);
    setBody(review.body);
    setEvent(review.event ?? "");
    setRating(review.rating);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="p-4 rounded-xl border border-white/[0.12] bg-white/[0.03] space-y-3">
        <div className="grid sm:grid-cols-2 gap-3">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className={inputClass} />
          <input value={event} onChange={(e) => setEvent(e.target.value)} placeholder="Event (optional)" className={inputClass} />
        </div>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Review" rows={3} className={`${inputClass} resize-none`} />
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-white/25 tracking-widest uppercase">Rating</span>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-lg leading-none transition-colors ${star <= rating ? "text-white" : "text-white/15"}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={save}
            disabled={saving || !name || !body}
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
    <div className="flex items-start justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-sm font-medium text-white">{review.name}</span>
          <span className="text-xs font-mono text-white/30">{"★".repeat(review.rating)}</span>
          {review.event && <span className="text-xs font-mono text-white/25">{review.event}</span>}
        </div>
        <p className="text-xs text-white/40 leading-relaxed">{review.body}</p>
      </div>
      <div className="flex items-center gap-4 ml-4 shrink-0">
        <button onClick={() => setEditing(true)} className="text-xs font-mono text-white/30 hover:text-white/60 transition-colors">
          Edit
        </button>
        <button onClick={() => onDelete(review.id)} className="text-xs font-mono text-red-400/50 hover:text-red-400 transition-colors">
          Delete
        </button>
      </div>
    </div>
  );
}

// ─── Main admin page ──────────────────────────────────────────────────────────

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [reviews, setReviews] = useState<Review[]>([]);
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [annForm, setAnnForm] = useState({ title: "", subtitle: "", event_date: "", location: "", cta_text: "", cta_link: "" });
  const [annSaving, setAnnSaving] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [newTitle, setNewTitle] = useState("");
  const [newUrl, setNewUrl] = useState("");
  const [newPin, setNewPin] = useState("");
  const [newGalleryPassword, setNewGalleryPassword] = useState("");
  const [adding, setAdding] = useState(false);

  const fetchData = useCallback(async () => {
    const [rv, gv, iq, an, ann] = await Promise.all([
      fetch("/api/reviews").then((r) => r.json()),
      fetch("/api/galleries").then((r) => r.json()),
      fetch("/api/contact").then((r) => r.json()),
      fetch("/api/analytics").then((r) => r.json()),
      fetch("/api/admin/announcement").then((r) => r.json()),
    ]);
    setReviews(rv);
    const withPins = await fetch("/api/admin/galleries")
      .then((r) => r.json())
      .catch(() => gv);
    setGalleries(withPins);
    setInquiries(iq);
    if (!an.error) setAnalytics(an);
    if (Array.isArray(ann)) setAnnouncements(ann);
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

  const updateReview = (id: string, updated: Partial<Review>) => {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, ...updated } : r)));
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
      body: JSON.stringify({
        title: newTitle,
        url: newUrl,
        pin: newPin,
        gallery_password: newGalleryPassword,
      }),
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

  const deleteInquiry = async (id: string) => {
    await fetch(`/api/contact/${id}`, { method: "DELETE" });
    setInquiries((prev) => prev.filter((i) => i.id !== id));
  };

  const updateInquiry = (id: string, updated: Partial<Inquiry>) => {
    setInquiries((prev) => prev.map((i) => (i.id === id ? { ...i, ...updated } : i)));
  };

  const saveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setAnnSaving(true);
    const res = await fetch("/api/admin/announcement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(annForm),
    });
    if (res.ok) {
      const created = await res.json();
      setAnnouncements((prev) => [created, ...prev.map((a) => ({ ...a, active: false }))]);
      setAnnForm({ title: "", subtitle: "", event_date: "", location: "", cta_text: "", cta_link: "" });
    }
    setAnnSaving(false);
  };

  const toggleAnnouncement = async (id: string, active: boolean) => {
    await fetch("/api/admin/announcement", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, active }),
    });
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, active } : active ? { ...a, active: false } : a))
    );
  };

  const deleteAnnouncement = async (id: string) => {
    await fetch("/api/admin/announcement", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  // Derived counts
  const counts = {
    all: inquiries.length,
    pending: inquiries.filter((i) => i.status === "pending").length,
    confirmed: inquiries.filter((i) => i.status === "confirmed").length,
    completed: inquiries.filter((i) => i.status === "completed").length,
    cancelled: inquiries.filter((i) => i.status === "cancelled").length,
  };

  const filteredInquiries =
    statusFilter === "all" ? inquiries : inquiries.filter((i) => i.status === statusFilter);

  if (authed === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white/20 text-sm font-mono">
        Loading...
      </div>
    );
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

        {/* ── Traffic ────────────────────────────────────────────────────── */}
        {analytics && (
          <section>
            <h2 className="text-lg font-semibold mb-6">Traffic</h2>

            {/* Overview stats */}
            <div className="grid grid-cols-4 gap-3 mb-8">
              {[
                { label: "Today", value: analytics.totals.today },
                { label: "7 days", value: analytics.totals.week },
                { label: "30 days", value: analytics.totals.month },
                { label: "All time", value: analytics.totals.all_time },
              ].map(({ label, value }) => (
                <div key={label} className="p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <div className="text-2xl font-bold font-mono text-white tabular-nums">{Number(value).toLocaleString()}</div>
                  <div className="text-[10px] font-mono text-white/30 mt-1 uppercase tracking-widest">{label}</div>
                </div>
              ))}
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              {/* Top pages */}
              <div>
                <h3 className="text-xs font-mono text-white/30 uppercase tracking-widest mb-3">Top pages (30d)</h3>
                <div className="space-y-1.5">
                  {analytics.topPages.length === 0 && (
                    <p className="text-white/20 text-sm font-mono">No data yet.</p>
                  )}
                  {analytics.topPages.map((p) => (
                    <div key={p.path} className="flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <span className="text-xs font-mono text-white/60 truncate">{p.path || "/"}</span>
                      <span className="text-xs font-mono text-white/30 ml-4 shrink-0">{Number(p.views).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent views */}
              <div>
                <h3 className="text-xs font-mono text-white/30 uppercase tracking-widest mb-3">Recent visitors</h3>
                <div className="space-y-1.5">
                  {analytics.recent.length === 0 && (
                    <p className="text-white/20 text-sm font-mono">No data yet.</p>
                  )}
                  {analytics.recent.map((v, i) => (
                    <div key={i} className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono text-white/60">{v.path || "/"}</span>
                        <span className="text-[10px] font-mono text-white/20 ml-4 shrink-0">
                          {new Date(v.created_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      {v.referrer && (
                        <p className="text-[10px] font-mono text-white/20 truncate mt-0.5">from {v.referrer}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Event Announcements ────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Event Announcements</h2>
            {announcements.some((a) => a.active) && (
              <span className="text-[11px] font-mono text-emerald-400/70 bg-emerald-400/[0.08] border border-emerald-400/20 px-2 py-0.5 rounded-full">
                Live
              </span>
            )}
          </div>

          {/* Create form */}
          <form onSubmit={saveAnnouncement} className="space-y-3 mb-8 p-5 rounded-xl border border-white/[0.06] bg-white/[0.02]">
            <p className="text-xs font-mono text-white/25 uppercase tracking-widest mb-4">New announcement</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <input
                value={annForm.title}
                onChange={(e) => setAnnForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Event title *"
                required
                className={inputClass}
              />
              <input
                value={annForm.event_date}
                onChange={(e) => setAnnForm((f) => ({ ...f, event_date: e.target.value }))}
                placeholder="Date (e.g. May 3, 2025)"
                className={inputClass}
              />
              <input
                value={annForm.location}
                onChange={(e) => setAnnForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="Location"
                className={inputClass}
              />
              <input
                value={annForm.subtitle}
                onChange={(e) => setAnnForm((f) => ({ ...f, subtitle: e.target.value }))}
                placeholder="Short description"
                className={inputClass}
              />
              <input
                value={annForm.cta_text}
                onChange={(e) => setAnnForm((f) => ({ ...f, cta_text: e.target.value }))}
                placeholder="Button label (e.g. Book now)"
                className={inputClass}
              />
              <input
                value={annForm.cta_link}
                onChange={(e) => setAnnForm((f) => ({ ...f, cta_link: e.target.value }))}
                placeholder="Button URL (optional)"
                className={inputClass}
              />
            </div>
            <button
              type="submit"
              disabled={annSaving}
              className="w-full py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-40"
            >
              {annSaving ? "Saving..." : "Publish announcement"}
            </button>
          </form>

          {/* Existing announcements */}
          <div className="space-y-3">
            {announcements.length === 0 && (
              <p className="text-white/20 text-sm font-mono">No announcements yet.</p>
            )}
            {announcements.map((ann) => (
              <div key={ann.id} className="flex items-start justify-between p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-semibold text-white">{ann.title}</span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                      ann.active
                        ? "text-emerald-400/90 bg-emerald-400/[0.08] border-emerald-400/25"
                        : "text-white/30 bg-white/[0.03] border-white/[0.08]"
                    }`}>
                      {ann.active ? "Live" : "Off"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs font-mono text-white/30">
                    {ann.event_date && <span>{ann.event_date}</span>}
                    {ann.location && <span>{ann.location}</span>}
                    {ann.subtitle && <span className="text-white/20 truncate max-w-xs">{ann.subtitle}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => toggleAnnouncement(ann.id, !ann.active)}
                    className={`text-[11px] font-mono transition-colors ${
                      ann.active
                        ? "text-white/30 hover:text-white/60"
                        : "text-emerald-400/50 hover:text-emerald-400/80"
                    }`}
                  >
                    {ann.active ? "Turn off" : "Go live"}
                  </button>
                  <button
                    onClick={() => deleteAnnouncement(ann.id)}
                    className="text-[11px] font-mono text-red-400/40 hover:text-red-400/80 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Bookings ───────────────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Bookings</h2>
            {counts.pending > 0 && (
              <span className="text-[11px] font-mono text-amber-400/70 bg-amber-400/[0.08] border border-amber-400/20 px-2 py-0.5 rounded-full">
                {counts.pending} pending
              </span>
            )}
          </div>

          {/* Stats */}
          {inquiries.length > 0 && (
            <div className="grid grid-cols-4 gap-3 mb-6">
              {(["pending", "confirmed", "completed", "cancelled"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(statusFilter === s ? "all" : s)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    statusFilter === s
                      ? "border-white/20 bg-white/[0.05]"
                      : "border-white/[0.05] bg-white/[0.01] hover:border-white/[0.1]"
                  }`}
                >
                  <div className="text-xl font-bold font-mono text-white tabular-nums">
                    {counts[s]}
                  </div>
                  <div className={`text-[10px] font-mono mt-0.5 ${STATUS_CONFIG[s].badge.split(" ")[0]}`}>
                    {STATUS_CONFIG[s].label}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Filter tabs */}
          {inquiries.length > 0 && (
            <div className="flex items-center gap-1 mb-5 p-1 rounded-xl border border-white/[0.06] bg-white/[0.01] w-fit">
              {(["all", "pending", "confirmed", "completed", "cancelled"] as StatusFilter[]).map(
                (f) => (
                  <button
                    key={f}
                    onClick={() => setStatusFilter(f)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-mono transition-all ${
                      statusFilter === f
                        ? "bg-white/[0.08] text-white"
                        : "text-white/30 hover:text-white/60"
                    }`}
                  >
                    {f === "all" ? `All (${counts.all})` : STATUS_CONFIG[f].label}
                  </button>
                )
              )}
            </div>
          )}

          {/* Cards */}
          <div className="space-y-3">
            {filteredInquiries.length === 0 && (
              <p className="text-white/20 text-sm font-mono">
                {inquiries.length === 0 ? "No bookings yet." : "No bookings in this category."}
              </p>
            )}
            {filteredInquiries.map((inq) => (
              <BookingCard
                key={inq.id}
                inquiry={inq}
                onDelete={deleteInquiry}
                onUpdate={updateInquiry}
              />
            ))}
          </div>
        </section>

        {/* ── Galleries ──────────────────────────────────────────────────── */}
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
                  setGalleries((prev) => prev.map((x) => (x.id === id ? { ...x, ...updated } : x)))
                }
              />
            ))}
          </div>
        </section>

        {/* ── Reviews ────────────────────────────────────────────────────── */}
        <section>
          <h2 className="text-lg font-semibold mb-6">Reviews</h2>
          <div className="space-y-3">
            {reviews.length === 0 && (
              <p className="text-white/20 text-sm font-mono">No reviews yet.</p>
            )}
            {reviews.map((r) => (
              <ReviewRow key={r.id} review={r} onDelete={deleteReview} onUpdate={updateReview} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
