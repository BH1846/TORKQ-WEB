import type { Post } from '../types';

/**
 * Target term: "DPDP Act compliance for AI".
 *
 * Every statement about the Act describes duties the Act text actually
 * creates. Every statement about TorkQ describes a control it provides. The
 * two are kept separate on purpose — the post never says a control satisfies
 * an obligation, only that it supports meeting one.
 */
export const post: Post = {
  slug: 'dpdp-act-compliance-for-ai',
  title: 'DPDP Act Compliance for AI: What Indian Companies Need to Know',
  description:
    'DPDP Act compliance for AI tools: what the Digital Personal Data Protection Act, 2023 requires of Indian companies whose teams send personal data to LLMs, and the controls that support those obligations.',
  keywords: [
    'DPDP Act compliance for AI',
    'DPDP Act 2023',
    'Digital Personal Data Protection Act',
    'AI governance India',
    'data fiduciary obligations',
    'LLM compliance',
  ],
  datePublished: '2026-08-13',
  dateModified: '2026-08-13',
  author: 'TorkQ Team',
  readingTime: '8 min read',
  tags: ['DPDP Act', 'Compliance', 'AI Governance'],
  body: [
    {
      type: 'paragraph',
      spans: [
        'DPDP Act compliance for AI is now a practical problem rather than a theoretical one. Your team is already pasting customer records into ChatGPT to draft replies, already asking a model to summarise a spreadsheet of employee data, already debugging a production error by handing over a log full of real identifiers. Each of those is a disclosure of personal data to another organisation, and ',
        {
          text: "India's Digital Personal Data Protection Act, 2023",
          bold: true,
        },
        ' does not carve out an exception because the recipient happens to be a model.',
      ],
    },
    {
      type: 'paragraph',
      spans: [
        'This post covers what the Act actually says, which of its duties are engaged the moment a prompt leaves your network, and what a technical control at that boundary can and cannot do for you.',
      ],
    },

    { type: 'heading', level: 2, text: 'What the DPDP Act, 2023 covers' },
    {
      type: 'paragraph',
      spans: [
        'The Act governs the processing of digital personal data — personal data in digital form, or in non-digital form that is subsequently digitised. Personal data is defined broadly: any data about an individual who is identifiable by or in relation to that data. It is worth sitting with that definition, because it is wider than the list of identifiers most people picture. A name attached to a salary figure is personal data. A support ticket describing a customer\'s medical situation is personal data.',
      ],
    },
    {
      type: 'paragraph',
      spans: [
        'The Act assigns roles. A ',
        { text: 'Data Fiduciary', bold: true },
        ' is the person or entity that determines the purpose and means of processing. A ',
        { text: 'Data Processor', bold: true },
        ' processes personal data on a Fiduciary\'s behalf. The individual the data is about is the ',
        { text: 'Data Principal', bold: true },
        '. If your company decides to run customer data through an AI tool, your company is the Data Fiduciary, and the obligations land on you.',
      ],
    },

    { type: 'heading', level: 2, text: 'Which obligations an AI prompt engages' },
    {
      type: 'paragraph',
      spans: [
        'Four duties come into play as soon as personal data goes into a prompt bound for an external provider.',
      ],
    },
    {
      type: 'list',
      items: [
        [
          { text: 'Lawful purpose and notice. ', bold: true },
          'Personal data may be processed only for a lawful purpose, with consent or for certain legitimate uses, and the notice given to the Data Principal has to describe the personal data being collected and the purpose. If your notice describes support and billing, an unannounced new processing purpose is a gap you have to close.',
        ],
        [
          { text: 'Reasonable security safeguards. ', bold: true },
          'A Data Fiduciary must protect the personal data in its possession or under its control by taking reasonable security safeguards to prevent a personal data breach. This is the duty most directly engaged by an ungoverned prompt: data leaving your boundary in plain text, to a destination you have not assessed, is hard to describe as safeguarded.',
        ],
        [
          { text: 'Accountability for processors. ', bold: true },
          'Engaging a Data Processor does not transfer your responsibility. You remain accountable for the personal data you hand over, including to a model provider, and the engagement is meant to rest on a contract.',
        ],
        [
          { text: 'Breach notification. ', bold: true },
          'In the event of a personal data breach, the Data Fiduciary must notify the Data Protection Board and each affected Data Principal. To do that you need to know what was disclosed and to whom — which is a records problem before it is a legal one.',
        ],
      ],
    },
    {
      type: 'callout',
      title: 'The part that catches people out',
      spans: [
        'Retention and erasure duties do not stop at your own systems. When consent is withdrawn or the purpose is no longer being served, personal data is to be erased — and the Fiduciary is expected to cause its Processor to erase it too. Data sitting in a third-party provider\'s prompt history is inside that scope, and you generally cannot reach in and delete it.',
      ],
    },

    { type: 'heading', level: 2, text: 'Why AI tools make this harder than ordinary vendors' },
    {
      type: 'paragraph',
      spans: [
        'You already have a process for onboarding a vendor: a review, a contract, a defined data flow. AI tools slip past it for three reasons.',
      ],
    },
    {
      type: 'paragraph',
      spans: [
        'The first is that adoption is individual. Nobody procures ChatGPT for the support team; a support agent opens a browser tab. There is no vendor review because, procedurally, there is no vendor.',
      ],
    },
    {
      type: 'paragraph',
      spans: [
        'The second is that the data is unstructured. Your database has a column marked as personal data. A prompt is free text, and the personal data is somewhere in the middle of a paragraph, next to a question about tone of voice. Controls that work on fields do not work on prose.',
      ],
    },
    {
      type: 'paragraph',
      spans: [
        'The third is retention. Once a prompt is submitted, what happens to it is governed by the provider\'s policy and plan, not yours. Retention windows vary between consumer and enterprise tiers and change over time. We cover the mechanics in ',
        {
          text: 'How to Prevent PII Leaks When Your Team Uses ChatGPT and Other LLMs',
          href: '/blog/prevent-pii-leaks-to-llms',
        },
        '. The relevant point here is that a duty you hold is being discharged under terms you do not set.',
      ],
    },

    {
      type: 'heading',
      level: 2,
      text: 'Where a control point helps with DPDP Act compliance for AI',
    },
    {
      type: 'paragraph',
      spans: [
        'If prompts are going to leave, the useful place to intervene is the boundary they leave through. Route AI traffic through a single gateway you operate and that gateway can act on every request, rather than depending on each person remembering a policy.',
      ],
    },
    {
      type: 'heading',
      level: 3,
      text: 'Masking supports the security-safeguards duty',
    },
    {
      type: 'paragraph',
      spans: [
        'A gateway that inspects the prompt can find identifiers by their structure — Aadhaar, PAN, GSTIN, bank and UPI details, payment cards — and find the things with no fixed structure, such as names and organisations, by entity recognition. Replacing those values with opaque tokens before the request is forwarded means what reaches the provider carries placeholders rather than personal data, and the reply is restored on the way back so the work still gets done. That is a safeguard applied at the point of disclosure, which is the point that matters.',
      ],
    },
    {
      type: 'heading',
      level: 3,
      text: 'Access control narrows the exposure',
    },
    {
      type: 'paragraph',
      spans: [
        'Granting model access per user or group, with provider keys held centrally rather than scattered across employee laptops, gives you something you can actually revoke. It also makes the set of destinations personal data can reach a decision you made, rather than a consequence of which tool somebody signed up for.',
      ],
    },
    {
      type: 'heading',
      level: 3,
      text: 'An audit trail supports accountability and notification',
    },
    {
      type: 'paragraph',
      spans: [
        'Both the accountability duty and the breach-notification duty assume you can say what happened. A hash-chained record of every governed request — where each entry incorporates a hash of the one before it, so a later alteration breaks the chain — is a record you can put in front of someone. An ordinary log that can be edited without trace is a weaker thing to rely on.',
      ],
    },

    { type: 'heading', level: 2, text: 'What a tool cannot do for you' },
    {
      type: 'paragraph',
      spans: [
        'No product makes you DPDP compliant, and any vendor saying otherwise is selling you a problem. The Act imposes duties on your organisation as a Data Fiduciary, and most of them are not technical. Your lawful basis for processing, the notices and consent flows you present, your retention schedule, your grievance-redressal mechanism, how you handle a Data Principal exercising their rights — none of these are things software decides.',
      ],
    },
    {
      type: 'paragraph',
      spans: [
        'What a gateway does is close one specific and otherwise wide-open gap: personal data leaving your organisation in a prompt, uninspected, unlogged and unrestricted. It supports obligations. It does not discharge them, and there is no certification to point at.',
      ],
    },

    { type: 'heading', level: 2, text: 'A practical sequence' },
    {
      type: 'list',
      ordered: true,
      items: [
        [
          'Find out what is actually happening. Which teams use which AI tools, on what data. This is usually more than anyone expects.',
        ],
        [
          'Classify by the Act\'s definition, not by intuition. Free-text fields — tickets, notes, transcripts — carry more personal data than structured tables.',
        ],
        [
          'Consolidate onto a single egress path, so there is one place where policy can be enforced.',
        ],
        [
          'Mask before egress, so a prompt that does leave carries tokens rather than personal data.',
        ],
        [
          'Record what was sent, in a form that stays credible if it is ever questioned.',
        ],
        [
          'Align notices, retention and the rest of your programme. The technical control is one input to that work, not a substitute for it.',
        ],
      ],
    },
    {
      type: 'paragraph',
      spans: [
        'Where the gateway runs matters for step four in particular: inspection has to happen before the network boundary, not after. That argument is made in full in ',
        {
          text: 'Why On-Premise AI Gateways Matter for Data Privacy',
          href: '/blog/on-premise-ai-gateway-data-privacy',
        },
        '.',
      ],
    },
    {
      type: 'paragraph',
      spans: [
        'TorkQ is an on-premise AI governance gateway built for this boundary — detection and masking before prompts leave, per-user model access, and a tamper-evident audit trail. You can see it work on a real prompt on the ',
        { text: 'TorkQ homepage', href: '/' },
        '.',
      ],
    },
    {
      type: 'callout',
      title: 'Not legal advice',
      spans: [
        'This post describes the DPDP Act, 2023 in general terms to explain where a technical control fits. It is not legal advice, and how the Act applies to your organisation depends on facts specific to you. Read it alongside qualified counsel, not instead of.',
      ],
    },
  ],
};
