export function SkeletonCard() {
  return (
    <div className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col sm:flex-row-reverse gap-4 animate-pulse">
      {/* Thumbnail skeleton */}
      <div className="w-full aspect-video sm:w-[240px] sm:h-[135px] sm:aspect-auto shrink-0 rounded-lg bg-stone-200" />

      {/* Content skeleton */}
      <div className="flex-1 min-w-0 flex flex-col gap-3">
        {/* Source badge */}
        <div className="h-5 w-24 bg-stone-200 rounded-full" />

        {/* Title lines */}
        <div className="space-y-2">
          <div className="h-4 bg-stone-200 rounded w-full" />
          <div className="h-4 bg-stone-200 rounded w-4/5" />
        </div>

        {/* Summary lines */}
        <div className="space-y-2">
          <div className="h-3 bg-stone-100 rounded w-full" />
          <div className="h-3 bg-stone-100 rounded w-3/4" />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <div className="h-3 w-16 bg-stone-100 rounded" />
          <div className="flex gap-1.5">
            <div className="h-7 w-7 bg-stone-100 rounded" />
            <div className="h-7 w-14 bg-stone-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
