/* ============================================================
   SPRINT — The Quiz Section (Enhanced)
   Design: Dark zinc-950, cyan neon accents
   Content: Energy deficit calculator with all dog sizes
   ============================================================ */

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Zap, ArrowRight, Activity, AlertCircle } from "lucide-react";

const DOG_SIZES = {
  small: {
    label: "Small (Under 15kg)",
    breeds: ["Chihuahua", "Pug", "Dachshund", "Shih Tzu", "Cavalier King Charles", "French Bulldog"],
    baseEnergy: 60,
  },
  medium: {
    label: "Medium (15-30kg)",
    breeds: ["Beagle", "Cocker Spaniel", "Bulldog", "Poodle", "Schnauzer", "Corgi"],
    baseEnergy: 90,
  },
  large: {
    label: "Large (30-45kg)",
    breeds: ["Labrador Retriever", "Golden Retriever", "German Shepherd", "Boxer", "Dalmatian", "Vizsla"],
    baseEnergy: 120,
  },
  xlarge: {
    label: "Extra Large (45kg+)",
    breeds: ["Belgian Malinois", "Great Dane", "German Shepherd (Working)", "Husky", "Weimaraner", "Border Collie"],
    baseEnergy: 150,
  },
};

const BEHAVIORAL_ISSUES = [
  { issue: "Destructive chewing", severity: "high" },
  { issue: "Excessive barking", severity: "high" },
  { issue: "Jumping on people", severity: "medium" },
  { issue: "Pulling on leash", severity: "medium" },
  { issue: "Aggression towards other dogs", severity: "high" },
  { issue: "Separation anxiety", severity: "high" },
  { issue: "Digging and excavation", severity: "medium" },
  { issue: "Obsessive behaviors", severity: "high" },
  { issue: "Inability to settle/relax", severity: "medium" },
  { issue: "Escaping/running away", severity: "high" },
];

