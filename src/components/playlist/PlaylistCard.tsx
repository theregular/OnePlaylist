import Image from "next/image";
import { ListMusic, User } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

interface PlaylistCardProps {
  id: number;
  name: string;
  description?: string | null;
  trackCount: number;
  platforms: string[];
  creator?: {
    id: string;
    name: string;
    image?: string | null;
  };
  createdAt?: Date;
}

const platformColors: Record<string, string> = {
  spotify: "bg-primary text-primary-foreground",
  soundcloud: "bg-accent text-accent-foreground",
  bandcamp: "bg-secondary text-secondary-foreground",
};

export function PlaylistCard({
  id: _id,
  name,
  description,
  trackCount,
  platforms,
  creator,
  createdAt: _createdAt,
}: PlaylistCardProps) {
  return (
    <Card className="border-foreground bg-card border-2 shadow-[4px_4px_0_var(--foreground)] transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_var(--foreground)]">
      <CardHeader className="border-foreground border-b-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1">
            <CardTitle className="text-base leading-tight font-black tracking-[0.25em] uppercase">
              {name}
            </CardTitle>
            {description && (
              <CardDescription className="line-clamp-2 text-xs tracking-[0.2em] uppercase">
                {description}
              </CardDescription>
            )}
          </div>
          <ListMusic className="text-muted-foreground size-5 shrink-0" />
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-4">
        <div className="flex items-center justify-between text-xs tracking-[0.3em] uppercase">
          <span className="text-muted-foreground font-semibold">
            {trackCount} {trackCount === 1 ? "track" : "tracks"}
          </span>
        </div>

        {platforms.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {platforms.map((platform) => (
              <span
                key={platform}
                className={`border-foreground border px-2 py-1 text-[0.65rem] font-semibold tracking-[0.25em] uppercase ${
                  platformColors[platform.toLowerCase()] ??
                  "bg-muted text-muted-foreground"
                }`}
              >
                {platform}
              </span>
            ))}
          </div>
        )}

        {creator && (
          <div className="border-foreground/30 flex items-center gap-2 border-t-2 border-dashed pt-3">
            <div className="border-foreground bg-muted flex size-6 items-center justify-center border-2">
              {creator.image ? (
                <Image
                  src={creator.image}
                  alt={creator.name}
                  width={24}
                  height={24}
                  className="size-full object-cover"
                />
              ) : (
                <User className="size-3" />
              )}
            </div>
            <span className="text-muted-foreground text-[0.65rem] tracking-[0.3em] uppercase">
              {creator.name}
            </span>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-foreground border-t-2 pt-4">
        <Button
          variant="outline"
          className="w-full text-xs font-black tracking-[0.3em] uppercase"
        >
          View Playlist
        </Button>
      </CardFooter>
    </Card>
  );
}
