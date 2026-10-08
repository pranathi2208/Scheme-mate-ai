import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// For GitHub Pages, set base to '/your-repo-name/'
// For Netlify/Vercel/other hosts, leave base as '/'
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    port: 5173,
  },
});
