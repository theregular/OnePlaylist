import Link from "next/link";
import { Library, Plus } from "lucide-react";
import { Button } from "~/components/ui/button";
import { UserMenu } from "~/components/UserMenu";
import { CreatePlaylistDialog } from "~/components/playlist/CreatePlaylistDialog";

interface NavbarProps {
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  } | null;
}

export function Navbar({ user }: NavbarProps) {
  return (
    <nav className="border-foreground bg-background sticky top-0 z-50 w-full border-b-3 shadow-[0_4px_0_var(--foreground)]">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="border-foreground bg-card flex shrink-0 items-center gap-2 border-2 px-4 py-2 shadow-[3px_3px_0_var(--foreground)] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--foreground)]"
        >
          <span className="text-lg font-black tracking-[0.25em] uppercase">
            OnePlaylist
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex flex-1 items-center justify-end gap-3">
          {user ? (
            <>
              <Button
                asChild
                variant="ghost"
                className="border-foreground hidden border-2 font-black tracking-[0.25em] uppercase sm:flex"
              >
                <Link href="/library">
                  <Library className="mr-2 size-4" />
                  Library
                </Link>
              </Button>

              <CreatePlaylistDialog
                isLoggedIn={true}
                triggerLabel="New"
                triggerClassName="border-foreground bg-primary text-primary-foreground border-2 font-black uppercase tracking-[0.25em] shadow-[3px_3px_0_var(--foreground)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--foreground)] hidden sm:flex"
              />

              <UserMenu user={user} />
            </>
          ) : (
            <>
              <Button
                asChild
                variant="default"
                className="border-foreground border-2 font-black tracking-[0.25em] uppercase shadow-[3px_3px_0_var(--foreground)] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--foreground)]"
              >
                <Link href="/login">Login</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
