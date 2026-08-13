import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarDays, Clock } from 'lucide-react';
import { Seo } from '../components/seo';
import { ContentPage } from '../components/layout/content-page';
import { posts, postPath } from '../content/posts';
import { formatDate } from '../lib/format';

/**
 * /blog — the index.
 *
 * Cards are derived from the post registry and ordered newest first by that
 * module, so publishing a post surfaces it here with no edit to this file.
 */
export default function BlogIndexPage() {
  return (
    <ContentPage>
      <Seo
        title="Blog — AI Governance, DPDP Act and LLM Data Privacy | TorkQ"
        description="Practical writing on AI governance: DPDP Act compliance for AI, preventing PII leaks to LLMs, and why on-premise AI gateways matter for data privacy."
        canonical="/blog"
      />

      <div className="mx-auto w-full max-w-[1100px] px-4 sm:px-6">
        <header className="mb-14 sm:mb-20 max-w-3xl">
          <span className="inline-block text-xs font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-[#6DBE30]/10 border border-[#6DBE30]/20 text-[#6DBE30]">
            Blog
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl font-bold text-white tracking-heading leading-heading">
            AI governance, in practice.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-zinc-400 leading-body">
            Notes on keeping personal data out of large language models — what
            the DPDP Act actually asks of you, how prompts leak, and where a
            control point belongs.
          </p>
        </header>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <motion.li key={post.slug} whileHover={{ y: -6 }} className="h-full">
              {/* The whole card is the link, so the hit area matches what the
                  card looks like. The h2 stays a heading for the outline. */}
              <Link
                to={postPath(post)}
                className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm transition-colors duration-300 hover:border-[#6DBE30]/30 hover:bg-white/[0.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6DBE30]"
              >
                <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-widest text-zinc-500">
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
                </div>

                <h2 className="text-lg font-bold text-white tracking-heading leading-heading transition-colors group-hover:text-[#6DBE30]">
                  {post.title}
                </h2>

                <p className="mt-3 flex-1 text-sm text-zinc-400 leading-body">
                  {post.description}
                </p>

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
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </ContentPage>
  );
}
