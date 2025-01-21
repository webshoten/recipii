import { client } from '@/lib/honoServerSide';

export default async function RecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { $get } = client.api;
  const res = await $get({
    query: {
      id,
    },
  });
  const aa = await res.json();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        {JSON.stringify(aa)}
      </main>
    </div>
  );
}
