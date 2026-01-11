import Link from "next/link";
import { Button } from "~/components/ui/button";
import { UniversalSearch } from "~/components/search/UniversalSearch";
import { CommunityFeed } from "~/components/playlist/CommunityFeed";
import { getSession } from "~/server/better-auth/server";
import { HydrateClient } from "~/trpc/server";
import { Library, Plus } from "lucide-react";

export default async function Home() {
  const session = await getSession();

  return (
    <HydrateClient>
      <main className="bg-background text-foreground min-h-screen">
        {/* Hero Section */}
        <section className="border-foreground bg-secondary text-secondary-foreground border-b-4">
          <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
            <div className="mx-auto max-w-3xl space-y-6 text-center">
              <h1 className="text-5xl font-black tracking-[0.12em] uppercase md:text-6xl">
                OnePlaylist
              </h1>
              <p className="text-secondary-foreground/80 mx-auto max-w-2xl text-base md:text-lg">
                Build playlists that live beyond a single platform.
              </p>
              {session?.user && (
                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                  <Button
                    asChild
                    variant="default"
                    size="lg"
                    className="border-foreground border-2 font-black tracking-[0.3em] uppercase shadow-[4px_4px_0_var(--foreground)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_var(--foreground)]"
                  >
                    <Link href="/library">
                      <Library className="mr-2 size-5" />
                      My Library
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Universal Search Section */}
        <section className="mx-auto max-w-6xl px-4 py-10">
          <UniversalSearch isLoggedIn={!!session} />
        </section>

        {/* Community Feed Section */}
        <section className="mx-auto max-w-6xl space-y-6 px-4 py-10">
          <div className="space-y-2">
            <h2 className="text-2xl font-black tracking-[0.2em] uppercase">
              Community Playlists
            </h2>
            <p className="text-muted-foreground text-sm">
              Discover public playlists created by the community
            </p>
          </div>
          <CommunityFeed />
        </section>
      </main>
    </HydrateClient>
  );
}
