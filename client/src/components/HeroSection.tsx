/* ============================================================
   SPRINT Hero Section
   Design: Full-viewport dark hero with marble/matte bg image
   Layout: Asymmetric — text left, dog image right
   Headline: "STOP THE DIGGING. START THE SPRINT."
   CTA: Neon cyan glow button
   ============================================================ */

import { motion } from "framer-motion";
import { ArrowRight, Zap, ChevronDown } from "lucide-react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663647456493/mEJBkFbB7UGeMtd3qBLotR/sprint-hero-bg-HrzFmpCfK7Po6vVGJfgQid.webp";
const DOG_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663647456493/mEJBkFbB7UGeMtd3qBLotR/sprint-dog-transparent-MxPsDJWEceERsB7SzqnXWK.webp";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12 },
  }),
};

export default function HeroSection() {
  const scrollToProcess = () => {
    document.getElementById("process")?.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToQuiz = () => {
    document.getElementById("quiz")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-zinc-950"
      style={{
        backgroundImage: `url(${HERO_BG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-zinc-950/72" />

      {/* Amber diagonal accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, transparent 38%, rgba(245,158,11,0.035) 50%, transparent 62%)",
        }}
      />

      {/* Subtle noise texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundSize: "200px 200px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full pt-24 pb-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-4 items-center min-h-[82vh]">

          {/* ── Left: Text Content ── */}
          <div className="flex flex-col justify-center">

            {/* Eyebrow label */}
            <motion.div
              custom={0}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-8 h-px bg-amber-500" />
              <span className="sprint-label text-amber-500 text-[11px]">
                Cape Town's First Mobile Dog Gym
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              custom={1}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="font-display text-[clamp(3rem,8vw,6rem)] text-white leading-[0.9] tracking-tight mb-6"
            >
              STOP THE
              <br />
              DIGGING.
              <br />
              <span className="text-amber-500 text-glow-amber">
                START THE
                <br />
                SPRINT.
              </span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              custom={2}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="text-zinc-300 text-lg lg:text-xl font-light leading-relaxed max-w-md mb-10"
              style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}
            >
              Your high-drive dog is an athlete who drank pre-workout and is strapped to a chair in a locked room, punished if they disobey the order of sitting still.{" "}
              <span className="text-zinc-100 font-medium">
                We fulfill their biological needs.
              </span>
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              custom={3}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex flex-col sm:flex-row gap-4"
            >
              {/* Primary: Cyan neon */}
              <button
                onClick={scrollToQuiz}
                className="group flex items-center justify-center gap-3 px-8 py-4 text-zinc-950 font-condensed tracking-widest uppercase text-sm bg-cyan-400 hover:bg-cyan-300 transition-colors duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  fontWeight: 700,
                  boxShadow: "0 0 20px rgba(34,211,238,0.4), 0 0 60px rgba(34,211,238,0.12)",
                }}
              >
                <Zap size={15} strokeWidth={2.5} />
                Calculate Energy Deficit
                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-1 transition-transform duration-200"
                />
              </button>

              {/* Secondary: Amber outline */}
              <button
                onClick={scrollToProcess}
                className="flex items-center justify-center gap-2 px-8 py-4 font-condensed tracking-widest uppercase text-sm text-amber-500 border border-amber-500/40 hover:border-amber-500 hover:bg-amber-500/5 transition-all duration-200"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}
              >
                The Riley Method
              </button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              custom={4}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="flex gap-8 mt-12 pt-8 border-t border-zinc-800/60"
            >
              {[
                { value: "45", unit: "MIN", label: "Per Session" },
                { value: "100%", unit: "", label: "Non-Motorized" },
                { value: "1:1", unit: "", label: "Trainer Ratio" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="flex items-baseline gap-1">
                    <span className="font-display text-3xl text-white">{stat.value}</span>
                    {stat.unit && (
                      <span className="sprint-label text-amber-500 text-[10px] ml-0.5">
                        {stat.unit}
                      </span>
                    )}
                  </div>
                  <div className="sprint-label text-zinc-500 text-[10px] mt-0.5">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Dog Image ── */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.35 }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            {/* Glow halo */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse 70% 60% at 55% 50%, rgba(245,158,11,0.18) 0%, rgba(34,211,238,0.08) 50%, transparent 75%)",
                filter: "blur(30px)",
              }}
            />

            <img
              src={DOG_IMG}
              alt="High-drive Belgian Malinois in full athletic sprint"
              className="relative z-10 w-full max-w-md lg:max-w-xl object-contain"
              style={{
                filter: "drop-shadow(0 0 50px rgba(245,158,11,0.18))",
              }}
            />

            {/* Floating data badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.1 }}
              className="absolute top-6 right-0 lg:right-2 glass-card px-4 py-3 border border-cyan-400/25"
            >
              <div className="sprint-label text-cyan-400 text-[10px]">Kinetik Output</div>
              <div className="font-display text-white text-xl mt-0.5 leading-none">
                8.2{" "}
                <span
                  className="text-xs font-sans font-normal text-zinc-400"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  km/h avg
                </span>
              </div>
            </motion.div>

            {/* Second floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.3 }}
              className="absolute bottom-12 left-0 lg:-left-4 glass-card px-4 py-3 border border-amber-500/25"
            >
              <div className="sprint-label text-amber-500 text-[10px]">Session Status</div>
              <div className="flex items-center gap-2 mt-1">
                <div
                  className="w-2 h-2 rounded-full bg-amber-500"
                  style={{ boxShadow: "0 0 8px rgba(245,158,11,0.8)" }}
                />
                <span
                  className="text-zinc-200 text-xs"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Active · 23 min
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        onClick={scrollToProcess}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-500 hover:text-amber-500 transition-colors duration-200"
      >
        <span className="sprint-label text-[10px]">Scroll</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.button>
    </section>
  );
}
