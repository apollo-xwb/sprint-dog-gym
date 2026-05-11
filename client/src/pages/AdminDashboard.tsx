/* ============================================================
   SPRINT — Admin Dashboard
   Design: Dark, data-focused, high-performance
   Features: Bookings, subscriptions, payments, analytics
   ============================================================ */

import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { Loader2, Calendar, Users, CreditCard, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();

  // Redirect non-admins
  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const { data: bookings = [], isLoading: bookingsLoading } = trpc.bookings.getBookings.useQuery();
  const { data: payments = [], isLoading: paymentsLoading } = trpc.payments.getPaymentHistory.useQuery();
  const { data: subscriptions = [], isLoading: subscriptionsLoading } = trpc.payments.getActiveSubscriptions.useQuery();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={32} className="animate-spin text-cyan-400" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return null;
  }

  const totalRevenue = payments.reduce((sum, p) => sum + parseFloat(p.amount || "0"), 0);
  const activeSubscriptions = subscriptions.filter((s) => s.status === "active").length;
  const upcomingBookings = bookings.filter((b) => b.status === "scheduled").length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-display text-zinc-50 tracking-tight" style={{ fontFamily: "'Barlow', sans-serif" }}>
            SPRINT Admin Dashboard
          </h1>
          <p className="text-zinc-400 mt-2">Manage bookings, subscriptions, and revenue</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard
            icon={<Calendar size={24} />}
            label="Upcoming Bookings"
            value={upcomingBookings}
            trend="+12% this week"
          />
          <KPICard
            icon={<Users size={24} />}
            label="Active Subscriptions"
            value={activeSubscriptions}
            trend="+8% this month"
          />
          <KPICard
            icon={<CreditCard size={24} />}
            label="Total Revenue"
            value={`R${totalRevenue.toLocaleString()}`}
            trend="+24% YoY"
          />
          <KPICard
            icon={<TrendingUp size={24} />}
            label="Conversion Rate"
            value="34%"
            trend="+5% this quarter"
          />
        </div>

        {/* Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Bookings Table */}
          <div className="border border-zinc-700 bg-zinc-900 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-zinc-700">
              <h2 className="text-xl font-display text-zinc-50" style={{ fontFamily: "'Barlow', sans-serif" }}>
                Recent Bookings
              </h2>
            </div>
            <div className="overflow-x-auto">
              {bookingsLoading ? (
                <div className="flex items-center justify-center p-12">
                  <Loader2 size={24} className="animate-spin text-cyan-400" />
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-700 bg-zinc-800">
                      <th className="px-6 py-3 text-left text-zinc-400">ID</th>
                      <th className="px-6 py-3 text-left text-zinc-400">Date</th>
                      <th className="px-6 py-3 text-left text-zinc-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.slice(0, 5).map((booking) => (
                      <tr key={booking.id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                        <td className="px-6 py-3 text-zinc-300">#{booking.id}</td>
                        <td className="px-6 py-3 text-zinc-300">
                          {new Date(booking.sessionDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              booking.status === "scheduled"
                                ? "bg-cyan-500/20 text-cyan-300"
                                : booking.status === "completed"
                                  ? "bg-green-500/20 text-green-300"
                                  : "bg-red-500/20 text-red-300"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Payments Table */}
          <div className="border border-zinc-700 bg-zinc-900 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-zinc-700">
              <h2 className="text-xl font-display text-zinc-50" style={{ fontFamily: "'Barlow', sans-serif" }}>
                Recent Payments
              </h2>
            </div>
            <div className="overflow-x-auto">
              {paymentsLoading ? (
                <div className="flex items-center justify-center p-12">
                  <Loader2 size={24} className="animate-spin text-cyan-400" />
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-700 bg-zinc-800">
                      <th className="px-6 py-3 text-left text-zinc-400">ID</th>
                      <th className="px-6 py-3 text-left text-zinc-400">Amount</th>
                      <th className="px-6 py-3 text-left text-zinc-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.slice(0, 5).map((payment) => (
                      <tr key={payment.id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                        <td className="px-6 py-3 text-zinc-300">#{payment.id}</td>
                        <td className="px-6 py-3 text-amber-400 font-bold">R{parseFloat(payment.amount || "0").toLocaleString()}</td>
                        <td className="px-6 py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              payment.status === "completed"
                                ? "bg-green-500/20 text-green-300"
                                : payment.status === "pending"
                                  ? "bg-yellow-500/20 text-yellow-300"
                                  : "bg-red-500/20 text-red-300"
                            }`}
                          >
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Subscriptions Table */}
        <div className="border border-zinc-700 bg-zinc-900 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-zinc-700">
            <h2 className="text-xl font-display text-zinc-50" style={{ fontFamily: "'Barlow', sans-serif" }}>
              Active Subscriptions
            </h2>
          </div>
          <div className="overflow-x-auto">
            {subscriptionsLoading ? (
              <div className="flex items-center justify-center p-12">
                <Loader2 size={24} className="animate-spin text-cyan-400" />
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-700 bg-zinc-800">
                    <th className="px-6 py-3 text-left text-zinc-400">ID</th>
                    <th className="px-6 py-3 text-left text-zinc-400">Billing Cycle</th>
                    <th className="px-6 py-3 text-left text-zinc-400">Status</th>
                    <th className="px-6 py-3 text-left text-zinc-400">Next Billing</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.slice(0, 10).map((sub) => (
                    <tr key={sub.id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                      <td className="px-6 py-3 text-zinc-300">#{sub.id}</td>
                      <td className="px-6 py-3 text-zinc-300 capitalize">{sub.billingCycle}</td>
                      <td className="px-6 py-3">
                        <span className="px-2 py-1 rounded text-xs font-bold bg-cyan-500/20 text-cyan-300">
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-zinc-300">
                        {sub.nextBillingDate ? new Date(sub.nextBillingDate).toLocaleDateString() : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function KPICard({ icon, label, value, trend }: { icon: React.ReactNode; label: string; value: string | number; trend: string }) {
  return (
    <div className="border border-zinc-700 bg-zinc-900 rounded-lg p-6 hover:border-cyan-400/50 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">{icon}</div>
      </div>
      <p className="text-zinc-400 text-sm mb-2">{label}</p>
      <p className="text-3xl font-bold text-zinc-50 mb-2">{value}</p>
      <p className="text-xs text-green-400">{trend}</p>
    </div>
  );
}
