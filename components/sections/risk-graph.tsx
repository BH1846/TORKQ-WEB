import React, { useCallback, useId, useMemo, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ShieldAlert, ShieldCheck, Table2 } from 'lucide-react';
import { Reveal } from '../ui/reveal';
import { SectionBackdrop } from '../ui/section-backdrop';

/**
 * The risk graph: the data-protection regimes a gateway actually bears on, the
 * risk level under each with and without one, and the maximum penalty each
 * provision carries.
 *
 * Two measures, deliberately encoded differently. Risk level is the graphed
 * one — 0–100, one axis, and the only thing the toggle moves. The penalty is a
 * stated figure beside it, never a bar, for two reasons: the ceilings are in
 * four currencies and two of them are a percentage of turnover, so they share
 * no scale; and the ceiling does not change when you deploy something. What
 * changes is your risk of meeting it.
 *
 * ── ACCURACY RULES ────────────────────────────────────────────────────────
 * These are statutory claims. Breaking one turns a defensible page into a
 * false one.
 *
 *  - `penalty` is the MAXIMUM the provision allows, per violation unless the
 *    qualifier says otherwise. It is a ceiling, not an expected or typical
 *    fine, and not a figure any regulator has assessed against anyone here.
 *  - Never state a penalty as reduced, covered in part, or discounted by a
 *    percentage. A gateway does not lower a statutory ceiling. The ceiling is
 *    what is at stake; the risk bar is the only thing it moves.
 *  - Every row must be a regime the product genuinely bears on, and `covers`
 *    must name the specific control — not the regime. "Supports the security
 *    obligation under X" is true; "makes you X-compliant" is not, and no copy
 *    on this page may imply it.
 *  - `risk` values are a qualitative model, not measured data or an audit
 *    result. The caption under the graph says so. Do not add a decimal point.
 *  - HIPAA and CCPA figures are inflation-adjusted annually by the agency.
 *    Re-check them against the current Federal Register / OAG notice before
 *    each release; the qualifier text is where the adjustment note lives.
 *
 * ── FITTING ONE SCREEN ────────────────────────────────────────────────────
 * The whole section is sized to land inside a single viewport on a laptop and
 * close to it on a phone, because it now owns a nav link and a visitor who
 * clicks RISK MAP should arrive at the whole chart rather than the top third of
 * it. That budget is why `requirement` and `covers` render only in the table
 * view: six rows of prose is roughly 300px, which is the difference between
 * fitting and not. `control` is the one-line stand-in that stays on the row.
 * Anything added here has to come out of something else.
 *
 * ── CHART CONSTRUCTION ────────────────────────────────────────────────────
 * Horizontal bars, one 0–100 axis. Colour is status, never identity: #EE2255
 * is the exposed state, #6DBE30 the controlled one. That pair was validated
 * against each other on a near-black surface (deutan ΔE 10.6, normal ΔE 38.0,
 * contrast ≥ 3:1). The site's #FF3B4E fails the same pairing at ΔE 5.6, which
 * is why it is not used here, and a red/amber/green severity ramp was rejected
 * outright — amber against the brand green separates by ΔE 2.0 under
 * protanopia. State therefore rides bar length, the toggle label, the band
 * name and the numbers, never colour alone.
 */

type Mode = 'without' | 'with';

interface Regulation {
  /** Short name a reader will recognise. */
  name: string;
  jurisdiction: string;
  /** The specific article or section, cited so it can be checked. */
  provision: string;
  /** What that provision requires. Table view only — see FITTING ONE SCREEN. */
  requirement: string;
  /** The control, in a handful of words. The only prose on the row itself. */
  control: string;
  /**
   * The maximum the provision allows. A ceiling, stated as the statute states
   * it — never scaled, discounted, or presented as an expected fine.
   */
  penalty: string;
  /** 'per violation', 'whichever is higher', and similar qualifiers. */
  penaltyQualifier: string;
  /** Screen-reader expansion, since the chip uses currency shorthand. */
  penaltyLabel: string;
  /** Qualitative risk level 0–100 in each state. */
  risk: Record<Mode, number>;
  /** The full claim. Table view only. Names the control, not the regime. */
  covers: string;
}

