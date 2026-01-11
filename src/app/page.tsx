import { LatestPost } from "~/app/_components/post";
import { TrackCard } from "~/components/track/TrackCard";
import { TrackSearch } from "~/components/track/TrackSearch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";

import { PrettyObject } from "~/components/util/PrettyObject";
import { getSession } from "~/server/better-auth/server";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const session = await getSession();

  // const search = await api.spotify.search();

  const soundcloudTrackSearch = await api.soundcloud.search({
    query: "no broke boys",
  });

  // const firstSong = soundcloudTrackSearch.collection[0];

  if (session) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <main className="min-h-screen bg-background text-foreground">
        <section className="border-b-4 border-foreground bg-secondary text-secondary-foreground">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.4em]">
                OnePlaylist
              </p>
              <h1 className="text-4xl font-black uppercase tracking-[0.12em]">
                Unify your crates
              </h1>
              <p className="max-w-xl text-sm text-secondary-foreground/80">
                Build playlists that live beyond a single platform. Connect
                services, pull tracks in, and route everything through one
                brutalist dashboard.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button className="font-black uppercase tracking-[0.3em]">
                  Start a crate
                </Button>
                <Button
                  variant="outline"
                  className="bg-background text-foreground font-black uppercase tracking-[0.3em]"
                >
                  See live demo
                </Button>
              </div>
              {session && (
                <p className="text-xs uppercase tracking-[0.3em] text-secondary-foreground/70">
                  Logged in as {session.user?.name}
                </p>
              )}
            </div>

            <Card className="border-foreground bg-background text-foreground">
              <CardHeader className="border-b-2 border-foreground">
                <CardTitle className="text-lg font-black uppercase tracking-[0.2em]">
                  Palette B live
                </CardTitle>
                <CardDescription className="text-sm uppercase tracking-[0.2em]">
                  Acid lime, ink, and noise.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <div className="flex flex-wrap gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em]">
                  <span className="border-2 border-foreground bg-primary px-3 py-2 text-primary-foreground">
                    Primary
                  </span>
                  <span className="border-2 border-foreground bg-accent px-3 py-2 text-accent-foreground">
                    Accent
                  </span>
                  <span className="border-2 border-foreground bg-muted px-3 py-2 text-muted-foreground">
                    Muted
                  </span>
                </div>
                <div className="border-2 border-foreground bg-card px-3 py-2 text-xs uppercase tracking-[0.35em]">
                  Cross-platform routing enabled
                </div>
              </CardContent>
              <CardFooter className="justify-between border-t-2 border-foreground pt-4">
                <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  3 services ready
                </span>
                <Button
                  variant="secondary"
                  className="font-black uppercase tracking-[0.3em]"
                >
                  Open settings
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        <section className="mx-auto max-w-6xl space-y-6 px-4 py-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black uppercase tracking-[0.2em]">
                Track intake
              </h2>
              <p className="text-sm text-muted-foreground">
                Pull tracks from connected services and stack them into crates.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" className="uppercase tracking-[0.3em]">
                Connect service
              </Button>
              <Button variant="default" className="uppercase tracking-[0.3em]">
                New playlist
              </Button>
            </div>
          </div>

          <Card className="border-foreground bg-card">
            <CardHeader className="border-b-2 border-foreground">
              <CardTitle className="text-base font-black uppercase tracking-[0.3em]">
                Search SoundCloud
              </CardTitle>
              <CardDescription className="text-xs uppercase tracking-[0.3em]">
                Drop results into your queue.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <TrackSearch />
              <div className="grid gap-3 md:grid-cols-2">
                {soundcloudTrackSearch.collection.map((track) => (
                  <TrackCard
                    key={track.id}
                    artworkUrl={track.artwork_url}
                    title={track.title}
                    artist={track.user.username}
                    duration={track.duration}
                    id={track.id}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          <div>{session?.user && <LatestPost />}</div>

          <Card className="border-foreground bg-muted">
            <CardHeader className="border-b-2 border-foreground">
              <CardTitle className="text-base font-black uppercase tracking-[0.3em]">
                Debug payload
              </CardTitle>
              <CardDescription className="text-xs uppercase tracking-[0.3em]">
                First search result snapshot.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <PrettyObject>{soundcloudTrackSearch.collection[0]}</PrettyObject>
            </CardContent>
          </Card>
        </section>
      </main>
    </HydrateClient>
  );
}
