/* ============================================================
   SPRINT — Why Sprint Section
   Design: Light marble background, asymmetric layout
   Content: Problem/solution framing with data points
   ============================================================ */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Activity, Brain, Shield, TrendingUp } from "lucide-react";

const REASONS = [
  {
    icon: Brain,
    title: "Cognitive Depletion",
    body: "Physical exhaustion resets the neurological drive cycle. A tired dog is a calm dog — not a bored one.",
    metric: "87%",
    metricLabel: "reduction in destructive behaviour",
    color: "amber",
  },
  {
    icon: Activity,
    title: "Breed-Specific Output",
    body: "Working breeds require 2–3× the exercise of companion dogs. A standard walk doesn't close the deficit.",
    metric: "3×",
    metricLabel: "energy output vs. standard walk",
    color: "cyan",
  },
  {
    icon: Shield,
    title: "Supervised & Safe",
    body: "Every session is one-on-one. No pack dynamics. No off-leash risk. Your dog runs at their own pace on a non-motorized slatted treadmill.",
    metric: "1:1",
    metricLabel: "trainer-to-dog ratio",
    color: "amber",
  },
  {
    icon: TrendingUp,
    title: "Measurable Progress",
    body: "We track session data — speed, duration, heart rate recovery — so you see the performance curve improve over time.",
    metric: "100%",
    metricLabel: "data-logged sessions",
    color: "cyan",
  },
];

export default function WhySprint() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="why-sprint" className="relative py-24 lg:py-32 marble-bg overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section Header — asymmetric layout */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16 lg:mb-20">
          <div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 mb-5"
            >
              <div className="w-8 h-px bg-amber-500" />
              <span className="sprint-label text-amber-600 text-[11px]">The Science</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl text-zinc-950 leading-[0.92] tracking-tight"
            >
              HIGH-DRIVE DOGS
              <br />
              <span className="text-amber-500">NEED MORE</span>
              <br />
              THAN A WALK.
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col justify-end"
          >
            <p
              className="text-zinc-500 text-lg leading-relaxed mb-6"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Border Collies, Malinois, GSDs, Vizslas, Huskies — these breeds were engineered for
              sustained high-output work. Suburban life creates a biological debt that manifests as
              anxiety, aggression, and destruction.
            </p>

            {/* Inline stat */}
            <div className="flex items-center gap-4 pt-6 border-t border-zinc-200">
              <div>
                <div className="font-display text-4xl text-zinc-950">68%</div>
                <div className="sprint-label text-zinc-400 text-[10px] mt-1">
                  of Cape Town's high-drive dogs are in energy deficit
                </div>
              </div>
              <div className="w-px h-12 bg-zinc-200" />
              <div>
                <div className="font-display text-4xl text-amber-500">3 days</div>
                <div className="sprint-label text-zinc-400 text-[10px] mt-1">
                  average time to see behavioural improvement
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Reasons Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {REASONS.map((reason, i) => {
            const Icon = reason.icon;
            const isAmber = reason.color === "amber";
            return (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="glass-card-light p-6 group hover:border-amber-500/50 transition-all duration-300 hover:-translate-y-1.5"
              >
                {/* Icon */}
                <div
                  className={`w-10 h-10 flex items-center justify-center mb-5 border ${
                    isAmber
                      ? "border-amber-500/30 text-amber-500"
                      : "border-cyan-400/30 text-cyan-500"
                  }`}
                >
                  <Icon size={18} strokeWidth={1.5} />
                </div>

                {/* Metric */}
                <div className="mb-4">
                  <span
                    className={`font-display text-4xl leading-none ${
                      isAmber ? "text-amber-500" : "text-cyan-500"
                    }`}
                  >
                    {reason.metric}
                  </span>
                  <div className="sprint-label text-zinc-400 text-[10px] mt-1.5 leading-tight">
                    {reason.metricLabel}
                  </div>
                </div>

                {/* Content */}
                <h3
                  className="font-condensed text-zinc-900 text-lg tracking-tight mb-2 leading-tight"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
                >
                  {reason.title}
                </h3>
                <p
                  className="text-zinc-500 text-sm leading-relaxed"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {reason.body}
                </p>

                {/* Bottom accent */}
                <div
                  className={`mt-5 h-px w-0 group-hover:w-full transition-all duration-500 ${
                    isAmber ? "bg-amber-500/40" : "bg-cyan-400/40"
                  }`}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
