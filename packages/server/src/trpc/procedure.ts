import { initTRPC } from '@trpc/server';
import { TRPCContext } from '../context';
import { OpenApiMeta } from 'trpc-to-openapi';

export const t = initTRPC.context<TRPCContext>().meta<OpenApiMeta>().create();

export const publicProcedure = t.procedure;
