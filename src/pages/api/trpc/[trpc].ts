import { createNextApiHandler } from "@trpc/server/adapters/next";
import { env } from "~/env.mjs";
import { appRouter } from "~/server/api/root";
import { createTRPCContext } from "~/server/api/trpc";

// Define the onError function conditionally
const onError =
  env.NODE_ENV === "development"
    ? ({ path, error }) => {
        console.error(
          `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
        );
      }
    : undefined;

// Export API handler with the defined onError function
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError,
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "200mb",
    },
  },
};
