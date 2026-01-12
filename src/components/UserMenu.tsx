"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, Settings, Library, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { authClient } from "~/server/better-auth/client";

interface UserMenuProps {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("oneplaylist-theme");
    const prefersDark = window.matchMedia?.(
      "(prefers-color-scheme: dark)",
    ).matches;
    const next = stored ? stored === "dark" : prefersDark;
    setIsDark(next);
  }, []);

  const handleToggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      window.localStorage.setItem("oneplaylist-theme", next ? "dark" : "light");
      return next;
    });
  };

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="border-foreground bg-background text-foreground flex items-center gap-3 border-2 px-5 py-3 shadow-[4px_4px_0_var(--foreground)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_var(--foreground)]">
          <div className="border-foreground bg-muted flex size-8 items-center justify-center border-2">
            {user.image ? (
              <Image
                src={user.image}
                alt={user.name}
                width={32}
                height={32}
                className="size-full object-cover"
              />
            ) : (
              <User className="size-4" />
            )}
          </div>
          <div className="text-left">
            <p className="text-muted-foreground text-[0.65rem] tracking-[0.3em] uppercase">
              Logged in as
            </p>
            <p className="text-xs font-black tracking-[0.25em] uppercase">
              {user.name}
            </p>
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="border-foreground bg-popover text-popover-foreground w-64 border-2 shadow-[4px_4px_0_var(--foreground)]">
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-black tracking-[0.3em] uppercase">
              {user.name}
            </p>
            <p className="text-muted-foreground text-[0.65rem] tracking-[0.25em] uppercase">
              {user.email}
            </p>
          </div>

          <div className="border-foreground space-y-2 border-t-2 border-dashed pt-3">
            <Button
              asChild
              variant="ghost"
              className="hover:bg-foreground hover:text-background w-full justify-start text-xs font-semibold tracking-[0.25em] uppercase"
            >
              <Link href="/library">
                <Library className="mr-2 size-4" />
                My Library
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="hover:bg-foreground hover:text-background w-full justify-start text-xs font-semibold tracking-[0.25em] uppercase"
            >
              <Settings className="mr-2 size-4" />
              Settings
            </Button>
            <Button
              onClick={handleToggleTheme}
              variant="ghost"
              className="hover:bg-foreground hover:text-background w-full justify-start text-xs font-semibold tracking-[0.25em] uppercase"
            >
              {isDark ? (
                <>
                  <Sun className="mr-2 size-4" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="mr-2 size-4" />
                  Dark Mode
                </>
              )}
            </Button>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="text-destructive hover:bg-destructive hover:text-destructive-foreground w-full justify-start text-xs font-semibold tracking-[0.25em] uppercase"
            >
              <LogOut className="mr-2 size-4" />
              Logout
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
