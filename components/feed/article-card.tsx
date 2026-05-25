"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Article } from "@/lib/data";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const [imgError, setImgError] = useState(false);
  const showPlaceholder = !article.imageUrl || imgError;

  return (
    <article className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col sm:flex-row-reverse gap-4">
      {/* Thumbnail */}
      <div className="w-full aspect-video sm:w-[240px] sm:h-[135px] sm:aspect-auto shrink-0 rounded-lg overflow-hidden">
        {showPlaceholder ? (
          <div className="w-full h-full thumbnail-placeholder" />
        ) : (
          <img
            src={article.imageUrl ?? ""}
            alt={article.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-2">
        {/* Source badge */}
        <div>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-stone-200 text-xs text-stone-500">
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: article.sourceColor }}
            />
            {article.source}
          </span>
        </div>

        {/* Headline */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-serif text-stone-900 text-base leading-snug hover:text-terracotta transition-colors line-clamp-2"
        >
          {article.title}
        </a>

        {/* Summary */}
        <p className="text-sm text-stone-600 leading-relaxed line-clamp-2">
          {article.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-1">
          <span className="font-mono text-stone-400 text-[11px] uppercase tracking-wide">
            {article.publishedAt}
          </span>

          <div className="flex items-center gap-0.5">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-0.5 px-2 py-1.5 rounded text-xs text-stone-500 hover:bg-stone-100 hover:text-stone-700 transition-colors"
            >
              Open
              <ArrowUpRight className="h-3 w-3" />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}
