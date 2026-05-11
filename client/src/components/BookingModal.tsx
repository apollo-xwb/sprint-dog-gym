/* ============================================================
   SPRINT — Booking Modal Component
   Design: Glassmorphism with multi-step flow
   Features: Dog selection, package selection, payment
   ============================================================ */

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Plus, Loader2, Check, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

type BookingStep = "dogs" | "package" | "confirmation";

export default function BookingModal({ isOpen, onClose, onSuccess }: BookingModalProps) {
  const [step, setStep] = useState<BookingStep>("dogs");
  const [selectedDogs, setSelectedDogs] = useState<number[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { data: dogs = [], isLoading: dogsLoading } = trpc.bookings.getDogs.useQuery();
  const { data: packages = [], isLoading: packagesLoading } = trpc.bookings.getPackages.useQuery();
  const createCheckout = trpc.payments.createCheckoutSession.useMutation();

  const PACKAGE_DETAILS: Record<string, { name: string; price: number; sessions: string; description: string }> = {
    "1": { name: "Single Session", price: 550, sessions: "1", description: "Perfect for trying SPRINT" },
    "2": { name: "5-Session Bundle", price: 2500, sessions: "5", description: "Weekly sessions for a month" },
    "3": { name: "10-Session Bundle", price: 4800, sessions: "10", description: "Bi-weekly sessions for 5 months" },
    "4": { name: "Monthly Unlimited", price: 1950, sessions: "Unlimited", description: "All sessions for one month" },
  };

  const handleSelectDog = (dogId: number) => {
    setSelectedDogs((prev) =>
      prev.includes(dogId) ? prev.filter((id) => id !== dogId) : [...prev, dogId]
    );
  };

  const handleProceedToPackage = () => {
    if (selectedDogs.length === 0) {
      toast.error("Please select at least one dog");
      return;
    }
    setStep("package");
  };

  const handleSelectPackage = (packageId: number) => {
    setSelectedPackage(packageId);
    setStep("confirmation");
  };

  const handleConfirmBooking = async () => {
    if (!selectedPackage) return;

    setIsLoading(true);
    try {
      const packageInfo = PACKAGE_DETAILS[selectedPackage.toString()];
      
      // Create checkout session for first dog
      const result = await createCheckout.mutateAsync({
        packageId: selectedPackage,
        packageName: packageInfo.name,
        amount: packageInfo.price,
        dogId: selectedDogs[0],
        billingCycle: selectedPackage === 4 ? "monthly" : "single",
      });

      // Open checkout in new tab
      window.open(result.checkoutUrl, "_blank");
      toast.success("Redirecting to checkout...");
      
      // Close modal after a delay
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
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-2xl mx-4"
          >
            <div
              className="bg-zinc-950 border border-cyan-400/30 rounded-lg overflow-hidden"
              style={{
                backdropFilter: "blur(12px)",
                boxShadow: "0 0 40px rgba(34,211,238,0.2)",
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-cyan-400/20">
                <h2
                  className="font-display text-2xl text-cyan-400 tracking-tight"
                  style={{ fontFamily: "'Barlow', sans-serif" }}
                >
                  {step === "dogs" && "Select Your Dogs"}
                  {step === "package" && "Choose Your Package"}
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

                {/* Step 2: Select Package */}
                {step === "package" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {packagesLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 size={24} className="text-cyan-400 animate-spin" />
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries(PACKAGE_DETAILS).map(([id, pkg]) => (
                          <motion.button
                            key={id}
                            onClick={() => handleSelectPackage(parseInt(id))}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="p-4 border-2 border-zinc-700 bg-zinc-800 hover:border-cyan-400/50 rounded-lg transition-all text-left"
                          >
                            <p className="font-display text-lg text-cyan-100 mb-1" style={{ fontFamily: "'Barlow', sans-serif" }}>
                              {pkg.name}
                            </p>
                            <p className="text-amber-500 font-bold text-xl mb-2">R{pkg.price}</p>
                            <p className="text-zinc-400 text-sm mb-2">{pkg.sessions} sessions</p>
                            <p className="text-zinc-500 text-xs">{pkg.description}</p>
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 3: Confirmation */}
                {step === "confirmation" && selectedPackage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="p-4 bg-zinc-800 border border-zinc-700 rounded-lg space-y-3">
                      <div>
                        <p className="text-zinc-500 text-sm">Dogs Selected</p>
                        <p className="text-cyan-100 font-display" style={{ fontFamily: "'Barlow', sans-serif" }}>
                          {selectedDogs.length} dog{selectedDogs.length > 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="border-t border-zinc-700 pt-3">
                        <p className="text-zinc-500 text-sm">Package</p>
                        <p className="text-cyan-100 font-display" style={{ fontFamily: "'Barlow', sans-serif" }}>
                          {PACKAGE_DETAILS[selectedPackage.toString()].name}
                        </p>
                      </div>
                      <div className="border-t border-zinc-700 pt-3">
                        <p className="text-zinc-500 text-sm">Total Amount</p>
                        <p className="text-amber-500 font-bold text-2xl">
                          R{PACKAGE_DETAILS[selectedPackage.toString()].price}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded text-cyan-100 text-sm">
                      ✓ You'll be redirected to checkout. Payment is secure and encrypted.
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="flex gap-3 p-6 border-t border-cyan-400/20 bg-zinc-900/50">
                {step !== "dogs" && (
                  <button
                    onClick={() => {
                      if (step === "package") setStep("dogs");
                      if (step === "confirmation") setStep("package");
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
                    if (step === "dogs") handleProceedToPackage();
                    if (step === "package" && selectedPackage) setStep("confirmation");
                    if (step === "confirmation") handleConfirmBooking();
                  }}
                  disabled={
                    isLoading ||
                    (step === "dogs" && selectedDogs.length === 0) ||
                    (step === "package" && !selectedPackage)
                  }
                  className="ml-auto px-6 py-2 bg-cyan-400 text-zinc-950 rounded hover:bg-cyan-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-bold flex items-center gap-2"
                >
                  {isLoading && <Loader2 size={16} className="animate-spin" />}
                  {step === "dogs" && "Next"}
                  {step === "package" && "Review"}
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
