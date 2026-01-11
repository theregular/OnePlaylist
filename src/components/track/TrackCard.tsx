import Image from "next/image";
import { Card, CardContent } from "../ui/card";
import { AddToPlaylistButton } from "./AddToPlaylistButton";
import type { Track } from "~/lib/shared/track-types";

type TrackCardProps = Track & { isLoggedIn?: boolean };

const formatDuration = (ms?: number) => {
  if (!ms) return "—";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export function TrackCard({ isLoggedIn = false, ...track }: TrackCardProps) {
  return (
    <Card className="border-foreground bg-card border-2 shadow-[3px_3px_0_var(--foreground)]">
      <CardContent className="flex gap-4 p-4">
        {track.artworkUrl ? (
          <div className="border-foreground bg-muted relative h-24 w-24 border-2">
            <Image
              src={track.artworkUrl}
              alt="Track Cover Art"
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="border-foreground/40 flex h-24 w-24 items-center justify-center border-2 border-dashed text-xs tracking-[0.2em] uppercase">
            No Art
          </div>
        )}

        <div className="flex flex-1 flex-col gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="text-sm leading-tight font-black tracking-[0.2em] uppercase">
                {track.title}
              </p>
              <p className="text-muted-foreground text-xs tracking-[0.18em] uppercase">
                {track.artist}
              </p>
            </div>
            <span className="border-foreground bg-muted rounded-none border-2 px-2 py-1 text-[10px] font-black tracking-[0.3em] uppercase">
              {track.platform}
            </span>
          </div>

          <div className="text-muted-foreground flex items-center justify-between text-xs tracking-[0.2em] uppercase">
            <span>Duration: {formatDuration(track.duration)}</span>
            <AddToPlaylistButton track={track} isLoggedIn={isLoggedIn} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
