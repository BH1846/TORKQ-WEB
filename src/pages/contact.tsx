import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ShieldCheck, Server } from 'lucide-react';
import { Seo } from '../components/seo';
import { ContentPage } from '../components/layout/content-page';
import { Breadcrumbs, breadcrumbSchema } from '../components/ui/breadcrumbs';
import { ContactSection } from '../components/sections/contact';
import { SITE_NAME, absoluteUrl } from '../lib/site';

/**
 * Contact as a page of its own, not only a block at the bottom of the
 * homepage.
 *
 * The form was ~9,000px down a single scrolling page. Anyone who arrived
 * wanting to talk to a person had to scroll past the whole pitch to find it,
 * and anyone sent a link had no address to be sent. This gives it a URL, so
 * it can be linked from an email, a deck or an ad, and so the primary CTA has
 * somewhere to point from every page that is not the homepage.
 *
 * The form itself is the same <ContactSection> the homepage renders — one
 * implementation, one endpoint, one set of validation rules.
 */

const TRAIL = [{ label: 'Contact' }];

/**
 * ContactPage + ContactPoint.
 *
 * Only the email address, which is real and monitored. No telephone, no
 * postal address, no opening hours — marking up contact details that do not
 * exist is the kind of claim that gets structured data ignored site-wide.
 */
function contactPageSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: `Contact ${SITE_NAME}`,
    url: absoluteUrl('/contact'),
    mainEntity: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: absoluteUrl('/'),
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: 'contact@torkq.com',
        availableLanguage: 'English',
      },
    },
  };
}

const ASSURANCES = [
  {
    icon: Mail,
    title: 'One business day',
    body: 'A person reads every enquiry and replies within one working day.',
  },
  {
    icon: Server,
    title: 'Your deployment, your terms',
    body: 'On-premise or your own private cloud. We walk the install with you.',
  },
  {
    icon: ShieldCheck,
    title: 'Nothing shared',
    body: 'What you send us stays with us. No lists, no third-party enrichment.',
  },
];

export default function ContactPage() {
  return (
    <ContentPage>
      <Seo
        title="Contact Torkq — Book a demo of the AI governance gateway"
        description="Talk to the team behind Torkq. Book a demo of the on-premise AI governance gateway, ask about deployment, or send a question — we reply within one business day."
        canonical="/contact"
        structuredData={[contactPageSchema(), breadcrumbSchema(TRAIL)]}
      />

      <div className="mx-auto w-full max-w-[1100px] px-4 sm:px-6">
        <Breadcrumbs trail={TRAIL} className="mb-8" />

        <header className="mb-4 max-w-2xl">
          <span className="inline-block rounded-full border border-[#6DBE30]/20 bg-[#6DBE30]/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-[#6DBE30]">
            Contact
          </span>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl font-bold tracking-display leading-display text-white">
            Talk to the team.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-zinc-400 leading-body">
            Book a demo against your own traffic, ask about on-premise
            deployment, or send a question. No forms-to-nowhere — a person
            answers.
          </p>
        </header>

        {/* Three short assurances, because the thing that stops people filling
            in a B2B form is not knowing what happens next. */}
        <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {ASSURANCES.map((item) => {
            const Icon = item.icon;
            return (
              <li
                key={item.title}
                data-material="panel"
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm"
              >
                <Icon
                  className="h-5 w-5 text-[#6DBE30] stroke-[2]"
                  aria-hidden="true"
                />
                <h2 className="mt-3 text-sm font-bold text-white tracking-heading">
                  {item.title}
                </h2>
                <p className="mt-1.5 text-sm text-zinc-400 leading-body">
                  {item.body}
                </p>
              </li>
            );
          })}
        </ul>
      </div>

      {/* The form. Same component as the homepage section, so there is one
          place where the fields, the honeypot and the endpoint are defined. */}
      <ContactSection showHeading={false} />

      <div className="mx-auto w-full max-w-[1100px] px-4 sm:px-6">
        <p className="text-sm text-zinc-500 leading-body">
          Looking for something else? The{' '}
          <Link
            to="/faq"
            className="text-[#6DBE30] underline decoration-[#6DBE30]/30 underline-offset-4 hover:decoration-[#6DBE30]"
          >
            FAQ
          </Link>{' '}
          covers deployment, the DPDP Act and how masking works, and the{' '}
          <Link
            to="/blog"
            className="text-[#6DBE30] underline decoration-[#6DBE30]/30 underline-offset-4 hover:decoration-[#6DBE30]"
          >
            blog
          </Link>{' '}
          goes deeper on each.
        </p>
      </div>
    </ContentPage>
  );
}
