import { PrimeVueResolver } from '@primevue/auto-import-resolver';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import { fileURLToPath, URL } from 'node:url';
import Components from 'unplugin-vue-components/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    vueJsx(),
    tailwindcss(),
    Components({
      dirs: ['src/components'],
      extensions: ['vue'],
      deep: true,
      dts: false,
      resolvers: [PrimeVueResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          primevue: ['primevue'],
          apollo: ['@apollo/client', '@vue/apollo-composable'],
          charts: ['chart.js']
        }
      }
    }
  },
  preview: {
    port: 5173,
    host: true,
    cors: true,
    open: false,
    strictPort: true
  }
});
