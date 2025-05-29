import { createTRPCClient, httpBatchLink } from '@trpc/client';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import { cache } from 'react';
import { makeQueryClient } from './queryClient';
import type { AppRouter } from 'server/src/trpc/type';

function getServerUrl() {
  return process.env.NEXT_PUBLIC_API_URL + '/trpc';
}

export const getQueryClient = cache(makeQueryClient);

export function getTRPCQueryKey(path: string, input: any) {
  return [[...path.split('.')], { input, type: 'query' }];
}

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: getServerUrl(),
      headers: () => {
        return {
          'x-trpc-source': 'server',
        };
      },
    }),
  ],
});

// Create a HydrateClient component for client components
export function HydrateClient({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}

type Routes = Omit<AppRouter, '_def' | 'createCaller'>;

type FlattenObjectKeys<T extends Record<string, unknown>, Key = keyof T> = Key extends string
  ? T[Key] extends Record<string, unknown>
    ? `${Key}.${FlattenObjectKeys<T[Key]>}`
    : `${Key}`
  : never;

type FlattenedRoutes = FlattenObjectKeys<Routes>;

// Helper type to access a nested property using a dot-notated path
type PathValue<T, P extends string> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;

// Get the input type for a specific flattened route
type RouteInputType<Path extends FlattenedRoutes> =
  PathValue<Routes, Path> extends { _def: { $types: { input: infer Input } } } ? Input : never;

export async function usePrefetchQuery<Path extends FlattenedRoutes>(args: {
  queryKey: Path;
  input?: RouteInputType<Path>;
}) {
  const { queryKey, input } = args;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: getTRPCQueryKey(queryKey, input),
    queryFn: () => queryFn(args),
  });
}

function queryFn<Path extends FlattenedRoutes>(args: {
  queryKey: Path;
  input?: RouteInputType<Path>;
}) {
  const { queryKey, input } = args;
  const queryKeyParts = queryKey.split('.');

  return queryKeyParts
    .reduce((acc, part) => acc[part as keyof typeof acc], trpc as any)
    .query(input);
}
