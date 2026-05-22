"use client";

import { cn } from "@/lib/utils";

interface SourceFilterProps {
  sources: string[];
  selected: string;
  onChange: (source: string) => void;
}

export function SourceFilter({ sources, selected, onChange }: SourceFilterProps) {
  return (
    <div className="sticky top-14 z-40 bg-[oklch(0.985_0.003_75)] border-b border-stone-200 -mx-4 px-4">
      <div className="flex gap-2 overflow-x-auto scrollbar-hide py-3">
        {sources.map((source) => (
          <button
            key={source}
            onClick={() => onChange(source)}
            className={cn(
              "shrink-0 px-3 py-1 rounded-full text-sm border transition-colors",
              selected === source
                ? "bg-stone-900 text-white border-stone-900"
                : "bg-white text-stone-500 border-stone-200 hover:border-stone-300 hover:text-stone-700"
            )}
          >
            {source}
          </button>
        ))}
      </div>
    </div>
  );
}
