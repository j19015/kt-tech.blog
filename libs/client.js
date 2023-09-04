import { createClient } from 'microcms-js-sdk';

export const client = createClient({
  serviceDomain: 'kt-tech-blog',
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
});