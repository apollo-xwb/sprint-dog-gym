/* ============================================================
   SPRINT — Enhanced Booking Modal
   Design: Glassmorphism with multi-step flow
   Features: Per-dog package selection, location picker, multi-session scheduling
   ============================================================ */

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { X, Plus, Loader2, Check, AlertCircle, MapPin, Calendar } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface DogPackageSelection {
  dogId: number;
  packageId: number;
}

interface SessionSchedule {
  date: string;
  time: string;
}

type BookingStep = "dogs" | "packages" | "location" | "scheduling" | "billing" | "confirmation";

const PACKAGE_DETAILS: Record<string, { name: string; price: number; sessions: string | number; description: string }> = {
  "1": { name: "Single Session", price: 550, sessions: 1, description: "Perfect for trying SPRINT" },
  "2": { name: "5-Session Bundle", price: 2500, sessions: 5, description: "Weekly sessions for a month" },
  "3": { name: "10-Session Bundle", price: 4800, sessions: 10, description: "Bi-weekly sessions for 5 months" },
  "4": { name: "Monthly Unlimited", price: 1950, sessions: "Unlimited", description: "All sessions for one month" },
};

export default function BookingModalEnhanced({ isOpen, onClose, onSuccess }: BookingModalProps) {
  const [step, setStep] = useState<BookingStep>("dogs");
  const [selectedDogs, setSelectedDogs] = useState<number[]>([]);
  const [dogPackages, setDogPackages] = useState<DogPackageSelection[]>([]);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [location, setLocation] = useState<{ address: string; lat: number; lng: number } | null>(null);
  const [sessionSchedules, setSessionSchedules] = useState<SessionSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { data: dogs = [], isLoading: dogsLoading } = trpc.bookings.getDogs.useQuery();
  const createCheckout = trpc.payments.createCheckoutSession.useMutation();

  // Calculate total sessions for multi-session scheduling (sum of all dogs' sessions)
  const totalSessions = useMemo(() => {
    let total = 0;
    dogPackages.forEach((dp) => {
      const pkg = PACKAGE_DETAILS[dp.packageId.toString()];
      if (pkg && typeof pkg.sessions === "number") {
        total += pkg.sessions;
      }
    });
    return total;
  }, [dogPackages]);

  // Calculate total with Buddy System discount
  const totalPrice = useMemo(() => {
    let total = 0;
    dogPackages.forEach((dp, index) => {
      const pkg = PACKAGE_DETAILS[dp.packageId.toString()];
      if (pkg) {
        let price = pkg.price;
        // Apply 15% discount to 2nd dog onwards
        if (index > 0) {
          price = Math.round(price * 0.85);
        }
        // Apply yearly multiplier for subscription packages
        if (dp.packageId === 4 && billingCycle === "yearly") {
          price = price * 12;
        }
        total += price;
      }
    });
    return total;
  }, [dogPackages, billingCycle]);

  const handleSelectDog = (dogId: number) => {
    setSelectedDogs((prev) =>
      prev.includes(dogId) ? prev.filter((id) => id !== dogId) : [...prev, dogId]
    );
  };

  const handleProceedToPackages = () => {
    if (selectedDogs.length === 0) {
      toast.error("Please select at least one dog");
      return;
    }
    setDogPackages(selectedDogs.map((dogId) => ({ dogId, packageId: 1 })));
    setStep("packages");
  };

  const handlePackageChange = (dogId: number, packageId: number) => {
    setDogPackages((prev) =>
      prev.map((dp) => (dp.dogId === dogId ? { ...dp, packageId } : dp))
    );
  };

  const handleProceedToLocation = () => {
    if (dogPackages.length === 0 || dogPackages.some((dp) => !dp.packageId)) {
      toast.error("Please select a package for each dog");
      return;
    }
    setStep("location");
  };

  const handleLocationSubmit = () => {
    if (!location?.address) {
      toast.error("Please enter a location");
      return;
    }
    // For multi-session packages, go to scheduling
    if (totalSessions > 1) {
      setSessionSchedules(Array(totalSessions).fill(null).map(() => ({ date: "", time: "" })));
      setStep("scheduling");
    } else {
      setStep("billing");
    }
  };

  const handleSessionScheduleChange = (index: number, date: string, time: string) => {
    setSessionSchedules((prev) => {
      const updated = [...prev];
      updated[index] = { date, time };
      return updated;
    });
  };

  const handleProceedToBilling = () => {
    if (totalSessions > 1) {
      const allScheduled = sessionSchedules.every((s) => s.date && s.time);
      if (!allScheduled) {
        toast.error("Please schedule all sessions");
        return;
      }
    }
    setStep("billing");
  };

  const handleConfirmBooking = async () => {
    setIsLoading(true);
    try {
      if (dogPackages.length === 0) {
        toast.error("No dogs selected");
        return;
      }

      // Process all dogs/packages, not just the first
      const packageDetails = dogPackages.map((dp, index) => {
        const pkg = PACKAGE_DETAILS[dp.packageId.toString()];
        let price = pkg?.price || 0;
        if (index > 0) {
          price = Math.round(price * 0.85);
        }
        if (dp.packageId === 4 && billingCycle === "yearly") {
          price = price * 12;
        }
        return {
          dogId: dp.dogId,
          packageId: dp.packageId,
          packageName: pkg?.name || "Unknown",
          price,
        };
      });

      const totalAmount = packageDetails.reduce((sum, p) => sum + p.price, 0);
      const packageNames = packageDetails.map((p) => p.packageName).join(", ");

      const result = await createCheckout.mutateAsync({
        packageId: dogPackages[0].packageId,
        packageName: packageNames,
        amount: totalAmount,
        dogId: dogPackages[0].dogId,
        billingCycle: dogPackages[0].packageId === 4 ? billingCycle : "single",
        location: location?.address,
        sessions: sessionSchedules.length > 0 ? sessionSchedules : undefined,
      });

      window.open(result.checkoutUrl, "_blank");
      toast.success("Redirecting to checkout...");

      setTimeout(() => {
        onClose();
        onSuccess?.();
      }, 1500);
    } catch (error) {
      toast.error("Failed to create checkout session");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div
              className="bg-zinc-950 border border-cyan-400/30 rounded-lg overflow-hidden"
              style={{
                backdropFilter: "blur(12px)",
                boxShadow: "0 0 40px rgba(34,211,238,0.2)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-cyan-400/20 sticky top-0 bg-zinc-950/95">
                <h2
                  className="font-display text-2xl text-cyan-400 tracking-tight"
                  style={{ fontFamily: "'Barlow', sans-serif" }}
                >
                  {step === "dogs" && "Select Your Dogs"}
                  {step === "packages" && "Choose Packages"}
                  {step === "location" && "Session Location"}
                  {step === "scheduling" && "Schedule Sessions"}
                  {step === "billing" && "Billing Cycle"}
                  {step === "confirmation" && "Confirm Booking"}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-zinc-800 rounded transition-colors"
                >
                  <X size={20} className="text-zinc-400" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 min-h-[400px]">
                {/* Step 1: Select Dogs */}
                {step === "dogs" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {dogsLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 size={24} className="text-cyan-400 animate-spin" />
                      </div>
                    ) : dogs.length === 0 ? (
                      <div className="text-center py-12">
                        <AlertCircle size={32} className="text-amber-500 mx-auto mb-3" />
                        <p className="text-zinc-400 mb-4">No dogs found. Add one to get started.</p>
                        <button className="px-4 py-2 bg-cyan-400 text-zinc-950 rounded hover:bg-cyan-300 transition-colors flex items-center gap-2 mx-auto">
                          <Plus size={16} />
                          Add Dog Profile
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {dogs.map((dog) => (
                            <button
                              key={dog.id}
                              onClick={() => handleSelectDog(dog.id)}
                              className={`p-4 rounded-lg border-2 transition-all ${
                                selectedDogs.includes(dog.id)
                                  ? "border-cyan-400 bg-cyan-400/10"
                                  : "border-zinc-700 hover:border-cyan-400/50"
                              }`}
                            >
                              <div className="text-left">
                                <p className="font-semibold text-white">{dog.name}</p>
                                <p className="text-sm text-zinc-400">{dog.breed}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                        <div className="flex gap-3 mt-6">
                          <button
                            onClick={() => setStep("dogs")}
                            className="flex-1 px-4 py-2 border border-zinc-700 rounded hover:bg-zinc-800 transition-colors text-zinc-300"
                          >
                            Back
                          </button>
                          <button
                            onClick={handleProceedToPackages}
                            className="flex-1 px-4 py-2 bg-cyan-400 text-zinc-950 rounded hover:bg-cyan-300 transition-colors font-semibold"
                          >
                            Next
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}

                {/* Step 2: Choose Packages */}
                {step === "packages" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    {dogPackages.map((dp) => {
                      const dog = dogs.find((d) => d.id === dp.dogId);
                      return (
                        <div key={dp.dogId} className="border border-zinc-700 rounded-lg p-4">
                          <p className="font-semibold text-white mb-3">{dog?.name}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {Object.entries(PACKAGE_DETAILS).map(([id, pkg]) => (
                              <button
                                key={id}
                                onClick={() => handlePackageChange(dp.dogId, parseInt(id))}
                                className={`p-3 rounded-lg border-2 transition-all text-left ${
                                  dp.packageId === parseInt(id)
                                    ? "border-cyan-400 bg-cyan-400/10"
                                    : "border-zinc-700 hover:border-cyan-400/50"
                                }`}
                              >
                                <p className="font-semibold text-white text-sm">{pkg.name}</p>
                                <p className="text-xs text-zinc-400">{pkg.sessions} sessions</p>
                                <p className="text-cyan-400 font-bold text-sm mt-1">R{pkg.price}</p>
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => setStep("dogs")}
                        className="flex-1 px-4 py-2 border border-zinc-700 rounded hover:bg-zinc-800 transition-colors text-zinc-300"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleProceedToLocation}
                        className="flex-1 px-4 py-2 bg-cyan-400 text-zinc-950 rounded hover:bg-cyan-300 transition-colors font-semibold"
                      >
                        Next
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Location Picker */}
                {step === "location" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <MapPin size={20} className="text-amber-500" />
                      <p className="text-zinc-300">Where should the mobile unit meet you?</p>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter your address or location"
                      value={location?.address || ""}
                      onChange={(e) => setLocation({ address: e.target.value, lat: 0, lng: 0 })}
                      className="w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-cyan-400 focus:outline-none"
                    />
                    <p className="text-xs text-zinc-400">We'll use this to schedule your session and provide directions.</p>
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => setStep("packages")}
                        className="flex-1 px-4 py-2 border border-zinc-700 rounded hover:bg-zinc-800 transition-colors text-zinc-300"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleLocationSubmit}
                        className="flex-1 px-4 py-2 bg-cyan-400 text-zinc-950 rounded hover:bg-cyan-300 transition-colors font-semibold"
                      >
                        Next
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Schedule Sessions */}
                {step === "scheduling" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <Calendar size={20} className="text-amber-500" />
                      <p className="text-zinc-300">Schedule your {totalSessions} sessions</p>
                    </div>
                    <div className="max-h-[300px] overflow-y-auto space-y-3">
                      {sessionSchedules.map((session, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="date"
                            value={session.date}
                            onChange={(e) => handleSessionScheduleChange(index, e.target.value, session.time)}
                            className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white text-sm focus:border-cyan-400 focus:outline-none"
                          />
                          <input
                            type="time"
                            value={session.time}
                            onChange={(e) => handleSessionScheduleChange(index, session.date, e.target.value)}
                            className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white text-sm focus:border-cyan-400 focus:outline-none"
                          />
                          <span className="text-zinc-400 text-sm py-2">Session {index + 1}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => setStep("location")}
                        className="flex-1 px-4 py-2 border border-zinc-700 rounded hover:bg-zinc-800 transition-colors text-zinc-300"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleProceedToBilling}
                        className="flex-1 px-4 py-2 bg-cyan-400 text-zinc-950 rounded hover:bg-cyan-300 transition-colors font-semibold"
                      >
                        Next
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Billing Cycle */}
                {step === "billing" && dogPackages[0]?.packageId === 4 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <p className="text-zinc-300 mb-4">Choose your billing cycle</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setBillingCycle("monthly")}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          billingCycle === "monthly"
                            ? "border-cyan-400 bg-cyan-400/10"
                            : "border-zinc-700 hover:border-cyan-400/50"
                        }`}
                      >
                        <p className="font-semibold text-white">Monthly</p>
                        <p className="text-cyan-400 font-bold">R1,950/mo</p>
                      </button>
                      <button
                        onClick={() => setBillingCycle("yearly")}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          billingCycle === "yearly"
                            ? "border-cyan-400 bg-cyan-400/10"
                            : "border-zinc-700 hover:border-cyan-400/50"
                        }`}
                      >
                        <p className="font-semibold text-white">Yearly</p>
                        <p className="text-cyan-400 font-bold">R23,400/yr</p>
                        <p className="text-xs text-amber-500">Save 20%</p>
                      </button>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => setStep(totalSessions > 1 ? "scheduling" : "location")}
                        className="flex-1 px-4 py-2 border border-zinc-700 rounded hover:bg-zinc-800 transition-colors text-zinc-300"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setStep("confirmation")}
                        className="flex-1 px-4 py-2 bg-cyan-400 text-zinc-950 rounded hover:bg-cyan-300 transition-colors font-semibold"
                      >
                        Review
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 6: Confirmation */}
                {step === "confirmation" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-zinc-900/50 border border-zinc-700 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Dogs:</span>
                        <span className="text-white font-semibold">{selectedDogs.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-400">Location:</span>
                        <span className="text-white font-semibold">{location?.address}</span>
                      </div>
                      <div className="flex justify-between border-t border-zinc-700 pt-3">
                        <span className="text-white font-semibold">Total:</span>
                        <span className="text-cyan-400 font-bold text-lg">R{totalPrice}</span>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button
                        onClick={() => setStep("billing")}
                        className="flex-1 px-4 py-2 border border-zinc-700 rounded hover:bg-zinc-800 transition-colors text-zinc-300"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleConfirmBooking}
                        disabled={isLoading}
                        className="flex-1 px-4 py-2 bg-cyan-400 text-zinc-950 rounded hover:bg-cyan-300 transition-colors font-semibold disabled:opacity-50"
                      >
                        {isLoading ? <Loader2 size={16} className="animate-spin mx-auto" /> : "Proceed to Payment"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
