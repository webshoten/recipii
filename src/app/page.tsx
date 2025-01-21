'use client';

import { client } from '@/lib/hono';
import { InferRequestType } from 'hono/client';
import useSWR from 'swr';

export default function Home() {
  const { $post } = client.api;

  const createFetcher = (arg: InferRequestType<typeof $post>) => async () => {
    const res = await $post(arg);
    return res.json();
  };

  const { data, isLoading } = useSWR('/api', createFetcher({}));

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
