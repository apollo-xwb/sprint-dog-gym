/* ============================================================
   SPRINT — FAQ & Behavioral Issues Section
   Design: Light marble background, amber/cyan accents
   ============================================================ */

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronDown, AlertTriangle, CheckCircle } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "What is the Kinetik Deficit Score?",
    answer: "The Kinetik Deficit Score measures the gap between your dog's biological energy requirement and their current daily output. Dogs with high deficits (60%+) are at risk for behavioral issues, anxiety, and destructive behavior.",
  },
  {
    question: "How often should my dog use SPRINT?",
    answer: "We recommend 1–2 sessions per week for most high-drive dogs. Our 5-Session and 10-Session packages are designed for optimal results. Monthly subscriptions provide unlimited access for serious athletes.",
  },
  {
    question: "Is SPRINT safe for all dog breeds?",
    answer: "SPRINT is designed for high-drive and athletic dogs of all sizes. Our assessment quiz helps identify if your dog is a good fit. We also work with smaller breeds and mixed-energy dogs—contact us for a consultation.",
  },
  {
    question: "What if my dog has never used a treadmill?",
    answer: "Our team provides a full orientation session. We use positive reinforcement and gradual conditioning to ensure your dog feels confident. Most dogs adapt within 1–2 sessions.",
  },
  {
    question: "Can I book multiple dogs in one session?",
    answer: "Yes! Our Buddy System offers 15% off the second dog. You can book multiple dogs in one visit or stagger sessions based on your schedule.",
  },
  {
    question: "What happens during a SPRINT session?",
    answer: "Each 45-minute session includes: pre-session assessment, supervised non-motorized slatted treadmill work, heart rate and form monitoring, and a post-session recovery report with metrics logged to your profile.",
  },
  {
    question: "Do you offer monthly subscriptions?",
    answer: "Yes! Our Monthly subscription (R1,950/mo) includes unlimited sessions. You can also pay yearly upfront (R23,400) for a 10% savings.",
  },
  {
    question: "What if my dog gets injured or sick?",
    answer: "We pause subscriptions at no charge. Sessions are transferable to another dog in your household. Contact us for details on our injury recovery protocol.",
  },
];

const BEHAVIORAL_ISSUES_DATA = [
  {
    category: "Destructive Behavior",
    issues: [
      "Chewing furniture, walls, or personal items",
      "Digging and excavation (especially in yards)",
      "Shredding blankets or toys obsessively",
    ],
    cause: "Excess energy + frustration + boredom",
    solution: "SPRINT sessions reduce pent-up energy and provide healthy outlet for drive",
  },
  {
    category: "Aggression & Reactivity",
    issues: [
      "Lunging or snapping at other dogs",
      "Excessive barking at triggers (cars, people, animals)",
      "Leash reactivity and pulling",
    ],
    cause: "Overstimulation + unmet exercise needs + frustration",
    solution: "Structured high-output exercise calms nervous system and improves focus",
  },
  {
    category: "Anxiety & Escape Behaviors",
    issues: [
      "Separation anxiety (destructive when alone)",
      "Escaping or jumping fences",
      "Obsessive behaviors (spinning, pacing)",
    ],
    cause: "Excess energy manifests as anxiety; lack of outlet increases stress",
    solution: "Regular SPRINT sessions tire the dog mentally and physically, reducing anxiety",
  },
  {
    category: "Attention-Seeking & Hyperactivity",
    issues: [
      "Jumping on people constantly",
      "Inability to settle or relax indoors",
      "Excessive play-biting and roughhousing",
    ],
    cause: "Unmet biological need for high-intensity exercise",
    solution: "SPRINT provides the intensity high-drive dogs crave, improving home behavior",
  },
];

export default function FAQSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [expandedBehavior, setExpandedBehavior] = useState<number | null>(null);

  return (
    <section ref={ref} className="relative py-24 lg:py-32 bg-gray-50 overflow-hidden">
      {/* Amber radial glow */}
      <div
        className="absolute top-0 left-0 w-[600px] h-[400px] opacity-5 pointer-events-none blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse, rgba(245,158,11,0.6) 0%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-24"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-amber-500" />
            <span className="sprint-label text-amber-500">Frequently Asked</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-zinc-950 leading-tight tracking-tight mb-12">
            Questions About SPRINT
          </h2>

          <div className="space-y-4">
            {FAQ_ITEMS.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="border border-zinc-200 bg-white hover:border-amber-500/30 transition-all duration-200"
              >
                <button
                  onClick={() =>
                    setExpandedFAQ(expandedFAQ === idx ? null : idx)
                  }
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span
                    className="font-display text-lg text-zinc-950 tracking-tight"
                    style={{ fontFamily: "'Barlow', sans-serif" }}
                  >
                    {item.question}
                  </span>
                  <ChevronDown
                    size={20}
                    className={`text-amber-500 flex-shrink-0 transition-transform duration-300 ${
                      expandedFAQ === idx ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {expandedFAQ === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-zinc-200 px-6 py-4 bg-gray-50"
                  >
                    <p
                      className="text-zinc-600 leading-relaxed"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Behavioral Issues Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-px bg-amber-500" />
            <span className="sprint-label text-amber-500">Behavioral Root Causes</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl text-zinc-950 leading-tight tracking-tight mb-12">
            When Dogs Don't Meet Their Needs
          </h2>

          <div className="grid lg:grid-cols-2 gap-8">
            {BEHAVIORAL_ISSUES_DATA.map((category, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="border border-zinc-200 bg-white p-8 hover:border-amber-500/50 transition-all duration-200"
              >
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-1" />
                  <h3
                    className="font-display text-2xl text-zinc-950 tracking-tight"
                    style={{ fontFamily: "'Barlow', sans-serif" }}
                  >
                    {category.category}
                  </h3>
                </div>

                <div className="mb-6">
                  <p className="sprint-label text-zinc-500 text-[10px] mb-2">Common Behaviors:</p>
                  <ul className="space-y-2">
                    {category.issues.map((issue, i) => (
                      <li
                        key={i}
                        className="text-zinc-600 text-sm flex items-start gap-2"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        <span className="text-amber-500 mt-1">•</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-4 p-4 bg-amber-50 border border-amber-200">
                  <p className="sprint-label text-amber-900 text-[10px] mb-1">Root Cause:</p>
                  <p
                    className="text-amber-900 text-sm"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {category.cause}
                  </p>
                </div>

                <div className="p-4 bg-cyan-50 border border-cyan-200">
                  <div className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-cyan-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="sprint-label text-cyan-900 text-[10px] mb-1">SPRINT Solution:</p>
                      <p
                        className="text-cyan-900 text-sm"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {category.solution}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Key Stat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 p-8 bg-gradient-to-r from-amber-50 to-cyan-50 border border-amber-200"
          >
            <div className="text-center">
              <p
                className="sprint-label text-amber-600 text-[10px] mb-2"
                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
              >
                The Science
              </p>
              <p
                className="font-display text-4xl sm:text-5xl text-zinc-950 mb-4"
                style={{ fontFamily: "'Barlow', sans-serif" }}
              >
                68% of behavioral issues stem from unmet energy needs
              </p>
              <p
                className="text-zinc-600 text-lg max-w-2xl mx-auto"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Dogs are athletes locked in quiet houses. When their biological drive goes unfulfilled, the brain redirects that energy into destructive, anxious, or aggressive outlets. SPRINT closes the gap.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
