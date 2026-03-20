import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.SITE_URL || 'https://kt-tech.blog';
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/searches'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
