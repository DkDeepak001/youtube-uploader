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
        role: true,
      },
    });
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
});
