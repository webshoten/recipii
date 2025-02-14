import { getFilesFromUrls } from '@/lib/getFilesFromUrls';
import { client } from '@/lib/honoServerSide';

export type GetFoodsResponse = {
  id: number;
  name: string;
  yyyymmdd: string;
  file: File;
}[];

export const getFoods = async (yyyymmdd: string) => {
  const res = await client.api.food.list.s3get.$post({
    json: {
      yyyymmdd,
    },
  });
  const urls = await res.json();
  const files = await getFilesFromUrls(urls);

  const res2 = await client.api.food.list.$get({
    query: {
      yyyymmdd,
    },
  });
  const list = await res2.json();

  return list.map((item) => {
    return {
      id: item.id,
      name: item.name,
      yyyymmdd: item.yyyymmdd || null,
      file: files.find((f) => f?.name == item.name) || null,
    };
  });
};
