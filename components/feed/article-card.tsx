"use client";

import { useState } from "react";
import Image from "next/image";
import { Bookmark, BookmarkCheck, ExternalLink, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import type { Article } from "@/lib/data";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const [saved, setSaved] = useState(false);

  return (
    <Card className="group flex flex-col overflow-hidden transition-shadow hover:shadow-md h-full">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-muted">
        {article.imageUrl ? (
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Newspaper className="h-12 w-12 text-muted-foreground/30" />
          </div>
        )}
      </div>

      <CardHeader className="px-4 pt-4 pb-2 gap-2">
        {/* Source */}
        <span
          className="text-xs font-semibold uppercase tracking-wide"
          style={{ color: article.sourceColor }}
        >
          {article.source}
        </span>

        {/* Title */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors"
        >
          {article.title}
        </a>
      </CardHeader>

      <CardContent className="px-4 pb-2 flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {article.description}
        </p>
      </CardContent>

      <CardFooter className="px-4 pt-0 pb-4 flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">{article.publishedAt}</span>

        <div className="flex items-center gap-1 shrink-0">
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
