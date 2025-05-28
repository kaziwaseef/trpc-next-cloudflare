import { Hono } from 'hono';
import { HonoContext, HonoTypes } from './context';
import { cors } from 'hono/cors';
import { createOpenApiFetchHandler } from 'trpc-to-openapi';
import { trpcServer } from '@hono/trpc-server';
import { appRouter } from './trpc/router';
import { createTRPCContext } from './context';
import { swaggerUI } from '@hono/swagger-ui';
import { openApiDocument } from './openapi';

const app = new Hono<HonoTypes>();

app.use(
  cors({
    credentials: true,
    origin: ['http://localhost:3000'],
  })
);

app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    endpoint: '/trpc',
    createContext: (_opts, c: HonoContext) => createTRPCContext(c),
  })
);

app.get('/docs.json', (c) => c.json(openApiDocument));

app.use('/api/*', (c) =>
  createOpenApiFetchHandler({
    router: appRouter,
    createContext: () => createTRPCContext(c),
    req: c.req.raw,
    endpoint: '/api',
  })
);

app.get('/openapi', swaggerUI({ url: '/docs.json' }));

export default app;
