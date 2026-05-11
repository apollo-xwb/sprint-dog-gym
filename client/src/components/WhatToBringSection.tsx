/* ============================================================
   SPRINT — What to Bring (Free Value Section)
   Design: Glassmorphism checklist, pre-session prep guide
   ============================================================ */

import { motion } from "framer-motion";
import { Check, AlertCircle } from "lucide-react";
import KineticPulse from "./KineticPulse";

const BRING_ITEMS = [
  { item: "Water bowl", why: "Keep your dog hydrated during rest periods" },
  { item: "Fresh water", why: "Essential for recovery after intense exercise" },
  { item: "Treats", why: "Reward-based positive reinforcement during session" },
  { item: "Leash & collar", why: "Safety and control during transitions" },
  { item: "ID tag", why: "In case of emergency or separation" },
  { item: "Towel", why: "Dry off after sweating or if weather is wet" },
];

const AVOID_ITEMS = [
  { item: "Heavy meals", why: "Wait 2-3 hours after eating before intense exercise" },
  { item: "Hot weather sessions", why: "Early morning or evening preferred (avoid midday heat)" },
  { item: "Medications on empty stomach", why: "Consult vet about timing with food" },
  { item: "Stress or anxiety", why: "Dogs sense your energy — stay calm and positive" },
];

export default function WhatToBringSection() {
  return (
    <>
      <KineticPulse />
      <section className="relative py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-display font-black tracking-tight mb-4" style={{ fontFamily: "'Barlow', sans-serif" }}>
              Before You Sprint
            </h2>
            <p className="text-lg text-zinc-600">Everything you need to know to prepare for a perfect session</p>
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* What to Bring */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-cyan-400/20 flex items-center justify-center">
                  <Check className="text-cyan-400" size={20} />
                </div>
                <h3 className="text-2xl font-display font-bold text-cyan-100" style={{ fontFamily: "'Barlow', sans-serif" }}>
                  Bring These
                </h3>
              </div>

              <div className="space-y-3">
                {BRING_ITEMS.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 rounded-xl bg-white border border-cyan-200/30 hover:border-cyan-400/50 transition-all"
                    style={{
                      backdropFilter: "blur(8px)",
                      background: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-cyan-400/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <Check size={14} className="text-cyan-400" />
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900">{item.item}</p>
                        <p className="text-sm text-zinc-600">{item.why}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* What to Avoid */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center">
                  <AlertCircle className="text-amber-400" size={20} />
                </div>
                <h3 className="text-2xl font-display font-bold text-amber-100" style={{ fontFamily: "'Barlow', sans-serif" }}>
                  Avoid These
                </h3>
              </div>

              <div className="space-y-3">
                {AVOID_ITEMS.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.05 }}
                    className="p-4 rounded-xl bg-white border border-amber-200/30 hover:border-amber-400/50 transition-all"
                    style={{
                      backdropFilter: "blur(8px)",
                      background: "rgba(255, 255, 255, 0.7)",
                    }}
                  >
                    <div className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-400/20 flex items-center justify-center flex-shrink-0 mt-1">
                        <AlertCircle size={14} className="text-amber-400" />
                      </div>
                      <div>
                        <p className="font-bold text-zinc-900">{item.item}</p>
                        <p className="text-sm text-zinc-600">{item.why}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Pro Tip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-12 p-6 rounded-2xl border border-cyan-400/30 bg-cyan-400/5"
            style={{
              backdropFilter: "blur(12px)",
            }}
          >
            <p className="text-sm text-zinc-600">
              <span className="font-bold text-cyan-400">💡 Pro Tip:</span> Arrive 10 minutes early so your dog can acclimate to the environment and our team can assess their energy level. This ensures we tailor the session perfectly to their needs.
            </p>
          </motion.div>
        </div>
      </section>
    </>
  );
}
