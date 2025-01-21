import { type AppType } from '@/app/api/[[...route]]/route';
import { getBaseUrl } from '@/lib/getUrl';
import { hc } from 'hono/client';
export const client = hc<AppType>(getBaseUrl() || '');
