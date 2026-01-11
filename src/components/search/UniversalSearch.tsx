"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { api } from "~/trpc/react";
import { TrackCard } from "~/components/track/TrackCard";
import { PlaylistCard } from "~/components/playlist/PlaylistCard";

type SearchTab = "tracks" | "playlists" | "my-library";

interface UniversalSearchProps {
  isLoggedIn?: boolean;
}

export function UniversalSearch({ isLoggedIn = false }: UniversalSearchProps) {
  const [activeTab, setActiveTab] = useState<SearchTab>("tracks");
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Track search queries
  const spotifySearch = api.spotify.searchTracks.useQuery(
    { query: searchQuery },
    { enabled: activeTab === "tracks" && searchQuery.length > 0 },
  );

  const soundcloudSearch = api.soundcloud.search.useQuery(
    { query: searchQuery },
    { enabled: activeTab === "tracks" && searchQuery.length > 0 },
  );

  // Playlist search queries
  const publicPlaylistsSearch = api.playlists.searchPublic.useQuery(
    { query: searchQuery, limit: 20 },
    { enabled: activeTab === "playlists" && searchQuery.length > 0 },
  );

  const myPlaylistsSearch = api.playlists.searchMyPlaylists.useQuery(
    { query: searchQuery, limit: 20 },
    {
      enabled:
        activeTab === "my-library" && searchQuery.length > 0 && isLoggedIn,
    },
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(query);
  };

  const tabs: { id: SearchTab; label: string; disabled?: boolean }[] = [
    { id: "tracks", label: "Tracks" },
    { id: "playlists", label: "Playlists" },
    { id: "my-library", label: "My Library", disabled: !isLoggedIn },
  ];

  const isLoading =
    (activeTab === "tracks" &&
      (spotifySearch.isLoading || soundcloudSearch.isLoading)) ||
    (activeTab === "playlists" && publicPlaylistsSearch.isLoading) ||
    (activeTab === "my-library" && myPlaylistsSearch.isLoading);

  const hasSearched = searchQuery.length > 0;

  return (
    <Card className="border-foreground bg-card border-2">
      <CardHeader className="border-foreground border-b-2">
        <CardTitle className="text-lg font-black tracking-[0.25em] uppercase">
          Universal Search
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 pt-6">
        {/* Tab Navigation */}
        <div className="border-foreground bg-muted flex flex-wrap gap-2 border-2 p-2">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              disabled={tab.disabled}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 text-xs font-black tracking-[0.25em] uppercase ${
                activeTab === tab.id
                  ? "shadow-[2px_2px_0_var(--foreground)]"
                  : ""
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              type="text"
              placeholder={
                activeTab === "tracks"
                  ? "Search tracks across platforms..."
                  : activeTab === "playlists"
                    ? "Search public playlists..."
                    : "Search your playlists..."
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="border-foreground border-2 pl-10 font-semibold tracking-[0.2em] uppercase placeholder:text-xs"
            />
          </div>
          <Button
            type="submit"
            className="font-black tracking-[0.3em] uppercase"
            disabled={query.length === 0}
          >
            Search
          </Button>
        </form>

        {/* Results */}
        <div className="min-h-[200px]">
          {!hasSearched && (
            <div className="border-foreground/30 flex h-[200px] items-center justify-center border-2 border-dashed">
              <p className="text-muted-foreground text-xs tracking-[0.3em] uppercase">
                Enter a search query to begin
              </p>
            </div>
          )}

          {hasSearched && isLoading && (
            <div className="grid gap-3 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="border-foreground bg-muted h-32 animate-pulse border-2"
                />
              ))}
            </div>
          )}

          {/* Track Results */}
          {hasSearched && !isLoading && activeTab === "tracks" && (
            <div className="space-y-4">
              {/* Spotify Results */}
              {spotifySearch.data && spotifySearch.data.items.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-muted-foreground text-xs font-black tracking-[0.3em] uppercase">
                    Spotify Results
                  </h3>
                  <div className="grid gap-3 md:grid-cols-2">
                    {spotifySearch.data.items.slice(0, 4).map((track) => (
                      <TrackCard
                        key={`spotify-${track.id}`}
                        platform="spotify"
                        platformTrackId={track.id}
                        title={track.name}
                        artist={track.artists.map((a) => a.name).join(", ")}
                        artworkUrl={track.album.images[0]?.url}
                        duration={track.duration_ms}
                        isLoggedIn={isLoggedIn}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* SoundCloud Results */}
              {soundcloudSearch.data &&
                soundcloudSearch.data.collection.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-muted-foreground text-xs font-black tracking-[0.3em] uppercase">
                      SoundCloud Results
                    </h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      {soundcloudSearch.data.collection
                        .slice(0, 4)
                        .map((track) => (
                          <TrackCard
                            key={`soundcloud-${track.id}`}
                            platform="soundcloud"
                            platformTrackId={track.id.toString()}
                            title={track.title}
                            artist={track.user.username}
                            artworkUrl={
                              track.artwork_url ?? track.user.avatar_url
                            }
                            duration={track.duration}
                            isLoggedIn={isLoggedIn}
                          />
                        ))}
                    </div>
                  </div>
                )}

              {/* No Results */}
              {spotifySearch.data?.items.length === 0 &&
                soundcloudSearch.data?.collection.length === 0 && (
                  <div className="border-foreground/30 flex h-[200px] items-center justify-center border-2 border-dashed">
                    <p className="text-muted-foreground text-xs tracking-[0.3em] uppercase">
                      No tracks found
                    </p>
                  </div>
                )}
            </div>
          )}

          {/* Playlist Results */}
          {hasSearched && !isLoading && activeTab === "playlists" && (
            <div>
              {publicPlaylistsSearch.data &&
              publicPlaylistsSearch.data.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {publicPlaylistsSearch.data.map((playlist) => (
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
              ) : (
                <div className="border-foreground/30 flex h-[200px] items-center justify-center border-2 border-dashed">
                  <p className="text-muted-foreground text-xs tracking-[0.3em] uppercase">
                    No playlists found
                  </p>
                </div>
              )}
            </div>
          )}

          {/* My Library Results */}
          {hasSearched && !isLoading && activeTab === "my-library" && (
            <div>
              {myPlaylistsSearch.data && myPlaylistsSearch.data.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {myPlaylistsSearch.data.map((playlist) => (
                    <PlaylistCard
                      key={playlist.id}
                      id={playlist.id}
                      name={playlist.name}
                      description={playlist.description}
                      trackCount={playlist.trackCount}
                      platforms={playlist.platforms}
                      createdAt={playlist.createdAt}
                    />
                  ))}
                </div>
              ) : (
                <div className="border-foreground/30 flex h-[200px] items-center justify-center border-2 border-dashed">
                  <p className="text-muted-foreground text-xs tracking-[0.3em] uppercase">
                    No playlists found in your library
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
