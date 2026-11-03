import { siteOgImage } from '@/lib/siteOgImage';

export const runtime = 'edge';
export const alt = 'kt-tech.blog - 技術と創造性が交わる場所';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return siteOgImage();
}
