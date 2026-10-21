import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' lets the same build work on GitHub Pages (username.github.io/<repo>/)
export default defineConfig({
  plugins: [react()],
  base: './',
});
