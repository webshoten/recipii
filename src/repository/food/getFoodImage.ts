import { client } from '@/lib/honoServerSide';

export const getFoodImage = async (foodFilePath: string) => {
  const res = await client.api.food.s3get.$post({
    json: {
      filepath: foodFilePath,
    },
  });

  return await res.json();
};
