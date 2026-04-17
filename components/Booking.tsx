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

const baseInput =
  "w-full bg-white/[0.03] light:bg-black/[0.03] border border-white/[0.08] light:border-black/[0.08] rounded-xl px-4 text-white/80 light:text-black/80 text-sm focus:outline-none focus:border-white/30 light:focus:border-black/30 focus:bg-white/[0.05] light:focus:bg-black/[0.05] transition-all duration-200";

function FloatingInput({
  label,
  id,
  type = "text",
  value,
  onChange,
  required,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`${baseInput} pt-6 pb-2`}
      />
      <motion.label
        htmlFor={id}
        animate={{ y: floated ? 0 : 8, fontSize: floated ? "0.6rem" : "0.75rem" }}
        transition={{ duration: 0.15, ease: EASE }}
        className="absolute left-4 top-2 font-mono text-white/25 light:text-black/25 tracking-widest uppercase pointer-events-none"
      >
        {label}
      </motion.label>
    </div>
  );
}

function FloatingTextarea({
  label,
  id,
  value,
  onChange,
  rows = 5,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;
  return (
    <div className="relative">
      <textarea
        id={id}
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`${baseInput} pt-6 pb-2 resize-none`}
      />
      <motion.label
        htmlFor={id}
        animate={{ y: floated ? 0 : 8, fontSize: floated ? "0.6rem" : "0.75rem" }}
        transition={{ duration: 0.15, ease: EASE }}
        className="absolute left-4 top-2 font-mono text-white/25 light:text-black/25 tracking-widest uppercase pointer-events-none"
      >
        {label}
      </motion.label>
    </div>
  );
}

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
          <span className="text-xs font-mono text-white/25 light:text-black/25 tracking-[0.3em] uppercase">
            06 / Book
          </span>
          <div className="h-px flex-1 bg-white/[0.06] light:bg-black/[0.06]" />
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
              <span className="text-white light:text-black">Let&apos;s create</span>
              <br />
              <span className="text-[#86868b] light:text-[#5a5a5a]">something.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-[#86868b] light:text-[#5a5a5a] text-lg mb-12 leading-relaxed"
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
                  className="text-sm text-white/30 light:text-black/30 hover:text-white light:hover:text-black transition-colors duration-200 underline-offset-4 hover:underline"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FloatingInput
                label="Name"
                id="booking-name"
                value={name}
                onChange={setName}
                required
              />
              <FloatingInput
                label="Email"
                id="booking-email"
                type="email"
                value={email}
                onChange={setEmail}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-white/25 light:text-black/25 tracking-widest uppercase mb-2">
                Session type
              </label>
              <div className="relative">
                <select
                  value={session}
                  onChange={(e) => setSession(e.target.value)}
                  className={`${baseInput} py-3 appearance-none cursor-pointer pr-10`}
                >
                  {sessionTypes.map((type) => (
                    <option key={type} value={type} className="bg-[#111]">
                      {type}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-white/30 light:text-black/30">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 4.5L6 8.5L10 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>

            <FloatingInput
              label="Preferred date"
              id="booking-date"
              value={date}
              onChange={setDate}
            />

            <FloatingTextarea
              label="Message"
              id="booking-message"
              value={message}
              onChange={setMessage}
              rows={5}
            />

            <button
              type="submit"
              disabled={status === "submitting" || status === "done"}
              className="w-full py-4 rounded-xl bg-white light:bg-black text-black light:text-white text-sm font-medium hover:bg-white/90 light:hover:bg-black/90 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {status === "submitting" ? "Sending..." : status === "done" ? "Sent!" : "Send inquiry"}
            </button>

            {status === "done" && (
              <p className="text-xs font-mono text-white/40 light:text-black/40 text-center">
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
        className="max-w-6xl mx-auto mt-32 pt-8 border-t border-white/[0.06] light:border-black/[0.06] flex flex-wrap items-center justify-between gap-y-4"
      >
        <span className="text-xs text-white/20 light:text-black/20 font-mono">
          © {new Date().getFullYear()} Kabir Joshi
        </span>
        <div className="flex items-center gap-6">
          <a
            href="https://www.instagram.com/kabirjphoto/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-white/20 light:text-black/20 font-mono hover:text-white/50 light:hover:text-black/50 transition-colors duration-200"
          >
            Instagram
          </a>
          <a
            href="mailto:mail@kabirj.com"
            className="text-xs text-white/20 light:text-black/20 font-mono hover:text-white/50 light:hover:text-black/50 transition-colors duration-200"
          >
            mail@kabirj.com
          </a>
        </div>
      </motion.div>
    </section>
  );
}
