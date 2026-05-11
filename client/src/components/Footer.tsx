/* ============================================================
   SPRINT Footer
   Design: Minimalist zinc-950 background
   Content: "Now Sprinting in Cape Town." + "Born from Riley's Legacy."
   ============================================================ */

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { MapPin, Instagram, Mail, Phone } from "lucide-react";

export default function Footer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800/50" ref={ref}>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid md:grid-cols-3 gap-12 lg:gap-16">

          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="font-display text-4xl text-amber-500 tracking-tight mb-2">
              SPRINT
            </div>
            <div className="sprint-label text-zinc-600 text-[10px] mb-6">
              Mobile Dog Gym
            </div>
            <p
              className="text-zinc-500 text-sm leading-relaxed max-w-xs"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Cape Town's first performance-focused mobile dog gym. Bringing elite canine
              conditioning directly to your driveway.
            </p>

            {/* Location */}
            <div className="flex items-center gap-2 mt-6">
              <MapPin size={14} className="text-amber-500" strokeWidth={1.5} />
              <span className="sprint-label text-zinc-400 text-[11px]">
                Now Sprinting in Cape Town.
              </span>
            </div>
          </motion.div>

          {/* Links Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="sprint-label text-amber-500 text-[10px] mb-6">Navigate</div>
            <ul className="flex flex-col gap-3">
              {[
                { label: "Why Sprint", id: "why-sprint" },
                { label: "The Riley Method", id: "process" },
                { label: "Packages", id: "packages" },
                { label: "The Quiz", id: "quiz" },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() =>
                      document.getElementById(link.id)?.scrollIntoView({ behavior: "smooth" })
                    }
                    className="text-zinc-500 hover:text-amber-500 transition-colors duration-200 text-sm"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="sprint-label text-amber-500 text-[10px] mb-6">Contact</div>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href="mailto:hello@sprintdoggym.co.za"
                  className="flex items-center gap-3 text-zinc-500 hover:text-amber-500 transition-colors duration-200 group"
                >
                  <Mail size={14} strokeWidth={1.5} className="flex-shrink-0" />
                  <span
                    className="text-sm"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    hello@sprintdoggym.co.za
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+27000000000"
                  className="flex items-center gap-3 text-zinc-500 hover:text-amber-500 transition-colors duration-200"
                >
                  <Phone size={14} strokeWidth={1.5} className="flex-shrink-0" />
                  <span
                    className="text-sm"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    +27 (0) 00 000 0000
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-3 text-zinc-500 hover:text-amber-500 transition-colors duration-200"
                >
                  <Instagram size={14} strokeWidth={1.5} className="flex-shrink-0" />
                  <span
                    className="text-sm"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    @sprint.doggym
                  </span>
                </a>
              </li>
            </ul>

            {/* Service area */}
            <div className="mt-8 p-4 border border-zinc-800 bg-zinc-900/50">
              <div className="sprint-label text-zinc-600 text-[10px] mb-2">Service Area</div>
              <div
                className="text-zinc-400 text-sm"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Constantia · Bishopscourt · Newlands
                <br />
                Claremont · Rondebosch · Kenilworth
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="border-t border-zinc-800/50"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <span
              className="text-zinc-600 text-xs"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              © 2025 SPRINT Mobile Dog Gym. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500/60" />
            <span
              className="text-zinc-600 text-xs italic"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Born from Riley's Legacy.
            </span>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