const REGULATIONS: Regulation[] = [
  {
    name: 'DPDP Act 2023',
    jurisdiction: 'India',
    provision: 'Section 8(5)',
    requirement: 'Reasonable security safeguards to prevent a personal data breach',
    control: 'PII masked before egress',
    penalty: '₹250 Cr',
    penaltyQualifier: 'per violation',
    penaltyLabel: '250 crore rupees per violation',
    risk: { without: 95, with: 25 },
    covers:
      'Sensitive values are masked before a prompt leaves your network, so they are never transmitted to or retained by an external model provider.',
  },
  {
    name: 'GDPR',
    jurisdiction: 'EU',
    provision: 'Art. 5(1)(c) & Ch. V',
    requirement: 'Data minimisation, and lawful basis for transfer outside the EEA',
    control: 'No personal data crosses the border',
    penalty: '€20M or 4%',
    penaltyQualifier: 'of global turnover, whichever is higher',
    penaltyLabel:
      '20 million euro or 4 percent of global annual turnover, whichever is higher',
    risk: { without: 90, with: 28 },
    covers:
      'Tokenising identifiers before egress means the personal data never crosses a border, and the prompt that does leave carries the minimum the model needs.',
  },
  {
    name: 'HIPAA Security Rule',
    jurisdiction: 'US',
    provision: '45 CFR §164.312',
    requirement:
      'Technical safeguards for ePHI: access control, audit controls, transmission security',
    control: 'Access control, audit log, transmission security',
    penalty: '$2.1M',
    penaltyQualifier: 'per violation category, per year',
    penaltyLabel:
      '2.1 million US dollars per violation category per year, inflation-adjusted',
    risk: { without: 88, with: 26 },
    covers:
      'Per-user model access, a hash-chained record of every request, and health identifiers stripped before transmission — the three technical safeguards the section names.',
  },
  {
    name: 'IT Act 2000',
    jurisdiction: 'India',
    provision: 'Section 43A',
    requirement: 'Reasonable security practices for sensitive personal data',
    control: 'On-premise, with an auditable record',
    penalty: 'No ceiling',
    penaltyQualifier: 'compensation per affected person, uncapped',
    penaltyLabel: 'No statutory ceiling — compensation to each affected person',
    risk: { without: 85, with: 24 },
    covers:
      'The SPDI Rules ask for a documented, auditable security practice. On-premise deployment plus a tamper-evident log is evidence you ran one.',
  },
  {
    name: 'CCPA / CPRA',
    jurisdiction: 'California',
    provision: '§1798.155',
    requirement: 'Reasonable security, and purpose limitation on personal information',
    control: 'Tokenised before any third-party model sees it',
    penalty: '$7,500',
    penaltyQualifier: 'per intentional violation, per consumer',
    penaltyLabel:
      '7,500 US dollars per intentional violation per consumer, inflation-adjusted',
    risk: { without: 75, with: 30 },
    covers:
      'Personal information is replaced with tokens before it reaches a third-party model, so it is not disclosed to a processor outside your stated purpose.',
  },
  {
    name: 'EU AI Act',
    jurisdiction: 'EU',
    provision: 'Art. 99(4)',
    requirement: 'Deployer obligations, including automatic logging of high-risk system use',
    control: 'Tamper-evident log of every request',
    penalty: '€15M or 3%',
    penaltyQualifier: 'of global turnover, whichever is higher',
    penaltyLabel:
      '15 million euro or 3 percent of global annual turnover, whichever is higher',
    risk: { without: 70, with: 35 },
    covers:
      'Every request through the gateway is logged in a chain that breaks if altered, which is the record-keeping half of the deployer duty. Conformity assessment and human oversight remain yours.',
  },
];

const MODES: { id: Mode; label: string }[] = [
  { id: 'without', label: 'Without TorkQ' },
  { id: 'with', label: 'With TorkQ' },
];

/** See CHART CONSTRUCTION above before swapping either of these. */
const RISK_RED = '#EE2255';
const SAFE_GREEN = '#6DBE30';

