import { Context } from 'hono';

export type HonoTypes = {
  Bindings: CloudflareBindings;
  Variables: {};
};

export type HonoContext = Context<HonoTypes>;

export type TRPCContext = {
  env: CloudflareBindings;
  get: HonoContext['get'];
  set: HonoContext['set'];
  executionCtx: HonoContext['executionCtx'];
  c: HonoContext;
};

export function createTRPCContext(c: HonoContext): TRPCContext {
  return { env: c.env, get: c.get, set: c.set, executionCtx: c.executionCtx, c };
}
