/* ============================================================
   SPRINT — Enhanced Admin Dashboard
   Design: Full booking, subscription, and analytics management
   ============================================================ */

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calendar, DollarSign, Users, TrendingUp, Filter, X, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { toast } from "sonner";

type TabType = "overview" | "bookings" | "subscriptions" | "dogs" | "payments";

export default function AdminDashboardEnhanced() {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchDog, setSearchDog] = useState("");

  // Fetch data
  const { data: bookings = [], isLoading: bookingsLoading } = trpc.bookings.getBookings.useQuery();
  const { data: subscriptions = [], isLoading: subsLoading } = trpc.payments.getActiveSubscriptions.useQuery();
  const { data: dogs = [], isLoading: dogsLoading } = trpc.bookings.getDogs.useQuery();
  const { data: payments = [], isLoading: paymentsLoading } = trpc.payments.getPaymentHistory.useQuery();

  const cancelSubscription = trpc.payments.cancelSubscription.useMutation({
    onSuccess: () => {
      toast.success("Subscription cancelled");
    },
  });

  // Calculate KPIs
  const kpis = useMemo(() => {
    const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.amount || "0"), 0);
    const activeSubscriptions = subscriptions.filter((s) => s.status === "active").length;
    const thisMonthBookings = bookings.filter((b: any) => {
      const date = new Date(b.sessionDate);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;
    const totalDogs = dogs.length;

    return { totalRevenue, activeSubscriptions, thisMonthBookings, totalDogs };
  }, [payments, subscriptions, bookings, dogs]);

  // Filter bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b: any) => {
      if (filterStatus !== "all" && b.status !== filterStatus) return false;
      return true;
    });
  }, [bookings, filterStatus]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-display text-cyan-100" style={{ fontFamily: "'Barlow', sans-serif" }}>
            Admin Dashboard
          </h1>
          <div className="text-sm text-zinc-400">Last updated: {new Date().toLocaleTimeString()}</div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-500 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-amber-500">R{kpis.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign size={24} className="text-amber-500" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-500 text-sm">Active Subscriptions</p>
                <p className="text-2xl font-bold text-cyan-400">{kpis.activeSubscriptions}</p>
              </div>
              <TrendingUp size={24} className="text-cyan-400" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-500 text-sm">Bookings This Month</p>
                <p className="text-2xl font-bold text-green-400">{kpis.thisMonthBookings}</p>
              </div>
              <Calendar size={24} className="text-green-400" />
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-zinc-500 text-sm">Total Dogs</p>
                <p className="text-2xl font-bold text-purple-400">{kpis.totalDogs}</p>
              </div>
              <Users size={24} className="text-purple-400" />
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-zinc-700">
          {(["overview", "bookings", "subscriptions", "dogs", "payments"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-display capitalize transition-colors ${
                activeTab === tab
                  ? "text-cyan-400 border-b-2 border-cyan-400"
                  : "text-zinc-400 hover:text-zinc-300"
              }`}
              style={{ fontFamily: "'Barlow', sans-serif" }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="space-y-4">
          {/* Bookings Tab */}
          {activeTab === "bookings" && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-zinc-100 focus:outline-none focus:border-cyan-400"
                >
                  <option value="all">All Statuses</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {bookingsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 size={24} className="text-cyan-400 animate-spin" />
                </div>
              ) : filteredBookings.length === 0 ? (
                <div className="text-center py-8 text-zinc-400">No bookings found</div>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {filteredBookings.map((booking: any) => (
                    <motion.div
                      key={booking.id}
                      whileHover={{ scale: 1.01 }}
                      className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <p className="text-cyan-100 font-bold">Dog ID: {booking.dogId}</p>
                        <p className="text-zinc-400 text-sm">
                          {new Date(booking.sessionDate).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded text-xs font-bold ${
                            booking.status === "completed"
                              ? "bg-green-500/20 text-green-400"
                              : booking.status === "scheduled"
                              ? "bg-cyan-500/20 text-cyan-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Subscriptions Tab */}
          {activeTab === "subscriptions" && (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {subsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 size={24} className="text-cyan-400 animate-spin" />
                </div>
              ) : subscriptions.length === 0 ? (
                <div className="text-center py-8 text-zinc-400">No subscriptions</div>
              ) : (
                subscriptions.map((sub) => (
                  <motion.div
                    key={sub.id}
                    whileHover={{ scale: 1.01 }}
                    className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="text-cyan-100 font-bold">Dog ID: {sub.dogId}</p>
                        <p className="text-zinc-400 text-sm">
                          {sub.billingCycle === "monthly" ? "Monthly" : "Yearly"} • {sub.sessionsRemaining} sessions left
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-3 py-1 rounded text-xs font-bold ${
                            sub.status === "active"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }`}
                        >
                          {sub.status}
                        </span>
                        {sub.status === "active" && (
                          <button
                            onClick={() =>
                              cancelSubscription.mutate({
                                subscriptionId: sub.id,
                              })
                            }
                            disabled={cancelSubscription.isPending}
                            className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs hover:bg-red-500/30 transition-colors"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="text-zinc-500 text-xs">
                      Next billing: {new Date(sub.nextBillingDate || "").toLocaleDateString()}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Dogs Tab */}
          {activeTab === "dogs" && (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {dogsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 size={24} className="text-cyan-400 animate-spin" />
                </div>
              ) : dogs.length === 0 ? (
                <div className="text-center py-8 text-zinc-400">No dogs registered</div>
              ) : (
                dogs.map((dog: any) => (
                  <motion.div
                    key={dog.id}
                    whileHover={{ scale: 1.01 }}
                    className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-cyan-100 font-bold">{dog.name}</p>
                        <p className="text-zinc-400 text-sm">
                          {dog.breed} • {dog.size} • {dog.energyLevel} energy
                        </p>
                      </div>
                      <div className="text-right text-sm text-zinc-400">
                        {dog.age && <p>Age: {dog.age} years</p>}
                        {dog.weight && <p>Weight: {dog.weight} kg</p>}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === "payments" && (
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {paymentsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 size={24} className="text-cyan-400 animate-spin" />
                </div>
              ) : payments.length === 0 ? (
                <div className="text-center py-8 text-zinc-400">No payments</div>
              ) : (
                payments.map((payment) => (
                  <motion.div
                    key={payment.id}
                    whileHover={{ scale: 1.01 }}
                    className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <p className="text-cyan-100 font-bold">R{parseFloat(payment.amount || "0").toLocaleString()}</p>
                      <p className="text-zinc-400 text-sm">
                        {new Date(payment.createdAt).toLocaleDateString()} • {payment.paymentMethod}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded text-xs font-bold ${
                        payment.status === "completed"
                          ? "bg-green-500/20 text-green-400"
                          : payment.status === "pending"
                          ? "bg-yellow-500/20 text-yellow-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
