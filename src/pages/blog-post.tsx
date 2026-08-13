import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Clock } from 'lucide-react';
import { Seo } from '../components/seo';
import { ContentPage } from '../components/layout/content-page';
import { Prose } from '../components/blog/prose';
import { getPostBySlug, postPath } from '../content/posts';
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  absoluteUrl,
} from '../lib/site';
import { formatDate } from '../lib/format';
import type { Post } from '../content/types';

/**
 * BlogPosting structured data for one post.
 *
 * Only fields we can stand behind. The author is a name and nothing else — no
 * jobTitle, no sameAs, no fabricated credentials — because Google treats
 * invented author detail as exactly the spam signal it is. There is no
 * wordCount, no aggregateRating and no interactionStatistic for the same
 * reason: we would be making them up.
 */
function blogPostingSchema(post: Post): Record<string, unknown> {
  const url = absoluteUrl(postPath(post));

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    keywords: post.keywords.join(', '),
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: {
      '@type': 'Organization',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl('/logo.png'),
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    image: DEFAULT_OG_IMAGE,
    url,
  };
}

/**
 * The page a visitor lands on from search, so it carries the full head:
 * per-post title, description, canonical, article-type OG card and the
 * BlogPosting graph.
 */
export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = getPostBySlug(slug);

  // Only reachable if a link goes stale — every real slug is pre-rendered from
  // the registry. noindex so a 200-with-nothing-on-it never enters the index.
  if (!post) {
    return (
      <ContentPage>
        <Seo
          title="Post not found | TorkQ"
          description="This post could not be found."
          canonical="/blog"
          noindex
        />
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
          <h1 className="text-3xl font-bold text-white">Post not found</h1>
          <p className="mt-4 text-zinc-400">
            That post does not exist, or its address has changed.
          </p>
          <Link
            to="/blog"
            className="mt-8 inline-flex items-center gap-2 text-[#6DBE30] hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to the blog
          </Link>
        </div>
      </ContentPage>
    );
  }

  return (
    <ContentPage>
      <Seo
        title={`${post.title} | TorkQ`}
        description={post.description}
        canonical={postPath(post)}
        ogType="article"
        structuredData={blogPostingSchema(post)}
      />

      {/* max-w-3xl holds the measure at a readable line length. The metadata
          and prose share it so nothing runs wider than the text. */}
      <article className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-zinc-400 transition-colors hover:text-[#6DBE30]"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          All posts
        </Link>

        <header className="mt-8 mb-12 border-b border-white/10 pb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-white tracking-heading leading-heading">
            {post.title}
          </h1>

          <p className="mt-5 text-lg text-zinc-400 leading-body">
            {post.description}
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3 font-mono text-[11px] uppercase tracking-widest text-zinc-500">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
              <time dateTime={post.datePublished}>
                {formatDate(post.datePublished)}
              </time>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              {post.readingTime}
            </span>
            <span>{post.author}</span>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-zinc-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </header>

        <Prose blocks={post.body} />

        {/* Foot CTA back to the homepage's conversion section. */}
        <aside className="mt-16 rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-sm sm:p-10">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-heading leading-heading">
            See it run on a real prompt.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400 leading-body">
            TorkQ detects and masks sensitive values before a prompt leaves your
            network, controls which models each user can reach, and records every
            governed request.
          </p>
          <a
            href="/#get-torkq"
            className="mt-7 inline-block rounded-full bg-[#6DBE30] px-7 py-3 text-sm font-bold text-black shadow-lg shadow-[#6DBE30]/20 transition-colors duration-300 hover:bg-[#8BE14A] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            GET TORKQ
          </a>
        </aside>

        <div className="mt-12">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-zinc-400 transition-colors hover:text-[#6DBE30]"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Back to the blog
          </Link>
        </div>
      </article>
    </ContentPage>
  );
}
