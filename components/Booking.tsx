"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { EASE } from "@/lib/easing";

const sessionTypes = [
  "Portrait Session",
  "Event Coverage",
  "Commercial / Custom",
  "Other",
];

const socials = [
  { label: "Instagram", href: "#" },
  { label: "Email", href: "mailto:hello@kabirj.com" },
  { label: "GitHub", href: "https://github.com/kabir-joshi" },
];

const inputClass =
  "w-full bg-white/[0.03] border border-white/8 rounded-xl px-4 py-3 text-white/80 text-sm placeholder-white/20 focus:outline-none focus:border-violet-500/50 focus:bg-white/[0.05] transition-all duration-200";

export default function Booking() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [session, setSession] = useState(sessionTypes[0]);
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `Photography Booking — ${session}`;
    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Session type: ${session}`,
      `Preferred date: ${date || "Flexible"}`,
      `\nMessage:\n${message}`,
    ].join("\n");
    window.location.href = `mailto:hello@kabirj.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <section id="booking" className="py-32 px-6 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[600px] h-[600px] rounded-full bg-violet-600/5 blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="text-xs font-mono text-white/25 tracking-[0.3em] uppercase">
            04 / Book
          </span>
          <div className="h-px flex-1 bg-white/5" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left: heading + copy */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
              className="text-5xl md:text-7xl font-bold tracking-tight leading-none mb-8"
            >
              <span className="text-white">Let&apos;s create</span>
              <br />
              <span className="text-white/20">something.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-white/40 text-lg mb-12 leading-relaxed"
            >
              Have a shoot in mind? Fill out the form and I&apos;ll get back to
              you within 24 hours.
            </motion.p>

            {/* Socials */}
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
              className="w-full py-4 rounded-xl bg-white text-black text-sm font-medium hover:bg-violet-200 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
            >
              Send inquiry
            </button>
          </motion.form>
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="max-w-6xl mx-auto mt-32 pt-8 border-t border-white/5 flex items-center justify-between"
      >
        <span className="text-xs text-white/15 font-mono">
          © {new Date().getFullYear()} Kabir Joshi
        </span>
        <span className="text-xs text-white/15 font-mono">kabirj.com</span>
      </motion.div>
    </section>
  );
}
