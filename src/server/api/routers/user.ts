import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  self: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx?.session?.user.id,
      },
      select: {
        yt_expiry_date: true,
        yt_access_token: true,
        role: true,
      },
    });
  }),

  getEditors: protectedProcedure.query(async ({ ctx }) => {
    const editorsIDs = await ctx.prisma.user.findUnique({
      where: {
        id: ctx?.session?.user.id,
      },
      select: {
        editorsIDs: true,
      },
    });
    if (!editorsIDs) return null;
    const editors = await ctx.prisma.user.findMany({
      where: {
        id: {
          in: editorsIDs.editorsIDs,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
      },
    });
    return editors;
  }),
  searchEditors: protectedProcedure
    .input(
      z.object({
        q: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      console.log(input);
      const editors = ctx.prisma.user.findMany({
        where: {
          name: {
            contains: input.q,
            mode: "insensitive",
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          image: true,
        },
      });
      return (await editors).filter((editor) => editor.role === "EDITOR");
    }),

  addEditor: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.$transaction([
          ctx.prisma.user.update({
            where: {
              id: input.id,
            },
            data: {
              edittingChannels: {
                set: [ctx?.session?.user.id],
              },
            },
          }),
          ctx.prisma.editors.create({
            data: {
              ownerIds: {
                set: [ctx.session.user.id],
              },
              editorsIDs: {
                set: [input.id],
              },
            },
          }),
          ctx.prisma.user.update({
            where: {
              id: ctx?.session?.user.id,
            },
            data: {
              editorsIDs: {
                set: [input.id],
              },
            },
          }),
        ]);
      } catch (err) {
        console.log(err);
        return null;
      }
    }),
  removeEditor: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        return await ctx.prisma.$transaction([
          ctx.prisma.user.update({
            where: {
              id: input.id,
            },
            data: {
              edittingChannels: {
                set: [],
              },
            },
          }),

          ctx.prisma.user.update({
            where: {
              id: ctx?.session?.user.id,
            },
            data: {
              editorsIDs: {
                set: [],
              },
            },
          }),
        ]);
      } catch (err) {
        console.log(err);
        return null;
      }
    }),
});
