/* ============================================================
   SPRINT — Cool Facts Section
   Design: Energy deficit stats, behavioral science, animated counters
   ============================================================ */

import { motion } from "framer-motion";
import { TrendingUp, Brain, Zap, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import KineticPulse from "./KineticPulse";

interface StatCard {
  icon: React.ReactNode;
  stat: string;
  label: string;
  description: string;
  color: string;
}

const AnimatedCounter = ({ target, duration = 2 }: { target: number; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration * 60);
    const interval = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, [target, duration]);

  return <span>{count}</span>;
};

const FACTS: StatCard[] = [
  {
    icon: <TrendingUp size={32} />,
    stat: "23",
    label: "%",
    description: "of high-drive dogs reach their required daily energy output",
    color: "from-cyan-500/20 to-cyan-600/10",
  },
  {
    icon: <Brain size={32} />,
    stat: "87",
    label: "%",
    description: "of behavioral issues stem from unmet physical & mental needs",
    color: "from-purple-500/20 to-purple-600/10",
  },
  {
    icon: <Zap size={32} />,
    stat: "4x",
    label: "faster",
    description: "dogs improve focus & obedience after proper energy outlet",
    color: "from-amber-500/20 to-amber-600/10",
  },
  {
    icon: <Heart size={32} />,
    stat: "15",
    label: "yrs",
    description: "average lifespan increase with consistent exercise & mental stimulation",
    color: "from-red-500/20 to-red-600/10",
  },
];

export default function CoolFactsSection() {
  return (
    <>
      <KineticPulse />
      <section className="relative py-20 px-4 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight mb-4 text-white" style={{ fontFamily: "'Barlow', sans-serif" }}>
              The Science Behind SPRINT
            </h2>
            <p className="text-lg text-zinc-400">Why your dog needs more than just a walk</p>
          </motion.div>

          {/* Facts Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {FACTS.map((fact, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className={`p-8 rounded-2xl bg-gradient-to-br ${fact.color} border border-zinc-700 hover:border-cyan-400/50 transition-all overflow-hidden group`}
              >
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 to-cyan-400/0 group-hover:from-cyan-400/5 group-hover:to-cyan-400/5 transition-all duration-300" />

                {/* Content */}
                <div className="relative space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="text-cyan-400">{fact.icon}</div>
                  </div>

                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-black text-cyan-400" style={{ fontFamily: "'Barlow', sans-serif" }}>
                        <AnimatedCounter target={parseInt(fact.stat)} />
                      </span>
                      <span className="text-2xl font-bold text-zinc-400">{fact.label}</span>
                    </div>
                  </div>

                  <p className="text-zinc-300 leading-relaxed">{fact.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Key Insight */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="p-8 rounded-2xl border border-cyan-400/30 bg-cyan-400/5"
            style={{
              backdropFilter: "blur(12px)",
            }}
          >
            <h3 className="text-2xl font-display font-bold text-cyan-100 mb-3" style={{ fontFamily: "'Barlow', sans-serif" }}>
              🧠 The Energy Deficit Crisis
            </h3>
            <p className="text-zinc-300 leading-relaxed">
              High-drive dogs are biological athletes. When confined to quiet houses without proper outlets, they experience what we call an "Energy Deficit." This isn't just boredom — it's a neurological state where the dog's need for physical and mental stimulation goes unmet. The result? Destructive behavior, anxiety, aggression, and a shortened lifespan. SPRINT solves this by providing supervised, non-motorized treadmill sessions that tap into your dog's natural prey drive and athletic instincts, fulfilling their biological needs in just 20-45 minutes.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
