// import { z } from "zod";
import { createTRPCRouter } from "../init";
import { credentialsRouter } from "@/features/credentials/server/routers";
import { executionsRouter } from "@/features/executions/server/routers";
import { workflowsRouter } from "@/features/workflows/server/routers";

export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
  credentials: credentialsRouter,
  executions: executionsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
