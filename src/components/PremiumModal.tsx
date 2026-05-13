import { Crown, Sparkles, X } from "lucide-react";

type Props = {
  open: boolean;
  templateTitle?: string;
  onClose: () => void;
  onSubscribeDemo: () => void;
};

export default function PremiumModal({
  open,
  templateTitle,
  onClose,
  onSubscribeDemo,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="premium-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative max-w-md rounded-3xl border border-amber-500/30 bg-gradient-to-b from-slate-900 to-slate-950 p-8 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-slate-400 hover:bg-white/10 hover:text-white"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-400">
          <Crown className="h-8 w-8" />
        </div>
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-400/90">
          Subscription
        </p>
        <h2 id="premium-title" className="mt-1 text-2xl font-bold text-white">
          Unlock Premium
        </h2>
        {templateTitle ? (
          <p className="mt-2 text-sm text-slate-400">
            <span className="font-medium text-slate-300">{templateTitle}</span>{" "}
            is a premium template. Subscribe to use it and access the full
            premium library.
          </p>
        ) : (
          <p className="mt-2 text-slate-400">
            This design is part of Premium. Subscribe to unlock all premium
            backgrounds.
          </p>
        )}
        <ul className="mt-4 space-y-2 text-sm text-slate-300">
          <li className="flex gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
            All premium greeting backgrounds
          </li>
          <li className="flex gap-2">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-indigo-400" />
            Share merged images to any app from the system sheet
          </li>
        </ul>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              onSubscribeDemo();
              onClose();
            }}
            className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white shadow-lg shadow-indigo-900/40 transition hover:bg-indigo-500"
          >
            Subscribe (demo)
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-slate-600 px-4 py-3 font-medium text-slate-200 hover:bg-white/5"
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
}
