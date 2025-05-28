import { z } from 'zod';
import { extendZodWithOpenApi } from 'zod-openapi';
import { t, publicProcedure } from './procedure';

extendZodWithOpenApi(z);

const router = t.router;

export const appRouter = router({
  hello: publicProcedure
    .meta({
      openapi: {
        method: 'GET',
        path: '/hello',
        summary: 'Say hello',
        description: 'Say hello to the world',
        protect: false,
        tags: ['hello'],
      },
    })
    .input(z.object({ text: z.string() }))
    .output(z.object({ greeting: z.string() }).openapi({ title: 'HelloOutput' }))
    .query(({ input, ctx }) => {
      return {
        greeting: `Hello ${input.text}!, HELLO: ${ctx.env.ENVIRONMENT}`,
      };
    }),
  hi: publicProcedure.input(z.object({ message: z.string() })).query(({ input, ctx }) => {
    return {
      greeting: `Hello ${input.message}!, HELLO: ${ctx.env.ENVIRONMENT}`,
    };
  }),
  secret: t.router({
    message: publicProcedure.input(z.object({ number: z.number() })).query(async ({ input }) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return Array.from({ length: input.number }, () => Math.floor(Math.random() * 100));
    }),
  }),
});

export type AppRouter = typeof appRouter;
