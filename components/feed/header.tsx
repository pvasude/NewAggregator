"use client";

import { Rss, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  articleCount: number;
  lastUpdated: string;
  isRefreshing: boolean;
  onRefresh: () => void;
}

export function Header({ articleCount, lastUpdated, isRefreshing, onRefresh }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[oklch(0.985_0.003_75)] border-b border-stone-200">
      <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 bg-stone-900 rounded flex items-center justify-center shrink-0">
            <Rss className="h-4 w-4 text-white" />
          </div>
          <div className="min-w-0">
            <div className="font-serif text-stone-900 text-lg leading-none">The Feed</div>
            <div className="font-mono text-stone-400 text-[10px] uppercase tracking-wide leading-none mt-0.5">
              {articleCount} articles · {lastUpdated}
            </div>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-stone-300 text-stone-600 text-xs font-mono uppercase tracking-wide hover:bg-stone-100 transition-colors disabled:opacity-60 shrink-0"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", isRefreshing && "animate-spin")} />
          Refresh
        </button>
      </div>
    </header>
  );
}
