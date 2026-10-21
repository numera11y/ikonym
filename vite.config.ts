import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'demo-dist',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@dicebear/core')) return 'dicebear-core';
          const density = id.match(/[/\\]styles[/\\]ikonym-(3|5|7|9|12)\.json/);
          if (density) return `ikonym-style-${density[1]}`;
        },
      },
    },
  },
  server: { host: '0.0.0.0' },
});
