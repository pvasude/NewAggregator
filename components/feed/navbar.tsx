"use client";

import { useState } from "react";
import { Newspaper, Search, Bell, Bookmark, X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center gap-4 px-4">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 shrink-0">
          <Newspaper className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold tracking-tight hidden sm:block">
            The Feed
          </span>
        </a>

        {/* Search bar - desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-auto">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search articles, topics, sources…"
              className="pl-9 bg-muted/50 border-transparent focus-visible:border-input focus-visible:bg-background"
            />
          </div>
        </div>

        {/* Mobile search overlay */}
        {searchOpen && (
          <div className="absolute inset-x-0 top-0 h-16 flex items-center gap-2 px-4 bg-background border-b md:hidden z-50">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search articles, topics, sources…"
                className="pl-9"
                autoFocus
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1 md:hidden" />

        {/* Nav icons */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Bookmark className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <Button variant="default" size="sm" className="hidden md:flex">
            Sign in
          </Button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div
          className={cn(
            "md:hidden border-t bg-background px-4 py-3 flex flex-col gap-1"
          )}
        >
          <Button variant="ghost" className="justify-start gap-2">
            <Bell className="h-4 w-4" />
            Notifications
          </Button>
          <Button variant="ghost" className="justify-start gap-2">
            <Bookmark className="h-4 w-4" />
            Saved Articles
          </Button>
          <div className="pt-2 border-t mt-1">
            <Button className="w-full">Sign in</Button>
          </div>
        </div>
      )}
    </header>
  );
}
