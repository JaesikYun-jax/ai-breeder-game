import { defineConfig } from 'vite';
import feedbackPlugin from './vite-plugin-feedback';

export default defineConfig({
  base: '/',
  plugins: [feedbackPlugin()],
});
