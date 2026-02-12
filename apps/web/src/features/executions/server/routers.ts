import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { prisma } from "@repo/database";
import z from "zod";
import { PAGINATION } from "@/config/constants";
import { snapshotWorkflow } from "@repo/common";

export const executionsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return prisma.execution.findFirstOrThrow({
        where: {
          id: input.id,
          workflow: { userId: ctx.auth.user.id },
        },
        include: {
          nodeRuns: true,
          workflow: {
            include: {
              nodes: true,
              connections: true,
            },
          },
        },
      });
    }),

  createExecution: protectedProcedure
    .input(z.object({ workflowId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: {
          id: input.workflowId,
          userId: ctx.auth.user.id,
        },
        include: {
          nodes: true,
          connections: true,
        },
      });

      const snapshot = snapshotWorkflow(workflow.nodes, workflow.connections);

      return prisma.$transaction(async (tx) => {
        const execution = await tx.execution.create({
          data: {
            workflowId: workflow.id,
            status: "PENDING",

            workflowSnapshotNodes: snapshot.nodes,
            workflowSnapshotConnections: snapshot.connections,
          },
        });

        await tx.executionQueue.create({
          data: { executionId: execution.id },
        });

        return execution;
      });
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize } = input;

      const [items, totalCount] = await Promise.all([
        //give counts based on the conditions
        prisma.execution.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            workflow: {
              userId: ctx.auth.user.id,
            },
          },
          orderBy: {
            startedAt: "desc",
          },
          include: {
            workflow: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        }),

        //will give totalCount
        prisma.execution.count({
          where: {
            workflow: {
              userId: ctx.auth.user.id,
            },
          },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        items,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),
});
