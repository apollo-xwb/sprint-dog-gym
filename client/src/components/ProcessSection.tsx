/* ============================================================
   SPRINT — The Riley Method (Process Section)
   Design: Dark zinc-950 background, three vertical glass cards
   Cards: Gold borders, glassmorphism, numbered steps
   Images: Quiz (abstract), Mobile Unit, Treadmill
   ============================================================ */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ClipboardCheck, Truck, Gauge } from "lucide-react";

const MOBILE_UNIT_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663647456493/mEJBkFbB7UGeMtd3qBLotR/sprint-mobile-unit-MDq9JLzd2dXFt3W493hDtx.webp";
const TREADMILL_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663647456493/mEJBkFbB7UGeMtd3qBLotR/sprint-treadmill-H2wiuaJqaF8si7epUWWhCR.webp";

const STEPS = [
  {
    number: "01",
    icon: ClipboardCheck,
    title: "The Quiz",
    subtitle: "Calculate Energy Deficit",
    body: "Answer 8 questions about your dog's breed, age, weight, and current activity level. Our algorithm calculates their Kinetik Deficit Score — the gap between biological need and current output.",
    accent: "cyan",
    image: null,
    imageAlt: "",
  },
  {
    number: "02",
    icon: Truck,
    title: "The Arrival",
    subtitle: "Mobile Unit at Your Driveway",
    body: "Our fully-equipped matte-black mobile unit arrives at your gate. No drop-offs. No kennels. No separation anxiety from unfamiliar environments. Your dog trains in their own neighbourhood.",
    accent: "amber",
    image: MOBILE_UNIT_IMG,
    imageAlt: "SPRINT mobile unit at a Constantia driveway",
  },
  {
    number: "03",
    icon: Gauge,
    title: "The Session",
    subtitle: "Supervised Slatted Treadmill Run",
    body: "45 minutes of supervised, non-motorized slatted treadmill work. The dog sets the pace. Our trainer monitors form, heart rate, and recovery. Every metric is logged to your profile.",
    accent: "amber",
    image: TREADMILL_IMG,
    imageAlt: "SPRINT non-motorized slatted dog treadmill",
  },
];

export default function ProcessSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="process" className="relative py-24 lg:py-32 bg-zinc-950 overflow-hidden">
      {/* Subtle radial glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-10 pointer-events-none blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse, rgba(245,158,11,0.5) 0%, transparent 70%)",
        }}
      />

      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-16 lg:mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-8 h-px bg-amber-500" />
            <span className="sprint-label text-amber-500">Methodology</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-tight tracking-tight"
          >
            THE RILEY
            <br />
            <span className="text-amber-500">METHOD.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 text-lg mt-6 max-w-xl leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Three precision steps. Zero compromise. Born from years of working with high-drive
            breeds in Cape Town's most demanding households.
          </motion.p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const isCyan = step.accent === "cyan";
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 60 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                className="glass-card group hover:border-amber-500/50 transition-all duration-400 overflow-hidden flex flex-col"
              >
                {/* Image (if available) */}
                {step.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={step.image}
                      alt={step.imageAlt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
                  </div>
                )}

                {/* No image: colored header block */}
                {!step.image && (
                  <div className="relative h-48 overflow-hidden flex items-center justify-center bg-zinc-900">
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        background: isCyan
                          ? "radial-gradient(ellipse at center, rgba(34,211,238,0.8) 0%, transparent 70%)"
                          : "radial-gradient(ellipse at center, rgba(245,158,11,0.8) 0%, transparent 70%)",
                      }}
                    />
                    {/* Abstract quiz visual */}
                    <div className="relative z-10 flex flex-col items-center gap-3">
                      <div
                        className={`w-16 h-16 flex items-center justify-center border ${
                          isCyan ? "border-cyan-400/40 text-cyan-400" : "border-amber-500/40 text-amber-500"
                        }`}
                      >
                        <Icon size={28} strokeWidth={1.5} />
                      </div>
                      {/* Pulse rings */}
                      <div className="relative">
                        {[1, 2, 3].map((ring) => (
                          <motion.div
                            key={ring}
                            className={`absolute rounded-full border ${
                              isCyan ? "border-cyan-400/20" : "border-amber-500/20"
                            }`}
                            style={{
                              width: ring * 30,
                              height: ring * 30,
                              top: -(ring * 15),
                              left: -(ring * 15),
                            }}
                            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.1, 0.3] }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: ring * 0.3,
                            }}
                          />
                        ))}
                        <div
                          className={`w-3 h-3 rounded-full ${
                            isCyan ? "bg-cyan-400" : "bg-amber-500"
                          }`}
                          style={{
                            boxShadow: isCyan
                              ? "0 0 12px rgba(34,211,238,0.8)"
                              : "0 0 12px rgba(245,158,11,0.8)",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Card Content */}
                <div className="p-6 flex flex-col flex-1">
                  {/* Step number + icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="font-display text-5xl leading-none"
                      style={{ color: isCyan ? "rgba(34,211,238,0.15)" : "rgba(245,158,11,0.15)" }}
                    >
                      {step.number}
                    </span>
                    <div
                      className={`w-8 h-8 flex items-center justify-center ${
                        isCyan ? "text-cyan-400" : "text-amber-500"
                      }`}
                    >
                      <Icon size={18} strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className="font-display text-2xl text-white tracking-tight mb-1"
                  >
                    {step.title}
                  </h3>
                  <div
                    className={`sprint-label text-xs mb-4 ${
                      isCyan ? "text-cyan-400" : "text-amber-500"
                    }`}
                  >
                    {step.subtitle}
                  </div>

                  {/* Body */}
                  <p
                    className="text-zinc-400 text-sm leading-relaxed flex-1"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {step.body}
                  </p>

                  {/* Bottom accent line */}
                  <div
                    className={`mt-6 h-px w-12 ${
                      isCyan ? "bg-cyan-400/50" : "bg-amber-500/50"
                    }`}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
