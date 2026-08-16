import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  EyeOff,
  ShieldCheck,
  Cloud,
  Server,
  KeyRound,
  Users,
  FileX2,
  FileCheck2,
  Lock,
  Network,
  type LucideIcon,
} from 'lucide-react';
import { Reveal } from '../ui/reveal';
import { SectionBackdrop } from '../ui/section-backdrop';
import { BirdMark } from '../ui/bird-mark';

/**
 * Two panels, one seam.
 *
 * The left panel is deliberately light and the right deliberately dark: the
 * ungoverned path is clinical and exposed, the governed path is the branded
 * surface the rest of the page lives on. Converting the left side to dark would
 * collapse the whole point of the comparison into a colour-swapped duplicate.
 *
 * Greens are the fixed brand #6DBE30 rather than the theme-state accent — this
 * panel is a claim about the product, so it must not turn amber or red while a
 * scan is running further up the page.
 */

interface ComparisonSide {
  title: string;
  desc: string;
  icon: LucideIcon;
}

interface ComparisonRow {
  label: string;
  left: ComparisonSide;
  right: ComparisonSide;
}

const COMPARISON_ROWS: ComparisonRow[] = [
  {
    label: 'DATA PRIVACY',
    left: {
      icon: EyeOff,
      title: 'Exposed PII and Secrets',
      desc: 'Confidential values leave your network in plain text',
    },
    right: {
      icon: ShieldCheck,
      title: 'Masked Before It Leaves',
      desc: 'Sensitive values swapped for tokens on egress, restored on reply',
    },
  },
  {
    label: 'DEPLOYMENT',
    left: {
      icon: Cloud,
      title: "Someone Else's Infrastructure",
      desc: "Your prompts are retained under the provider's policy, not yours",
    },
    right: {
      icon: Server,
      title: 'Runs On Your Own Server',
      desc: 'Single-node on-premise or private cloud, your hardware, your keys',
    },
  },
  {
    label: 'ACCESS CONTROL',
    left: {
      icon: KeyRound,
      title: 'Keys Scattered Across Devices',
      desc: 'Every developer holds a provider key you cannot revoke centrally',
    },
    right: {
      icon: Users,
      title: 'One Control Plane',
      desc: 'Keys held centrally, model access granted per user or group',
    },
  },
  {
    label: 'AUDITABILITY',
    left: {
      icon: FileX2,
      title: 'No Verifiable Record',
      desc: 'Provider logs are theirs, partial, and not evidence',
    },
    right: {
      icon: FileCheck2,
      title: 'Tamper-Evident Chain',
      desc: 'Hash-chained records where any alteration breaks the chain',
    },
  },
  {
    label: 'MODEL CHOICE',
    left: {
      icon: Lock,
      title: 'Locked To One Provider',
      desc: 'Switching means changing code in every application',
    },
    right: {
      icon: Network,
      title: 'Multi-Provider Routing',
      desc: 'Cloud APIs and your own model servers behind one endpoint',
    },
  },
];

type Side = 'left' | 'right';

/**
 * Per-panel theming for a row and its popup. The two sides are the same
 * component with different paint — the light/dark contrast is the argument the
 * section is making, so it is expressed here once rather than duplicated in two
 * near-identical row blocks.
 */
const SIDE_STYLES: Record<Side, {
  iconTile: string;
  label: string;
  title: string;
  chevron: string;
  focusRing: string;
  card: string;
  caret: string;
  desc: string;
  marker: string;
  markerColor: string;
}> = {
  left: {
    iconTile: 'bg-zinc-100 border-zinc-200/60 text-zinc-600 shadow-sm',
    label: 'text-zinc-400',
    title: 'text-zinc-900',
    chevron: 'text-zinc-400',
    focusRing: 'focus-visible:ring-zinc-400/70',
    card: 'bg-white border-zinc-200 shadow-2xl shadow-zinc-950/10',
    caret: 'bg-white border-zinc-200',
    desc: 'text-zinc-500',
    marker: '×',
    markerColor: 'text-amber-600',
  },
  right: {
    iconTile: 'bg-[#041A0C] border-[#6DBE30]/25 text-[#6DBE30] shadow-sm shadow-black/20',
    label: 'text-[#6DBE30]/80',
    title: 'text-white',
    chevron: 'text-[#6DBE30]/70',
    focusRing: 'focus-visible:ring-[#6DBE30]/60',
    card: 'bg-[#041A0C] border-[#6DBE30]/25 shadow-2xl shadow-black/60',
    caret: 'bg-[#041A0C] border-[#6DBE30]/25',
    desc: 'text-zinc-400',
    marker: '✓',
    markerColor: 'text-[#6DBE30]',
  },
};

interface ComparisonRowItemProps {
  side: Side;
  row: ComparisonRow;
  isOpen: boolean;
  /** Last row of its panel: pop the card upwards so the panel's
   *  `overflow-hidden` cannot clip it. */
  flipUp: boolean;
  onToggle: () => void;
}

