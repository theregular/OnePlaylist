import { spotify } from "~/lib/spotify/spotify-server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";

export const spotifyRouter = createTRPCRouter({
    search: protectedProcedure.query(async () => {
        const res = await spotify.search("No Broke Boys",["track"])
        return res
    }),
    searchTracks: publicProcedure
        .input(z.object({ query: z.string() }))
        .query(async ({ input: { query } }) => {
            const res = await spotify.search(query, ["track"]);
            return res.tracks;
        }),
    // track: protectedProcedure.query(async () => {
    //     const res = await spotifyApi.tracks()
    //     return res
    // })
})