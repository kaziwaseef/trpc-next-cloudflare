import { Context } from 'hono';
import { Env } from '../worker-configuration';

export type HonoTypes = {
  Bindings: Env;
  Variables: {};
};

export type HonoContext = Context<HonoTypes>;

export type TRPCContext = {
  env: Env;
  get: HonoContext['get'];
  set: HonoContext['set'];
  executionCtx: HonoContext['executionCtx'];
  c: HonoContext;
};

export function createTRPCContext(c: HonoContext): TRPCContext {
  return { env: c.env, get: c.get, set: c.set, executionCtx: c.executionCtx, c };
}
