'use client';

import { client } from '@/lib/honoClientSide';
import { InferRequestType } from 'hono/client';
import useSWR from 'swr';

export default function Home() {
  const { $get } = client.api;

  const createFetcher = (arg: InferRequestType<typeof $get>) => async () => {
    const res = await $get(arg);
    return res.json();
  };

  const { data, isLoading } = useSWR(
    '/api?id=1',
    createFetcher({
      query: {
        id: '1',
      },
    }),
  );

  if (isLoading) {
    return <>loading</>;
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {data ? JSON.stringify(data) : 'none'}
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        aaa
      </footer>
    </div>
  );
}
