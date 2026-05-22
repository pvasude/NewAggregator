"use client";

import { useState, useEffect, useCallback } from "react";
import { ARTICLES } from "@/lib/data";
import { Header } from "./header";
import { SourceFilter } from "./source-filter";
import { ArticleCard } from "./article-card";
import { SkeletonCard } from "./skeleton-card";
import { EmptyState } from "./empty-state";
import { ErrorState } from "./error-state";
import { FeedFooter } from "./feed-footer";

function formatLastUpdated(date: Date): string {
  const diff = Date.now() - date.getTime();
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  return `${Math.floor(diff / 3_600_000)}h ago`;
}

export function FeedClient() {
  const [selectedSource, setSelectedSource] = useState("All");
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(() => new Date());

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const sources = ["All", ...Array.from(new Set(ARTICLES.map((a) => a.source)))];

  const filteredArticles =
    selectedSource === "All"
      ? ARTICLES
      : ARTICLES.filter((a) => a.source === selectedSource);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setIsLoading(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setIsLoading(false);
      setLastUpdated(new Date());
    }, 1200);
  }, []);

  const toggleBookmark = useCallback((id: number) => {
    setBookmarks((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  return (
    <div className="min-h-screen">
      <Header
        articleCount={ARTICLES.length}
        lastUpdated={formatLastUpdated(lastUpdated)}
        isRefreshing={isRefreshing}
        onRefresh={handleRefresh}
      />

      <div className="max-w-3xl mx-auto px-4">
        <SourceFilter
          sources={sources}
          selected={selectedSource}
          onChange={setSelectedSource}
        />

        {isLoading ? (
          <div className="flex flex-col gap-3 py-4">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <EmptyState onRefresh={handleRefresh} />
        ) : (
          <div className="flex flex-col gap-3 py-4">
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                bookmarked={bookmarks.has(article.id)}
                onBookmark={toggleBookmark}
              />
            ))}
          </div>
        )}

        {!isLoading && filteredArticles.length > 0 && <FeedFooter />}
      </div>
    </div>
  );
}
