import Image from "next/image";
import { ExternalLink, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Article } from "@/lib/data";

interface FeaturedArticleProps {
  article: Article;
}

export function FeaturedArticle({ article }: FeaturedArticleProps) {
  return (
    <article className="group relative overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="relative aspect-[16/7] w-full overflow-hidden bg-muted">
        {article.imageUrl ? (
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Newspaper className="h-16 w-16 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Overlay content */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-3">
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
              <span
                className="font-semibold"
                style={{ color: article.sourceColor }}
              >
                {article.source}
              </span>
              <span>·</span>
              <span>{article.publishedAt}</span>
            </div>

            <Button
              size="sm"
              className="bg-white text-foreground hover:bg-white/90 gap-1.5"
              asChild
            >
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                Read now
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
