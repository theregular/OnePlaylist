export type TrackPlatform = "spotify" | "soundcloud";

export type Track = {
  platform: TrackPlatform;
  platformTrackId: string;
  title: string;
  artist: string;
  duration?: number;
  artworkUrl?: string;
};
