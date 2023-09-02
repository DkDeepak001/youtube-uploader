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
        type: z.enum(["owner", "editor"]),
        oldFilePath: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      try {
        const extention = input.fileName.split(".")[1];
        const key =
          input.type === "owner"
            ? `${ctx.session.user.id}/${uuidv4()}.${extention}`
            : input.oldFilePath;

        const url = s3Client.getSignedUrl("putObject", {
          Bucket: "upload-videos.localhost",
          Key: key,
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
        _count: {
          select: {
            rework: true,
          },
        },
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
  videosToEdit: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.videoQueue.findMany({
      where: {
        editor: {
          id: ctx.session.user.id,
        },
      },
      select: {
        id: true,
        status: true,
        videoUrl: true,
        dueDate: true,
        ownerId: true,
        rework: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          select: {
            videoUrl: true,
          },
        },
      },
    });
  }),
  getQueueStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.videoQueue.findUnique({
        where: {
          id: input.id,
        },
        select: {
          id: true,
          rework: {
            select: {
              id: true,
              videoUrl: true,
              createdAt: true,
            },
          },
          status: true,
          editor: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          dueDate: true,
          createdAt: true,
          videoUrl: true,
        },
      });
    }),

  createVideo: protectedProcedure
    .input(
      z.object({
        editorId: z.string(),
        videoUrl: z.string(),
        dueDate: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.videoQueue.create({
        data: {
          status: "EDITING",
          ownerId: ctx.session.user.id,
          editorId: input.editorId,
          videoUrl: input.videoUrl,
          dueDate: input.dueDate,
          rework: {
            create: {
              videoUrl: input.videoUrl,
            },
          },
        },
      });
    }),
  videoEdited: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        videoUrl: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.videoQueue.update({
        where: {
          id: input.id,
        },
        data: {
          status: "READY",
          rework: {
            create: {
              videoUrl: input.videoUrl,
            },
          },
        },
      });
    }),
  changeStatus: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        status: z.enum(["EDITING", "READY", "REWORK", "APPROVED", "PUBLISHED"]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.videoQueue.update({
        where: {
          id: input.id,
        },
        data: {
          status: input.status,
        },
      });
    }),
});
