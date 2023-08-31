import { createTRPCRouter, protectedProcedure } from "../trpc";
import { v4 as uuidv4 } from "uuid";
import { s3Client } from "../utils";

export const uploadRouter = createTRPCRouter({
  createPresignedUrl: protectedProcedure.mutation(({ ctx }) => {
    try {
      const url = s3Client.getSignedUrl("putObject", {
        Bucket: "upload-videos.localhost",
        Key: `videos2`,
        Expires: 60 * 60 * 24,
        ContentType: "video/mp4",
      });

      return { url };
    } catch (err) {
      console.error(err);
    }
  }),
});
