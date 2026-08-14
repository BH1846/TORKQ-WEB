/**
 * The DPDP Act 2023 penalty schedule, and an honest map of which tiers TorkQ
 * actually touches.
 *
 * Kept as data rather than JSX for two reasons. The page renders the tiers and
 * the FAQ from these arrays, and the FAQPage JSON-LD is built from the same
 * FAQ array — Google treats a marked-up answer that differs from the visible
 * text as a rich-result violation, so there must be no second copy of the
 * wording to drift. Second, the figures below are legal claims about a statute:
 * one list, one place to check them against the Act.
 *
 * ACCURACY RULES for anyone editing this file:
 *  - These are the seven tiers in the Act's Schedule. Do not add, merge, or
 *    re-round them.
 *  - Penalties are fixed rupee ceilings per violation, monetary only. They are
 *    not a percentage of turnover, and the Act carries no imprisonment.
 *  - `relevance: 'direct'` belongs to Section 8(5) and nothing else. TorkQ is
 *    one control; it does not deliver, guarantee, or ensure DPDP compliance,
 *    and no copy here may say otherwise.
 */

/**
 * How much of a tier's exposure TorkQ actually bears on.
 *
 * 'none' and 'not-applicable' render identically (grey) but are distinct
 * claims: 'none' means the obligation is real for the reader and TorkQ does not
 * help with it, 'not-applicable' means the tier does not fall on data
 * fiduciaries at all.
 */
export type Relevance = 'direct' | 'partial' | 'none' | 'not-applicable';

export interface PenaltyTier {
  /** 1-based, matching the order the Schedule lists them in. */
  tier: number;
  /** Section of the Act the penalty attaches to. */
  section: string;
  /** Ceiling as displayed, e.g. 'Up to ₹250 Cr'. */
  ceiling: string;
  /** Screen-reader expansion of the abbreviated ceiling. */
  ceilingLabel: string;
  /** What triggers the penalty, in the Act's terms. */
  trigger: string;
  relevance: Relevance;
  /** The visible tag text. Always shown next to the colour, never instead. */
  tagLabel: string;
  /** One line on why the tag reads the way it does. */
  explanation: string;
}

export const PENALTY_TIERS: PenaltyTier[] = [
  {
    tier: 1,
    section: 'Section 8(5)',
    ceiling: 'Up to ₹250 Cr',
    ceilingLabel: 'Up to 250 crore rupees',
    trigger:
      'Failure to take reasonable security safeguards to prevent a personal data breach.',
    relevance: 'direct',
    tagLabel: 'TorkQ reduces this exposure',
    explanation:
      'Sensitive values are masked before prompts leave your network, so company and personal data is not transmitted to, or retained by, external model providers. This is one safeguard among many the Board weighs — not a complete security programme.',
  },
  {
    tier: 2,
    section: 'Section 8(6)',
    ceiling: 'Up to ₹200 Cr',
    ceilingLabel: 'Up to 200 crore rupees',
    trigger:
      'Failure to notify the Data Protection Board and affected individuals of a breach.',
    relevance: 'none',
    tagLabel: 'Not addressed by TorkQ',
    explanation:
      'Breach notification is a process obligation — who you tell, and how fast. TorkQ does not cover it.',
  },
  {
    tier: 3,
    section: 'Section 9',
    ceiling: 'Up to ₹200 Cr',
    ceilingLabel: 'Up to 200 crore rupees',
    trigger:
      'Breach of obligations for processing data of children and persons with disabilities.',
    relevance: 'none',
    tagLabel: 'Not addressed by TorkQ',
    explanation:
      'Verifiable parental consent and the restrictions on tracking and targeted advertising to children sit outside what the gateway does.',
  },
  {
    tier: 4,
    section: 'Section 10',
    ceiling: 'Up to ₹150 Cr',
    ceilingLabel: 'Up to 150 crore rupees',
    trigger:
      'Breach of additional obligations by Significant Data Fiduciaries.',
    relevance: 'partial',
    tagLabel: 'Partial — supporting control only',
    explanation:
      'The tamper-evident audit trail can support the record-keeping expected of a Significant Data Fiduciary. It does not make you SDF-compliant: the DPO appointment, independent data audits, and algorithmic due diligence are separate duties TorkQ does not discharge.',
  },
  {
    tier: 5,
    section: 'Section 15',
    ceiling: 'Up to ₹10,000',
    ceilingLabel: 'Up to 10,000 rupees',
    trigger:
      'Breach of Data Principal duties (individuals filing false complaints).',
    relevance: 'not-applicable',
    tagLabel: 'Not applicable',
    explanation:
      'This penalty falls on individuals, not on data fiduciaries. Nothing an organisation deploys changes it.',
  },
  {
    tier: 6,
    section: 'Section 32',
    ceiling: 'Variable',
    ceilingLabel: 'Variable',
    trigger:
      'Breach of a voluntary undertaking accepted by the Board — penalty extends to the amount for the underlying contravention.',
    relevance: 'not-applicable',
    tagLabel: 'Not directly applicable',
    explanation:
      'This tier reopens whatever contravention the undertaking settled, so its exposure follows the underlying tier rather than standing on its own.',
  },
  {
    tier: 7,
    section: 'Any other provision',
    ceiling: 'Up to ₹50 Cr',
    ceilingLabel: 'Up to 50 crore rupees',
    trigger:
      'Catch-all: consent failures, purpose limitation, data minimisation, cross-border transfer, grievance redressal.',
    relevance: 'partial',
    tagLabel: 'Partial — supporting control only',
    explanation:
      'Tokenising PII before egress supports data minimisation and purpose limitation for the AI-usage slice of your data flows. It does not cover consent management or grievance redressal, which are the larger part of this tier.',
  },
];

export interface DpdpFaqItem {
  question: string;
  /** Rendered verbatim as the visible answer and as the JSON-LD answer text. */
  answer: string;
}

/**
 * Four questions of fact about the Act. Every answer restates a figure that is
 * also visible elsewhere on the page; none of them makes a claim about TorkQ.
 */
export const DPDP_FAQ: DpdpFaqItem[] = [
  {
    question: 'What is the maximum DPDP penalty?',
    answer:
      'The highest penalty under the DPDP Act 2023 is up to ₹250 crore, for failure to take reasonable security safeguards to prevent a personal data breach under Section 8(5). Every penalty in the Act is a fixed rupee ceiling the Data Protection Board may impose per violation.',
  },
  {
    question: 'Are DPDP fines based on turnover?',
    answer:
      'No. The DPDP Act sets fixed rupee ceilings per violation rather than a percentage of turnover. The Data Protection Board determines the amount up to the ceiling for the provision that was contravened.',
  },
  {
    question: 'Does the DPDP Act carry criminal liability?',
    answer:
      'No. All penalties under the DPDP Act 2023 are monetary. The Act does not provide for imprisonment.',
  },
  {
    question: 'When does DPDP enforcement begin?',
    answer:
      'The DPDP Rules 2025 were notified on 13 November 2025. Core obligations, including breach notification, take effect on 13 May 2027.',
  },
];

/** Shown at the foot of the page. Not legal advice, and it says so. */
export const LEGAL_DISCLAIMER =
  'This page summarises publicly available provisions of the DPDP Act 2023 for general information and is not legal advice. Consult qualified counsel for your obligations.';
