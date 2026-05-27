/* ============================================================
   SPRINT — Enhanced Booking Modal
   Design: Glassmorphism with multi-step flow
   Features: Per-dog package selection, Buddy System discount, yearly billing
   ============================================================ */

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { X, Plus, Loader2, Check, AlertCircle, MapPin, CalendarDays, Clock } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  /** When set (e.g. from pricing card), skip package picker and use this package. */
  initialPackageId?: number;
}

interface DogPackageSelection {
  dogId: number;
  packageId: number;
}

type BookingStep = "dogs" | "packages" | "billing" | "schedule" | "location" | "confirmation";

type DraftDog = {
  id: number; // local id
  name: string;
  breed: string;
  size: "small" | "medium" | "large" | "xlarge";
  energyLevel: "low" | "medium" | "high" | "very_high";
};

const PACKAGE_DETAILS: Record<string, { name: string; price: number; sessions: string; description: string }> = {
  "1": { name: "Single Session", price: 550, sessions: "1", description: "Perfect for trying SPRINT" },
  "2": { name: "5-Session Bundle", price: 2500, sessions: "5", description: "Weekly sessions for a month" },
  "3": { name: "10-Session Bundle", price: 4800, sessions: "10", description: "Bi-weekly sessions for 5 months" },
  "4": { name: "Monthly Unlimited", price: 1950, sessions: "Unlimited", description: "All sessions for one month" },
};

