import { PAGINATION } from "@/config/constants";
import prisma from "@/lib/db";
import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import { generateSlug } from 'random-word-slugs'
import z from "zod";
import { NodeType } from '@/generated/prisma'
import type { Node, Edge } from '@xyflow/react'
import { inngest } from "@/inngest/client";
export const workflowsRouter = createTRPCRouter({
    execute: protectedProcedure.input(z.object({ id: z.string() })).mutation(async ({ ctx, input }) => {
        const workflow = await prisma.workflow.findUniqueOrThrow({
            where: {
                id: input.id,
                userId: ctx.auth.user.id
            }
        })
        await inngest.send({
            name: 'workflows/execute.workflow',
            data: {
                workflowId: workflow.id
            }
        })
        return workflow;
    }),
    create: premiumProcedure.input(z.object({ name: z.string().default(generateSlug(3)) })).mutation(({ ctx, input }) => {
        return prisma.workflow.create({
            data: {
                name: input?.name || generateSlug(3),
                userId: ctx.auth.user.id,
                nodes: {
                    create: {
                        type: NodeType.INITIAL,
                        position: { x: 0, y: 0 },
                        name: NodeType.INITIAL
                    }
                }
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
    update: protectedProcedure.input(z.object({
        id: z.string(),
        nodes: z.array(z.object({
            id: z.string(),
            type: z.string().nullish(),
            position: z.object({ x: z.number(), y: z.number() }),
            data: z.record(z.string(), z.any()).optional()
        })),
        edges: z.array(z.object({
            id: z.string(),
            source: z.string(),
            target: z.string(),
            sourceHandle: z.string().nullish(),
            targetHandle: z.string().nullish()
        }))
    })).mutation(async ({ ctx, input }) => {
        const { id, nodes, edges, ...rest } = input
        const workflow = prisma.workflow.findUniqueOrThrow({
            where: {
                id: input.id,
                userId: ctx.auth.user.id
            },
            include: { nodes: true, connections: true }
        })
        return await prisma.$transaction(async (tx) => {
            //delete existing nodes and collections

            await tx.node.deleteMany({ where: { workflowId: id } })
            // create nodes 

            await tx.node.createMany({
                data: nodes.map((node => {
                    return {
                        id: node.id,
                        workflowId: id,
                        name: node.type || 'unknown',
                        type: node.type as NodeType,
                        position: node.position,
                        data: node.data || {}
                    }
                }))
            })
            // create connections 

            await tx.connection.createMany({
                data: edges.map((edge => {
                    return {
                        workflowId: id,
                        fromNodeId: edge.source,
                        toNodeId: edge.target,
                        fromOutput: edge.sourceHandle || 'main',
                        toInput: edge.targetHandle || 'main'
                    }
                }))
            })
            // update workflow's updatedAt timestamp
            await tx.workflow.update({
                where: {
                    id: id,
                    userId: ctx.auth.user.id
                },
                data: {
                    updatedAt: new Date()
                }
            })
            return workflow
        },{
            maxWait:10000,
            timeout:10000
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
    getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ ctx, input }) => {
        const workflow = await prisma.workflow.findUnique({
            where: {
                id: input.id,
                userId: ctx.auth.user.id,
            },
            include: { nodes: true, connections: true }
        })
        //Transfer servers node to react-flow compatible node
        const nodes: Node[] = workflow?.nodes.map((node => {
            return {
                id: node.id,
                type: node.type,
                position: node.position as { x: number, y: number },
                data: (node.data as Record<string, unknown>) || {}
            }
        })) || []

        const edges: Edge[] = workflow?.connections.map((connection => {
            return {
                id: connection.id,
                source: connection.fromNodeId,
                target: connection.toNodeId,
                sourceHandle: connection.fromOutput,
                targetHandle: connection.toInput
            }
        })) || []
        return {
            id: workflow?.id,
            name: workflow?.name,
            nodes,
            edges
        }

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
        const totalPages = Math.ceil(totalCount / pageSize)
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