import { defineConfig } from 'vite';
import feedbackPlugin from './vite-plugin-feedback';
import episodePlugin from './vite-plugin-episode';
import designPlugin from './vite-plugin-design';

export default defineConfig({
  base: '/',
  plugins: [feedbackPlugin(), episodePlugin(), designPlugin()],
});
