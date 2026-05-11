/* ============================================================
   SPRINT — Kinetik Pulse Separator
   Design: Animated sine wave SVG as section divider
   Colors: amber-500 primary line, cyan-400 ghost echo
   Usage: Place between sections as a visual separator
   ============================================================ */

import { motion } from "framer-motion";

interface KineticPulseProps {
  className?: string;
}

export default function KineticPulse({ className = "" }: KineticPulseProps) {
  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      style={{ height: "60px" }}
    >
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="pulseAmber" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0" />
            <stop offset="15%" stopColor="#f59e0b" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#f59e0b" stopOpacity="1" />
            <stop offset="85%" stopColor="#f59e0b" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="pulseCyan" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="25%" stopColor="#22d3ee" stopOpacity="0.35" />
            <stop offset="75%" stopColor="#22d3ee" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
          <filter id="glowAmber">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Cyan ghost wave — slightly offset */}
        <motion.path
          d="M0,30 C180,8 360,52 540,30 C720,8 900,52 1080,30 C1260,8 1380,52 1440,30"
          fill="none"
          stroke="url(#pulseCyan)"
          strokeWidth="1.2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.5, delay: 0.4 }}
        />

        {/* Amber primary wave */}
        <motion.path
          d="M0,30 C180,10 360,50 540,30 C720,10 900,50 1080,30 C1260,10 1380,50 1440,30"
          fill="none"
          stroke="url(#pulseAmber)"
          strokeWidth="1.5"
          filter="url(#glowAmber)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.5 }}
        />

        {/* Traveling amber pulse dot */}
        <motion.circle
          r="2.5"
          fill="#f59e0b"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 1.5 }}
          style={{ filter: "drop-shadow(0 0 5px #f59e0b)" }}
        >
          <animateMotion
            dur="3.5s"
            repeatCount="indefinite"
            path="M0,30 C180,10 360,50 540,30 C720,10 900,50 1080,30 C1260,10 1380,50 1440,30"
          />
        </motion.circle>

        {/* Traveling cyan echo dot */}
        <motion.circle
          r="1.5"
          fill="#22d3ee"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.7, 0.7, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 1.5, delay: 1.2 }}
          style={{ filter: "drop-shadow(0 0 4px #22d3ee)" }}
        >
          <animateMotion
            dur="3.5s"
            begin="1.2s"
            repeatCount="indefinite"
            path="M0,30 C180,8 360,52 540,30 C720,8 900,52 1080,30 C1260,8 1380,52 1440,30"
          />
        </motion.circle>
      </svg>
    </div>
  );
}
