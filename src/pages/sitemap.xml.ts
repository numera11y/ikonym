import type { APIRoute } from 'astro';

export const prerender = true;

const escapeXml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export const GET: APIRoute = ({ site }) => {
  const base = site ?? new URL('https://ikonym.numera11y.fr');
  const english = escapeXml(new URL('/en/', base).toString());
  const french = escapeXml(new URL('/fr/', base).toString());
  const pages = [
    { url: english, locale: 'en-US' },
    { url: french, locale: 'fr' },
  ];
  const entries = pages.map(({ url }) => `
  <url>
    <loc>${url}</loc>
    <xhtml:link rel="alternate" hreflang="en-US" href="${english}" />
    <xhtml:link rel="alternate" hreflang="fr" href="${french}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${english}" />
  </url>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${entries}
</urlset>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
