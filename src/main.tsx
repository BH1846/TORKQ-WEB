import { ViteReactSSG } from 'vite-react-ssg';
import { routes } from './routes';
import './index.css';

/**
 * SSG entry.
 *
 * ViteReactSSG replaces the createRoot call this file used to make. At build
 * time it walks the route tree and writes real HTML for each URL; in the
 * browser the same export hydrates that HTML. Without it the site is an empty
 * <div id="root"> as far as a crawler is concerned, and no amount of head tags
 * or structured data makes an empty page rank.
 */
export const createRoot = ViteReactSSG({ routes });
