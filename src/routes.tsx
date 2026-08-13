import React from 'react';
import { Outlet } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import type { RouteRecord } from 'vite-react-ssg';
import { ThemeStateProvider } from './lib/theme-state';
import { posts, postPath } from './content/posts';
import HomePage from './pages/home';
import BlogIndexPage from './pages/blog-index';
import BlogPostPage from './pages/blog-post';
import FaqPage from './pages/faq';

/**
 * The route tree vite-react-ssg pre-renders.
 *
 * Every route is a child of one layout so the providers are mounted once and
 * shared: ThemeStateProvider in particular is needed on the blog and FAQ
 * because the footer reads the accent from it.
 *
 * Pages are imported eagerly rather than lazily. Four routes is not enough
 * code to justify splitting, and eager imports keep the pre-render path
 * simple — the SSG pass renders each route synchronously with no suspense
 * boundary to resolve first.
 */
const RootLayout: React.FC = () => (
  // reducedMotion="user" makes every framer-motion transform animation on the
  // page respect the OS setting. Without it, Framer Motion ignores it entirely.
  <MotionConfig reducedMotion="user">
    <HelmetProvider>
      <ThemeStateProvider>
        <Outlet />
      </ThemeStateProvider>
    </HelmetProvider>
  </MotionConfig>
);

export const routes: RouteRecord[] = [
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'blog', element: <BlogIndexPage /> },
      {
        path: 'blog/:slug',
        element: <BlogPostPage />,
        // Tells the SSG pass which concrete URLs this dynamic segment expands
        // to. Derived from the registry, so a new post is pre-rendered without
        // touching this file.
        getStaticPaths: () => posts.map(postPath),
      },
      { path: 'faq', element: <FaqPage /> },
    ],
  },
];
