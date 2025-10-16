import { baseProcedure, createTRPCRouter, protectedProcedure } from '../init';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import prisma from '@/lib/db';
export const appRouter = createTRPCRouter({
  getUsers: protectedProcedure.query(({ ctx }) => {
    const userId = ctx.auth.user.id
    return prisma.user.findMany({
      where: {
        id: userId
      }
    });
  }),
  testAi: protectedProcedure.mutation(async ({ ctx }) => {
    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      prompt: 'Write a vegetarian lasagna recipe for 4 people.',
    });
    return text;
  })
});
// export type definition of API
export type AppRouter = typeof appRouter;