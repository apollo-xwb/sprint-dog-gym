import { ArrowLeft, XCircle } from "lucide-react";
import { useLocation } from "wouter";

export default function BookingCancelled() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center px-6">
      <div className="w-full max-w-lg border border-amber-500/20 bg-zinc-900/50 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <XCircle className="text-amber-400" />
          <div>
            <p className="font-display text-xl text-amber-200">Checkout cancelled</p>
            <p className="text-zinc-400 text-sm">
              No worries — you can restart booking anytime.
            </p>
          </div>
        </div>

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

