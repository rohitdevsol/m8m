import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import { prisma } from "@repo/database";
export const appRouter = createTRPCRouter({
  findUsers: baseProcedure.query(() => {
    return prisma.user.findMany();
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
