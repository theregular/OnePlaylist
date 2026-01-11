"use client";

import { useState } from "react";
import { PlusCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { api } from "~/trpc/react";

type CreatePlaylistDialogProps = {
  triggerLabel?: string;
  triggerClassName?: string;
  isLoggedIn: boolean;
  onCreated?: (playlistId: number) => void;
  defaultPublic?: boolean;
};

export function CreatePlaylistDialog({
  triggerLabel = "Create Playlist",
  triggerClassName,
  isLoggedIn,
  onCreated,
  defaultPublic = false,
}: CreatePlaylistDialogProps) {
  const utils = api.useContext();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(defaultPublic);

  const createPlaylist = api.playlists.create.useMutation({
    onSuccess: async (playlist) => {
      if (!playlist) {
        toast.error("Create playlist failed", {
          description: "No playlist returned from server",
        });
        return;
      }
      await utils.playlists.getMyPlaylists.invalidate();
      toast.success("Playlist created", {
        description: playlist.name,
      });
      setOpen(false);
      setName("");
      setIsPublic(defaultPublic);
      onCreated?.(playlist.id);
    },
    onError: (err: unknown) => {
      const description =
        err instanceof Error ? err.message : "Could not create playlist";
      toast.error("Create playlist failed", {
        description,
      });
    },
  });

  if (!isLoggedIn) {
    return (
      <Button variant="outline" className={triggerClassName} asChild>
        <a href="/login">Login to create</a>
      </Button>
    );
  }

  const isSubmitting = Boolean(createPlaylist.isPending);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className={triggerClassName}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <PlusCircle className="mr-2 size-4" />
          )}
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="border-foreground bg-background border-2 shadow-[6px_6px_0_var(--foreground)]">
        <DialogHeader>
          <DialogTitle className="text-xl font-black tracking-[0.25em] uppercase">
            New playlist
          </DialogTitle>
          <DialogDescription className="text-xs tracking-[0.2em] uppercase">
            Name your playlist and choose if it should be public.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <Input
            placeholder="Playlist name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-foreground border-2 font-semibold tracking-[0.15em] uppercase"
            disabled={isSubmitting}
          />
          <label className="text-muted-foreground flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="border-foreground bg-background accent-foreground border-2"
              disabled={isSubmitting}
            />
            Make public
          </label>
        </div>
        <DialogFooter className="justify-between gap-2 sm:justify-end">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="border-foreground bg-background border-2 font-black tracking-[0.2em] uppercase"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={() => createPlaylist.mutate({ name, isPublic })}
            disabled={isSubmitting || name.trim().length === 0}
            className="border-foreground bg-primary border-2 font-black tracking-[0.2em] uppercase shadow-[3px_3px_0_var(--foreground)] hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--foreground)]"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <PlusCircle className="mr-2 size-4" />
            )}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
