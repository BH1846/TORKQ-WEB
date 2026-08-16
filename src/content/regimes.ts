/**
 * The data-protection regimes the gateway bears on, as one typed source.
 *
 * The chart, the per-regime detail cards, and anything structured we emit later
 * all read this array. There is deliberately no second copy of a penalty figure
 * or a limitation clause anywhere in the codebase — a ceiling that drifts
 * between a bar and its card is the failure mode this module exists to prevent.
 *
 * React-free and JSX-free on purpose, matching src/content/faq.ts: it is data
 * about statutes, and nothing here should need a renderer to be checked.
 *
 * ── ACCURACY RULES ────────────────────────────────────────────────────────
 * These are statutory claims on a public page. Breaking one turns a defensible
 * claim into a false one.
 *
 *  - `penalty` is the MAXIMUM the cited provision allows, per violation unless
 *    `penaltyQualifier` says otherwise. It is a ceiling — not an expected fine,
 *    not a typical one, and not an amount any regulator has assessed here.
 *    Ceilings are per provision and are NOT additive across regimes.
 *  - Never state a penalty as reduced, covered in part, or discounted by a
 *    percentage. A gateway does not lower a statutory ceiling. What it lowers
 *    is the risk of meeting one, which is what `risk` models.
 *  - `relevance: 'direct'` requires that the cited provision is substantially
 *    what the gateway does. Anything with a carve-out is 'partial', and its
 *    `withTorkQ` text MUST carry the limitation clause naming what remains the
 *    reader's duty. Deleting a limitation clause to make a row read better is
 *    the single most damaging edit possible to this file.
 *  - Section 8(6) is a NOTIFICATION duty. Its copy may never imply that a
 *    breach cannot occur, that breaches are prevented, or that the duty is
 *    discharged. Reduced likelihood and faster detection is the whole claim.
 *  - `risk` values are a qualitative comparative index, not measured data, not
 *    a regulator assessment, and not a prediction of fines. Whole numbers only
 *    — a decimal point here would be fabricated precision.
 *  - HIPAA and CCPA figures are inflation-adjusted annually by the agency.
 *    Re-check them against the current Federal Register / OAG notice before
 *    each release.
 */

/**
 * How much of a provision's exposure the gateway actually bears on.
 *
 * 'none' currently has no members — every regime listed is one the product
 * genuinely touches. It stays in the vocabulary because the honest response to
 * a regime the gateway stops addressing is to mark it 'none' and let it render
 * grey, not to quietly delete the row.
 */
export type Relevance = 'direct' | 'partial' | 'none';

export interface Regime {
  /** Stable slug. Used for the card's DOM id, so it must not collide. */
  id: string;
  /** Short name a reader will recognise. */
  name: string;
  jurisdiction: string;
  /** The specific article or section, cited so a lawyer can check it. */
  provision: string;
  /** What the provision requires, as a title. */
  obligation: string;
  /** The control in a handful of words. The only prose on the chart row. */
  control: string;
  /** The ceiling, stated as the statute states it. Never scaled or discounted. */
  penalty: string;
  /** 'per violation', 'whichever is higher', and similar. Travels with the figure. */
  penaltyQualifier: string;
  /** Screen-reader expansion, since the chip uses currency shorthand. */
  penaltyLabel: string;
  relevance: Relevance;
  /** Visible tag text. Always rendered beside the colour, never instead of it. */
  tagLabel: string;
  /** Comparative index 0–100 in each state. See ACCURACY RULES. */
  risk: { without: number; with: number };
  /** The exposure with prompts going straight to a provider. */
  withoutTorkQ: string;
  /** What the gateway does, plus the carve-out when relevance is 'partial'. */
  withTorkQ: string;
}

