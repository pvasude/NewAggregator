"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowUpCircle, Bookmark, BookmarkCheck, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Article } from "@/lib/data";

interface ArticleCardProps {
  article: Article;
}

const CATEGORY_COLORS: Record<string, string> = {
  Technology: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
  Business: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Science: "bg-purple-500/15 text-purple-700 dark:text-purple-400",
  Politics: "bg-red-500/15 text-red-700 dark:text-red-400",
  Sports: "bg-green-500/15 text-green-700 dark:text-green-400",
  Health: "bg-teal-500/15 text-teal-700 dark:text-teal-400",
  Entertainment: "bg-pink-500/15 text-pink-700 dark:text-pink-400",
};

export function ArticleCard({ article }: ArticleCardProps) {
  const [saved, setSaved] = useState(false);
  const categoryColor =
    CATEGORY_COLORS[article.category] ??
    "bg-secondary text-secondary-foreground";

  return (
    <Card className="group flex flex-col overflow-hidden transition-shadow hover:shadow-md h-full">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={article.imageUrl}
          alt={article.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <CardHeader className="px-4 pt-4 pb-2 gap-2">
        {/* Category badge */}
        <div>
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
              categoryColor
            )}
          >
            {article.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {article.title}
        </h3>
      </CardHeader>

      <CardContent className="px-4 pb-2 flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {article.description}
        </p>
      </CardContent>

      <CardFooter className="px-4 pt-0 pb-4 flex items-center justify-between gap-2">
        {/* Meta */}
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm font-medium truncate">{article.source}</span>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>{article.publishedAt}</span>
            <span>·</span>
            <Clock className="h-3 w-3" />
            <span>{article.readTime}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          <span className="flex items-center gap-0.5 text-xs text-muted-foreground mr-1">
            <ArrowUpCircle className="h-3.5 w-3.5" />
            {article.upvotes >= 1000
              ? `${(article.upvotes / 1000).toFixed(1)}K`
              : article.upvotes}
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setSaved(!saved)}
          >
            {saved ? (
              <BookmarkCheck className="h-4 w-4 text-primary" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
