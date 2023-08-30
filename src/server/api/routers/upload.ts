import { createTRPCRouter, protectedProcedure } from "../trpc";
import { v4 as uuidv4 } from "uuid";
import { s3Client } from "../utils";

export const uploadRouter = createTRPCRouter({
  createPresignedUrl: protectedProcedure.mutation(({ ctx }) => {
    try {
      const url = s3Client.getSignedUrl("putObject", {
        Bucket: "upload-videos.localhost",
        Key: `kasjdajsdk`,
        Expires: 60 * 60 * 24,
        ContentType: "image/png",
      });
      return { url };
    } catch (err) {
      console.error(err);
    }
  }),
});
