const base = process.env.NEXT_PUBLIC_APP_URL || 'https://ericaimoveis.com.br';

export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
