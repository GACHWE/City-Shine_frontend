import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    allowedHosts: [
      'e724c1a0fc99.ngrok-free.app',
      'precious-beijinho-1b7a24.netlify.app',
    ]
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});