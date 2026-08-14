import React from 'react';
import { Seo } from '../components/seo';
import { ContentPage } from '../components/layout/content-page';
import { SITE_NAME, absoluteUrl } from '../lib/site';
import {
  DPDP_FAQ,
  LEGAL_DISCLAIMER,
  PENALTY_TIERS,
  type DpdpFaqItem,
  type PenaltyTier,
  type Relevance,
} from '../content/dpdp';

const PATH = '/dpdp-exposure';

/**
 * Breadcrumb and FAQ graph for the page.
 *
 * The FAQ answers are the DPDP_FAQ strings unmodified — the same strings the
 * accordion below renders — because marked-up text that does not appear on the
 * page is a rich-result violation rather than a warning.
 */
function structuredData(items: DpdpFaqItem[]): Record<string, unknown>[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: SITE_NAME,
          item: absoluteUrl('/'),
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'DPDP Risk Map',
          item: absoluteUrl(PATH),
        },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: items.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    },
  ];
}

/**
 * Colour per relevance level.
 *
 * Colour is never the only signal — every tag renders its `tagLabel` text
 * beside the dot. That is an accessibility requirement, and on this page it is
 * also the honest form: a reader skimming for green has to read what the green
 * actually claims.
 */
const TAG_STYLES: Record<Relevance, string> = {
  direct: 'border-[#6DBE30]/30 bg-[#6DBE30]/10 text-[#6DBE30]',
  partial: 'border-amber-400/30 bg-amber-400/10 text-amber-300',
  none: 'border-white/10 bg-white/5 text-zinc-400',
  'not-applicable': 'border-white/10 bg-white/5 text-zinc-400',
};

const DOT_STYLES: Record<Relevance, string> = {
  direct: 'bg-[#6DBE30]',
  partial: 'bg-amber-400',
  none: 'bg-zinc-500',
  'not-applicable': 'bg-zinc-500',
};

/** Only the direct tier gets a lifted surface; the rest stay flat on purpose. */
const CARD_STYLES: Record<Relevance, string> = {
  direct: 'border-[#6DBE30]/25 bg-[#6DBE30]/[0.04]',
  partial: 'border-amber-400/20 bg-white/[0.03]',
  none: 'border-white/10 bg-white/[0.02]',
  'not-applicable': 'border-white/10 bg-white/[0.02]',
};

