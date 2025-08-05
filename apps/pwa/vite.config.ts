import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      workbox: {
        navigateFallback: '/index.html', // Ensures SPA works offline
      },
      manifest: {
        name: 'kinL',
        short_name: 'kinL',
        description: 'kinL is a link bookmarking service that allows you to store links and share them with your friends and colleagues.',
        theme_color: '#ff7c7c',
        start_url: './',
        display: 'standalone',
        icons: [
          {
            src: 'pwa-64-64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'pwa-512-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
});
