/* ============================================================
   SPRINT — Testimonials / Social Proof
   Design: Dark zinc-950 background, glass cards
   Content: Client testimonials with dog breed and result metrics
   ============================================================ */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    quote:
      "Riley went from destroying furniture daily to calm within 72 hours of his first session. The data dashboard showed his energy output tripled versus a normal walk.",
    author: "Sarah M.",
    location: "Constantia",
    breed: "Belgian Malinois · 3 yrs",
    result: "−94% destructive behaviour",
    resultColor: "amber",
  },
  {
    quote:
      "I was skeptical about a mobile unit, but the convenience is unmatched. They arrive, Koda runs, they leave. No stress, no travel, no kennel anxiety. Pure performance.",
    author: "James K.",
    location: "Bishopscourt",
    breed: "Border Collie · 2 yrs",
    result: "10-session pack complete",
    resultColor: "cyan",
  },
  {
    quote:
      "As a vet, I recommend SPRINT to every high-drive breed owner in my practice. The non-motorized treadmill is biomechanically superior to leash walking for joint health.",
    author: "Dr. Annika V.",
    location: "Newlands",
    breed: "Veterinarian",
    result: "Clinically endorsed",
    resultColor: "amber",
  },
];

export default function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative py-24 lg:py-32 bg-zinc-950 overflow-hidden">
      {/* Subtle amber glow top-left */}
      <div
        className="absolute top-0 left-0 w-[500px] h-[300px] opacity-8 pointer-events-none blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse, rgba(245,158,11,0.4) 0%, transparent 70%)",
        }}
      />

      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-14">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-8 h-px bg-amber-500" />
            <span className="sprint-label text-amber-500">Field Reports</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-tight tracking-tight"
          >
            RESULTS FROM
            <br />
            <span className="text-amber-500">THE FIELD.</span>
          </motion.h2>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={t.author}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className="glass-card p-6 flex flex-col hover:border-amber-500/40 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Quote icon */}
              <Quote
                size={20}
                className="text-amber-500/40 mb-4 flex-shrink-0"
                strokeWidth={1.5}
              />

              {/* Quote text */}
              <p
                className="text-zinc-300 text-sm leading-relaxed flex-1 mb-6"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                "{t.quote}"
              </p>

              {/* Result badge */}
              <div
                className={`inline-flex items-center gap-2 px-3 py-1.5 mb-5 w-fit ${
                  t.resultColor === "amber"
                    ? "bg-amber-500/10 border border-amber-500/30"
                    : "bg-cyan-400/10 border border-cyan-400/30"
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    t.resultColor === "amber" ? "bg-amber-500" : "bg-cyan-400"
                  }`}
                />
                <span
                  className={`sprint-label text-[10px] ${
                    t.resultColor === "amber" ? "text-amber-500" : "text-cyan-400"
                  }`}
                >
                  {t.result}
                </span>
              </div>

              {/* Author */}
              <div className="border-t border-zinc-800 pt-4">
                <div
                  className="text-zinc-200 text-sm font-medium"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {t.author}
                </div>
                <div className="sprint-label text-zinc-600 text-[10px] mt-0.5">
                  {t.location} · {t.breed}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
