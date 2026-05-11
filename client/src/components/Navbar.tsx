/* ============================================================
   SPRINT Navbar
   Design: Transparent sticky → frosted black on scroll
   Logo: "SPRINT" in amber-500, bold geometric
   CTA: Cyan glowing "The Quiz" button
   ============================================================ */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Zap } from "lucide-react";
import AppSideMenu from "./AppSideMenu";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-zinc-950/90 backdrop-blur-md border-b border-amber-500/10 shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2 group"
            >
              <span className="font-display text-2xl lg:text-3xl text-amber-500 tracking-tight group-hover:text-amber-400 transition-colors duration-200">
                SPRINT
              </span>
              <span className="hidden sm:block sprint-label text-zinc-500 text-[10px] leading-tight mt-1">
                MOBILE DOG GYM
              </span>
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <NavLink onClick={() => scrollTo("why-sprint")}>Why Sprint</NavLink>
              <NavLink onClick={() => scrollTo("packages")}>Packages</NavLink>
              <NavLink onClick={() => scrollTo("process")}>The Method</NavLink>

              {/* The Quiz CTA */}
              <button
                onClick={() => scrollTo("quiz")}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-condensed font-700 tracking-widest uppercase text-zinc-950 bg-cyan-400 hover:bg-cyan-300 transition-all duration-200 neon-glow-cyan hover:scale-[1.03] active:scale-[0.98]"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
              >
                <Zap size={14} strokeWidth={2.5} />
                The Quiz
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden text-zinc-300 hover:text-amber-500 transition-colors"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="fixed top-16 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-amber-500/10 md:hidden"
          >
            <div className="flex flex-col px-6 py-6 gap-5">
              <MobileNavLink onClick={() => scrollTo("why-sprint")}>Why Sprint</MobileNavLink>
              <MobileNavLink onClick={() => scrollTo("packages")}>Packages</MobileNavLink>
              <MobileNavLink onClick={() => scrollTo("process")}>The Method</MobileNavLink>
              <button
                onClick={() => scrollTo("quiz")}
                className="flex items-center justify-center gap-2 px-5 py-3 text-sm font-condensed font-700 tracking-widest uppercase text-zinc-950 bg-cyan-400 neon-glow-cyan mt-2"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700 }}
              >
                <Zap size={14} strokeWidth={2.5} />
                The Quiz
              </button>
            </div>
            <div className="border-t border-zinc-800 mt-6 pt-6">
              <AppSideMenu />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function NavLink({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="sprint-label text-zinc-400 hover:text-amber-500 transition-colors duration-200 relative group"
    >
      {children}
      <span className="absolute -bottom-1 left-0 w-0 h-px bg-amber-500 group-hover:w-full transition-all duration-300" />
    </button>
  );
}

function MobileNavLink({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="sprint-label text-zinc-300 hover:text-amber-500 transition-colors duration-200 text-left border-b border-zinc-800 pb-4"
    >
      {children}
    </button>
  );
}
