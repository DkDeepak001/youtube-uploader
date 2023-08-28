import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { oAuth2Client, youtube } from "../utils";

export const youtubeRouter = createTRPCRouter({
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
  getChannel: protectedProcedure.mutation(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: {
        id: ctx?.session?.user.id,
      },
    });
    oAuth2Client.setCredentials({
      access_token: user?.yt_access_token,
      refresh_token: user?.yt_refresh_token,
      expiry_date: user?.yt_expiry_date,
    });
    const videos = await youtube.videos.list({
      part: ["snippet", "contentDetails", "status", "statistics"],
      myRating: "like",
    });
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
    return {
      videos: videos.data.items,
      channels: channels.data.items,
    };
  }),
});
