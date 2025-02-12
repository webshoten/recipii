import { getYyyymmdd } from '@/lib/date';
import { client } from '@/lib/honoClientSide';

export const putFood = async (file: File) => {
  const yyyymmdd: string = getYyyymmdd(new Date());

  const res = await client.api.food.s3put.$post({
    json: {
      name: file.name,
      type: file.type,
      yyyymmdd,
    },
  });
  const url = await res.json();
  console.log(url);
  await fetch(url || '', {
    method: 'PUT',
    body: file,
    headers: {
      'Content-Type': file.type,
    },
  });

  const foodres = await client.api.food.$post({
    json: {
      name: file.name,
      yyyymmdd,
    },
  });
  return (await foodres.json())[0];
};
