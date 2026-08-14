import React from 'react';
import { Link } from 'react-router-dom';
import { useThemeState } from '../../lib/theme-state';
import { TorkQLogo } from '../ui/torkq-logo';

/**
 * Shared by every route, so this is where the content pages get their links.
 *
 * Blog and FAQ live here rather than in the nav pill: the pill is the
 * homepage's section switcher — four in-page anchors with a sliding lamp — and
 * dropping cross-page destinations into it would mean two link behaviours in
 * one control. The footer is where a visitor already looks for them.
 */

const CONTENT_LINKS: { to: string; label: string }[] = [
  { to: '/blog', label: 'Blog' },
  { to: '/faq', label: 'FAQ' },
  { to: '/dpdp-exposure', label: 'DPDP Risk Map' },
];

export const FooterSection: React.FC = () => {
  const { accent } = useThemeState();

  return (
    <footer className="w-full border-t border-white/10 bg-black/90 py-12 px-4 relative z-20">
      <div className="max-w-[1100px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 font-mono text-xs text-neutral-400">
        <div className="flex items-center gap-3">
          <TorkQLogo size={28} accentColor={accent} />
        </div>

        <nav aria-label="Footer" className="flex items-center gap-6">
          {CONTENT_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="uppercase tracking-widest text-neutral-400 hover:text-[#6DBE30] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="text-center md:text-left">
          © {new Date().getFullYear()} TorkQ Inc. All rights reserved. Zero-Trust Data Protection Gateway.
        </div>

        <div>
          <a
            href="#"
            className="text-neutral-400 hover:text-white transition-colors underline decoration-dotted"
            onClick={(e) => e.preventDefault()}
          >
            &#123;&#123;DOMAIN_TBD&#125;&#125;
          </a>
        </div>
      </div>
    </footer>
  );
};
