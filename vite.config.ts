import { defineConfig } from 'vite';
import feedbackPlugin from './vite-plugin-feedback';
import episodePlugin from './vite-plugin-episode';

export default defineConfig({
  base: '/',
  plugins: [feedbackPlugin(), episodePlugin()],
});
