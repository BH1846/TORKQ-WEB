import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { Seo } from '../components/seo';
import { ContentPage } from '../components/layout/content-page';
import { FAQ_ITEMS, type FaqItem } from '../content/faq';

/**
 * FAQPage structured data, built from the same array the accordion renders.
 *
 * Google requires the marked-up answer to match the visible text, and a
 * mismatch is a rich-result penalty rather than a warning. Deriving both from
 * FAQ_ITEMS makes drift impossible: the join below is exactly what the DOM
 * ends up containing, since each answer paragraph renders as its own <p>.
 */
function faqPageSchema(items: FaqItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer.join(' '),
      },
    })),
  };
}

/**
 * Native <details>, not a JS-controlled accordion.
 *
 * A collapsed panel that unmounts its children would keep the answers out of
 * the pre-rendered HTML — no text to crawl, and structured data claiming text
 * the page does not show. <details> keeps every answer in the DOM, works
 * before hydration, and gets keyboard and screen-reader behaviour for free.
 */
const FaqEntry: React.FC<{ item: FaqItem; defaultOpen: boolean }> = ({
  item,
  defaultOpen,
}) => (
  <details
    open={defaultOpen}
    className="group rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm transition-colors duration-300 hover:border-[#6DBE30]/30 open:border-[#6DBE30]/20 open:bg-white/[0.05]"
  >
    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6DBE30] rounded-2xl [&::-webkit-details-marker]:hidden">
      <h2 className="text-base sm:text-lg font-bold text-white tracking-heading leading-heading">
        {item.question}
      </h2>
      <ChevronDown
        className="h-5 w-5 shrink-0 text-[#6DBE30] transition-transform duration-300 group-open:rotate-180"
        aria-hidden="true"
      />
    </summary>

    <div className="space-y-4 px-6 pb-6 pt-0">
      {item.answer.map((paragraph, i) => (
        <p key={i} className="text-[15px] text-zinc-300 leading-[1.75]">
          {paragraph}
        </p>
      ))}
    </div>
  </details>
);

export default function FaqPage() {
  return (
    <ContentPage>
      <Seo
        title="FAQ — AI Governance Gateway, DPDP Act and PII Masking | TorkQ"
        description="Answers on what an AI governance gateway is, how TorkQ masks PII before prompts reach an LLM, what the DPDP Act requires, on-premise deployment, and the tamper-evident audit trail."
        canonical="/faq"
        structuredData={faqPageSchema(FAQ_ITEMS)}
      />

      <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <header className="mb-12 sm:mb-16">
          <span className="inline-block text-xs font-mono font-bold tracking-widest uppercase px-3 py-1 rounded-full bg-[#6DBE30]/10 border border-[#6DBE30]/20 text-[#6DBE30]">
            FAQ
          </span>
          <h1 className="mt-5 text-4xl sm:text-5xl font-bold text-white tracking-heading leading-heading">
            Frequently asked questions.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-zinc-400 leading-body">
            What TorkQ does, where it runs, and how it fits the obligations you
            already have.
          </p>
        </header>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item, i) => (
            <FaqEntry key={item.question} item={item} defaultOpen={i === 0} />
          ))}
        </div>

        <aside className="mt-16 rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-sm sm:p-10">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-heading leading-heading">
            Still have a question?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-zinc-400 leading-body">
            Read more on the{' '}
            <Link
              to="/blog"
              className="text-[#6DBE30] underline decoration-[#6DBE30]/30 underline-offset-4 hover:decoration-[#6DBE30]"
            >
              blog
            </Link>
            , or see the gateway run on a real prompt.
          </p>
          <a
            href="/#get-torkq"
            className="mt-7 inline-block rounded-full bg-[#6DBE30] px-7 py-3 text-sm font-bold text-black shadow-lg shadow-[#6DBE30]/20 transition-colors duration-300 hover:bg-[#8BE14A] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            GET TORKQ
          </a>
        </aside>
      </div>
    </ContentPage>
  );
}
