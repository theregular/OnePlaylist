import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { playlists, playlistTracks } from "~/server/db/schema";
import { eq, desc, and, like, or, max } from "drizzle-orm";

export const playlistsRouter = createTRPCRouter({
  // Get public playlists for community feed
  getPublicPlaylists: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(8),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const publicPlaylists = await ctx.db.query.playlists.findMany({
        where: eq(playlists.isPublic, true),
        orderBy: [desc(playlists.createdAt)],
        limit: input.limit,
        offset: input.offset,
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              image: true,
            },
          },
          tracks: {
            columns: {
              id: true,
              platform: true,
            },
          },
        },
      });

      // Transform to include track count and platform badges
      return publicPlaylists.map((playlist) => {
        const platforms = [
          ...new Set(playlist.tracks.map((track) => track.platform)),
        ];
        return {
          id: playlist.id,
          name: playlist.name,
          description: playlist.description,
          createdAt: playlist.createdAt,
          updatedAt: playlist.updatedAt,
          trackCount: playlist.tracks.length,
          platforms,
          creator: {
            id: playlist.user.id,
            name: playlist.user.name,
            image: playlist.user.image,
          },
        };
      });
    }),

  // Search public playlists
  searchPublic: publicProcedure
    .input(
      z.object({
        query: z.string().min(1),
        limit: z.number().min(1).max(50).default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const searchPattern = `%${input.query}%`;

      const results = await ctx.db.query.playlists.findMany({
        where: and(
          eq(playlists.isPublic, true),
          or(
            like(playlists.name, searchPattern),
            like(playlists.description, searchPattern),
          ),
        ),
        limit: input.limit,
        with: {
          user: {
            columns: {
              id: true,
              name: true,
              image: true,
            },
          },
          tracks: {
            columns: {
              id: true,
              platform: true,
            },
          },
        },
      });

      return results.map((playlist) => {
        const platforms = [
          ...new Set(playlist.tracks.map((track) => track.platform)),
        ];
        return {
          id: playlist.id,
          name: playlist.name,
          description: playlist.description,
          createdAt: playlist.createdAt,
          trackCount: playlist.tracks.length,
          platforms,
          creator: {
            id: playlist.user.id,
            name: playlist.user.name,
            image: playlist.user.image,
          },
        };
      });
    }),

  // Search user's own playlists
  searchMyPlaylists: protectedProcedure
    .input(
      z.object({
        query: z.string().min(1),
        limit: z.number().min(1).max(50).default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const searchPattern = `%${input.query}%`;

      const results = await ctx.db.query.playlists.findMany({
        where: and(
          eq(playlists.userId, ctx.session.user.id),
          or(
            like(playlists.name, searchPattern),
            like(playlists.description, searchPattern),
          ),
        ),
        limit: input.limit,
        with: {
          tracks: {
            columns: {
              id: true,
              platform: true,
            },
          },
        },
      });

      return results.map((playlist) => {
        const platforms = [
          ...new Set(playlist.tracks.map((track) => track.platform)),
        ];
        return {
          id: playlist.id,
          name: playlist.name,
          description: playlist.description,
          isPublic: playlist.isPublic,
          createdAt: playlist.createdAt,
          trackCount: playlist.tracks.length,
          platforms,
        };
      });
    }),

  // Get user's playlists
  getMyPlaylists: protectedProcedure.query(async ({ ctx }) => {
    const userPlaylists = await ctx.db.query.playlists.findMany({
      where: eq(playlists.userId, ctx.session.user.id),
      orderBy: [desc(playlists.updatedAt)],
      with: {
        tracks: {
          columns: {
            id: true,
            platform: true,
          },
        },
      },
    });

    return userPlaylists.map((playlist) => {
      const platforms = [
        ...new Set(playlist.tracks.map((track) => track.platform)),
      ];
      return {
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        isPublic: playlist.isPublic,
        createdAt: playlist.createdAt,
        updatedAt: playlist.updatedAt,
        trackCount: playlist.tracks.length,
        platforms,
      };
    });
  }),

  // Get a single playlist by ID with all tracks
  getPlaylistById: protectedProcedure
    .input(z.object({ playlistId: z.number() }))
    .query(async ({ ctx, input }) => {
      const playlist = await ctx.db.query.playlists.findFirst({
        where: and(
          eq(playlists.id, input.playlistId),
          eq(playlists.userId, ctx.session.user.id),
        ),
        with: {
          tracks: {
            orderBy: [playlistTracks.position],
          },
        },
      });

      if (!playlist) {
        throw new Error("Playlist not found or unauthorized");
      }

      return {
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        isPublic: playlist.isPublic,
        createdAt: playlist.createdAt,
        updatedAt: playlist.updatedAt,
        tracks: playlist.tracks,
      };
    }),

  // Create a new playlist
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(256),
        description: z.string().max(1000).optional(),
        isPublic: z.boolean().default(false),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [newPlaylist] = await ctx.db
        .insert(playlists)
        .values({
          userId: ctx.session.user.id,
          name: input.name,
          description: input.description,
          isPublic: input.isPublic,
        })
        .returning();

      return newPlaylist;
    }),

  // Add a track to a playlist
  addTrack: protectedProcedure
    .input(
      z.object({
        playlistId: z.number(),
        platform: z.string(),
        platformTrackId: z.string(),
        title: z.string(),
        artist: z.string(),
        artworkUrl: z.string().optional(),
        duration: z.number().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify the playlist belongs to the user
      const playlist = await ctx.db.query.playlists.findFirst({
        where: and(
          eq(playlists.id, input.playlistId),
          eq(playlists.userId, ctx.session.user.id),
        ),
      });

      if (!playlist) {
        throw new Error("Playlist not found or unauthorized");
      }

      // Get the current max position in the playlist
      const result = await ctx.db
        .select({ maxPosition: max(playlistTracks.position) })
        .from(playlistTracks)
        .where(eq(playlistTracks.playlistId, input.playlistId));

      const nextPosition = (result[0]?.maxPosition ?? -1) + 1;

      // Insert the track
      const [newTrack] = await ctx.db
        .insert(playlistTracks)
        .values({
          playlistId: input.playlistId,
          position: nextPosition,
          platform: input.platform,
          platformTrackId: input.platformTrackId,
          title: input.title,
          artist: input.artist,
          artworkUrl: input.artworkUrl,
          duration: input.duration,
        })
        .returning();

      return newTrack;
    }),

  // Remove a track from a playlist
  removeTrack: protectedProcedure
    .input(
      z.object({
        trackId: z.number(),
        playlistId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // Verify the playlist belongs to the user
      const playlist = await ctx.db.query.playlists.findFirst({
        where: and(
          eq(playlists.id, input.playlistId),
          eq(playlists.userId, ctx.session.user.id),
        ),
      });

      if (!playlist) {
        throw new Error("Playlist not found or unauthorized");
      }

      await ctx.db
        .delete(playlistTracks)
        .where(eq(playlistTracks.id, input.trackId));

      return { success: true };
    }),
});