export default function BookingModalEnhanced({
  isOpen,
  onClose,
  onSuccess,
  initialPackageId,
}: BookingModalProps) {
  const [step, setStep] = useState<BookingStep>("dogs");
  const [selectedDogs, setSelectedDogs] = useState<number[]>([]);
  const [dogPackages, setDogPackages] = useState<DogPackageSelection[]>([]);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [subscriptionStartDate, setSubscriptionStartDate] = useState<string>(() =>
    formatDateInput(getDefaultSubscriptionStart())
  );
  const [subscriptionRenewalDate, setSubscriptionRenewalDate] = useState<string>(() =>
    formatDateInput(addYears(getDefaultSubscriptionStart(), 1))
  );
  const [isLoading, setIsLoading] = useState(false);
  const [draftDogs, setDraftDogs] = useState<DraftDog[]>([]);
  const [addingDog, setAddingDog] = useState(false);
  const [dogForm, setDogForm] = useState<Omit<DraftDog, "id">>({
    name: "",
    breed: "",
    size: "medium",
    energyLevel: "high",
  });
  const [sessionDay, setSessionDay] = useState<Date | undefined>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [timeSlot, setTimeSlot] = useState<string>(() => getRecommendedTimeSlot(new Date()));
  const [locationAddress, setLocationAddress] = useState<string>("");
  const [locationNotes, setLocationNotes] = useState<string>("");
  const [saveAsDefaultAddress, setSaveAsDefaultAddress] = useState<boolean>(true);
  const availableDays = useMemo(() => buildAvailableDays(10), []);
  const inputBase =
    "bg-white border-zinc-200 text-zinc-900 placeholder:text-zinc-400 rounded-xl shadow-sm focus-visible:ring-2 focus-visible:ring-orange-500/30 focus-visible:border-orange-400";
  const surface =
    "rounded-2xl border border-zinc-200 bg-white/80 backdrop-blur";

  const createDog = trpc.bookings.createDog.useMutation();
  const dogsQuery = trpc.bookings.getDogs.useQuery(undefined, { retry: false });
  const dogsLoading = dogsQuery.isLoading;
  const serverDogs = dogsQuery.data ?? [];
  const dogs = serverDogs.length > 0 ? serverDogs : draftDogs;
  const createCheckout = trpc.payments.createCheckoutSession.useMutation();

  const hasSubscriptionPackage = useMemo(
    () => dogPackages.some((dp) => dp.packageId === 4) || initialPackageId === 4,
    [dogPackages, initialPackageId]
  );

  const sessionsInPackage = useMemo(() => {
    const pkgId = initialPackageId ?? dogPackages[0]?.packageId;
    if (!pkgId) return 1;
    if (pkgId === 2) return 5;
    if (pkgId === 3) return 10;
    return 1;
  }, [initialPackageId, dogPackages]);

  const isMultiSessionPack = sessionsInPackage > 1 && !hasSubscriptionPackage;

  const [scheduledSessionIsos, setScheduledSessionIsos] = useState<string[]>([]);
  const [scheduleMode, setScheduleMode] = useState<"single" | "pick" | "recurring">("single");
  const [recurringDays, setRecurringDays] = useState<{ tue: boolean; wed: boolean }>({ tue: true, wed: true });

  const flowSteps = useMemo(() => {
    const steps: BookingStep[] = ["dogs"];
    if (!initialPackageId) steps.push("packages");
    steps.push("schedule", "location");
    if (hasSubscriptionPackage) steps.push("billing");
    steps.push("confirmation");
    return steps;
  }, [initialPackageId, hasSubscriptionPackage]);

  const uiStepIndex = Math.max(0, flowSteps.indexOf(step)) + 1;
  const uiStepTotal = flowSteps.length;

  useEffect(() => {
    if (!isOpen) return;
    setStep("dogs");
    setSelectedDogs([]);
    setDogPackages([]);
    setBillingCycle("yearly");
    const start = getDefaultSubscriptionStart();
    setSubscriptionStartDate(formatDateInput(start));
    setSubscriptionRenewalDate(formatDateInput(addYears(start, 1)));
    setAddingDog(false);
    setScheduledSessionIsos([]);
    setScheduleMode("single");
    setRecurringDays({ tue: true, wed: true });
    const saved = readSavedAddress();
    if (saved) {
      setLocationAddress(saved);
      setSaveAsDefaultAddress(true);
    } else {
      setLocationAddress("");
      setSaveAsDefaultAddress(true);
    }
  }, [isOpen, initialPackageId]);

  useEffect(() => {
    if (billingCycle === "yearly") {
      const start = parseDateInput(subscriptionStartDate) ?? getDefaultSubscriptionStart();
      setSubscriptionRenewalDate(formatDateInput(addYears(start, 1)));
    } else {
      const start = parseDateInput(subscriptionStartDate) ?? getDefaultSubscriptionStart();
      setSubscriptionRenewalDate(formatDateInput(addMonths(start, 1)));
    }
  }, [billingCycle, subscriptionStartDate]);

  const goNext = () => {
    const idx = flowSteps.indexOf(step);
    if (idx >= 0 && idx < flowSteps.length - 1) setStep(flowSteps[idx + 1]);
  };

  const goBack = () => {
    const idx = flowSteps.indexOf(step);
    if (idx > 0) setStep(flowSteps[idx - 1]);
  };

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

  const handleProceedFromDogs = () => {
    if (selectedDogs.length === 0) {
      toast.error("Please select at least one dog");
      return;
    }
    const packageId = initialPackageId ?? 1;
    setDogPackages(selectedDogs.map((dogId) => ({ dogId, packageId })));
    goNext();
  };

  const canPersistDogToServer = serverDogs.length > 0 || !dogsQuery.error; // in dev, auth will no longer 401

  const handleAddDog = async () => {
    const name = dogForm.name.trim();
    const breed = dogForm.breed.trim();
    if (!name || !breed) {
      toast.error("Please enter your dog's name and breed");
      return;
    }

    // Try to persist to DB when available; fall back to local draft.
    try {
      if (canPersistDogToServer) {
        const created = await createDog.mutateAsync({
          name,
          breed,
          size: dogForm.size,
          energyLevel: dogForm.energyLevel,
        });
        setSelectedDogs((prev) => (prev.includes(created.id) ? prev : [...prev, created.id]));
        setAddingDog(false);
        setDogForm({ name: "", breed: "", size: "medium", energyLevel: "high" });
        await dogsQuery.refetch();
        return;
      }
    } catch {
      // fall through to draft
    }

    const id = -(Date.now());
    const newDog: DraftDog = { id, name, breed, size: dogForm.size, energyLevel: dogForm.energyLevel };
    setDraftDogs((prev) => [newDog, ...prev]);
    setSelectedDogs((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setAddingDog(false);
    setDogForm({ name: "", breed: "", size: "medium", energyLevel: "high" });
  };

  const handlePackageChange = (dogId: number, packageId: number) => {
    setDogPackages((prev) =>
      prev.map((dp) => (dp.dogId === dogId ? { ...dp, packageId } : dp))
    );
  };

  const handleProceedFromPackages = () => {
    if (dogPackages.length === 0 || dogPackages.some((dp) => !dp.packageId)) {
      toast.error("Please select a package for each dog");
      return;
    }
    goNext();
  };

  const handleProceedFromSchedule = () => {
    const hasAny =
      scheduledSessionIsos.length > 0 || (!!sessionDay && !!timeSlot);
    if (!hasAny) {
      toast.error("Please choose at least one session date and time");
      return;
    }
    goNext();
  };

  const handleProceedFromLocation = () => {
    if (!locationAddress.trim()) {
      toast.error("Please enter a pickup/location address");
      return;
    }
    if (saveAsDefaultAddress) {
      saveAddress(locationAddress.trim());
    }
    goNext();
  };

  const handleProceedFromBilling = () => {
    goNext();
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

      const sessionDateTimeIso = buildSessionDateTimeIso(sessionDay, timeSlot);
      if (!sessionDateTimeIso) {
        toast.error("Please select a valid date and time");
        return;
      }

      const sessionDateTimeIsos = (() => {
        const out = new Set<string>(scheduledSessionIsos);
        if (scheduleMode === "single") out.add(sessionDateTimeIso);
        return Array.from(out);
      })();

      const result = await createCheckout.mutateAsync({
        packageId: firstSelection.packageId,
        packageName: pkg.name,
        amount,
        dogId: firstSelection.dogId > 0 ? firstSelection.dogId : 0,
        billingCycle: firstSelection.packageId === 4 ? billingCycle : "single",
        sessionDateTimeIso,
        sessionDateTimeIsosJson: sessionDateTimeIsos.length > 1 ? JSON.stringify(sessionDateTimeIsos) : undefined,
        locationAddress: locationAddress.trim(),
        locationNotes: locationNotes.trim() || undefined,
        subscriptionStartIso:
          firstSelection.packageId === 4
            ? parseDateInput(subscriptionStartDate)?.toISOString()
            : undefined,
        subscriptionRenewalIso:
          firstSelection.packageId === 4
            ? parseDateInput(subscriptionRenewalDate)?.toISOString()
            : undefined,
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
            <div className="bg-white border border-zinc-200 rounded-3xl overflow-hidden shadow-2xl">
              {/* subtle grid */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.18]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(24,24,27,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(24,24,27,0.06) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />
              <div className="relative">
              {/* Header */}
              <div className="flex items-start justify-between px-8 pt-8 pb-5 border-b border-zinc-200 sticky top-0 bg-white/90 backdrop-blur">
                <div>
                  <h2 className="text-2xl font-semibold text-zinc-900 tracking-tight">
                    {step === "schedule" && "Pick Your Time"}
                    {step === "dogs" && "About Your Pup"}
                    {step === "confirmation" && "Confirm & Pay"}
                    {step === "location" && "Location"}
                    {step === "packages" && "Choose Package"}
                    {step === "billing" && "Billing"}
                  </h2>
                  <p className="text-sm text-zinc-500 mt-1">
                    Step {uiStepIndex} of {uiStepTotal}
                  </p>
                  {initialPackageId && step === "dogs" && (
                    <p className="text-xs text-orange-600 mt-1">
                      Package: {PACKAGE_DETAILS[initialPackageId.toString()]?.name}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                >
                  <X size={18} className="text-zinc-500" />
                </button>
              </div>

              {/* Content */}
              <div className="px-8 py-7 min-h-[440px]">
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
                    ) : dogs.length === 0 && !addingDog ? (
                      <div className="text-center py-10">
                        <AlertCircle size={32} className="text-amber-500 mx-auto mb-3" />
                        <p className="text-zinc-300 font-display text-xl" style={{ fontFamily: "'Barlow', sans-serif" }}>
                          About your pup
                        </p>
                        <p className="text-zinc-400 mb-6 mt-1">
                          Add at least one dog to continue.
                        </p>
                        <button
                          onClick={() => setAddingDog(true)}
                          className="px-4 py-2 bg-cyan-400 text-zinc-950 rounded hover:bg-cyan-300 transition-colors flex items-center gap-2 mx-auto"
                        >
                          <Plus size={16} />
                          Add Dog
                        </button>
                        {dogsQuery.error?.data?.code === "UNAUTHORIZED" && (
                          <p className="text-xs text-zinc-500 mt-4">
                            You’re not logged in. In dev we’ll still let you book; in production you’ll need login.
                          </p>
                        )}
                      </div>
                    ) : addingDog ? (
                      <div className="space-y-5">
                        <p className="text-zinc-900 font-semibold text-lg">
                          About your pup
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <label className="text-xs font-semibold tracking-widest uppercase text-zinc-500">Name</label>
                            <Input
                              value={dogForm.name}
                              onChange={(e) => setDogForm((p) => ({ ...p, name: e.target.value }))}
                              placeholder="e.g. Luna"
                              className={inputBase}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-xs font-semibold tracking-widest uppercase text-zinc-500">Breed</label>
                            <Input
                              value={dogForm.breed}
                              onChange={(e) => setDogForm((p) => ({ ...p, breed: e.target.value }))}
                              placeholder="e.g. Belgian Malinois"
                              className={inputBase}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold tracking-widest uppercase text-zinc-500">Size</label>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {(["small", "medium", "large", "xlarge"] as const).map((s) => (
                              <button
                                key={s}
                                type="button"
                                onClick={() => setDogForm((p) => ({ ...p, size: s }))}
                                className={`px-3 py-2 rounded-xl border text-xs uppercase tracking-widest transition-colors ${
                                  dogForm.size === s
                                    ? "border-orange-500 bg-orange-500/10 text-orange-700"
                                    : "border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50"
                                }`}
                                style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                              >
                                {s === "xlarge" ? "Extra-Large" : s}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-3 pt-1">
                          <button
                            type="button"
                            onClick={() => setAddingDog(false)}
                            className="px-4 py-2 border border-zinc-200 text-zinc-700 rounded-xl hover:bg-zinc-50 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={handleAddDog}
                            disabled={createDog.isPending}
                            className="ml-auto px-5 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-400 disabled:opacity-50 transition-colors font-semibold"
                          >
                            {createDog.isPending ? "Saving…" : "Save Dog"}
                          </button>
                        </div>
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
                              className={`p-4 border rounded-2xl transition-all text-left ${
                                selectedDogs.includes(dog.id)
                                  ? "border-orange-500 bg-orange-500/10"
                                  : "border-zinc-200 bg-white hover:bg-zinc-50"
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div>
                                  <p className="text-zinc-900 font-semibold text-lg">
                                    {dog.name}
                                  </p>
                                  <p className="text-zinc-600 text-sm">{dog.breed}</p>
                                </div>
                                {selectedDogs.includes(dog.id) && (
                                  <Check size={20} className="text-orange-600" />
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

                        <button
                          type="button"
                          onClick={() => setAddingDog(true)}
                          className="w-full mt-2 px-4 py-3 border border-zinc-200 text-zinc-700 rounded-2xl hover:bg-zinc-50 transition-colors flex items-center justify-center gap-2"
                        >
                          <Plus size={16} />
                          Add Another Dog
                        </button>
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

                {/* Subscription billing (Monthly plan only) */}
                {step === "billing" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-5"
                  >
                    <p className="text-zinc-900 font-semibold text-lg">Choose your plan</p>
                    <p className="text-sm text-zinc-500 -mt-2">
                      Annual is recommended — fewer renewals, better value. You can adjust dates anytime.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setBillingCycle("yearly")}
                        className={`relative p-4 rounded-2xl border text-left transition-all ${
                          billingCycle === "yearly"
                            ? "border-orange-500 bg-orange-500 text-white shadow-md"
                            : "border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900"
                        }`}
                      >
                        <span className="absolute -top-2 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-600 text-white">
                          Recommended
                        </span>
                        <p className="font-semibold text-lg">Annual</p>
                        <p className={`text-2xl font-bold mt-1 ${billingCycle === "yearly" ? "text-white" : "text-zinc-900"}`}>
                          R23,400/yr
                        </p>
                        <p className={`text-xs mt-1 ${billingCycle === "yearly" ? "text-white/90" : "text-green-700"}`}>
                          Save vs paying monthly
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBillingCycle("monthly")}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          billingCycle === "monthly"
                            ? "border-orange-500 bg-orange-500/10 text-orange-900"
                            : "border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900"
                        }`}
                      >
                        <p className="font-semibold text-lg">Monthly</p>
                        <p className="text-2xl font-bold mt-1">R1,950/mo</p>
                        <p className="text-xs text-zinc-500 mt-1">Flexible, cancel anytime</p>
                      </button>
                    </div>

                    <div className={`p-4 ${surface} space-y-3`}>
                      <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500">
                        Billing dates (editable)
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="text-xs text-zinc-500">Start date</label>
                          <Input
                            type="date"
                            value={subscriptionStartDate}
                            onChange={(e) => setSubscriptionStartDate(e.target.value)}
                            className={inputBase}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs text-zinc-500">
                            {billingCycle === "yearly" ? "Renews annually" : "Renews monthly"}
                          </label>
                          <Input
                            type="date"
                            value={subscriptionRenewalDate}
                            onChange={(e) => setSubscriptionRenewalDate(e.target.value)}
                            className={inputBase}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-zinc-500">
                        We’ll confirm these dates after payment. You can change them later with our team.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Schedule */}
                {step === "schedule" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    {isMultiSessionPack && (
                      <div className={`p-4 ${surface} space-y-3`}>
                        <p className="text-xs font-semibold tracking-widest uppercase text-zinc-500">
                          Scheduling
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { id: "pick", label: "Pick dates now" },
                            { id: "recurring", label: "Every Tue/Wed" },
                          ].map((opt) => {
                            const active = scheduleMode === opt.id;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => setScheduleMode(opt.id as any)}
                                className={`px-3 py-2 rounded-xl border text-sm transition-colors ${
                                  active
                                    ? "border-orange-500 bg-orange-500/10 text-orange-900"
                                    : "border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700"
                                }`}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>

                        {scheduleMode === "recurring" && (
                          <div className="flex items-center gap-2 flex-wrap">
                            <label className="text-sm text-zinc-700 flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={recurringDays.tue}
                                onChange={(e) => setRecurringDays((p) => ({ ...p, tue: e.target.checked }))}
                              />
                              Tue
                            </label>
                            <label className="text-sm text-zinc-700 flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={recurringDays.wed}
                                onChange={(e) => setRecurringDays((p) => ({ ...p, wed: e.target.checked }))}
                              />
                              Wed
                            </label>
                            <button
                              type="button"
                              onClick={() => {
                                const base = sessionDay ?? startOfToday();
                                const isos = buildRecurringIsos(base, timeSlot, sessionsInPackage, recurringDays);
                                setScheduledSessionIsos(isos);
                                toast.success(`Generated ${isos.length} session dates`);
                              }}
                              className="ml-auto px-3 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-400 transition-colors text-sm"
                            >
                              Generate
                            </button>
                          </div>
                        )}

                        {scheduledSessionIsos.length > 0 && (
                          <div className="text-sm text-zinc-700">
                            Scheduled: <span className="font-semibold">{scheduledSessionIsos.length}</span> / {sessionsInPackage}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-zinc-900">
                        <CalendarDays size={16} className="text-orange-500" />
                        <p className="text-xs font-semibold tracking-widest text-zinc-700 uppercase">
                          Available Dates
                        </p>
                      </div>

                      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
                        {availableDays.map((d) => {
                          const selected = !!sessionDay && isSameDay(sessionDay, d);
                          return (
                            <button
                              key={d.toISOString()}
                              type="button"
                              onClick={() => {
                                const normalized = new Date(d);
                                normalized.setHours(0, 0, 0, 0);
                                setSessionDay(normalized);
                              }}
                              className={`min-w-[92px] rounded-2xl border px-4 py-3 text-left transition-colors ${
                                selected
                                  ? "border-orange-500 bg-orange-500 text-white"
                                  : "border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900"
                              }`}
                            >
                              <div className={`text-xs font-semibold ${selected ? "text-white/90" : "text-zinc-500"}`}>
                                {d.toLocaleDateString(undefined, { weekday: "short" }).toUpperCase()}
                              </div>
                              <div className="text-2xl font-semibold leading-none mt-1">
                                {d.getDate()}
                              </div>
                              <div className={`text-xs mt-1 ${selected ? "text-white/90" : "text-zinc-500"}`}>
                                {d.toLocaleDateString(undefined, { month: "short" })}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-3 pt-1">
                      <div className="flex items-center gap-2 text-zinc-900">
                        <Clock size={16} className="text-orange-500" />
                        <p className="text-xs font-semibold tracking-widest text-zinc-700 uppercase">
                          Available Times
                        </p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {TIME_SLOTS.map((slot) => {
                          const selected = timeSlot === slot;
                          return (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setTimeSlot(slot)}
                              className={`rounded-2xl border px-4 py-3 text-sm font-medium transition-colors ${
                                selected
                                  ? "border-orange-500 bg-orange-500 text-white"
                                  : "border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-900"
                              }`}
                            >
                              {formatTimeSlot(slot)}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {isMultiSessionPack && scheduleMode === "pick" && (
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            const iso = buildSessionDateTimeIso(sessionDay, timeSlot);
                            if (!iso) return;
                            setScheduledSessionIsos((prev) => {
                              const set = new Set(prev);
                              set.add(iso);
                              const arr = Array.from(set).slice(0, sessionsInPackage);
                              return arr;
                            });
                          }}
                          className="px-4 py-2 rounded-xl bg-orange-500 text-white hover:bg-orange-400 transition-colors text-sm"
                        >
                          Add this session
                        </button>
                        <div className="text-sm text-zinc-600">
                          {scheduledSessionIsos.length} / {sessionsInPackage} added
                        </div>
                        {scheduledSessionIsos.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setScheduledSessionIsos([])}
                            className="ml-auto px-3 py-2 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-sm"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 5: Location */}
                {step === "location" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 text-zinc-200">
                      <MapPin size={18} className="text-orange-500" />
                      <p className="text-zinc-900 font-semibold">
                        Where should we come to?
                      </p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold tracking-widest uppercase text-zinc-500">Address / Location</label>
                      <Input
                        value={locationAddress}
                        onChange={(e) => setLocationAddress(e.target.value)}
                        placeholder="e.g. 12 Main Rd, Rondebosch, Cape Town"
                        className={inputBase}
                      />
                    </div>

                    <label className="flex items-center gap-2 text-sm text-zinc-700">
                      <input
                        type="checkbox"
                        checked={saveAsDefaultAddress}
                        onChange={(e) => setSaveAsDefaultAddress(e.target.checked)}
                      />
                      Save this as my default gym address
                    </label>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold tracking-widest uppercase text-zinc-500">Notes (gate code, parking, temperament)</label>
                      <Textarea
                        value={locationNotes}
                        onChange={(e) => setLocationNotes(e.target.value)}
                        placeholder="Anything we should know to make arrival smooth?"
                        className={`${inputBase} min-h-[110px]`}
                      />
                    </div>

                    <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-2xl text-orange-800 text-sm">
                      ✓ We’ll confirm the slot by SMS/WhatsApp if traffic or logistics require a small adjustment.
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
                    <div className={`p-5 ${surface} space-y-3`}>
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
                              <p key={dp.dogId} className="text-zinc-900 text-sm">
                                {dog?.name} — {pkg?.name} (R{price.toLocaleString()})
                              </p>
                            );
                          })}
                        </div>
                      </div>
                      <div className="border-t border-zinc-200 pt-3">
                        <p className="text-zinc-500 text-sm">Total Amount</p>
                        <p className="text-zinc-900 font-semibold text-3xl">R{totalPrice.toLocaleString()}</p>
                      </div>
                      <div className="border-t border-zinc-200 pt-3">
                        <p className="text-zinc-500 text-sm">Session</p>
                        <p className="text-zinc-900 text-sm">
                          {formatSessionSummary(sessionDay, timeSlot)}
                        </p>
                      </div>
                      <div className="border-t border-zinc-200 pt-3">
                        <p className="text-zinc-500 text-sm">Location</p>
                        <p className="text-zinc-900 text-sm">{locationAddress || "—"}</p>
                        {locationNotes?.trim() && (
                          <p className="text-zinc-400 text-xs mt-1 whitespace-pre-wrap">{locationNotes}</p>
                        )}
                      </div>
                      {hasSubscriptionPackage && (
                        <div className="border-t border-zinc-200 pt-3">
                          <p className="text-zinc-500 text-sm">Subscription</p>
                          <p className="text-zinc-900 text-sm capitalize">{billingCycle} billing</p>
                          <p className="text-zinc-600 text-xs mt-1">
                            Starts {formatDisplayDate(subscriptionStartDate)} · Renews{" "}
                            {formatDisplayDate(subscriptionRenewalDate)}
                          </p>
                        </div>
                      )}
                    </div>

                    {dogPackages.length > 1 && (
                      <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-800 text-sm">
                        ✓ Buddy System discount applied: 15% off 2nd dog
                      </div>
                    )}

                    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-800 text-sm">
                      ✓ You'll be redirected to checkout. Payment is secure and encrypted.
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Footer */}
              <div className="flex gap-3 px-8 py-6 border-t border-zinc-200 bg-white sticky bottom-0">
                {uiStepIndex > 1 && (
                  <button
                    onClick={goBack}
                    className="px-4 py-2 border border-zinc-200 text-zinc-700 rounded-xl hover:bg-zinc-50 transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-zinc-200 text-zinc-700 rounded-xl hover:bg-zinc-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (step === "dogs") handleProceedFromDogs();
                    else if (step === "packages") handleProceedFromPackages();
                    else if (step === "schedule") handleProceedFromSchedule();
                    else if (step === "location") handleProceedFromLocation();
                    else if (step === "billing") handleProceedFromBilling();
                    else if (step === "confirmation") handleConfirmBooking();
                  }}
                  disabled={
                    isLoading ||
                    (step === "dogs" && selectedDogs.length === 0) ||
                    (step === "packages" && dogPackages.some((dp) => !dp.packageId)) ||
                    (step === "schedule" && (!sessionDay || !timeSlot)) ||
                    (step === "location" && !locationAddress.trim())
                  }
                  className="ml-auto px-7 py-3 bg-orange-500 text-white rounded-2xl hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-semibold flex items-center gap-2"
                >
                  {isLoading && <Loader2 size={16} className="animate-spin" />}
                  {step === "confirmation" ? "Pay & Confirm" : "Continue"}
                </button>
              </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

const TIME_SLOTS = ["06:00", "07:00", "08:00", "09:00", "15:00", "16:00", "17:00", "18:00"] as const;

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function buildAvailableDays(count: number) {
  const out: Date[] = [];
  const d = startOfToday();
  // include today if still bookable, then roll forward
  while (out.length < count) {
    const day = new Date(d);
    out.push(day);
    d.setDate(d.getDate() + 1);
  }
  return out;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatTimeSlot(slot: string) {
  const m = /^(\d{2}):(\d{2})$/.exec(slot);
  if (!m) return slot;
  const h = Number(m[1]);
  const min = m[2];
  const hour12 = ((h + 11) % 12) + 1;
  const ampm = h >= 12 ? "PM" : "AM";
  return `${hour12}:${min} ${ampm}`;
}

function getDefaultSubscriptionStart() {
  const d = startOfToday();
  d.setDate(d.getDate() + 7);
  return d;
}

function addYears(date: Date, years: number) {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + years);
  return d;
}

function addMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

function formatDateInput(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseDateInput(value: string) {
  if (!value) return undefined;
  const d = new Date(value + "T12:00:00");
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function formatDisplayDate(value: string) {
  const d = parseDateInput(value);
  if (!d) return value;
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
}

function buildSessionDateTimeIso(day: Date | undefined, slot: string) {
  if (!day) return null;
  const m = /^(\d{2}):(\d{2})$/.exec(slot);
  if (!m) return null;
  const [_, hh, mm] = m;
  const d = new Date(day);
  d.setHours(Number(hh), Number(mm), 0, 0);
  return d.toISOString();
}

const SAVED_ADDRESS_KEY = "sprint.gymAddress";

function readSavedAddress() {
  try {
    return localStorage.getItem(SAVED_ADDRESS_KEY) || "";
  } catch {
    return "";
  }
}

function saveAddress(value: string) {
  try {
    localStorage.setItem(SAVED_ADDRESS_KEY, value);
  } catch {
    // ignore
  }
}

function buildRecurringIsos(
  start: Date,
  slot: string,
  count: number,
  days: { tue: boolean; wed: boolean }
) {
  const weekdays = new Set<number>();
  if (days.tue) weekdays.add(2);
  if (days.wed) weekdays.add(3);
  if (weekdays.size === 0) weekdays.add(2);

  const out: string[] = [];
  const d = new Date(start);
  d.setHours(0, 0, 0, 0);

  // walk forward until we have enough sessions
  while (out.length < count) {
    if (weekdays.has(d.getDay())) {
      const iso = buildSessionDateTimeIso(d, slot);
      if (iso) out.push(iso);
    }
    d.setDate(d.getDate() + 1);
    if (out.length > 365) break;
  }
  return out;
}

function formatSessionSummary(day: Date | undefined, slot: string) {
  if (!day) return "—";
  try {
    return `${day.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })} at ${slot}`;
  } catch {
    return `${day.toDateString()} at ${slot}`;
  }
}

function getRecommendedTimeSlot(now: Date) {
  // "Intelligent": choose the next closest slot today; otherwise default to 08:00.
  const today = startOfToday();
  const isToday = now.getFullYear() === today.getFullYear() && now.getMonth() === today.getMonth() && now.getDate() === today.getDate();
  const minutesNow = now.getHours() * 60 + now.getMinutes();
  if (isToday) {
    for (const slot of TIME_SLOTS) {
      const [h, m] = slot.split(":").map(Number);
      const minutesSlot = h * 60 + m;
      if (minutesSlot >= minutesNow + 30) return slot;
    }
  }
  return "08:00";
}
