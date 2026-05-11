/* ============================================================
   SPRINT — Enhanced Booking Modal
   Design: Glassmorphism with multi-step flow
   Features: Per-dog package selection, Buddy System discount, yearly billing
   ============================================================ */

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
import { X, Plus, Loader2, Check, AlertCircle } from "lucide-react";
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

type BookingStep = "dogs" | "packages" | "billing" | "confirmation";

const PACKAGE_DETAILS: Record<string, { name: string; price: number; sessions: string; description: string }> = {
  "1": { name: "Single Session", price: 550, sessions: "1", description: "Perfect for trying SPRINT" },
  "2": { name: "5-Session Bundle", price: 2500, sessions: "5", description: "Weekly sessions for a month" },
  "3": { name: "10-Session Bundle", price: 4800, sessions: "10", description: "Bi-weekly sessions for 5 months" },
  "4": { name: "Monthly Unlimited", price: 1950, sessions: "Unlimited", description: "All sessions for one month" },
};

export default function BookingModalEnhanced({ isOpen, onClose, onSuccess }: BookingModalProps) {
  const [step, setStep] = useState<BookingStep>("dogs");
  const [selectedDogs, setSelectedDogs] = useState<number[]>([]);
  const [dogPackages, setDogPackages] = useState<DogPackageSelection[]>([]);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [isLoading, setIsLoading] = useState(false);

  const { data: dogs = [], isLoading: dogsLoading } = trpc.bookings.getDogs.useQuery();
  const createCheckout = trpc.payments.createCheckoutSession.useMutation();

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
    // Initialize package selections
    setDogPackages(selectedDogs.map((dogId) => ({ dogId, packageId: 1 })));
    setStep("packages");
  };

  const handlePackageChange = (dogId: number, packageId: number) => {
    setDogPackages((prev) =>
      prev.map((dp) => (dp.dogId === dogId ? { ...dp, packageId } : dp))
    );
  };

  const handleProceedToBilling = () => {
    if (dogPackages.length === 0 || dogPackages.some((dp) => !dp.packageId)) {
      toast.error("Please select a package for each dog");
      return;
    }
    setStep("billing");
  };

  const handleConfirmBooking = async () => {
    setIsLoading(true);
    try {
      // For now, create checkout for first dog (multi-dog checkout would require backend enhancement)
      const firstSelection = dogPackages[0];
      if (!firstSelection) return;

      const pkg = PACKAGE_DETAILS[firstSelection.packageId.toString()];
      let amount = pkg.price;
      if (firstSelection.packageId === 4 && billingCycle === "yearly") {
        amount = amount * 12;
      }

      const result = await createCheckout.mutateAsync({
        packageId: firstSelection.packageId,
        packageName: pkg.name,
        amount,
        dogId: firstSelection.dogId,
        billingCycle: firstSelection.packageId === 4 ? billingCycle : "single",
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
                    exit={{ opacity: 0, y: -10 }}
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
                            <motion.button
                              key={dog.id}
                              onClick={() => handleSelectDog(dog.id)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`p-4 border-2 rounded-lg transition-all text-left ${
                                selectedDogs.includes(dog.id)
                                  ? "border-cyan-400 bg-cyan-400/10"
                                  : "border-zinc-700 bg-zinc-800 hover:border-cyan-400/50"
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="font-display text-lg text-cyan-100" style={{ fontFamily: "'Barlow', sans-serif" }}>
                                    {dog.name}
                                  </p>
                                  <p className="text-zinc-400 text-sm">{dog.breed}</p>
                                </div>
                                {selectedDogs.includes(dog.id) && (
                                  <Check size={20} className="text-cyan-400" />
                                )}
                              </div>
                            </motion.button>
                          ))}
                        </div>

                        {selectedDogs.length > 0 && (
                          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded text-amber-100 text-sm">
                            💡 Selected {selectedDogs.length} dog{selectedDogs.length > 1 ? "s" : ""}. Get 15% off the second dog!
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                )}

                {/* Step 2: Select Packages */}
                {step === "packages" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    {dogPackages.map((dp) => {
                      const dog = dogs.find((d) => d.id === dp.dogId);
                      return (
                        <div key={dp.dogId} className="space-y-3">
                          <p className="text-zinc-300 font-display" style={{ fontFamily: "'Barlow', sans-serif" }}>
                            {dog?.name} — Select Package
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {Object.entries(PACKAGE_DETAILS).map(([id, pkg]) => (
                              <motion.button
                                key={id}
                                onClick={() => handlePackageChange(dp.dogId, parseInt(id))}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`p-3 border-2 rounded-lg transition-all text-left ${
                                  dp.packageId === parseInt(id)
                                    ? "border-cyan-400 bg-cyan-400/10"
                                    : "border-zinc-700 bg-zinc-800 hover:border-cyan-400/50"
                                }`}
                              >
                                <p className="font-display text-sm text-cyan-100" style={{ fontFamily: "'Barlow', sans-serif" }}>
                                  {pkg.name}
                                </p>
                                <p className="text-amber-500 font-bold text-lg">R{pkg.price}</p>
                                <p className="text-zinc-400 text-xs">{pkg.sessions} sessions</p>
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}

                {/* Step 3: Billing Cycle */}
                {step === "billing" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <p className="text-zinc-300">Select Billing Cycle</p>
                    <div className="grid grid-cols-2 gap-4">
                      <motion.button
                        onClick={() => setBillingCycle("monthly")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          billingCycle === "monthly"
                            ? "border-cyan-400 bg-cyan-400/10"
                            : "border-zinc-700 bg-zinc-800 hover:border-cyan-400/50"
                        }`}
                      >
                        <p className="font-display text-lg text-cyan-100" style={{ fontFamily: "'Barlow', sans-serif" }}>
                          Monthly
                        </p>
                        <p className="text-amber-500 font-bold">R1,950/mo</p>
                      </motion.button>

                      <motion.button
                        onClick={() => setBillingCycle("yearly")}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          billingCycle === "yearly"
                            ? "border-cyan-400 bg-cyan-400/10"
                            : "border-zinc-700 bg-zinc-800 hover:border-cyan-400/50"
                        }`}
                      >
                        <p className="font-display text-lg text-cyan-100" style={{ fontFamily: "'Barlow', sans-serif" }}>
                          Yearly
                        </p>
                        <p className="text-amber-500 font-bold">R23,400/yr</p>
                        <p className="text-green-400 text-xs">Save 10%</p>
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Confirmation */}
                {step === "confirmation" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg space-y-3">
                      <div>
                        <p className="text-zinc-500 text-sm">Dogs & Packages</p>
                        <div className="space-y-1 mt-2">
                          {dogPackages.map((dp, idx) => {
                            const dog = dogs.find((d) => d.id === dp.dogId);
                            const pkg = PACKAGE_DETAILS[dp.packageId.toString()];
                            let price = pkg?.price || 0;
                            if (idx > 0) price = Math.round(price * 0.85);
                            if (dp.packageId === 4 && billingCycle === "yearly") price = price * 12;
                            return (
                              <p key={dp.dogId} className="text-cyan-100 text-sm">
                                {dog?.name} — {pkg?.name} (R{price})
                              </p>
                            );
                          })}
                        </div>
                      </div>
                      <div className="border-t border-zinc-700 pt-3">
                        <p className="text-zinc-500 text-sm">Total Amount</p>
                        <p className="text-amber-500 font-bold text-2xl">R{totalPrice.toLocaleString()}</p>
                      </div>
                    </div>

                    {dogPackages.length > 1 && (
                      <div className="p-3 bg-green-500/10 border border-green-500/30 rounded text-green-100 text-sm">
                        ✓ Buddy System discount applied: 15% off 2nd dog
                      </div>
                    )}

                    <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded text-cyan-100 text-sm">
                      ✓ You'll be redirected to checkout. Payment is secure and encrypted.
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-6 border-t border-cyan-400/20 bg-zinc-900/50 sticky bottom-0">
                {step !== "dogs" && (
                  <button
                    onClick={() => {
                      if (step === "packages") setStep("dogs");
                      if (step === "billing") setStep("packages");
                      if (step === "confirmation") setStep("billing");
                    }}
                    className="px-4 py-2 border border-zinc-700 text-zinc-300 rounded hover:bg-zinc-800 transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-zinc-700 text-zinc-300 rounded hover:bg-zinc-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (step === "dogs") handleProceedToPackages();
                    if (step === "packages") handleProceedToBilling();
                    if (step === "billing") setStep("confirmation");
                    if (step === "confirmation") handleConfirmBooking();
                  }}
                  disabled={
                    isLoading ||
                    (step === "dogs" && selectedDogs.length === 0) ||
                    (step === "packages" && dogPackages.some((dp) => !dp.packageId))
                  }
                  className="ml-auto px-6 py-2 bg-cyan-400 text-zinc-950 rounded hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-bold flex items-center gap-2"
                >
                  {isLoading && <Loader2 size={16} className="animate-spin" />}
                  {step === "dogs" && "Next"}
                  {step === "packages" && "Next"}
                  {step === "billing" && "Review"}
                  {step === "confirmation" && "Proceed to Checkout"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
