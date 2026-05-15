import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/youtube": "http://localhost:8888",
    },
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 800,
  },
});
