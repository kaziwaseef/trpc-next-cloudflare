import { trpc, usePrefetchQuery } from '@/trpc/serverClient';

export default async function Home() {
  // Fetch data for server rendering
  const serverHello = await trpc.hello.query({ text: 'server' });

  await usePrefetchQuery({
    queryKey: 'hi',
    input: { message: 'prefetch' },
  });

  return <div>{serverHello.greeting}</div>;
}
