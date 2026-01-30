import { z } from "zod";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";
import { prisma } from "@repo/database";

export const appRouter = createTRPCRouter({
  findAccounts: protectedProcedure.query(({ ctx }) => {
    console.log("user id", { userId: ctx.auth.user.id });

    return prisma.account.findMany({
      where: {
        userId: ctx.auth.user.id,
      },
    });
  }),
});
// export type definition of API
export type AppRouter = typeof appRouter;
