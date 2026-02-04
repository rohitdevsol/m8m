// import { z } from "zod";
import { createTRPCRouter } from "../init";
import { credentialsRouter } from "@/features/credentials/server/route";
import { workflowsRouter } from "@/features/workflows/server/routers";

export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
  credentials: credentialsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
