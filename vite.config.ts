import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

// GitHub Pages のサブパス（https://<owner>.github.io/nihon-no-shiro/）に対応
export default defineConfig({
  base: '/nihon-no-shiro/',
  plugins: [tailwindcss()],
});
