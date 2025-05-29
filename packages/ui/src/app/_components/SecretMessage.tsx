'use client';

import { trpc } from '@/trpc/client';

interface SecretMessageProps {
  inputNumber: number;
}

export default function SecretMessage({ inputNumber }: SecretMessageProps) {
  const secretMessage = trpc.secret.message.useQuery({ number: inputNumber });

  return (
    <div className="p-4">
      <div className="mt-4">
        <h3 className="text-lg font-medium mb-2">Secret Message</h3>
        <ul className="list-disc pl-5 space-y-1">
          {secretMessage.data?.map((num, i) => <li key={i}>{num}</li>)}
          {secretMessage.isLoading && <li>Loading...</li>}
          {secretMessage.isError && <li>Error: {secretMessage.error.message}</li>}
        </ul>
      </div>
    </div>
  );
}
