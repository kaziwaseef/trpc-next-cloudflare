import { HydrateClient, trpc, usePrefetchQuery } from '@/trpc/serverClient';
import SecretMessage from './_components/SecretMessage';

export const runtime = 'edge';

export default async function Home() {
  // Fetch data for server rendering
  const serverHello = await trpc.hello.query({ text: 'server' });

  await usePrefetchQuery({
    queryKey: 'secret.message',
    input: { number: 5 },
  });

  return (
    <>
      <div>{serverHello.greeting}</div>
      <HydrateClient>
        <SecretMessage inputNumber={5} />
      </HydrateClient>
      <SecretMessage inputNumber={10} />
    </>
  );
}
