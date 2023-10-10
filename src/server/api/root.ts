import { youtubeRouter } from "~/server/api/routers/youtube";
import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { uploadRouter } from "./routers/upload";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  // YouTube router for handling YouTube API-related procedures
  youtube: youtubeRouter,

  // User router for handling user-related procedures
  user: userRouter,

  // Upload router for handling file upload-related procedures
  upload: uploadRouter,
});

// Export type definition of the API
export type AppRouter = typeof appRouter;
