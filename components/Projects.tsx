"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { EASE } from "@/lib/easing";

const projects = [
  {
    number: "01",
    title: "RunIQ",
    description:
      "A Strava-connected running analytics app. Visualizes your training data with insights and trends to help you run smarter.",
    tags: ["Python", "Flask", "Strava API", "Render"],
    href: "/runiq",
    status: "Live",
  },
  {
    number: "02",
    title: "F1 Manager",
    description:
      "A macOS Formula 1 team management simulation game built with SpriteKit and SwiftUI. Manage your team through a full season.",
    tags: ["Swift", "SpriteKit", "SwiftUI", "macOS"],
    href: "#",
    status: "In Development",
  },
  {
    number: "03",
    title: "More coming soon",
    description:
      "Always building something new. Check back here for updates on what I&apos;m working on next.",
    tags: [],
    href: "#",
    status: "Soon",
  },
];

function ProjectCard({
  project,
  index,
  inView,
}: {
  project: (typeof projects)[0];
  index: number;
  inView: boolean;
}) {
  return (
    <motion.a
      href={project.href}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.7,
        delay: index * 0.12,
        ease: EASE,
      }}
      whileHover={{ y: -4 }}
      className="group block relative p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{
          background: "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(167,139,250,0.04), transparent 40%)"
        }}
      />

      <div className="flex items-start justify-between mb-6">
        <span className="text-xs font-mono text-white/15">{project.number}</span>
        <span
          className={`text-xs px-3 py-1 rounded-full border font-mono ${
            project.status === "Live"
              ? "border-emerald-500/20 text-emerald-400/60 bg-emerald-500/5"
              : project.status === "In Development"
              ? "border-amber-500/20 text-amber-400/60 bg-amber-500/5"
              : "border-white/10 text-white/25 bg-white/3"
          }`}
        >
          {project.status}
        </span>
      </div>

      <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-white transition-colors">
        {project.title}
      </h3>
      <p className="text-white/40 leading-relaxed mb-6 text-sm">
        {project.description}
      </p>

      {project.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-mono text-white/25 px-2 py-1 rounded bg-white/3"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-6 flex items-center gap-2 text-white/20 group-hover:text-white/50 transition-colors text-sm">
        <span>View project</span>
        <motion.span
          animate={inView ? {} : {}}
          className="transform group-hover:translate-x-1 transition-transform duration-200"
        >
          →
        </motion.span>
      </div>
    </motion.a>
  );
}

export default function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="projects" className="py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          ref={ref}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-16"
        >
          <span className="text-xs font-mono text-white/25 tracking-[0.3em] uppercase">
            02 / Projects
          </span>
          <div className="h-px flex-1 bg-white/5" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-12"
        >
          Selected work
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  );
}
