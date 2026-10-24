import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  build: {
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) return 'vendor-react';
            if (id.includes('maplibre-gl')) return 'vendor-map';
            if (id.includes('echarts') || id.includes('echarts-for-react')) return 'vendor-charts';
            if (id.includes('zustand') || id.includes('date-fns') || id.includes('@turf/turf')) return 'vendor-utils';
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    host: true,
    open: true,
  },
  preview: {
    port: 3000,
    host: true,
  },
  css: {
    postcss: './postcss.config.js',
  },
});