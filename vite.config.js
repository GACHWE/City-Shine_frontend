import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 3000,
    open: true,
    allowedHosts:[
      '88c11b21a2f7.ngrok-free.app',
    ]
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});