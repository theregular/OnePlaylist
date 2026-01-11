"use client";

import { api } from "~/trpc/react";
import { PlaylistCard } from "./PlaylistCard";

export function CommunityFeed() {
  const { data: playlists, isLoading } =
    api.playlists.getPublicPlaylists.useQuery({
      limit: 8,
      offset: 0,
    });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="border-foreground bg-muted h-64 animate-pulse border-2"
          />
        ))}
      </div>
    );
  }

  if (!playlists || playlists.length === 0) {
    return (
      <div className="border-foreground bg-muted/30 flex min-h-[300px] items-center justify-center border-2 border-dashed p-8">
        <div className="space-y-2 text-center">
          <p className="text-muted-foreground text-sm font-black tracking-[0.3em] uppercase">
            No public playlists yet
          </p>
          <p className="text-muted-foreground/70 text-xs tracking-[0.25em] uppercase">
            Be the first to create and share a playlist
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
      {playlists.map((playlist) => (
        <PlaylistCard
          key={playlist.id}
          id={playlist.id}
          name={playlist.name}
          description={playlist.description}
          trackCount={playlist.trackCount}
          platforms={playlist.platforms}
          creator={playlist.creator}
          createdAt={playlist.createdAt}
        />
      ))}
    </div>
  );
}