/** The graph's domain. Risk level only — the penalties are never plotted. */
const AXIS_TICKS = [0, 25, 50, 75, 100];

const compositeRisk = (mode: Mode): number =>
  Math.round(REGULATIONS.reduce((total, r) => total + r.risk[mode], 0) / REGULATIONS.length);

const JURISDICTION_COUNT = new Set(REGULATIONS.map((r) => r.jurisdiction)).size;

/**
 * Risk level bands. Four names, two colours — see the note on the rejected
 * red/amber/green ramp above. The band name is always rendered beside the icon.
 *
 * Boundaries sit clear of both composites rather than beside them: a threshold
 * a live figure lands within a point of is one edited row away from silently
 * flipping the summary from red to green.
 */
const bandFor = (level: number): { name: string; safe: boolean } => {
  if (level >= 75) return { name: 'High exposure', safe: false };
  if (level >= 45) return { name: 'Elevated', safe: false };
  if (level >= 20) return { name: 'Moderate', safe: true };
  return { name: 'Controlled', safe: true };
};

/**
 * The two-state segmented control.
 *
 * A radiogroup rather than two buttons: the states are mutually exclusive
 * readings of one graph, which is what a radio group means, and it earns
 * arrow-key traversal once the handler below is wired. The sliding pill is a
 * layoutId so it travels between the two rather than blinking across.
 */
