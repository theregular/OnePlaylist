"use client";

import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";

const THEME_KEY = "oneplaylist-theme";

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia?.(
      "(prefers-color-scheme: dark)"
    ).matches;
    const next = stored ? stored === "dark" : prefersDark;

    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
  }, []);

  const handleToggle = () => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      window.localStorage.setItem(THEME_KEY, next ? "dark" : "light");
      return next;
    });
  };

  return (
    <div className="fixed right-4 top-4 z-50">
      <Button
        type="button"
        variant="outline"
        onClick={handleToggle}
        aria-pressed={isDark}
        className="border-foreground bg-background text-foreground font-black uppercase tracking-[0.3em] shadow-[3px_3px_0_var(--foreground)]"
      >
        {isDark ? "Light mode" : "Dark mode"}
      </Button>
    </div>
  );
}
