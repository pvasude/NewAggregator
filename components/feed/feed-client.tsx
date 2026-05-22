"use client";

import { useState, useEffect, useCallback } from "react";
import type { Article } from "@/lib/data";
import { Header } from "./header";
import { SourceFilter } from "./source-filter";
import { ArticleCard } from "./article-card";
import { SkeletonCard } from "./skeleton-card";
import { EmptyState } from "./empty-state";
import { ErrorState } from "./error-state";
import { FeedFooter } from "./feed-footer";

// Shape returned by GET /api/feed
interface FeedArticle {
  id: number;
  title: string;
  description: string | null;
  link: string;
  pubDate: string;
  thumbnailUrl: string | null;
  thumbnailW: number | null;
  thumbnailH: number | null;
  source: { name: string; sourceColor: string };
}

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  if (diff < 60_000) return "just now";
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return `${Math.floor(diff / 86_400_000)}d ago`;
}

function toArticle(a: FeedArticle): Article {
  return {
    id: a.id,
    title: a.title,
    description: a.description ?? "",
    source: a.source.name,
    sourceColor: a.source.sourceColor,
    publishedAt: formatRelativeTime(a.pubDate),
    imageUrl: a.thumbnailUrl ?? undefined,
    url: a.link,
  };
}

export function FeedClient() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedSource, setSelectedSource] = useState("All");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(() => new Date());

  const loadArticles = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setIsLoading(true);
    setHasError(false);
    try {
      const res = await fetch("/api/feed");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: FeedArticle[] = await res.json();
      setArticles(data.map(toArticle));
      setLastUpdated(new Date());
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const sources = ["All", ...Array.from(new Set(articles.map((a) => a.source)))];

  const filteredArticles =
    selectedSource === "All"
      ? articles
      : articles.filter((a) => a.source === selectedSource);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch("/api/feed/refresh", { method: "POST" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch {
      // Refresh failure is non-fatal — reload whatever is already in the DB
    } finally {
      setIsRefreshing(false);
    }
    await loadArticles({ silent: true });
  }, [loadArticles]);

  return (
    <div className="min-h-screen">
      <Header
        articleCount={articles.length}
        lastUpdated={formatRelativeTime(lastUpdated.toISOString())}
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
        ) : hasError ? (
          <ErrorState onRetry={loadArticles} />
        ) : filteredArticles.length === 0 ? (
          <EmptyState onRefresh={handleRefresh} />
        ) : (
          <div className="flex flex-col gap-3 py-4">
            {filteredArticles.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
              />
            ))}
          </div>
        )}

        {!isLoading && !hasError && filteredArticles.length > 0 && <FeedFooter />}
      </div>
    </div>
  );
}
