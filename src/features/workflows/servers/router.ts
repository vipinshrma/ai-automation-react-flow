import { PAGINATION } from "@/config/constants";
import prisma from "@/lib/db";
import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import { generateSlug } from 'random-word-slugs'
import z from "zod";

export const workflowsRouter = createTRPCRouter({
    create: premiumProcedure.input(z.object({name:z.string().default(generateSlug(3))})).mutation(({ ctx,input }) => {
        return prisma.workflow.create({
            data: {
                name: input.name,
                userId: ctx.auth.user.id
            }
        })
    }),
    remove: protectedProcedure.input(z.object({ id: z.string() })).mutation(({ ctx, input }) => {
        return prisma.workflow.delete({
            where: {
                id: input.id,
                userId: ctx.auth.user.id
            }
        })
    }),
    updateName: protectedProcedure.input(z.object({ name: z.string().min(1), id: z.string() })).mutation(({ ctx, input }) => {
        return prisma.workflow.update({
            where: {
                id: input.id,
                userId: ctx.auth.user.id
            },
            data: {
                name: input.name
            }
        })
    }),
    getOne: protectedProcedure.input(z.object({ id: z.string() })).query(({ ctx, input }) => {
        return prisma.workflow.findUnique({
            where: {
                id: input.id,
                userId: ctx.auth.user.id
            }
        })
    }),
    getMany: protectedProcedure.input(z.object({ page: z.number().default(PAGINATION.DEFAULT_PAGE), pageSize: z.number().min(PAGINATION.MIN_PAGE_SIZE).max(PAGINATION.MAX_PAGE_SIZE).default(PAGINATION.DEFAULT_PAGE_SIZE), search: z.string().default('') })).query(async ({ ctx, input }) => {
        const { page, pageSize, search } = input
        const [items, totalCount] = await Promise.all(
            [prisma.workflow.findMany({
                skip: (page - 1) * pageSize, take: pageSize, where: {
                    userId: ctx.auth.user.id,
                    name: {
                        contains: search,
                        mode: 'insensitive'
                    },
                }, orderBy: {
                    updatedAt: 'desc'
                }
            }), prisma.workflow.count({
                where: {
                    userId: ctx.auth.user.id,
                    name: {
                        contains: search,
                        mode: 'insensitive'
                    }
                }
            })]
        )
        const totalPages = Math.ceil(totalCount/pageSize)
        const hasNextPage = page < totalPages;
        const hasPreviousePage = page > 1
        return {
            items,
            page,
            pageSize,
            totalCount,
            totalPages,
            hasNextPage,
            hasPreviousePage
        }
    })
})