const RelevanceTag: React.FC<{ tier: PenaltyTier }> = ({ tier }) => (
  <span
    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-widest ${TAG_STYLES[tier.relevance]}`}
  >
    <span
      aria-hidden="true"
      className={`h-1.5 w-1.5 rounded-full ${DOT_STYLES[tier.relevance]}`}
    />
    {tier.tagLabel}
  </span>
);

/**
 * One tier.
 *
 * Rendered as a card rather than a <tr> so the same markup works at every
 * width — a seven-row, five-column table of long sentences has no honest
 * mobile form. The grid below reflows the card into a row from lg up, which is
 * where the table reading actually helps.
 */
const TierCard: React.FC<{ tier: PenaltyTier }> = ({ tier }) => (
  <li
    className={`rounded-3xl border p-6 backdrop-blur-sm sm:p-8 ${CARD_STYLES[tier.relevance]}`}
  >
    <div className="grid gap-5 lg:grid-cols-12 lg:items-start lg:gap-8">
      <div className="lg:col-span-3">
        <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-zinc-500">
          Tier {tier.tier} · {tier.section}
        </p>
        <p
          className="mt-2 text-3xl font-bold tracking-heading text-white sm:text-[2rem]"
          aria-label={tier.ceilingLabel}
        >
          {tier.ceiling}
        </p>
      </div>

      <div className="lg:col-span-5">
        <h3 className="text-base font-bold leading-heading tracking-heading text-white">
          {tier.trigger}
        </h3>
      </div>

      <div className="lg:col-span-4">
        <RelevanceTag tier={tier} />
        <p className="mt-3 text-sm leading-body text-zinc-400">
          {tier.explanation}
        </p>
      </div>
    </div>
  </li>
);

const FaqEntry: React.FC<{ item: DpdpFaqItem }> = ({ item }) => (
  <details className="group rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm open:border-[#6DBE30]/20">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl p-5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6DBE30] [&::-webkit-details-marker]:hidden">
      <h3 className="text-[15px] font-bold leading-heading tracking-heading text-white">
        {item.question}
      </h3>
      <span
        aria-hidden="true"
        className="font-mono text-[#6DBE30] transition-transform duration-300 group-open:rotate-45"
      >
        +
      </span>
    </summary>
    <p className="px-5 pb-5 text-[15px] leading-[1.75] text-zinc-300">
      {item.answer}
    </p>
  </details>
);

/**
 * The DPDP penalty schedule, mapped against what TorkQ actually does.
 *
 * The point of the page is the grey and amber rows. Four of the seven tiers
 * are marked as untouched by TorkQ, and the two partials are worded as
 * supporting controls — that is what makes the one green row credible to the
 * lawyer who will read this before the buyer does. Nothing here says TorkQ
 * delivers or guarantees compliance, and the only 'direct' claim is the
 * Section 8(5) one.
 */
export default function DpdpExposurePage() {
  return (
    <ContentPage>
      <Seo
        title="DPDP Act Penalties & AI Data Exposure | TorkQ"
        description="The full DPDP Act 2023 penalty schedule — from the ₹250 Cr ceiling under Section 8(5) for failed security safeguards down to the ₹50 Cr catch-all — mapped honestly against the exposure an AI data governance gateway reduces."
        canonical={PATH}
        structuredData={structuredData(DPDP_FAQ)}
      />

      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <header className="mb-14 sm:mb-20">
          <span className="inline-block font-mono text-xs font-bold uppercase tracking-widest text-[#6DBE30]">
            DPDP Act 2023 · Penalty Exposure
          </span>
          <h1 className="mt-5 text-3xl font-bold leading-heading tracking-heading text-white sm:text-4xl lg:text-[2.75rem]">
            What each DPDP violation costs — and where TorkQ reduces your
            exposure.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-body text-zinc-400 sm:text-lg">
            India's Digital Personal Data Protection Act sets fixed penalty
            ceilings per violation, enforced by the Data Protection Board. Here
            is the full schedule, and an honest map of which exposures an AI
            governance gateway actually reduces.
          </p>
          <p className="mt-6 max-w-3xl border-l-2 border-[#6DBE30]/40 pl-4 text-sm leading-body text-zinc-300">
            Penalties are fixed rupee ceilings, not a percentage of turnover.
            The Act carries no criminal liability — all penalties are monetary.
          </p>
        </header>

        <section aria-labelledby="schedule-heading">
          <h2
            id="schedule-heading"
            className="text-2xl font-bold leading-heading tracking-heading text-white sm:text-3xl"
          >
            The seven penalty tiers.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-body text-zinc-400">
            Each tier below carries its own ceiling, and its own answer to a
            single question: does an AI governance gateway change your exposure
            here? For four of the seven, it does not.
          </p>

          <ul className="mt-8 space-y-4">
            {PENALTY_TIERS.map((tier) => (
              <TierCard key={tier.tier} tier={tier} />
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="summary-heading"
          className="mt-14 rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm sm:p-10"
        >
          <h2
            id="summary-heading"
            className="text-xl font-bold leading-heading tracking-heading text-white sm:text-2xl"
          >
            Where TorkQ actually sits.
          </h2>
          <p className="mt-4 text-[15px] leading-[1.75] text-zinc-300">
            Of the seven penalty tiers, TorkQ most directly reduces exposure
            under Section 8(5) — by ensuring sensitive data never reaches an
            external model in the first place — and supports data-minimisation
            obligations under the catch-all tier. It is one control in a broader
            compliance programme, not a substitute for one.
          </p>
          <p className="mt-4 text-[15px] leading-[1.75] text-zinc-400">
            It does not address breach notification, children's data,
            Significant Data Fiduciary audit duties, or consent management.
            Those obligations remain yours whether or not a gateway is in place.
          </p>
        </section>

        <aside className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/[0.04] p-6 sm:p-8">
          <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-amber-300">
            Enforcement timeline
          </p>
          <p className="mt-3 text-[15px] leading-[1.75] text-zinc-300">
            The DPDP Rules 2025 were notified on 13 November 2025. Core
            obligations, including breach notification, take effect on 13 May
            2027. Nothing on this page is a statement that you are liable today
            — the point is that the window to prepare is now, while AI usage
            inside your organisation is still small enough to bring under
            control.
          </p>
        </aside>

        <section aria-labelledby="faq-heading" className="mt-14">
          <h2
            id="faq-heading"
            className="text-xl font-bold leading-heading tracking-heading text-white sm:text-2xl"
          >
            Questions of fact.
          </h2>
          <div className="mt-6 space-y-3">
            {DPDP_FAQ.map((item) => (
              <FaqEntry key={item.question} item={item} />
            ))}
          </div>
        </section>

        <section
          aria-labelledby="cta-heading"
          className="mt-14 rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur-sm sm:p-10"
        >
          <h2
            id="cta-heading"
            className="text-xl font-bold leading-heading tracking-heading text-white sm:text-2xl"
          >
            See what your prompts are exposing.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-body text-zinc-400">
            Run the gateway against a real prompt and see which values would
            have left your network.
          </p>
          <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/#demo"
              className="inline-block rounded-full bg-[#6DBE30] px-7 py-3 text-sm font-bold text-black shadow-lg shadow-[#6DBE30]/20 transition-colors duration-300 hover:bg-[#8BE14A] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              See what your prompts are exposing
            </a>
            <a
              href="/#get-torkq"
              className="inline-block rounded-full border border-white/15 px-7 py-3 text-sm font-bold text-white transition-colors duration-300 hover:border-[#6DBE30]/40 hover:text-[#6DBE30] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Talk to us about deployment
            </a>
          </div>
        </section>

        <p className="mt-14 border-t border-white/10 pt-8 text-xs leading-[1.7] text-zinc-500">
          {LEGAL_DISCLAIMER}
        </p>
      </div>
    </ContentPage>
  );
}
