import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

/** Standalone admin panel — deploy as a second Vercel project (same repo, different build). */
export default defineConfig({
  plugins: [react()],
  root: path.join(rootDir, 'admin-app'),
  publicDir: path.join(rootDir, 'public'),
  envDir: rootDir,
  server: {
    port: 5174,
    fs: { allow: [rootDir] },
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  css: {
    postcss: path.join(rootDir, 'postcss.config.js'),
  },
  build: {
    outDir: path.join(rootDir, 'admin-dist'),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
});
