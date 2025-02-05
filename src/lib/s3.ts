import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import {
  GetObjectCommand,
  GetObjectCommandInput,
  ListBucketsCommand,
  ListBucketsCommandInput,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';

export const s3Client = new S3Client({
  region: 'ap-northeast-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export const getPresignedPutUrl = async (
  client: S3Client,
  params: PutObjectCommandInput,
) => {
  const command = new PutObjectCommand(params);
  const url = await getSignedUrl(client, command, { expiresIn: 3600 });
  return url;
};

export const getPresignedGetUrl = async (
  client: S3Client,
  params: GetObjectCommandInput,
) => {
  const command = new GetObjectCommand(params);
  const url = await getSignedUrl(client, command, { expiresIn: 3600 });
  return url;
};

export const listBuckets = async (
  client: S3Client,
  params: ListBucketsCommandInput,
) => {
  const buckets = await client.send(new ListBucketsCommand(params));
  return buckets;
};
