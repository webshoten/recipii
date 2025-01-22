import { client } from '@/lib/honoServerSide';
import { put } from '@vercel/blob';

export function UploadForm({ children }: { children: React.ReactNode }) {
  async function uploadImage(formData: FormData) {
    'use server';
    const imageFile = formData.get('image') as File;
    const blob = await put(imageFile.name, imageFile, {
      access: 'public',
    });
    console.log(blob);

    const { $patch } = client.api.picture;
    const res = await $patch({
      json: {
        id: '1',
        filename: imageFile.name,
      },
    });
    const aa = await res.json();
    console.log(aa);
  }

  return (
    <>
      <form action={uploadImage}>{children}</form>
    </>
  );
}
