import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  self: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findUnique({
      where: {
        id: ctx?.session?.user.id,
      },
      select: {
        yt_expiry_date: true,
      },
    });
  }),
});
