import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  outDir: './demo-dist',
  site: process.env.PUBLIC_SITE_URL || 'https://ikonym.numera11y.fr',
});
