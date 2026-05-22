import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  onRetry: () => void;
}

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <AlertCircle className="h-10 w-10 text-stone-300" />
      <p className="font-mono text-stone-400 text-xs uppercase tracking-widest">
        Couldn&apos;t load your feed
      </p>
      <button
        onClick={onRetry}
        className="px-4 py-2 rounded border border-stone-300 text-stone-600 text-xs font-mono uppercase tracking-wide hover:bg-stone-100 transition-colors"
      >
        Retry
      </button>
    </div>
  );
}
