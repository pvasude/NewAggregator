import Image from "next/image";
import { ArrowUpCircle, Clock, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Article } from "@/lib/data";

interface FeaturedArticleProps {
  article: Article;
}

const CATEGORY_COLORS: Record<string, string> = {
  Technology: "bg-blue-500/20 text-blue-700 dark:text-blue-300",
  Business: "bg-amber-500/20 text-amber-700 dark:text-amber-300",
  Science: "bg-purple-500/20 text-purple-700 dark:text-purple-300",
  Politics: "bg-red-500/20 text-red-700 dark:text-red-300",
  Sports: "bg-green-500/20 text-green-700 dark:text-green-300",
  Health: "bg-teal-500/20 text-teal-700 dark:text-teal-300",
  Entertainment: "bg-pink-500/20 text-pink-700 dark:text-pink-300",
};

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  const categoryColor =
    CATEGORY_COLORS[article.category] ??
    "bg-secondary text-secondary-foreground";

  return (
    <article className="group relative overflow-hidden rounded-xl border bg-card shadow-sm">
      {/* Image */}
      <div className="relative aspect-[16/7] w-full overflow-hidden">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Overlay content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-3">
            <span
              className={`inline-flex items-center rounded-full border-transparent px-2.5 py-0.5 text-xs font-semibold ${categoryColor}`}
            >
              {article.category}
            </span>
            <Badge
              variant="outline"
              className="border-white/40 text-white bg-white/10 text-xs"
            >
              Featured
            </Badge>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight mb-3 line-clamp-2">
            {article.title}
          </h2>

          <p className="text-white/80 text-sm sm:text-base line-clamp-2 mb-4 max-w-3xl">
            {article.description}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-white/70 text-sm">
              <span className="font-semibold text-white">
                {article.source}
              </span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline">{article.author}</span>
              <span>·</span>
              <span>{article.publishedAt}</span>
              <span className="hidden sm:flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {article.readTime}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-white/70 text-sm">
                <ArrowUpCircle className="h-4 w-4" />
                {article.upvotes.toLocaleString()}
              </span>
              <Button
                size="sm"
                className="bg-white text-foreground hover:bg-white/90 gap-1.5"
              >
                Read now
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