const ComparisonRowItem: React.FC<ComparisonRowItemProps> = ({
  side,
  row,
  isOpen,
  flipUp,
  onToggle,
}) => {
  const styles = SIDE_STYLES[side];
  const content = row[side];
  const Icon = content.icon;
  const cardId = `comparison-${side}-${row.label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div
      data-comparison-row
      role="button"
      tabIndex={0}
      aria-expanded={isOpen}
      aria-controls={cardId}
      onClick={onToggle}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onToggle();
        }
      }}
      className={`relative py-6 flex gap-4 items-start first:pt-0 last:pb-0 cursor-pointer rounded-xl outline-none focus-visible:ring-2 ${styles.focusRing}`}
    >
      <div
        className={`w-10 h-10 shrink-0 rounded-xl border flex items-center justify-center ${styles.iconTile}`}
      >
        <Icon className="h-5 w-5 stroke-[2]" aria-hidden="true" />
      </div>

      <div className="min-w-0 space-y-1">
        <span
          className={`block text-[10px] font-black tracking-widest uppercase select-none ${styles.label}`}
        >
          {row.label}
        </span>
        <div className="flex items-start gap-1.5">
          <h4 className={`text-lg font-black leading-tight ${styles.title}`}>{content.title}</h4>
          <ChevronDown
            aria-hidden="true"
            className={`mt-1 h-4 w-4 shrink-0 transition-transform duration-200 ${styles.chevron} ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={cardId}
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: flipUp ? 'bottom left' : 'top left' }}
            className={`absolute z-20 left-14 right-0 rounded-xl border p-3 ${styles.card} ${
              flipUp ? 'bottom-full mb-2' : 'top-full -mt-2'
            }`}
          >
            <span
              aria-hidden="true"
              className={`absolute left-6 w-2.5 h-2.5 rotate-45 border ${styles.caret} ${
                flipUp ? '-bottom-[6px] border-t-0 border-l-0' : '-top-[6px] border-b-0 border-r-0'
              }`}
            />
            <p className={`relative flex items-start gap-1 text-xs font-medium leading-normal ${styles.desc}`}>
              <span className={`shrink-0 font-bold ${styles.markerColor}`} aria-hidden="true">
                {styles.marker}
              </span>
              <span>{content.desc}</span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const ComparisonSection: React.FC = () => {
  /** Keyed `${side}-${label}` so the two panels pop independently, but still
   *  one card at a time across the whole comparison. */
  const [openRow, setOpenRow] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!openRow) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Element | null;
      if (!target?.closest('[data-comparison-row]')) setOpenRow(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenRow(null);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [openRow]);

  const toggle = (key: string) => setOpenRow((current) => (current === key ? null : key));

  return (
    <section
      id="comparison"
      className="relative w-full overflow-hidden py-24 sm:py-32 scroll-mt-24"
    >
      <SectionBackdrop />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 flex flex-col items-center">
        <Reveal className="text-center max-w-3xl flex flex-col items-center space-y-4 mb-16 sm:mb-20">
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight leading-heading text-white">
            Same AI prompts.
            <br />
            Two completely different outcomes.
          </h2>
          <p className="max-w-2xl text-sm sm:text-base md:text-lg text-zinc-400 font-sans leading-body">
            A side-by-side look at what sending prompts straight to a provider actually costs you — and
            what changes when every request passes through a control point you own.
          </p>
        </Reveal>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl shadow-black/40 bg-black"
        >
          {/* Seam badge. Hidden on mobile, where the panels stack and there is no
              seam for it to sit on. */}
          <div
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 hidden md:flex items-center justify-center"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center select-none bg-gradient-to-b from-zinc-900 to-black border border-white/15 shadow-2xl text-xs font-black tracking-widest text-[#6DBE30]">
              VS
            </div>
          </div>

          {/* ── LEFT: raw provider APIs ──────────────────────────────────────── */}
          <div className="relative bg-[#FAF9F6] text-zinc-950 p-8 sm:p-12 md:pr-14 flex flex-col justify-between border-b md:border-b-0 md:border-r border-zinc-200/50">
            <div className="flex items-center justify-center gap-3 mb-10 sm:mb-12">
              <h3 className="font-display text-2xl font-black tracking-tight text-zinc-950 text-center">
                Raw LLM APIs
              </h3>
            </div>

            <div className="flex-1 divide-y divide-zinc-200/60">
              {COMPARISON_ROWS.map((row, index) => (
                <ComparisonRowItem
                  key={row.label}
                  side="left"
                  row={row}
                  isOpen={openRow === `left-${row.label}`}
                  flipUp={index === COMPARISON_ROWS.length - 1}
                  onToggle={() => toggle(`left-${row.label}`)}
                />
              ))}
            </div>

            <div className="mt-10 sm:mt-12 pt-6 border-t border-zinc-200/40 text-[10px] sm:text-xs font-medium text-zinc-400">
              Based on direct provider SDK integration
            </div>
          </div>

          {/* ── RIGHT: the governed path ─────────────────────────────────────── */}
          <div className="relative overflow-hidden bg-gradient-to-b from-[#0B2410]/90 to-black p-8 sm:p-12 md:pl-14 flex flex-col">
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,#6DBE301A_0%,transparent_50%)]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px pointer-events-none bg-gradient-to-r from-transparent via-[#6DBE30]/30 to-transparent"
            />

            <div className="relative z-10 flex items-center justify-center gap-3 mb-10 sm:mb-12">
              {/* <BirdMark>, not <TorkQLogo>: the latter is an <img> of
                  /logo.svg, which carries an opaque #030404 backing square. On
                  black that square is invisible, but this panel's gradient is a
                  dark green, so it reads as a black tile behind the bird. The
                  inline mark has no rect and no padding to offset it. */}
              <BirdMark className="h-8 w-auto shrink-0" />
              <h3 className="font-display text-2xl font-black tracking-tight text-white text-center">
                TorkQ Gateway
              </h3>
            </div>

            <div className="relative z-10 flex-1 divide-y divide-[#6DBE30]/15">
              {COMPARISON_ROWS.map((row, index) => (
                <ComparisonRowItem
                  key={row.label}
                  side="right"
                  row={row}
                  isOpen={openRow === `right-${row.label}`}
                  flipUp={index === COMPARISON_ROWS.length - 1}
                  onToggle={() => toggle(`right-${row.label}`)}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
