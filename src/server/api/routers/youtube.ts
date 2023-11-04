import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { oAuth2Client, youtube } from "../utils";

export const youtubeRouter = createTRPCRouter({
  // Generate a URL for YouTube OAuth2 authorization (Public Mutation)
  genUrl: publicProcedure.mutation(({ ctx }) => {
    return oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: [
        "https://www.googleapis.com/auth/youtube.upload",
        "https://www.googleapis.com/auth/youtube",
      ],
      redirect_uri: "http://localhost:3000/api/google/auth",
      state: `${ctx.session?.user.id}`,
    });
  }),

  // Get channel information for the authenticated user (Protected Query)
  getChannel: protectedProcedure.query(async ({ ctx }) => {
    try {
      // Retrieve user information
      const user = await ctx.prisma.user.findUnique({
        where: {
          id: ctx?.session?.user.id,
        },
      });

      // Set OAuth2 credentials for YouTube API
      oAuth2Client.setCredentials({
        access_token: user?.yt_access_token,
        refresh_token: user?.yt_refresh_token,
        expiry_date: user?.yt_expiry_date,
      });

      // Retrieve channel information
      const channels = await youtube.channels.list({
        part: [
          "snippet",
          "contentDetails",
          "statistics",
          "status",
          "brandingSettings",
          "topicDetails",
          "localizations",
          "contentOwnerDetails",
          "id",
        ],
        mine: true,
      });

      // Retrieve videos for the authenticated user
      const videos = await youtube.search.list({
        part: ["snippet"],
        forMine: true,
        type: ["video"],
        maxResults: 20,
      });
      console.log(videos.data.items);

      return {
        channels: channels.data.items,
        videos: videos.data.items,
      };
    } catch (err) {
      console.error(err);
    }
  }),
});
