/* ============================================================
   SPRINT — User Profile Page
   Design: Glassmorphism, dark theme
   Features: User info, dog profiles, booking history
   ============================================================ */

import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { User, Dog, Calendar, LogOut } from "lucide-react";
import { useLocation } from "wouter";
import { getLoginUrl } from "@/const";

export default function Profile() {
  const { user, loading, logout } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-cyan-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-6">
        <h1 className="text-3xl font-bold text-white">Sign in to view your profile</h1>
        <Button
          onClick={() => (window.location.href = getLoginUrl())}
          className="bg-cyan-400 text-zinc-950 hover:bg-cyan-300"
        >
          Sign In
        </Button>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-zinc-950 pt-24 pb-32 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Your Profile</h1>
          <p className="text-zinc-400">Manage your account and bookings</p>
        </motion.div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-zinc-900/50 border-cyan-400/20 backdrop-blur-md p-6 mb-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-cyan-400/10 rounded-lg">
                <User className="text-cyan-400" size={24} />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                <p className="text-zinc-400">{user.email}</p>
                <p className="text-sm text-zinc-500 mt-2">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Dogs Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Dog className="text-amber-500" size={24} />
            <h3 className="text-2xl font-bold text-white">Your Dogs</h3>
          </div>
          <Card className="bg-zinc-900/50 border-cyan-400/20 backdrop-blur-md p-6">
            <p className="text-zinc-400">Your registered dogs will appear here</p>
          </Card>
        </motion.div>

        {/* Bookings Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="text-amber-500" size={24} />
            <h3 className="text-2xl font-bold text-white">Upcoming Sessions</h3>
          </div>
          <Card className="bg-zinc-900/50 border-cyan-400/20 backdrop-blur-md p-6">
            <p className="text-zinc-400">Your upcoming sessions will appear here</p>
          </Card>
        </motion.div>

        {/* Logout Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button
            onClick={handleLogout}
            className="w-full bg-red-600/20 border border-red-500/30 text-red-400 hover:bg-red-600/30 flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Sign Out
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
