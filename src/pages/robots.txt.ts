import type { APIRoute } from 'astro';

export const prerender = true;

export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = new URL('/sitemap.xml', site ?? 'https://ikonym.numera11y.fr').toString();
  const body = `User-agent: *\nAllow: /\nSitemap: ${sitemapUrl}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
