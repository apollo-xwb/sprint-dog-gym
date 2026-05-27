import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { Loader2, CheckCircle2, ArrowLeft } from "lucide-react";

function getSessionIdFromUrl() {
  try {
    const url = new URL(window.location.href);
    return url.searchParams.get("session_id");
  } catch {
    return null;
  }
}

export default function BookingSuccess() {
  const [, setLocation] = useLocation();
  const [sessionId] = useState<string | null>(() => getSessionIdFromUrl());

  const confirm = trpc.payments.confirmPayment.useMutation();

  useEffect(() => {
    if (!sessionId) return;
    confirm.mutate({ sessionId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-6">
      <div className="w-full max-w-lg border border-cyan-400/20 bg-zinc-900/50 rounded-lg p-6">
        {!sessionId ? (
          <>
            <p className="text-amber-400 font-display text-xl">Missing session</p>
            <p className="text-zinc-400 mt-2">
              We couldn’t find a checkout session. Please try booking again.
            </p>
          </>
        ) : confirm.isPending ? (
          <div className="flex items-center gap-3">
            <Loader2 className="animate-spin text-cyan-400" />
            <div>
              <p className="font-display text-xl text-cyan-200">Confirming payment…</p>
              <p className="text-zinc-400 text-sm">Creating your booking details.</p>
            </div>
          </div>
        ) : confirm.isError ? (
          <>
            <p className="text-amber-400 font-display text-xl">Confirmation failed</p>
            <p className="text-zinc-400 mt-2">
              Payment confirmation didn’t complete. If you were charged, contact support.
            </p>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-green-400" />
            <div>
              <p className="font-display text-xl text-green-200">Booking confirmed</p>
              <p className="text-zinc-400 text-sm">
                You’re all set. We’ll follow up to confirm timing and logistics.
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setLocation("/")}
            className="px-4 py-2 border border-zinc-700 text-zinc-200 rounded hover:bg-zinc-800 transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

