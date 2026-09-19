import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { FileText, Play, Columns3, Mail, type LucideIcon } from 'lucide-react';
import { BirdMark } from './bird-mark';

/**
 * Torkq navigation.
 *
 * Deliberately does NOT read the theme-state accent. The bar stays green and
 * white through every site state (scanning / exposed / remediated) so the one
 * piece of persistent chrome never turns amber or red under the visitor. The
 * page-level dimming during a scan is applied by the <Dimmable> wrapper in
 * App.tsx, not from in here.
 */

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'demo', label: 'Demo', icon: Play },
  { id: 'details', label: 'Details', icon: FileText },
  { id: 'comparison', label: 'Comparison', icon: Columns3 },
  // { id: 'risk-graph', label: 'Risk map', icon: BarChart3 },
  { id: 'contact', label: 'Contact', icon: Mail },
];

export interface NavbarProps {
  /**
   * Prefix for the section links. Empty on the homepage, where the sections
   * are on the page and '#demo' is right; '/' on the blog and FAQ, where the
   * sections live elsewhere and the link has to be '/#demo' to get there.
   *
   * The click handler below falls through to the browser whenever the target
   * section is absent, so the same component drives both cases.
   */
  linkBase?: string;
}

/**
 * Sections that are tracked but own no link of their own — they light the link
 * they sit under. #key-features is a continuation of the details area, so the
 * lamp stays on DETAILS while the visitor reads it. Without this mapping the
 * observer would set an id matching no link and the lamp would vanish entirely.
 */
const SECTION_TO_LINK: Record<string, string> = {
  'key-features': 'details',
  'get-torkq': 'contact',
};

/** Past this scroll offset the pill thickens its material to stay legible. */
const SCROLL_THRESHOLD = 80;

/**
 * A programmatic smooth scroll sweeps the viewport across every section between
 * here and the target, and the observer would fire for each one — the lamp would
 * skitter through four links before landing. Suppress observer writes while our
 * own scroll is in flight, but release early the moment the user takes over, so
 * a hand on the wheel always beats the animation.
 */
const SCROLL_LOCK_MS = 800;

