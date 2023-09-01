import { createTRPCRouter, protectedProcedure } from "../trpc";
import { v4 as uuidv4 } from "uuid";
import { s3Client } from "../utils";
import { z } from "zod";

export const uploadRouter = createTRPCRouter({
  createPresignedUrl: protectedProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileType: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      try {
        const extention = input.fileName.split(".")[1];
        const url = s3Client.getSignedUrl("putObject", {
          Bucket: "upload-videos.localhost",
          Key: `${ctx.session.user.id}/${
            input.fileName.split(".")[0]
          }/${uuidv4()}.${extention}}`,
          Expires: 60 * 60 * 24,
          ContentType: `${input.fileType}`,
        });

        return { url };
      } catch (err) {
        console.error(err);
      }
    }),
  getVideoQueue: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.videoQueue.findMany({
      where: {
        ownerId: ctx.session.user.id,
      },
      select: {
        id: true,
        status: true,
        videoUrl: true,
        dueDate: true,
        editorId: true,
        editor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }),
  createVideo: protectedProcedure
    .input(
      z.object({
        editorId: z.string(),
        videoUrl: z.string(),
        dueDate: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.videoQueue.create({
        data: {
          status: "EDITING",
          ownerId: ctx.session.user.id,
          editorId: input.editorId,
          videoUrl: input.videoUrl,
          dueDate: new Date(input.dueDate),
        },
      });
    }),
});
