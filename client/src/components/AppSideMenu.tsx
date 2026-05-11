/* ============================================================
   SPRINT — App-Like Side Menu
   Design: Big square curved buttons, grid layout, card-based
   ============================================================ */

import { motion } from "framer-motion";
import { Zap, Calendar, MessageCircle, HelpCircle, Settings, LogOut } from "lucide-react";

type MenuItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  href?: string;
  color: string;
};

const MENU_ITEMS: MenuItem[] = [
  {
    id: "quiz",
    label: "Energy Quiz",
    icon: <Zap size={32} />,
    description: "Calculate your dog's deficit",
    href: "/#quiz",
    color: "from-cyan-500/20 to-cyan-600/10",
  },
  {
    id: "book",
    label: "Book Session",
    icon: <Calendar size={32} />,
    description: "Schedule a sprint",
    href: "/#pricing",
    color: "from-amber-500/20 to-amber-600/10",
  },
  {
    id: "chat",
    label: "Ask SPRINT",
    icon: <MessageCircle size={32} />,
    description: "Chat with AI",
    href: "#",
    color: "from-purple-500/20 to-purple-600/10",
  },
  {
    id: "faq",
    label: "FAQ",
    icon: <HelpCircle size={32} />,
    description: "Common questions",
    href: "/#faq",
    color: "from-green-500/20 to-green-600/10",
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings size={32} />,
    description: "Manage profile",
    href: "#",
    color: "from-zinc-500/20 to-zinc-600/10",
  },
  {
    id: "logout",
    label: "Logout",
    icon: <LogOut size={32} />,
    description: "Sign out",
    href: "#",
    color: "from-red-500/20 to-red-600/10",
  },
];

export default function AppSideMenu() {
  return (
    <div className="space-y-4">
      <div className="px-4 py-2">
        <h3 className="text-sm font-display text-zinc-400 uppercase tracking-wider" style={{ fontFamily: "'Barlow', sans-serif" }}>
          Menu
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3 px-4">
        {MENU_ITEMS.map((item, idx) => (
          <motion.a
            key={item.id}
            href={item.href || "#"}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className={`group relative p-4 rounded-2xl bg-gradient-to-br ${item.color} border border-zinc-700 hover:border-cyan-400/50 transition-all duration-300 overflow-hidden`}
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 to-cyan-400/0 group-hover:from-cyan-400/10 group-hover:to-cyan-400/5 transition-all duration-300" />

            {/* Content */}
            <div className="relative flex flex-col items-center justify-center h-32 space-y-2">
              <motion.div
                className="text-cyan-400"
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {item.icon}
              </motion.div>
              <h4 className="text-sm font-bold text-cyan-100 text-center">{item.label}</h4>
              <p className="text-xs text-zinc-400 text-center">{item.description}</p>
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
