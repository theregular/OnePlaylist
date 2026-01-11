"use client";

import { useMemo, useState } from "react";
import { ListPlus, Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { api } from "~/trpc/react";
import type { Track } from "~/lib/shared/track-types";
import { CreatePlaylistDialog } from "~/components/playlist/CreatePlaylistDialog";

interface AddToPlaylistButtonProps {
  track: Track;
  isLoggedIn?: boolean;
}

export function AddToPlaylistButton({
  track,
  isLoggedIn = false,
}: AddToPlaylistButtonProps) {
  const utils = api.useContext();
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");
  const [createName, setCreateName] = useState("");
  const [createIsPublic, setCreateIsPublic] = useState(false);

  const playlistsQuery = api.playlists.getMyPlaylists.useQuery(undefined, {
    enabled: isLoggedIn && open,
  });

  const createPlaylist = api.playlists.create.useMutation({
    onError: (err: unknown) => {
      const description =
        err instanceof Error ? err.message : "Could not create playlist";
      toast.error("Create playlist failed", {
        description,
      });
    },
  });

  const addTrackMutation = api.playlists.addTrack.useMutation({
    onSuccess: async () => {
      await utils.playlists.getMyPlaylists.invalidate();
      toast.success("Track added", {
        description: `${track.title} added to playlist`,
      });
      setOpen(false);
    },
    onError: (err: unknown) => {
      const description =
        err instanceof Error ? err.message : "Could not add track";
      toast.error("Could not add track", {
        description,
      });
    },
  });

  const filteredPlaylists = useMemo(() => {
    if (!playlistsQuery.data) return [];
    if (!filter) return playlistsQuery.data;
    return playlistsQuery.data.filter((playlist) =>
      playlist.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }, [filter, playlistsQuery.data]);

  const isAdding =
    Boolean(addTrackMutation.isPending) || Boolean(createPlaylist.isPending);

  const handleAdd = async (playlistId: number) => {
    await addTrackMutation.mutateAsync({
      playlistId,
      platform: track.platform,
      platformTrackId: track.platformTrackId,
      title: track.title,
      artist: track.artist,
      artworkUrl: track.artworkUrl,
      duration: track.duration,
    });
  };

  const handleCreateAndAdd = async () => {
    const name = createName.trim();
    if (!name) {
      toast.error("Name is required", {
        description: "Give your playlist a name first",
      });
      return;
    }

    try {
      const newPlaylist = await createPlaylist.mutateAsync({
        name,
        isPublic: createIsPublic,
      });
      
      if (!newPlaylist) {
        throw new Error("Failed to create playlist");
      }
      
      await addTrackMutation.mutateAsync({
        playlistId: newPlaylist.id,
        platform: track.platform,
        platformTrackId: track.platformTrackId,
        title: track.title,
        artist: track.artist,
        artworkUrl: track.artworkUrl,
        duration: track.duration,
      });
      await utils.playlists.getMyPlaylists.invalidate();
      setCreateName("");
      setCreateIsPublic(false);
      setOpen(false);
    } catch (err: unknown) {
      const description =
        err instanceof Error ? err.message : "Could not create playlist";
      toast.error("Create playlist failed", {
        description,
      });
    }
  };

  if (!isLoggedIn) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="border-foreground bg-background border-2 font-black tracking-[0.2em] uppercase"
        disabled
      >
        <LogIn className="mr-2 size-4" />
        Login to save
      </Button>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className="border-foreground bg-muted border-2 font-black tracking-[0.2em] uppercase shadow-[2px_2px_0_var(--foreground)] transition-all hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--foreground)]"
          disabled={isAdding}
        >
          {isAdding ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <ListPlus className="mr-2 size-4" />
          )}
          Add
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="border-foreground bg-background w-80 border-2 p-3 shadow-[4px_4px_0_var(--foreground)]"
        align="start"
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-black tracking-[0.25em] uppercase">
              Add to playlist
            </p>
            {playlistsQuery.isFetching && (
              <Loader2 className="size-4 animate-spin" />
            )}
          </div>
          <Input
            placeholder="Filter playlists"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border-foreground border-2 font-semibold tracking-[0.15em] uppercase"
          />
          <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
            {playlistsQuery.isLoading && (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="border-foreground/40 h-10 animate-pulse border-2 border-dashed"
                  />
                ))}
              </div>
            )}

            {!playlistsQuery.isLoading && filteredPlaylists.length === 0 && (
              <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
                No playlists found
              </p>
            )}

            {filteredPlaylists.map((playlist) => (
              <Button
                key={playlist.id}
                variant="ghost"
                size="sm"
                className="border-foreground bg-card flex w-full items-center justify-between border-2 px-3 font-black tracking-[0.15em] uppercase hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--foreground)]"
                onClick={() => handleAdd(playlist.id)}
                disabled={isAdding}
              >
                <span className="truncate">{playlist.name}</span>
                <span className="text-muted-foreground text-[10px]">
                  {playlist.trackCount ?? 0} tracks
                </span>
              </Button>
            ))}
          </div>

          <div className="border-foreground/40 border-t-2 pt-3">
            <p className="text-xs font-black tracking-[0.25em] uppercase">
              Create playlist
            </p>
            <div className="space-y-2 pt-2">
              <Input
                placeholder="Playlist name"
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                className="border-foreground border-2 font-semibold tracking-[0.15em] uppercase"
                disabled={isAdding}
              />
              <label className="text-muted-foreground flex items-center gap-2 text-[11px] font-semibold tracking-[0.18em] uppercase">
                <input
                  type="checkbox"
                  checked={createIsPublic}
                  onChange={(e) => setCreateIsPublic(e.target.checked)}
                  className="border-foreground bg-background accent-foreground border-2"
                  disabled={isAdding}
                />
                Make public
              </label>
              <Button
                variant="secondary"
                size="sm"
                className="border-foreground bg-muted border-2 font-black tracking-[0.2em] uppercase shadow-[2px_2px_0_var(--foreground)] hover:-translate-y-0.5 hover:shadow-[4px_4px_0_var(--foreground)]"
                onClick={handleCreateAndAdd}
                disabled={isAdding}
              >
                {isAdding ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <ListPlus className="mr-2 size-4" />
                )}
                Create & add
              </Button>
              <CreatePlaylistDialog
                isLoggedIn={isLoggedIn}
                triggerLabel="Open full dialog"
                triggerClassName="border-2 border-foreground bg-background font-black uppercase tracking-[0.2em] w-full"
                onCreated={(playlistId) => void handleAdd(playlistId)}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
