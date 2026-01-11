import { LatestPost } from "~/app/_components/post";
import { TrackCard } from "~/components/track/TrackCard";
import { TrackSearch } from "~/components/track/TrackSearch";

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
      <main className="">
        <div className="flex flex-col items-center justify-center gap-4">
          <p className="text-center text-2x">
            {session && <span>Logged in as {session.user?.name}</span>}
          </p>
        </div>
        <div>{session?.user && <LatestPost />}</div>
        <section>
          <TrackSearch />
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
          <PrettyObject>{soundcloudTrackSearch.collection[0]}</PrettyObject>
        </section>
      </main>
    </HydrateClient>
  );
}
