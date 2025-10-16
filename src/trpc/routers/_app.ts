import { baseProcedure, createTRPCRouter,protectedProcedure } from '../init';
import prisma from '@/lib/db';
export const appRouter = createTRPCRouter({
  getUsers: protectedProcedure.query(({ctx}) => {
    const userId = ctx.auth.user.id
      return prisma.user.findMany({where:{
        id:userId
      }});
    }),
});
// export type definition of API
export type AppRouter = typeof appRouter;