export const Navbar: React.FC<NavbarProps> = ({ linkBase = '' }) => {
  const [activeId, setActiveId] = useState<string>('');
  const [isScrolled, setIsScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const navigate = useNavigate();
  const lockUntilRef = useRef(0);

  const releaseLock = useCallback(() => {
    lockUntilRef.current = 0;
  }, []);

  // Material weight follows scroll depth.
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > SCROLL_THRESHOLD);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // The lamp tracks where the visitor actually is, not only where they clicked.
  // rootMargin collapses the observer root to a thin band across the middle of
  // the viewport, so "active" means "this section is what you're looking at".
  useEffect(() => {
    const observedIds = [...NAV_ITEMS.map((item) => item.id), ...Object.keys(SECTION_TO_LINK)];
    const sections = observedIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (Date.now() < lockUntilRef.current) return;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(SECTION_TO_LINK[entry.target.id] ?? entry.target.id);
          }
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Any real input hands control straight back to the observer.
  useEffect(() => {
    const opts = { passive: true } as const;
    window.addEventListener('wheel', releaseLock, opts);
    window.addEventListener('touchstart', releaseLock, opts);
    window.addEventListener('keydown', releaseLock, opts);
    return () => {
      window.removeEventListener('wheel', releaseLock);
      window.removeEventListener('touchstart', releaseLock);
      window.removeEventListener('keydown', releaseLock);
    };
  }, [releaseLock]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    // Check for the section before suppressing the default. On the homepage the
    // target is always present and this behaves exactly as before; on the blog
    // and FAQ it is absent, and letting the click through is what navigates the
    // visitor back to '/#demo' instead of doing nothing.
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();

    // Respond on the click, not when the scroll lands — the lamp leaves for the
    // new link immediately and the page catches up to it.
    setActiveId(SECTION_TO_LINK[id] ?? id);
    lockUntilRef.current = prefersReducedMotion ? 0 : Date.now() + SCROLL_LOCK_MS;

    // Smooth scroll is vestibular motion — hand it off to an instant jump when
    // the user has asked for less of it.
    target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  };

  /**
   * The primary CTA used to point at '#get-torkq' — a pitch panel whose own
   * button then scrolled to the form. Two deliberate actions to reach one
   * field. It now goes straight to where the visitor can actually type:
   * the #contact block when this page has one, and /contact otherwise.
   */
  const contactHref = linkBase ? '/contact' : '#contact';

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (document.getElementById('contact')) {
      handleNavClick(e, 'contact');
      return;
    }
    // No section here, so this is a route change. Take it through the router
    // rather than letting the browser reload the whole bundle.
    e.preventDefault();
    navigate('/contact');
  };

  return (
    <>
      {/* ── TOP ROW: logo left, CTA right ─────────────────────────────────── */}
      {/* The strip is fixed, so whatever the visitor scrolls past runs underneath
          it. Transparent, that put white body copy — and the white half of the
          comparison table — directly behind a white wordmark, which is why the
          logo disappeared partway down the page. Past the threshold the strip
          takes its own material and the chrome always has something to sit on.

          pointer-events stays off while the strip is transparent so it never
          eats clicks meant for the hero, and comes back once it is an opaque
          bar that visibly owns that space. */}
      <header
        data-material="chrome"
        className={`fixed top-0 left-0 right-0 z-50 transition-[background-color,border-color,padding,backdrop-filter] duration-300 border-b ${
          isScrolled
            ? 'py-3 bg-black/80 backdrop-blur-lg border-white/10 pointer-events-auto'
            : 'py-6 bg-transparent border-transparent pointer-events-none'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-3">
          <motion.a
            href={linkBase || '#'}
            aria-label={linkBase ? 'Torkq — home' : 'Torkq — back to top'}
            className="group pointer-events-auto flex items-center gap-2.5 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6DBE30]"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            {/* Transitions `scale`, not `transform` — Tailwind v4's scale-105
                writes the standalone scale property, which a transform-only
                transition would leave to snap. */}
            <BirdMark
              className={`w-auto transition-[scale,filter,height] duration-300 group-hover:scale-105 group-hover:brightness-110 ${
                isScrolled ? 'h-8' : 'h-9 sm:h-10'
              }`}
            />
            {/* The wordmark is a name, not an acronym: set in the brand face at
                its own capitalisation. Mono + uppercase + wide tracking read as
                a terminal prompt and spelled the company TORKQ, which is not
                how it is written. */}
            <span className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white select-none">
              Torkq
            </span>
          </motion.a>

          <motion.a
            href={contactHref}
            onClick={handleContactClick}
            className="pointer-events-auto shrink-0 bg-[#6DBE30] hover:bg-[#8BE14A] text-black font-display font-bold text-xs sm:text-sm px-4 sm:px-6 py-2.5 rounded-full shadow-lg shadow-[#6DBE30]/20 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.96 }}
          >
            Get Torkq
          </motion.a>
        </div>
      </header>

      {/* ── FLOATING PILL: bottom on phones, top from sm up ──────────────────

          From sm up the pill shares the top strip with the logo and the CTA, so
          its offset has to track the strip's padding — otherwise, once the
          header collapses on scroll, the pill hangs below the bar it is meant
          to sit inside. On phones it stays docked to the bottom edge, where a
          thumb reaches it. */}
      <div
        className={`fixed bottom-4 sm:bottom-auto left-1/2 -translate-x-1/2 z-50 transition-[top] duration-300 ease-in-out ${
          isScrolled ? 'sm:top-1.5' : 'sm:top-6'
        }`}
      >
        <nav
          aria-label="Main navigation"
          data-material="chrome"
          className={`flex items-center gap-2 border backdrop-blur-lg py-1.5 px-2 rounded-full shadow-2xl shadow-black/40 transition-all duration-300 ease-in-out ${
            isScrolled ? 'bg-black/70 border-white/20' : 'bg-black/40 border-white/10'
          }`}
        >
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeId === item.id;

            return (
              <a
                key={item.id}
                href={`${linkBase}#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                aria-label={item.label}
                aria-current={isActive ? 'true' : undefined}
                // px tightened from 6 to 5 at sm: five links now share the pill,
                // and the old padding pushed it past the hero's column on md.
                className={`relative cursor-pointer font-display text-sm font-medium tracking-tight px-4 py-2 sm:px-5 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6DBE30] ${
                  isActive ? 'text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <span className="hidden md:inline">{item.label}</span>
                <Icon className="md:hidden" size={18} strokeWidth={2.5} aria-hidden="true" />

                {isActive && (
                  // layoutId is what slides the lamp between links — framer-motion
                  // animates from wherever it currently is on screen, so clicking
                  // mid-flight redirects it instead of restarting.
                  <motion.div
                    layoutId="lamp"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="absolute inset-0 w-full rounded-full -z-10 bg-white/5"
                  >
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 rounded-t-full bg-[#6DBE30]">
                      <div className="absolute w-12 h-6 rounded-full blur-md -top-2 -left-2 bg-[#6DBE30]/25" />
                      <div className="absolute w-8 h-6 rounded-full blur-md -top-1 bg-[#6DBE30]/25" />
                      <div className="absolute w-4 h-4 rounded-full blur-sm top-0 left-2 bg-[#6DBE30]/20" />
                    </div>
                  </motion.div>
                )}
              </a>
            );
          })}
        </nav>
      </div>
    </>
  );
};
