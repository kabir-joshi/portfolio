"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { EASE } from "@/lib/easing";

const sessionTypes = [
  "Event Coverage",
  "Portrait Session",
  "Commercial / Custom",
  "Other",
];

const socials = [
  { label: "Instagram", href: "https://www.instagram.com/kabirjphoto/" },
  { label: "Email", href: "mailto:mail@kabirj.com" },
];

const inputClass =
  "w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white/80 text-sm placeholder-white/20 focus:outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all duration-200";

export default function Booking() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [session, setSession] = useState(sessionTypes[0]);
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          session_type: session,
          preferred_date: date,
          message,
        }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setName("");
      setEmail("");
      setSession(sessionTypes[0]);
      setDate("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="booking" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="text-xs font-mono text-white/25 tracking-[0.3em] uppercase">
            06 / Book
          </span>
          <div className="h-px flex-1 bg-white/[0.06]" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
              className="text-5xl md:text-7xl font-bold tracking-tight leading-none mb-8"
            >
              <span className="text-white">Let&apos;s create</span>
              <br />
              <span className="text-[#86868b]">something.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-[#86868b] text-lg mb-12 leading-relaxed"
            >
              Have a shoot in mind? Fill out the form and I&apos;ll get back to
              you within 24 hours.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-wrap gap-6"
            >
              {socials.map((social, i) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    social.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  initial={{ opacity: 0, y: 10 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
                  className="text-sm text-white/30 hover:text-white transition-colors duration-200 underline-offset-4 hover:underline"
                >
                  {social.label}
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Right: form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3, ease: EASE }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-white/25 tracking-widest uppercase mb-2">
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
                <label className="block text-xs font-mono text-white/25 tracking-widest uppercase mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-white/25 tracking-widest uppercase mb-2">
                Session type
              </label>
              <select
                value={session}
                onChange={(e) => setSession(e.target.value)}
                className={`${inputClass} cursor-pointer`}
              >
                {sessionTypes.map((type) => (
                  <option key={type} value={type} className="bg-[#111]">
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-white/25 tracking-widest uppercase mb-2">
                Preferred date
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="e.g. Weekend in April, flexible"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-white/25 tracking-widest uppercase mb-2">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell me about your vision..."
                rows={5}
                className={`${inputClass} resize-none`}
              />
            </div>

            <button
              type="submit"
              disabled={status === "submitting" || status === "done"}
              className="w-full py-4 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? "Sending..." : status === "done" ? "Sent!" : "Send inquiry"}
            </button>

            {status === "done" && (
              <p className="text-xs font-mono text-white/40 text-center">
                Got it — I&apos;ll get back to you within 24 hours.
              </p>
            )}
            {status === "error" && (
              <p className="text-xs font-mono text-red-400/60 text-center">
                Something went wrong. Try emailing me directly at mail@kabirj.com
              </p>
            )}
          </motion.form>
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="max-w-6xl mx-auto mt-32 pt-8 border-t border-white/[0.06] flex items-center justify-between"
      >
        <span className="text-xs text-white/20 font-mono">
          © {new Date().getFullYear()} Kabir Joshi
        </span>
        <div className="flex items-center gap-6">
          <a
            href="https://www.instagram.com/kabirjphoto/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/20 font-mono hover:text-white/50 transition-colors duration-200"
          >
            Instagram
          </a>
          <a
            href="mailto:mail@kabirj.com"
            className="text-xs text-white/20 font-mono hover:text-white/50 transition-colors duration-200"
          >
            mail@kabirj.com
          </a>
        </div>
      </motion.div>
    </section>
  );
}
