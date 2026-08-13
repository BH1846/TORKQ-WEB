import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import {sitemapPlugin} from './vite/sitemap';
import {hoistHeadTags} from './vite/hoist-head';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), sitemapPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    ssgOptions: {
      // 'nested' writes /blog/<slug>/index.html rather than /blog/<slug>.html,
      // so every route is served from a clean directory URL with no extension
      // and no server rewrite rule to maintain.
      dirStyle: 'nested' as const,
      // React 19 emits <Seo>'s tags inside the app markup during SSR; this
      // lifts them into <head>. See vite/hoist-head.ts.
      onPageRendered: (_route: string, html: string) => hoistHeadTags(html),
    },
    ssr: {
      // framer-motion and lucide-react ship ESM that Node will not load from
      // node_modules as-is during the SSG pass; bundling them into the server
      // build sidesteps it.
      noExternal: ['framer-motion', 'lucide-react'],
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
