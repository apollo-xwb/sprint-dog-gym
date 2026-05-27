/* ============================================================
   SPRINT — Pricing Grid
   Design: Light marble background, 4 pricing cards
   Animation: Framer Motion viewport reveal with stagger
   Buddy System: Full-width amber-500 banner
   Packages: Single R550, 5-Session R2500, 10-Session R4800, Monthly R1950/mo
   ============================================================ */

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Check, Zap, Star, Users } from "lucide-react";
import BookingModalEnhanced from "@/components/BookingModalEnhanced";

const PACKAGES = [
  {
    id: "single",
    name: "Single",
    tagline: "Try the Method",
    price: "R550",
    period: "per session",
    sessions: "1 Session",
    features: [
      "45-min supervised session",
      "Kinetik Deficit Assessment",
      "Session data report",
      "Mobile unit to your driveway",
    ],
    highlight: false,
    badge: null,
    accentColor: "zinc",
  },
  {
    id: "five",
    name: "5-Session",
    tagline: "Build the Habit",
    price: "R2,500",
    period: "R500/session",
    sessions: "5 Sessions",
    features: [
      "5 × 45-min sessions",
      "Progress tracking dashboard",
      "Breed-specific protocol",
      "Mobile unit to your driveway",
      "Priority scheduling",
    ],
    highlight: false,
    badge: "Save R250",
    accentColor: "amber",
  },
  {
    id: "ten",
    name: "10-Session",
    tagline: "The Transformation",
    price: "R4,800",
    period: "R480/session",
    sessions: "10 Sessions",
    features: [
      "10 × 45-min sessions",
      "Full performance profile",
      "Nutrition consultation",
      "Mobile unit to your driveway",
      "Priority scheduling",
      "Monthly progress report",
    ],
    highlight: true,
    badge: "Best Value",
    accentColor: "amber",
  },
  {
    id: "monthly",
    name: "Monthly",
    tagline: "Peak Performance",
    price: "R1,950",
    period: "per month",
    sessions: "Unlimited*",
    features: [
      "Unlimited sessions/month",
      "Real-time session analytics",
      "Dedicated trainer assigned",
      "Mobile unit to your driveway",
      "Same-day scheduling",
      "Quarterly performance review",
    ],
    highlight: false,
    badge: "Subscription",
    accentColor: "cyan",
  },
];

