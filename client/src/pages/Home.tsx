/* ============================================================
   SPRINT — Home Page
   Design: "Constantia Marble & Matte" — Performance-Luxury
   Sections: Hero → WhySprint → Process → Testimonials → Pricing → Quiz → Footer
   Separators: KineticPulse sine wave between sections
   ============================================================ */

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhySprint from "@/components/WhySprint";
import ProcessSection from "@/components/ProcessSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PricingSection from "@/components/PricingSection";
import QuizSection from "@/components/QuizSection";
import Footer from "@/components/Footer";
import KineticPulse from "@/components/KineticPulse";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 overflow-x-hidden">
      {/* Sticky Navigation */}
      <Navbar />

      {/* ── Hero ── Dark marble/matte background */}
      <HeroSection />

      {/* ── Transition: Dark → Light ── */}
      <div className="relative bg-zinc-950" style={{ marginBottom: "-1px" }}>
        <KineticPulse />
        <div className="h-16 bg-gradient-to-b from-zinc-950 to-gray-50" />
      </div>

      {/* ── Why Sprint ── Light marble section */}
      <WhySprint />

      {/* ── Transition: Light → Dark ── */}
      <div className="relative bg-gray-50" style={{ marginBottom: "-1px" }}>
        <KineticPulse />
        <div className="h-16 bg-gradient-to-b from-gray-50 to-zinc-950" />
      </div>

      {/* ── The Riley Method ── Dark section */}
      <ProcessSection />

      {/* ── Testimonials ── Dark section (continuous) */}
      <TestimonialsSection />

      {/* ── Transition: Dark → Light ── */}
      <div className="relative bg-zinc-950" style={{ marginBottom: "-1px" }}>
        <KineticPulse />
        <div className="h-16 bg-gradient-to-b from-zinc-950 to-gray-50" />
      </div>

      {/* ── Pricing Grid ── Light marble section */}
      <PricingSection />

      {/* ── Transition: Light → Dark ── */}
      <div className="relative bg-gray-50" style={{ marginBottom: "-1px" }}>
        <KineticPulse />
        <div className="h-16 bg-gradient-to-b from-gray-50 to-zinc-950" />
      </div>

      {/* ── The Quiz ── Dark section */}
      <QuizSection />

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}
