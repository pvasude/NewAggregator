"use client";

import { useState, useMemo } from "react";
import { Newspaper } from "lucide-react";
import { Navbar } from "@/components/feed/navbar";
import { CategoryFilter } from "@/components/feed/category-filter";
import { FeaturedArticle } from "@/components/feed/featured-article";
import { ArticleCard } from "@/components/feed/article-card";
import { TrendingSidebar } from "@/components/feed/trending-sidebar";
import { FEATURED_ARTICLE, ARTICLES } from "@/lib/data";

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredArticles = useMemo(() => {
    if (selectedCategory === "All") return ARTICLES;
    return ARTICLES.filter((a) => a.category === selectedCategory);
  }, [selectedCategory]);

  const showFeatured =
    selectedCategory === "All" ||
    FEATURED_ARTICLE.category === selectedCategory;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <CategoryFilter
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />

      <main className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content */}
          <div className="flex-1 min-w-0 flex flex-col gap-6">
            {/* Featured Article */}
            {showFeatured && <FeaturedArticle article={FEATURED_ARTICLE} />}

            {/* Section header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-primary" />
                {selectedCategory === "All"
                  ? "Latest Stories"
                  : `${selectedCategory} News`}
              </h2>
              <span className="text-sm text-muted-foreground">
                {filteredArticles.length} articles
              </span>
            </div>

            {/* Article grid */}
            {filteredArticles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Newspaper className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground font-medium">
                  No articles in this category yet
                </p>
                <p className="text-sm text-muted-foreground/70 mt-1">
                  Check back later or explore another category
                </p>
              </div>
            )}
          </div>

          {/* Sidebar — desktop only */}
          <div className="hidden lg:block w-80 xl:w-96 shrink-0">
            <div className="sticky top-[8.5rem]">
              <TrendingSidebar />
            </div>
          </div>
        </div>

        {/* Sidebar — mobile (below feed) */}
        <div className="lg:hidden mt-8">
          <TrendingSidebar />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Newspaper className="h-4 w-4" />
            <span className="font-medium">The Feed</span>
          </div>
          <p>© 2026 The Feed. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Terms
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              About
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