export const REGIMES: Regime[] = [
  {
    id: 'dpdp-8-5',
    name: 'DPDP Act 2023',
    jurisdiction: 'India',
    provision: 'Section 8(5)',
    obligation: 'Reasonable security safeguards to prevent a personal data breach',
    control: 'PII masked before egress',
    penalty: '₹250 Cr',
    penaltyQualifier: 'per violation',
    penaltyLabel: '250 crore rupees per violation',
    relevance: 'direct',
    tagLabel: 'Directly reduced',
    risk: { without: 95, with: 25 },
    withoutTorkQ:
      "Prompts carrying personal data leave your network in plain text and are retained under the provider's policy, not yours.",
    withTorkQ:
      'Sensitive values are masked before a prompt leaves your network, so they are never transmitted to or retained by an external model provider.',
  },
  {
    id: 'dpdp-8-6',
    name: 'DPDP Act 2023',
    jurisdiction: 'India',
    provision: 'Section 8(6)',
    obligation: 'Notify the Data Protection Board and affected individuals of a breach',
    control: 'Fewer exposures, faster detection',
    penalty: '₹200 Cr',
    penaltyQualifier: 'per violation',
    penaltyLabel: '200 crore rupees per violation',
    relevance: 'partial',
    tagLabel: 'Partially reduced',
    risk: { without: 85, with: 55 },
    withoutTorkQ:
      'Every prompt containing personal data is another exposure you would have to detect, assess and report — with no record of what left, or when.',
    // Wording is fixed. This is a notification duty: the claim is reduced
    // likelihood and faster detection, never prevention. See ACCURACY RULES.
    withTorkQ:
      'Fewer raw-data exposures means fewer breach events to report, and the admin dashboard surfaces anomalies so you detect faster. The statutory duty to notify the Board when a breach does occur still rests with you — TorkQ does not discharge it.',
  },
  {
    id: 'dpdp-9',
    name: 'DPDP Act 2023',
    jurisdiction: 'India',
    provision: 'Section 9',
    obligation:
      "Obligations for processing children's data and data of persons with disabilities",
    control: 'Custom types masked before egress',
    penalty: '₹200 Cr',
    penaltyQualifier: 'per violation',
    penaltyLabel: '200 crore rupees per violation',
    relevance: 'partial',
    tagLabel: 'Partially reduced',
    risk: { without: 70, with: 42 },
    withoutTorkQ:
      "Children's and health identifiers pasted into a prompt leave with everything else — nothing in the request distinguishes them from ordinary text.",
    // Wording is fixed. The parental-consent carve-out is what keeps this row
    // amber rather than green, and may not be dropped.
    withTorkQ:
      "Custom data classification lets you define children's and health identifiers as maskable types, so that data is tokenised before it reaches an external model. It does not handle verifiable parental consent, which the section also requires.",
  },
  {
    id: 'it-act-43a',
    name: 'IT Act 2000',
    jurisdiction: 'India',
    provision: 'Section 43A',
    obligation: 'Reasonable security practices for sensitive personal data',
    control: 'On-premise, with an auditable record',
    penalty: 'No ceiling',
    penaltyQualifier: 'compensation per affected person, uncapped',
    penaltyLabel: 'No statutory ceiling — compensation to each affected person',
    relevance: 'direct',
    tagLabel: 'Directly reduced',
    risk: { without: 85, with: 24 },
    withoutTorkQ:
      'No documented control point between the prompt and the provider, and no record to show a reasonable security practice was in place.',
    withTorkQ:
      'The SPDI Rules ask for a documented, auditable security practice. On-premise deployment plus a tamper-evident log is evidence you ran one.',
  },
  {
    id: 'gdpr',
    name: 'GDPR',
    jurisdiction: 'EU',
    provision: 'Art. 5(1)(c) & Ch. V',
    obligation: 'Data minimisation, and lawful basis for transfer outside the EEA',
    control: 'No personal data crosses the border',
    penalty: '€20M or 4%',
    penaltyQualifier: 'of global turnover, whichever is higher',
    penaltyLabel:
      '20 million euro or 4 percent of global annual turnover, whichever is higher',
    relevance: 'direct',
    tagLabel: 'Directly reduced',
    risk: { without: 90, with: 28 },
    withoutTorkQ:
      'Personal data crosses to a provider outside the EEA with no transfer mechanism of your own, and the prompt carries more than the model needs.',
    withTorkQ:
      'Tokenising identifiers before egress means the personal data never crosses a border, and the prompt that does leave carries the minimum the model needs.',
  },
  {
    id: 'eu-ai-act',
    name: 'EU AI Act',
    jurisdiction: 'EU',
    provision: 'Art. 99(4)',
    obligation: 'Deployer obligations, including automatic logging of high-risk system use',
    control: 'Tamper-evident log of every request',
    penalty: '€15M or 3%',
    penaltyQualifier: 'of global turnover, whichever is higher',
    penaltyLabel:
      '15 million euro or 3 percent of global annual turnover, whichever is higher',
    relevance: 'partial',
    tagLabel: 'Partially reduced',
    risk: { without: 70, with: 35 },
    withoutTorkQ:
      'No automatic record of who used which model, on what input, or when.',
    withTorkQ:
      'Every request through the gateway is logged in a chain that breaks if altered, which is the record-keeping half of the deployer duty. Conformity assessment and human oversight remain yours.',
  },
  {
    id: 'hipaa',
    name: 'HIPAA Security Rule',
    jurisdiction: 'US',
    provision: '45 CFR §164.312',
    obligation:
      'Technical safeguards for ePHI: access control, audit controls, transmission security',
    control: 'Access control, audit log, transmission security',
    penalty: '$2.1M',
    penaltyQualifier: 'per violation category, per year',
    penaltyLabel:
      '2.1 million US dollars per violation category per year, inflation-adjusted',
    relevance: 'direct',
    tagLabel: 'Directly reduced',
    risk: { without: 88, with: 26 },
    withoutTorkQ:
      'ePHI is transmitted to a third party with no per-user access control and no audit record you can produce.',
    withTorkQ:
      'Per-user model access, a hash-chained record of every request, and health identifiers stripped before transmission — the three technical safeguards the section names.',
  },
  {
    id: 'ccpa',
    name: 'CCPA / CPRA',
    jurisdiction: 'California',
    provision: '§1798.155',
    obligation: 'Reasonable security, and purpose limitation on personal information',
    control: 'Tokenised before any third-party model sees it',
    penalty: '$7,500',
    penaltyQualifier: 'per intentional violation, per consumer',
    penaltyLabel:
      '7,500 US dollars per intentional violation per consumer, inflation-adjusted',
    relevance: 'direct',
    tagLabel: 'Directly reduced',
    risk: { without: 75, with: 30 },
    withoutTorkQ:
      'Personal information is disclosed to a third-party model outside the purpose you stated to the consumer.',
    withTorkQ:
      'Personal information is replaced with tokens before it reaches a third-party model, so it is not disclosed to a processor outside your stated purpose.',
  },
];

/** Whole numbers only — see ACCURACY RULES. */
export const compositeIndex = (mode: 'without' | 'with'): number =>
  Math.round(REGIMES.reduce((total, r) => total + r.risk[mode], 0) / REGIMES.length);

export const countByRelevance = (relevance: Relevance): number =>
  REGIMES.filter((r) => r.relevance === relevance).length;

export const JURISDICTION_COUNT = new Set(REGIMES.map((r) => r.jurisdiction)).size;
