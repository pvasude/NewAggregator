import { Inbox } from "lucide-react";

interface EmptyStateProps {
  onRefresh: () => void;
}

export function EmptyState({ onRefresh }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <Inbox className="h-10 w-10 text-stone-300" />
      <p className="font-mono text-stone-400 text-xs uppercase tracking-widest">
        Your feed is quiet
      </p>
      <button
        onClick={onRefresh}
        className="px-4 py-2 rounded border border-stone-300 text-stone-600 text-xs font-mono uppercase tracking-wide hover:bg-stone-100 transition-colors"
      >
        Refresh
      </button>
    </div>
  );
}
