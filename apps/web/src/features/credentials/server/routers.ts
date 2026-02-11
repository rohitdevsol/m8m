import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { CredentialType, prisma } from "@repo/database";
import { encrypt } from "@repo/common";
import z from "zod";
import { PAGINATION } from "@/config/constants";

export const credentialsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        type: z.enum(CredentialType),
        value: z.string().min(1, "Value is required"),
      }),
    )
    .mutation(({ ctx, input }) => {
      return prisma.credential.create({
        data: {
          name: input.name,
          value: encrypt(input.value),
          type: input.type,
          userId: ctx.auth.user.id,
        },
      });
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return prisma.credential.delete({
        where: {
          userId: ctx.auth.user.id,
          id: input.id,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, "Name is required"),
        type: z.enum(CredentialType),
        value: z.string().min(1, "Value is required"),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { id, name, type, value } = input;

      //   const credential = await prisma.credential.findUniqueOrThrow({
      //     where: {
      //       id,
      //       userId: ctx.auth.user.id,
      //     },
      //   });

      //update

      return prisma.credential.update({
        where: {
          id: id,
          userId: ctx.auth.user.id,
        },
        data: {
          name,
          value: encrypt(value),
          type,
        },
      });
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return prisma.credential.findUniqueOrThrow({
        where: {
          id: input.id,
          userId: ctx.auth.user.id,
        },
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
        search: z.string().default(""),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;

      const [items, totalCount] = await Promise.all([
        //give counts based on the conditions
        prisma.credential.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            userId: ctx.auth.user.id,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          orderBy: {
            updatedAt: "desc", //latest come on top
          },
          //do not pick the value (for security purpose)
          select: {
            id: true,
            name: true,
            type: true,
            createdAt: true,
            updatedAt: true,
          },
        }),

        //will give totalCount
        prisma.credential.count({
          where: {
            userId: ctx.auth.user.id,
            name: {
              contains: search,
              mode: "insensitive",
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

  getByType: protectedProcedure
    .input(
      z.object({
        type: z.enum(CredentialType),
      }),
    )
    .query(({ ctx, input }) => {
      return prisma.credential.findMany({
        where: {
          type: input.type,
          userId: ctx.auth.user.id,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    }),
});
