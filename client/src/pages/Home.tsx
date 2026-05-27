/* ============================================================
   SPRINT — Home Page
   Design: "Constantia Marble & Matte" — Performance-Luxury
   Sections: Hero → WhySprint → Process → Testimonials → Pricing → Quiz → FAQ → Footer
   Separators: KineticPulse sine wave between sections
   ============================================================ */
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhySprint from "@/components/WhySprint";
import ProcessSection from "@/components/ProcessSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import PricingSection from "@/components/PricingSection";
import QuizSection from "@/components/QuizSection";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";
import KineticPulse from "@/components/KineticPulse";
import FloatingNav from "@/components/FloatingNav";
import WhatToBringSection from "@/components/WhatToBringSection";
import CoolFactsSection from "@/components/CoolFactsSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 overflow-x-hidden pb-28">
      {/* Sticky Navigation */}
      <Navbar />

      {/* ── Hero ── Dark marble/matte background */}
      <section id="hero">
        <HeroSection />
      </section>

      {/* ── Transition: Dark → Light ── */}
      <div className="relative bg-zinc-950" style={{ marginBottom: "-1px" }}>
        <KineticPulse />
        <div className="h-16 bg-gradient-to-b from-zinc-950 to-gray-50" />
      </div>

      {/* ── Why Sprint ── Light marble section */}
      <section id="why-sprint">
        <WhySprint />
      </section>

      {/* ── Transition: Light → Dark ── */}
      <div className="relative bg-gray-50" style={{ marginBottom: "-1px" }}>
        <KineticPulse />
        <div className="h-16 bg-gradient-to-b from-gray-50 to-zinc-950" />
      </div>

      {/* ── The Riley Method ── Dark section */}
      <section id="process">
        <ProcessSection />
      </section>

      {/* ── Testimonials ── Dark section (continuous) */}
      <TestimonialsSection />

      {/* ── Transition: Dark → Light ── */}
      <div className="relative bg-zinc-950" style={{ marginBottom: "-1px" }}>
        <KineticPulse />
        <div className="h-16 bg-gradient-to-b from-zinc-950 to-gray-50" />
      </div>

      {/* ── Pricing Grid ── Light marble section */}
      <section id="pricing">
        <PricingSection />
      </section>

      {/* ── Transition: Light → Dark ── */}
      <div className="relative bg-gray-50" style={{ marginBottom: "-1px" }}>
        <KineticPulse />
        <div className="h-16 bg-gradient-to-b from-gray-50 to-zinc-950" />
      </div>

      {/* ── The Quiz ── Dark section */}
      <section id="quiz">
        <QuizSection />
      </section>

      {/* ── Transition: Dark → Light ── */}
      <div className="relative bg-zinc-950" style={{ marginBottom: "-1px" }}>
        <KineticPulse />
        <div className="h-16 bg-gradient-to-b from-zinc-950 to-gray-50" />
      </div>

      {/* ── FAQ & Behavioral Issues ── Light marble section */}
      <section id="faq">
        <FAQSection />
      </section>

      {/* ── What to Bring (Free Value) ── Light section (no transition, continuous light) */}
      <section id="what-to-bring">
        <WhatToBringSection />
      </section>

      {/* ── Transition: Light → Dark ── */}
      <div className="relative bg-gray-50" style={{ marginBottom: "-1px" }}>
        <KineticPulse />
        <div className="h-16 bg-gradient-to-b from-gray-50 to-zinc-950" />
      </div>

      {/* ── Cool Facts (Science) ── Dark section */}
      <section id="cool-facts">
        <CoolFactsSection />
      </section>

      {/* ── Transition: Dark → Light ── */}
      <div className="relative bg-zinc-950" style={{ marginBottom: "-1px" }}>
        <KineticPulse />
        <div className="h-16 bg-gradient-to-b from-zinc-950 to-gray-50" />
      </div>

      {/* ── Footer ── */}
      <Footer />

      {/* ── Chatbot ── */}
      <section id="chatbot" className="hidden" />

      {/* ── Floating Bottom Nav ── */}
      <FloatingNav />
    </div>
  );
}
