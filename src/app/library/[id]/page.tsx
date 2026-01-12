import { redirect, notFound } from "next/navigation";
import { getSession } from "~/server/better-auth/server";
import { api } from "~/trpc/server";
import Link from "next/link";
import {
  ArrowLeft,
  Music2,
  Clock,
  Lock,
  Globe,
  ExternalLink,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import Image from "next/image";

export default async function PlaylistDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const playlistId = parseInt(id);

  if (isNaN(playlistId)) {
    notFound();
  }

  let playlist;
  try {
    playlist = await api.playlists.getPlaylistById({ playlistId });
  } catch (error) {
    notFound();
  }

  const formatDuration = (ms: number | null | undefined) => {
    if (!ms) return "--:--";
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const totalDuration = playlist.tracks.reduce(
    (sum, track) => sum + (track.duration ?? 0),
    0,
  );

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/library">
          <Button
            variant="ghost"
            className="border-foreground bg-background mb-4 -ml-4 border-2 font-black tracking-wider uppercase"
          >
            <ArrowLeft className="mr-2 size-4" />
            Back to Library
          </Button>
        </Link>

        <div className="border-foreground bg-card border-3 p-8 shadow-[6px_6px_0_var(--foreground)]">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              <h1 className="mb-2 text-4xl font-black tracking-widest uppercase">
                {playlist.name}
              </h1>
              {playlist.description && (
                <p className="text-muted-foreground text-sm font-semibold tracking-wide">
                  {playlist.description}
                </p>
              )}
            </div>
            <div className="ml-4 flex items-center gap-2">
              {playlist.isPublic ? (
                <div className="border-foreground flex items-center gap-2 border-2 bg-green-500/20 px-3 py-2">
                  <Globe className="size-5" />
                  <span className="text-xs font-black tracking-wider uppercase">
                    Public
                  </span>
                </div>
              ) : (
                <div className="border-foreground bg-muted flex items-center gap-2 border-2 px-3 py-2">
                  <Lock className="size-5" />
                  <span className="text-xs font-black tracking-wider uppercase">
                    Private
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="border-foreground/20 flex flex-wrap items-center gap-4 border-t-2 pt-4">
            <div className="flex items-center gap-2">
              <Music2 className="text-muted-foreground size-5" />
              <span className="text-sm font-bold tracking-wider uppercase">
                {playlist.tracks.length}{" "}
                {playlist.tracks.length === 1 ? "track" : "tracks"}
              </span>
            </div>
            {totalDuration > 0 && (
              <div className="flex items-center gap-2">
                <Clock className="text-muted-foreground size-5" />
                <span className="text-sm font-bold tracking-wider uppercase">
                  {Math.floor(totalDuration / 60000)} min
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tracks List */}
      {playlist.tracks.length === 0 ? (
        <div className="border-foreground bg-muted/50 flex flex-col items-center justify-center border-3 p-16 text-center">
          <Music2 className="mb-4 size-16 opacity-50" />
          <h2 className="mb-2 text-xl font-black tracking-wider uppercase">
            No tracks yet
          </h2>
          <p className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
            Add tracks to this playlist to see them here
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {playlist.tracks.map((track, index) => (
            <div
              key={track.id}
              className="border-foreground bg-card group flex items-center gap-4 border-2 p-4 transition-all hover:shadow-[4px_4px_0_var(--foreground)]"
            >
              {/* Position */}
              <div className="text-muted-foreground w-8 text-center text-sm font-black uppercase">
                {index + 1}
              </div>

              {/* Artwork */}
              {track.artworkUrl ? (
                <Image
                  src={track.artworkUrl}
                  alt={track.title}
                  width={64}
                  height={64}
                  className="border-foreground size-16 border-2 object-cover"
                />
              ) : (
                <div className="border-foreground bg-muted flex size-16 items-center justify-center border-2">
                  <Music2 className="text-muted-foreground size-8" />
                </div>
              )}

              {/* Track Info */}
              <div className="min-w-0 flex-1">
                <h3 className="mb-1 truncate text-base font-black tracking-wide uppercase">
                  {track.title}
                </h3>
                <p className="text-muted-foreground truncate text-sm font-semibold">
                  {track.artist}
                </p>
              </div>

              {/* Platform Badge */}
              <div className="border-foreground bg-muted border-2 px-3 py-1">
                <span className="text-xs font-black tracking-wider uppercase">
                  {track.platform}
                </span>
              </div>

              {/* Duration */}
              <div className="text-muted-foreground w-16 text-right text-sm font-bold tabular-nums">
                {formatDuration(track.duration)}
              </div>

              {/* External Link (if we can construct platform URLs) */}
              <Button
                variant="ghost"
                size="sm"
                className="border-foreground border-2 opacity-0 transition-opacity group-hover:opacity-100"
                asChild
              >
                <a
                  href={
                    track.platform === "spotify"
                      ? `https://open.spotify.com/track/${track.platformTrackId}`
                      : track.platform === "soundcloud"
                        ? `https://soundcloud.com/${track.platformTrackId}`
                        : "#"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="size-4" />
                </a>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
