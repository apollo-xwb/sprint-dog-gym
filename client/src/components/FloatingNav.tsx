/* ============================================================
   SPRINT — Floating Bottom Navigation Bar
   Design: App-like fixed nav, centered, not full-width
   ============================================================ */

import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Home, Zap, Calendar, MessageCircle, User } from "lucide-react";

type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
};

export default function FloatingNav() {
  const [activeTab, setActiveTab] = useState("home");
  const [, setLocation] = useLocation();

  const handleScroll = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const NAV_ITEMS: NavItem[] = [
    { 
      id: "home", 
      label: "Home", 
      icon: <Home size={20} />, 
      action: () => window.scrollTo({ top: 0, behavior: "smooth" })
    },
    { 
      id: "quiz", 
      label: "Quiz", 
      icon: <Zap size={20} />, 
      action: () => handleScroll("quiz")
    },
    { 
      id: "bookings", 
      label: "Book", 
      icon: <Calendar size={20} />, 
      action: () => handleScroll("pricing")
    },
    { 
      id: "chat", 
      label: "Chat", 
      icon: <MessageCircle size={20} />, 
      action: () => handleScroll("chatbot")
    },
    { 
      id: "profile", 
      label: "Profile", 
      icon: <User size={20} />, 
      action: () => setLocation("/profile")
    },
  ];

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, duration: 0.4 }}
      className="fixed bottom-6 left-1/2 z-30 transform -translate-x-1/2"
      style={{
        backdropFilter: "blur(20px)",
        background: "rgba(24, 24, 27, 0.85)",
        border: "1px solid rgba(34, 211, 238, 0.2)",
        boxShadow: "0 8px 32px rgba(34, 211, 238, 0.15)",
      }}
    >
      <div className="flex items-center gap-2 px-2 py-3 rounded-full">
        {NAV_ITEMS.map((item) => (
          <motion.button
            key={item.id}
            onClick={() => {
              setActiveTab(item.id);
              item.action();
            }}
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`flex flex-col items-center justify-center px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer ${
              activeTab === item.id
                ? "bg-cyan-400/20 text-cyan-400"
                : "text-zinc-400 hover:text-cyan-300"
            }`}
          >
            <motion.div
              animate={{ scale: activeTab === item.id ? 1.1 : 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {item.icon}
            </motion.div>
            <span className="text-xs font-display mt-1" style={{ fontFamily: "'Barlow', sans-serif" }}>
              {item.label}
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
