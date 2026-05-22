import Image from "next/image";
import { TrendingUp, Zap, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TRENDING_TOPICS, QUICK_READS } from "@/lib/data";

export function TrendingSidebar() {
  return (
    <aside className="flex flex-col gap-6">
      {/* Trending Topics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-4 w-4 text-primary" />
            Trending Now
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <ol className="flex flex-col gap-3">
            {TRENDING_TOPICS.map((topic, index) => (
              <li key={topic.id}>
                <a
                  href="#"
                  className="flex items-start gap-3 group hover:opacity-80 transition-opacity"
                >
                  <span className="text-2xl font-black text-muted-foreground/30 leading-none w-6 shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-1">
                      {topic.name}
                    </p>
                    <span className="text-xs text-muted-foreground">
                      {topic.articleCount}
                    </span>
                  </div>
                </a>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* Quick Reads */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Zap className="h-4 w-4 text-primary" />
            Quick Reads
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4">
          <div className="flex flex-col gap-4">
            {QUICK_READS.map((article) => (
              <a
                key={article.id}
                href={article.url}
                className="flex gap-3 group hover:opacity-80 transition-opacity"
              >
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-muted">
                  {article.imageUrl && (
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </p>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                    <span
                      className="font-medium"
                      style={{ color: article.sourceColor }}
                    >
                      {article.source}
                    </span>
                    <span>·</span>
                    <span>{article.publishedAt}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Newsletter CTA */}
      <Card className="bg-primary text-primary-foreground">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-2">
            <ExternalLink className="h-4 w-4" />
            <span className="text-sm font-semibold uppercase tracking-wider opacity-80">
              Newsletter
            </span>
          </div>
          <p className="text-lg font-bold mb-1">Stay in the loop</p>
          <p className="text-sm opacity-80 mb-4">
            Get the top 5 stories every morning, curated just for you.
          </p>
          <div className="flex flex-col gap-2">
            <Input
              type="email"
              placeholder="your@email.com"
              className="bg-background/95 border-transparent placeholder:text-muted-foreground"
            />
            <Button
              variant="secondary"
              className="w-full bg-background text-foreground hover:bg-background/90"
            >
              Subscribe free
            </Button>
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