export default function QuizSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [selectedSize, setSelectedSize] = useState<keyof typeof DOG_SIZES | null>(null);
  const [selectedBreed, setSelectedBreed] = useState<string | null>(null);
  const [walkMinutes, setWalkMinutes] = useState(30);
  const [showResult, setShowResult] = useState(false);

  const baseEnergy = selectedSize ? DOG_SIZES[selectedSize].baseEnergy : 120;
  const deficit = Math.max(0, baseEnergy - walkMinutes);
  const deficitPercent = Math.round((deficit / baseEnergy) * 100);

  const handleCalculate = () => {
    if (selectedBreed) setShowResult(true);
  };

  const getRecommendedBehaviors = () => {
    const relevantBehaviors = BEHAVIORAL_ISSUES.filter(
      (b) => deficitPercent > 40 || (deficitPercent > 20 && b.severity === "high")
    );
    return relevantBehaviors.slice(0, 3);
  };

  return (
    <section id="quiz" className="relative py-24 lg:py-32 bg-zinc-950 overflow-hidden">
      {/* Cyan radial glow */}
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[400px] opacity-10 pointer-events-none blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse, rgba(34,211,238,0.6) 0%, transparent 70%)",
        }}
      />

      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left: Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="w-8 h-px bg-cyan-400" />
              <span className="sprint-label text-cyan-400">Kinetik Assessment</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-tight tracking-tight mb-6"
            >
              WHAT'S YOUR
              <br />
              DOG'S{" "}
              <span className="text-cyan-400" style={{ textShadow: "0 0 30px rgba(34,211,238,0.5)" }}>
                DEFICIT?
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-zinc-400 text-lg leading-relaxed mb-8"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              The Kinetik Deficit Score measures the gap between your dog's biological energy
              requirement and their current daily output. <strong>Only 32% of dogs reach their required daily energy output.</strong> The rest operate at a 40–80% deficit, leading to behavioral issues.
            </motion.p>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex gap-8"
            >
              {[
                { value: "68%", label: "Dogs with unmet energy needs" },
                { value: "3 days", label: "To see behavioral improvement" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-3xl text-cyan-400">{stat.value}</div>
                  <div className="sprint-label text-zinc-500 text-[10px] mt-1 max-w-[100px]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Mini Quiz */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="glass-card p-8 border border-cyan-400/20"
          >
            <div className="flex items-center gap-2 mb-6">
              <Zap size={16} className="text-cyan-400" strokeWidth={2} />
              <span className="sprint-label text-cyan-400 text-xs">Quick Assessment</span>
            </div>

            {!showResult ? (
              <>
                {/* Size Selection */}
                <div className="mb-6">
                  <label
                    className="sprint-label text-zinc-400 text-[10px] block mb-3"
                  >
                    Dog Size
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(DOG_SIZES).map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => {
                          setSelectedSize(key as keyof typeof DOG_SIZES);
                          setSelectedBreed(null);
                        }}
                        className={`text-left px-3 py-2 text-xs border transition-all duration-150 ${
                          selectedSize === key
                            ? "border-cyan-400 bg-cyan-400/10 text-cyan-400"
                            : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                        }`}
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {value.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Breed Selection */}
                {selectedSize && (
                  <div className="mb-6">
                    <label
                      className="sprint-label text-zinc-400 text-[10px] block mb-3"
                    >
                      Dog's Breed
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {DOG_SIZES[selectedSize].breeds.map((breed) => (
                        <button
                          key={breed}
                          onClick={() => setSelectedBreed(breed)}
                          className={`text-left px-3 py-2 text-xs border transition-all duration-150 ${
                            selectedBreed === breed
                              ? "border-cyan-400 bg-cyan-400/10 text-cyan-400"
                              : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                          }`}
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {breed}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Daily Walk Duration */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <label className="sprint-label text-zinc-400 text-[10px]">
                      Daily Walk Duration
                    </label>
                    <span className="font-condensed text-cyan-400 font-700 text-sm">
                      {walkMinutes} min
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={baseEnergy}
                    step={5}
                    value={walkMinutes}
                    onChange={(e) => setWalkMinutes(Number(e.target.value))}
                    className="w-full h-1 appearance-none bg-zinc-700 cursor-pointer"
                    style={{
                      accentColor: "#22d3ee",
                    }}
                  />
                  <div className="flex justify-between sprint-label text-zinc-600 text-[10px] mt-1">
                    <span>0 min</span>
                    <span>{baseEnergy} min</span>
                  </div>
                </div>

                {/* Calculate Button */}
                <button
                  onClick={handleCalculate}
                  disabled={!selectedBreed}
                  className="w-full flex items-center justify-center gap-2 py-4 font-condensed font-700 tracking-widest uppercase text-sm text-zinc-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    boxShadow: selectedBreed
                      ? "0 0 20px rgba(34,211,238,0.4)"
                      : "none",
                  }}
                >
                  <Activity size={16} strokeWidth={2} />
                  Calculate Deficit Score
                  <ArrowRight size={16} />
                </button>
              </>
            ) : (
              /* Result View */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <div className="text-center mb-6">
                  <div className="sprint-label text-zinc-500 text-[10px] mb-2">
                    Kinetik Deficit Score
                  </div>
                  <div
                    className="font-display text-7xl text-cyan-400"
                    style={{ textShadow: "0 0 40px rgba(34,211,238,0.6)" }}
                  >
                    {deficitPercent}%
                  </div>
                  <div className="sprint-label text-zinc-400 text-xs mt-2">
                    {selectedBreed} · {walkMinutes} min/day
                  </div>
                </div>

                {/* Deficit bar */}
                <div className="mb-6">
                  <div className="h-2 bg-zinc-800 w-full overflow-hidden">
                    <motion.div
                      className="h-full bg-cyan-400"
                      initial={{ width: 0 }}
                      animate={{ width: `${deficitPercent}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      style={{ boxShadow: "0 0 10px rgba(34,211,238,0.6)" }}
                    />
                  </div>
                  <div className="flex justify-between sprint-label text-zinc-600 text-[10px] mt-1">
                    <span>Fulfilled</span>
                    <span>Deficit</span>
                  </div>
                </div>

                <p
                  className="text-zinc-400 text-sm leading-relaxed mb-4"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {deficitPercent > 60
                    ? "Critical deficit. Your dog is operating at a significant energy debt. Behavioral issues are likely a direct symptom."
                    : deficitPercent > 30
                    ? "Moderate deficit. Your dog needs more structured high-output exercise to close the gap."
                    : "Low deficit. Your dog is relatively well-exercised, but a SPRINT session can still optimize their performance."}
                </p>

                {/* Behavioral Issues Warning */}
                {deficitPercent > 40 && (
                  <div className="mb-6 p-4 border border-amber-500/30 bg-amber-500/5">
                    <div className="flex items-start gap-2 mb-2">
                      <AlertCircle size={14} className="text-amber-500 mt-0.5 flex-shrink-0" />
                      <span className="sprint-label text-amber-500 text-[10px]">Common Behavioral Issues</span>
                    </div>
                    <ul className="space-y-1">
                      {getRecommendedBehaviors().map((b) => (
                        <li key={b.issue} className="text-zinc-400 text-xs" style={{ fontFamily: "'Inter', sans-serif" }}>
                          • {b.issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() =>
                    document.getElementById("packages")?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="w-full flex items-center justify-center gap-2 py-4 font-condensed font-700 tracking-widest uppercase text-sm text-zinc-950 bg-amber-500 hover:bg-amber-400 transition-all duration-200"
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 700,
                    boxShadow: "0 0 20px rgba(245,158,11,0.4)",
                  }}
                >
                  View Packages
                  <ArrowRight size={16} />
                </button>

                <button
                  onClick={() => {
                    setShowResult(false);
                    setSelectedBreed(null);
                    setSelectedSize(null);
                    setWalkMinutes(30);
                  }}
                  className="w-full mt-3 py-2 text-zinc-500 hover:text-zinc-300 text-xs transition-colors"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Retake assessment
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