export default function PricingSection() {
  const ref = useRef(null);
  const bannerRef = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const bannerInView = useInView(bannerRef, { once: true, margin: "-50px" });
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <section id="packages" className="relative py-24 lg:py-32 marble-bg overflow-hidden">
      {/* Marble texture */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Cfilter id='marble'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.01 0.005' numOctaves='8' seed='7'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%23d0d0d0' filter='url(%23marble)'/%3E%3C/svg%3E")`,
          backgroundSize: "800px 600px",
        }}
      />

      <div ref={ref} className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-4"
          >
            <div className="w-8 h-px bg-amber-500" />
            <span className="sprint-label text-amber-600">Investment</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl text-zinc-950 leading-tight tracking-tight"
          >
            CHOOSE YOUR
            <br />
            <span className="text-amber-500">PROTOCOL.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-500 text-lg mt-6 max-w-lg leading-relaxed"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            Every package includes mobile delivery to your driveway, supervised sessions,
            and full session data logging.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {PACKAGES.map((pkg, i) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 60 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              className={`relative flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-2 ${
                pkg.highlight
                  ? "bg-zinc-950 border border-amber-500/60 shadow-[0_0_30px_rgba(245,158,11,0.15)]"
                  : "glass-card-light hover:border-amber-500/50"
              }`}
            >
              {/* Highlight glow */}
              {pkg.highlight && (
                <div
                  className="absolute inset-0 pointer-events-none opacity-5"
                  style={{
                    background:
                      "radial-gradient(ellipse at top, rgba(245,158,11,0.8) 0%, transparent 70%)",
                  }}
                />
              )}

              {/* Badge */}
              {pkg.badge && (
                <div
                  className={`absolute top-4 right-4 sprint-label text-[10px] px-2 py-1 ${
                    pkg.highlight
                      ? "bg-amber-500 text-zinc-950"
                      : pkg.accentColor === "cyan"
                      ? "bg-cyan-400/20 text-cyan-500 border border-cyan-400/30"
                      : "bg-amber-500/15 text-amber-600 border border-amber-500/30"
                  }`}
                >
                  {pkg.badge}
                </div>
              )}

              <div className="p-6 flex flex-col flex-1">
                {/* Package name */}
                <div className="mb-5">
                  <div
                    className={`sprint-label text-xs mb-2 ${
                      pkg.highlight
                        ? "text-amber-500"
                        : pkg.accentColor === "cyan"
                        ? "text-cyan-600"
                        : "text-amber-600"
                    }`}
                  >
                    {pkg.sessions}
                  </div>
                  <h3
                    className={`font-display text-2xl tracking-tight ${
                      pkg.highlight ? "text-white" : "text-zinc-900"
                    }`}
                  >
                    {pkg.name}
                  </h3>
                  <p
                    className={`text-sm mt-1 ${
                      pkg.highlight ? "text-zinc-400" : "text-zinc-600"
                    }`}
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {pkg.tagline}
                  </p>
                </div>

                {/* Price */}
                  <div className="mb-6 pb-6 border-b border-zinc-300/30">
                  <div className="flex items-baseline gap-1">
                    <span
                      className={`font-display text-4xl ${
                        pkg.highlight ? "text-amber-500" : "text-zinc-900"
                      }`}
                    >
                      {pkg.price}
                    </span>
                  </div>
                  <div
                    className={`sprint-label text-[10px] mt-1 ${
                      pkg.highlight ? "text-zinc-500" : "text-zinc-500"
                    }`}
                  >
                    {pkg.period}
                  </div>
                </div>

                {/* Features */}
                <ul className="flex flex-col gap-3 flex-1 mb-6">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5">
                      <Check
                        size={14}
                        strokeWidth={2.5}
                        className={`mt-0.5 flex-shrink-0 ${
                          pkg.highlight
                            ? "text-amber-500"
                            : pkg.accentColor === "cyan"
                            ? "text-cyan-500"
                            : "text-amber-500"
                        }`}
                      />
                      <span
                        className={`text-sm leading-snug ${
                          pkg.highlight ? "text-zinc-300" : "text-zinc-600"
                        }`}
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <button
                  onClick={() => setBookingOpen(true)}
                  className={`w-full py-3 font-condensed font-700 tracking-widest uppercase text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${
                    pkg.highlight
                      ? "bg-amber-500 text-zinc-950 hover:bg-amber-400 neon-glow-amber"
                      : pkg.accentColor === "cyan"
                      ? "bg-transparent border border-cyan-400/40 text-cyan-500 hover:bg-cyan-400/10 hover:border-cyan-400"
                      : "bg-transparent border border-amber-500/40 text-amber-600 hover:bg-amber-500/10 hover:border-amber-500"
                  }`}
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
                >
                  {pkg.id === "monthly" ? "Subscribe" : "Book Now"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footnote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-zinc-400 text-xs mt-6 text-center"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          * Monthly plan: up to 12 sessions per month. All prices include VAT. Cape Town delivery only.
        </motion.p>
      </div>

      {/* Buddy System Banner */}
      <motion.div
        ref={bannerRef}
        initial={{ opacity: 0, scaleX: 0.95 }}
        animate={bannerInView ? { opacity: 1, scaleX: 1 } : {}}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="mt-20 bg-amber-500 relative overflow-hidden"
      >
        {/* Diagonal stripe pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(0,0,0,0.3) 0px, rgba(0,0,0,0.3) 1px, transparent 1px, transparent 20px)",
          }}
        />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8 lg:py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="flex items-center justify-center w-12 h-12 bg-zinc-950/15 flex-shrink-0">
                <Users size={22} strokeWidth={1.5} className="text-zinc-950" />
              </div>
              <div>
                <div className="sprint-label text-zinc-950/70 text-[10px] mb-1">
                  Buddy System Offer
                </div>
                <h3
                  className="font-display text-2xl lg:text-3xl text-zinc-950 tracking-tight leading-tight"
                >
                  Save 15% on the second dog.
                </h3>
                <p
                  className="text-zinc-950/70 text-sm mt-1"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Book any package for two dogs in the same household and receive 15% off the second dog's package.
                </p>
              </div>
            </div>

            <button
              onClick={() => setBookingOpen(true)}
              className="flex-shrink-0 flex items-center gap-2 px-7 py-3.5 bg-zinc-950 text-amber-500 font-condensed font-700 tracking-widest uppercase text-sm hover:bg-zinc-800 transition-all duration-200 hover:scale-[1.02]"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
            >
              <Star size={14} strokeWidth={2} />
              Claim Buddy Rate
            </button>
          </div>
        </div>
      </motion.div>

      <BookingModalEnhanced isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </section>
  );
}
