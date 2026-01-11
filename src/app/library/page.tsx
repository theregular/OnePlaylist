import { redirect } from "next/navigation";
import { getSession } from "~/server/better-auth/server";
import { api } from "~/trpc/server";
import Link from "next/link";
import { Music2, Lock, Globe } from "lucide-react";

export default async function LibraryPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const playlists = await api.playlists.getMyPlaylists();

  return (
    <div className="bg-secondary min-h-screen">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-black tracking-widest uppercase">
            My Library
          </h1>
          <p className="text-secondary-foreground/80 text-sm font-semibold tracking-wider uppercase">
            {playlists.length}{" "}
            {playlists.length === 1 ? "Playlist" : "Playlists"}
          </p>
        </div>

        {playlists.length === 0 ? (
          <div className="border-foreground bg-muted/50 flex flex-col items-center justify-center border-3 p-16 text-center">
            <Music2 className="mb-4 size-16 opacity-50" />
            <h2 className="mb-2 text-xl font-black tracking-wider uppercase">
              No playlists yet
            </h2>
            <p className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
              Start creating playlists to see them here
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {playlists.map((playlist) => (
              <Link
                key={playlist.id}
                href={`/library/${playlist.id}`}
                className="group"
              >
                <div className="border-foreground bg-card border-3 p-6 shadow-[4px_4px_0_var(--foreground)] transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0_var(--foreground)]">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="mb-1 line-clamp-2 text-lg font-black tracking-wider uppercase">
                        {playlist.name}
                      </h3>
                      {playlist.description && (
                        <p className="text-muted-foreground line-clamp-2 text-xs font-medium tracking-wide">
                          {playlist.description}
                        </p>
                      )}
                    </div>
                    <div className="ml-2">
                      {playlist.isPublic ? (
                        <Globe className="text-muted-foreground size-5" />
                      ) : (
                        <Lock className="text-muted-foreground size-5" />
                      )}
                    </div>
                  </div>

                  <div className="border-foreground/20 flex items-center justify-between border-t-2 pt-4">
                    <div className="flex items-center gap-2">
                      <Music2 className="text-muted-foreground size-4" />
                      <span className="text-muted-foreground text-xs font-bold tracking-wider uppercase">
                        {playlist.trackCount}{" "}
                        {playlist.trackCount === 1 ? "track" : "tracks"}
                      </span>
                    </div>
                    {playlist.platforms.length > 0 && (
                      <div className="flex gap-1">
                        {playlist.platforms.map((platform) => (
                          <span
                            key={platform}
                            className="border-foreground bg-muted text-foreground border-2 px-2 py-0.5 text-[10px] font-black tracking-wider uppercase"
                          >
                            {platform}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
