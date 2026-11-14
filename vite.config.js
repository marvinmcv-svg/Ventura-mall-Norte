import { defineConfig } from 'vite';

// Absolute base: the site uses clean URLs (/tiendas/boss), served by a SPA
// rewrite on Vercel (see vercel.json).
export default defineConfig({
  base: '/',
  build: { chunkSizeWarningLimit: 900 },
});