const ModeToggle: React.FC<{
  mode: Mode;
  onChange: (m: Mode) => void;
  labelledBy: string;
}> = ({ mode, onChange, labelledBy }) => {
  const refs = useRef<Record<Mode, HTMLButtonElement | null>>({ without: null, with: null });

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (!['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp'].includes(e.key)) return;
      e.preventDefault();
      // Two options, so every arrow key means "the other one".
      const next: Mode = mode === 'without' ? 'with' : 'without';
      onChange(next);
      // Selection follows focus in a radiogroup, so move focus with it.
      refs.current[next]?.focus();
    },
    [mode, onChange],
  );

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelledBy}
      data-material="panel"
      className="relative inline-flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur-sm"
    >
      {MODES.map((option) => {
        const isActive = mode === option.id;
        return (
          <button
            key={option.id}
            ref={(el) => {
              refs.current[option.id] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(option.id)}
            onKeyDown={handleKeyDown}
            className={`relative cursor-pointer rounded-full px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6DBE30] sm:px-5 sm:text-xs ${
              isActive ? 'text-black' : 'text-zinc-400 hover:text-white'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="risk-mode-pill"
                aria-hidden="true"
                initial={false}
                transition={{ type: 'spring', stiffness: 340, damping: 32 }}
                className="absolute inset-0 -z-10 rounded-full"
                style={{ backgroundColor: option.id === 'with' ? SAFE_GREEN : RISK_RED }}
              />
            )}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
};

/**
 * One regime, on one line from sm up.
 *
 * Three columns: identity, the plotted bar, the penalty. Both risk figures stay
 * on screen — the active one at the bar's right, the other as the grey tick —
 * so nothing is gated behind the toggle or a hover.
 */
const RegulationRow: React.FC<{ regulation: Regulation; mode: Mode }> = ({
  regulation,
  mode,
}) => {
  const active = regulation.risk[mode];
  const other = regulation.risk[mode === 'with' ? 'without' : 'with'];
  const colour = mode === 'with' ? SAFE_GREEN : RISK_RED;

  return (
    // Two lines on a phone, one from sm up. The grid placement is what folds the
    // penalty up beside the name on mobile instead of giving it a third line —
    // three lines × six rows is what pushed this past a phone screen.
    <li className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 py-2 sm:flex sm:gap-4 sm:py-2.5">
      {/* Identity. Fixed share of the row from sm up so every bar starts on the
          same vertical line — a ragged left edge would make the lengths
          incomparable, which is the one thing this chart is for. */}
      <div className="col-start-1 row-start-1 min-w-0 sm:w-[14rem] sm:shrink-0">
        <div className="flex items-baseline gap-2">
          <h3 className="truncate text-[13px] font-bold leading-tight tracking-heading text-white">
            {regulation.name}
          </h3>
          <span className="shrink-0 font-mono text-[9px] font-bold uppercase tracking-widest text-zinc-500">
            {regulation.jurisdiction}
          </span>
        </div>
        <p className="hidden truncate text-[11px] leading-tight text-zinc-500 sm:block">
          {regulation.control}
        </p>
      </div>

      {/* The plot. */}
      {/* col-start/col-end rather than col-span: `col-span-2` writes the
          grid-column shorthand, which would fight col-start-1 depending on
          which rule the cascade emits last. */}
      <div className="col-start-1 col-end-3 row-start-2 flex min-w-0 items-center gap-2.5 sm:col-auto sm:row-auto sm:flex-1 sm:gap-3">
        <div className="relative h-2 w-full overflow-hidden rounded-full bg-white/[0.05]">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-r-[4px]"
            initial={false}
            animate={{ width: `${active}%`, backgroundColor: colour }}
            transition={{ type: 'spring', stiffness: 210, damping: 30 }}
          />
          {/* Where this regime sits in the state you are not looking at. */}
          <motion.div
            aria-hidden="true"
            className="absolute inset-y-0 w-0.5 rounded-full bg-zinc-500"
            initial={false}
            animate={{ left: `${other}%` }}
            transition={{ type: 'spring', stiffness: 210, damping: 30 }}
          />
        </div>
        <span className="w-6 shrink-0 text-right font-mono text-[13px] font-bold tabular-nums text-white sm:w-7 sm:text-sm">
          {active}
        </span>
      </div>

      {/* The penalty. Ink tokens and no fill, so it can never be misread as part
          of the plot. The qualifier travels with the figure — "per violation"
          and "of global turnover" are the difference between a large number and
          an unbounded one. */}
      {/* The qualifier stays visible at every width, including the phone layout
          this row was compressed for. "€20M or 4%" without "of global turnover,
          whichever is higher" is a different claim, so it is not a candidate for
          the height budget — see ACCURACY RULES. */}
      <div className="col-start-2 row-start-1 max-w-[8rem] text-right sm:w-[8rem] sm:max-w-none sm:shrink-0">
        <span
          className="font-mono text-[13px] font-bold text-white"
          aria-label={regulation.penaltyLabel}
        >
          {regulation.penalty}
        </span>
        <span className="block text-[9px] leading-tight text-zinc-500">
          {regulation.penaltyQualifier}
        </span>
      </div>
    </li>
  );
};

export const RiskGraphSection: React.FC = () => {
  const [mode, setMode] = useState<Mode>('without');
  const prefersReducedMotion = useReducedMotion();
  const headingId = useId();
  const toggleLabelId = useId();

  const composite = useMemo(
    () => ({ without: compositeRisk('without'), with: compositeRisk('with') }),
    [],
  );

  const level = composite[mode];
  const otherLevel = composite[mode === 'with' ? 'without' : 'with'];
  const band = bandFor(level);
  const BandIcon = band.safe ? ShieldCheck : ShieldAlert;
  const accent = band.safe ? SAFE_GREEN : RISK_RED;

  return (
    <section
      id="risk-graph"
      aria-labelledby={headingId}
      // Matches the other linked sections: clears the fixed pill on sm+, and the
      // logo header on mobile, where the pill itself sits at the bottom.
      className="relative w-full overflow-hidden py-10 scroll-mt-24 sm:py-14"
    >
      <SectionBackdrop />

      <div className="relative z-10 mx-auto flex max-w-6xl flex-col items-center px-5 sm:px-8">
        <Reveal className="mb-5 flex max-w-2xl flex-col items-center space-y-1.5 text-center">
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#6DBE30]">
            Risk map
          </span>
          <h2
            id={headingId}
            className="font-display text-xl font-extrabold uppercase leading-heading tracking-tight text-white sm:text-3xl"
          >
            Six regulations. One control point.
          </h2>
          <p className="font-sans text-[11px] leading-body text-zinc-400 sm:text-sm">
            What each can fine you, and how far the risk moves with a gateway in front.
          </p>
        </Reveal>

        <Reveal className="w-full max-w-4xl">
          <div
            data-material="panel"
            className="rounded-3xl border border-white/10 bg-white/[0.02] p-4 shadow-2xl shadow-black/40 backdrop-blur-sm sm:p-6"
          >
            {/* ── SUMMARY + CONTROL ─────────────────────────────────────────── */}
            {/* One strip rather than a hero band: the toggle and the number it
                moves sit on the same line, so the cause and the effect are a
                single glance apart. */}
            <div className="border-b border-white/10 pb-3">
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <p
                    id={toggleLabelId}
                    className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-500"
                  >
                    Composite risk
                  </p>
                  {/* Number and band name share a baseline rather than stacking:
                      the band was costing a whole line for two words. */}
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <motion.span
                      key={`level-${mode}`}
                      initial={prefersReducedMotion ? false : { opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                      className="font-display text-3xl font-extrabold leading-none tracking-display sm:text-4xl"
                      style={{ color: accent }}
                    >
                      {level}
                    </motion.span>
                    <span className="font-mono text-[10px] text-zinc-500">/ 100</span>
                    <span
                      className="inline-flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-widest"
                      style={{ color: accent }}
                    >
                      <BandIcon className="h-3 w-3" aria-hidden="true" />
                      {band.name}
                    </span>
                  </div>
                </div>

                <ModeToggle mode={mode} onChange={setMode} labelledBy={toggleLabelId} />
              </div>

              {/* Full-width meter under the pair, so the cause and the effect are
                  one glance apart at every width. */}
              <div className="relative mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-r-[4px]"
                  initial={false}
                  animate={{ width: `${level}%`, backgroundColor: accent }}
                  transition={{ type: 'spring', stiffness: 210, damping: 30 }}
                />
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-y-0 w-0.5 rounded-full bg-zinc-500"
                  initial={false}
                  animate={{ left: `${otherLevel}%` }}
                  transition={{ type: 'spring', stiffness: 210, damping: 30 }}
                />
              </div>
            </div>

            {/* ── THE GRAPH ─────────────────────────────────────────────────── */}
            <div className="mt-3 flex items-baseline justify-between font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              <span>Regime</span>
              <span className="hidden sm:block">Risk level 0–100</span>
              <span>Max penalty</span>
            </div>

            <ul className="mt-1 divide-y divide-white/[0.06]">
              {REGULATIONS.map((regulation) => (
                <RegulationRow key={regulation.name} regulation={regulation} mode={mode} />
              ))}
            </ul>

            {/* Axis, aligned to the bar column only — the identity and penalty
                columns are not on this scale and must not sit above its ticks. */}
            <div className="mt-2 hidden items-center gap-4 sm:flex">
              <div className="w-[14rem] shrink-0" />
              <div
                aria-hidden="true"
                className="flex flex-1 justify-between border-t border-white/10 pt-1.5 pr-10 font-mono text-[9px] tabular-nums text-zinc-600"
              >
                {AXIS_TICKS.map((tick) => (
                  <span key={tick}>{tick}</span>
                ))}
              </div>
              <div className="w-[8rem] shrink-0" />
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-[10px] leading-tight text-zinc-600">
              <span>
                {REGULATIONS.length} regimes · {JURISDICTION_COUNT} jurisdictions · penalties not to
                scale
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span aria-hidden="true" className="inline-block h-2 w-0.5 rounded-full bg-zinc-500" />
                {mode === 'with' ? 'Without TorkQ' : 'With TorkQ'}, for reference
              </span>
            </div>

            {/* ── TABLE VIEW ────────────────────────────────────────────────── */}
            {/* Every figure in the graph plus the two prose fields the row has no
                height for, reachable without reading a colour or operating the
                toggle — and what a crawler and a screen reader get without
                JavaScript, since the page is pre-rendered. */}
            <details className="group mt-4 rounded-xl border border-white/10 bg-white/[0.02]">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-4 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#6DBE30] [&::-webkit-details-marker]:hidden">
                <span className="inline-flex items-center gap-2 text-[11px] font-bold text-white">
                  <Table2 className="h-3.5 w-3.5 text-[#6DBE30]" aria-hidden="true" />
                  Full detail and data table
                </span>
                <span
                  aria-hidden="true"
                  className="font-mono text-xs text-[#6DBE30] transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </summary>

              <div className="overflow-x-auto px-4 pb-4">
                <table className="w-full min-w-[42rem] border-collapse text-left">
                  <caption className="sr-only">
                    Data-protection regimes the TorkQ gateway bears on, what each provision
                    requires, the control that applies, the maximum penalty, and the modelled risk
                    level with and without the gateway.
                  </caption>
                  <thead>
                    <tr className="border-b border-white/10 font-mono text-[9px] uppercase tracking-widest text-zinc-500">
                      <th scope="col" className="py-2 pr-3 font-bold">
                        Regime
                      </th>
                      <th scope="col" className="py-2 pr-3 font-bold">
                        Obligation and control
                      </th>
                      <th scope="col" className="py-2 pr-3 font-bold">
                        Max penalty
                      </th>
                      <th scope="col" className="py-2 pr-3 text-right font-bold">
                        Without
                      </th>
                      <th scope="col" className="py-2 text-right font-bold">
                        With
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.06]">
                    {REGULATIONS.map((regulation) => (
                      <tr key={regulation.name} className="align-top text-xs">
                        <th
                          scope="row"
                          className="py-2.5 pr-3 text-left text-[12px] font-medium text-zinc-300"
                        >
                          {regulation.name}
                          <span className="block font-mono text-[9px] font-normal uppercase tracking-wider text-zinc-500">
                            {regulation.jurisdiction} · {regulation.provision}
                          </span>
                        </th>
                        <td className="py-2.5 pr-3 text-[11px] leading-snug text-zinc-400">
                          {regulation.requirement}
                          <span className="mt-1 block text-zinc-500">{regulation.covers}</span>
                        </td>
                        <td className="py-2.5 pr-3 font-mono text-[11px] tabular-nums text-zinc-300">
                          {regulation.penalty}
                          <span className="block text-[9px] text-zinc-500">
                            {regulation.penaltyQualifier}
                          </span>
                        </td>
                        <td className="py-2.5 pr-3 text-right font-mono tabular-nums text-zinc-300">
                          {regulation.risk.without}
                        </td>
                        <td className="py-2.5 text-right font-mono tabular-nums text-zinc-300">
                          {regulation.risk.with}
                        </td>
                      </tr>
                    ))}
                    <tr className="text-xs font-bold">
                      <th scope="row" className="py-2.5 pr-3 text-left text-[12px] text-white">
                        Composite risk level
                      </th>
                      <td
                        className="py-2.5 pr-3 text-[10px] font-normal text-zinc-500"
                        colSpan={2}
                      >
                        Ceilings are per provision and are not additive across regimes
                      </td>
                      <td className="py-2.5 pr-3 text-right font-mono tabular-nums text-white">
                        {composite.without}
                      </td>
                      <td className="py-2.5 text-right font-mono tabular-nums text-white">
                        {composite.with}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Do not delete. See the ACCURACY RULES at the top of this file. */}
                <p className="mt-4 text-[10px] leading-body text-zinc-500">
                  Every penalty above is the maximum the cited provision allows, per violation
                  unless noted. Ceilings are not additive across regimes, no regulator has assessed
                  any of them here, and a gateway does not lower a ceiling — it lowers the risk of
                  meeting one. The HIPAA and CCPA figures are adjusted for inflation each year;
                  check the current notice. Risk levels are a qualitative model, not measured data
                  or an audit result. TorkQ is one control in a compliance programme, not a
                  substitute for one, and addresses the specific obligation named on each row
                  rather than the regime as a whole. Not legal advice.
                </p>
              </div>
            </details>
          </div>

          {/* The short form of the disclaimer above, always visible — the long
              one must not be reachable only by opening a disclosure. */}
          <p className="mt-3 text-center text-[10px] leading-body text-zinc-600">
            Maximum statutory ceilings, not expected fines or amounts assessed. Risk levels are a
            qualitative model. One control, not compliance — not legal advice.
          </p>
        </Reveal>
      </div>
    </section>
  );
};
