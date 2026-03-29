"use client";

import { useEffect, useState } from "react";

type Submission = {
  id: number;
  name: string;
  email: string;
  session: string;
  date: string | null;
  message: string;
  read: number;
  created_at: string;
};

function formatDate(iso: string) {
  return new Date(iso + "Z").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [token, setToken] = useState<string | null>(() =>
    typeof window !== "undefined" ? sessionStorage.getItem("admin_token") : null
  );
  const [authError, setAuthError] = useState("");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setAuthError("");
    const res = await fetch("/api/admin/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setAuthError("Wrong password.");
      return;
    }
    const { token } = await res.json();
    sessionStorage.setItem("admin_token", token);
    setToken(token);
  }

  async function fetchSubmissions(t: string) {
    setLoading(true);
    const res = await fetch("/api/admin/submissions", {
      headers: { Authorization: `Bearer ${t}` },
    });
    if (res.ok) setSubmissions(await res.json());
    setLoading(false);
  }

  async function markRead(id: number) {
    await fetch("/api/admin/submissions", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, read: 1 } : s))
    );
  }

  async function deleteSubmission(id: number) {
    await fetch("/api/admin/submissions", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  }

  useEffect(() => {
    if (token) fetchSubmissions(token);
  }, [token]);

  if (!token) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <form onSubmit={login} className="w-full max-w-sm space-y-4">
          <h1 className="text-white font-semibold text-lg mb-6">Admin</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/30 transition-colors"
          />
          {authError && (
            <p className="text-red-400/70 text-xs font-mono">{authError}</p>
          )}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
          >
            Sign in
          </button>
        </form>
      </div>
    );
  }

  const unread = submissions.filter((s) => !s.read).length;

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-xl font-semibold">Inbox</h1>
            <p className="text-white/30 text-xs font-mono mt-0.5">
              {submissions.length} total · {unread} unread
            </p>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem("admin_token");
              setToken(null);
            }}
            className="text-xs text-white/30 hover:text-white transition-colors font-mono"
          >
            Sign out
          </button>
        </div>

        {loading && (
          <p className="text-white/30 text-sm font-mono">Loading...</p>
        )}

        {!loading && submissions.length === 0 && (
          <p className="text-white/30 text-sm font-mono">No submissions yet.</p>
        )}

        <div className="space-y-2">
          {submissions.map((s) => (
            <div
              key={s.id}
              className={`rounded-xl border transition-colors ${
                s.read
                  ? "border-white/[0.06] bg-white/[0.01]"
                  : "border-white/10 bg-white/[0.03]"
              }`}
            >
              {/* Row */}
              <button
                className="w-full text-left px-6 py-4 flex items-start gap-4"
                onClick={() => {
                  setExpanded(expanded === s.id ? null : s.id);
                  if (!s.read) markRead(s.id);
                }}
              >
                {!s.read && (
                  <span className="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-white" />
                )}
                {s.read && <span className="mt-1.5 shrink-0 w-1.5 h-1.5" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3 mb-0.5">
                    <span className="text-sm font-medium text-white truncate">
                      {s.name}
                    </span>
                    <span className="text-xs text-white/30 font-mono shrink-0">
                      {s.session}
                    </span>
                  </div>
                  <p className="text-xs text-white/40 truncate">{s.message}</p>
                </div>
                <span className="text-xs text-white/20 font-mono shrink-0 mt-0.5">
                  {formatDate(s.created_at)}
                </span>
              </button>

              {/* Expanded */}
              {expanded === s.id && (
                <div className="px-6 pb-6 border-t border-white/[0.06] pt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    <div>
                      <p className="text-white/25 uppercase tracking-widest mb-1">Email</p>
                      <a
                        href={`mailto:${s.email}`}
                        className="text-white/60 hover:text-white transition-colors"
                      >
                        {s.email}
                      </a>
                    </div>
                    <div>
                      <p className="text-white/25 uppercase tracking-widest mb-1">
                        Preferred date
                      </p>
                      <p className="text-white/60">{s.date || "Flexible"}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-white/25 uppercase tracking-widest text-xs font-mono mb-2">
                      Message
                    </p>
                    <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                      {s.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 pt-2">
                    <a
                      href={`mailto:${s.email}?subject=Re: Photography Booking — ${s.session}`}
                      className="text-xs text-white/50 hover:text-white transition-colors font-mono"
                    >
                      Reply →
                    </a>
                    <button
                      onClick={() => deleteSubmission(s.id)}
                      className="text-xs text-red-400/40 hover:text-red-400 transition-colors font-mono ml-auto"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
