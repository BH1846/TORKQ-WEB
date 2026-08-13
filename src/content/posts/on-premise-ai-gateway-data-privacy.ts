import type { Post } from '../types';

/**
 * Target term: "on-premise AI gateway".
 *
 * The argument here is architectural — where inspection runs relative to the
 * network boundary — so it can be made without any performance or cost
 * figures, which is fortunate, because we have none to quote.
 */
export const post: Post = {
  slug: 'on-premise-ai-gateway-data-privacy',
  title: 'Why On-Premise AI Gateways Matter for Data Privacy',
  description:
    'An on-premise AI gateway inspects and masks prompts before they cross your network boundary. Why that placement decides whether a privacy control actually prevents disclosure or merely relocates it.',
  keywords: [
    'on-premise AI gateway',
    'AI gateway data privacy',
    'self-hosted LLM gateway',
    'data residency AI',
    'AI governance gateway',
    'private cloud AI',
  ],
  datePublished: '2026-08-13',
  dateModified: '2026-08-13',
  author: 'TorkQ Team',
  readingTime: '7 min read',
  tags: ['On-Premise', 'Architecture', 'Data Privacy'],
  body: [
    {
      type: 'paragraph',
      spans: [
        'An on-premise AI gateway matters for data privacy because of one question that sounds like an implementation detail and is not: at what point, relative to your network boundary, does the inspection happen? Two products can describe themselves identically — "we detect and mask sensitive data in prompts" — and differ completely on whether your personal data ever leaves your control.',
      ],
    },
    {
      type: 'paragraph',
      spans: [
        'If masking runs on someone else\'s infrastructure, the prompt has to reach that infrastructure in the clear to be masked. The disclosure already happened. You have not prevented it; you have moved it to a company with a better privacy page.',
      ],
    },

    { type: 'heading', level: 2, text: 'Trace the prompt' },
    {
      type: 'paragraph',
      spans: [
        'Follow a single prompt containing a customer\'s name and Aadhaar number under two architectures.',
      ],
    },
    {
      type: 'heading',
      level: 3,
      text: 'Hosted inspection: two disclosures instead of one',
    },
    {
      type: 'paragraph',
      spans: [
        'The prompt leaves the employee\'s browser in full, crosses your boundary in the clear, and arrives at the vendor. The vendor finds the Aadhaar number, tokenises it, forwards a masked prompt to the model provider, restores the value in the reply and sends it back.',
      ],
    },
    {
      type: 'paragraph',
      spans: [
        'The model provider never saw the Aadhaar number — that part works. But the vendor did, in full, along with every other prompt your organisation sends. You have introduced a second processor with visibility over all of it, and you now depend on their retention, their access controls and their breach handling for data you are accountable for. You have also handed them the tokenisation mapping, which is the one artifact that reverses the whole scheme.',
      ],
    },
    {
      type: 'heading',
      level: 3,
      text: 'On-premise inspection: the value never leaves',
    },
    {
      type: 'paragraph',
      spans: [
        'The prompt reaches a gateway on your own hardware, inside your boundary. Detection runs there. The Aadhaar number is replaced with a token there. What crosses the boundary is a prompt carrying a placeholder. The reply comes back, the gateway restores the value on your side, and the user sees a normal answer.',
      ],
    },
    {
      type: 'paragraph',
      spans: [
        'The real value was never transmitted anywhere. Not to the model provider, not to a governance vendor. The mapping between token and value stayed on a machine you own, and so did the audit record. There is exactly one disclosure boundary to reason about, and it is one you control.',
      ],
    },
    {
      type: 'callout',
      title: 'The question to ask a vendor',
      spans: [
        'Not "do you mask PII?" — everyone says yes. Ask: on whose hardware does the detection run, and where is the token-to-value mapping stored? The answers determine whether the personal data left your organisation, and no amount of encryption in transit changes them.',
      ],
    },

    { type: 'heading', level: 2, text: 'What this means for your obligations' },
    {
      type: 'paragraph',
      spans: [
        'Under ',
        {
          text: "India's DPDP Act, 2023",
          href: '/blog/dpdp-act-compliance-for-ai',
        },
        ', a Data Fiduciary must take reasonable security safeguards to prevent a personal data breach, and remains accountable for personal data handed to a processor. Both are easier to satisfy when the set of parties holding the data in the clear is smaller.',
      ],
    },
    {
      type: 'list',
      items: [
        [
          { text: 'Fewer processors to account for. ', bold: true },
          'Each additional party that sees personal data in the clear is another engagement to contract for, assess and stand behind. On-premise inspection removes one entirely.',
        ],
        [
          { text: 'Erasure you can actually perform. ', bold: true },
          'When data is to be erased, you can erase what sits on your own hardware. Data in a third party\'s prompt history is a request, not an action.',
        ],
        [
          { text: 'Breach scope you can determine. ', bold: true },
          'Notification duties assume you can establish what was disclosed. That is a different exercise when the record is yours than when you are waiting on a vendor\'s incident report.',
        ],
        [
          { text: 'Residency that holds. ', bold: true },
          'If data is meant to stay in a jurisdiction, an inspection hop through infrastructure elsewhere is a transfer, whatever the marketing says.',
        ],
      ],
    },

    { type: 'heading', level: 2, text: 'The objections, honestly' },
    { type: 'heading', level: 3, text: '"On-premise means running infrastructure"' },
    {
      type: 'paragraph',
      spans: [
        'It does, and that is a real cost. But the shape of the workload is modest: a gateway forwards requests and inspects text, it does not run inference. Detection is pattern matching and entity recognition over prompt-sized inputs, and the storage is an audit trail of text records. This is a single-node deployment on ordinary server hardware, not a cluster and not a datacenter. If you already run anything internally, you can run this.',
      ],
    },
    { type: 'heading', level: 3, text: '"We are cloud-only"' },
    {
      type: 'paragraph',
      spans: [
        'On-premise in this argument means "infrastructure under your control", not "a rack in your office". A gateway in your own private cloud account keeps the same property that matters: inspection happens inside your boundary, and no third party sees prompts in the clear. What you are avoiding is a multi-tenant service operated by someone else, not virtualisation.',
      ],
    },
    { type: 'heading', level: 3, text: '"Does this lock us into one model provider?"' },
    {
      type: 'paragraph',
      spans: [
        'It should do the opposite. A gateway that registers several cloud provider APIs and your own model servers side by side, and routes across them, is the thing that makes providers swappable — applications talk to your endpoint, and switching is a routing decision rather than a code change in every integration.',
      ],
    },

    {
      type: 'heading',
      level: 2,
      text: 'What an on-premise AI gateway buys you beyond masking',
    },
    {
      type: 'paragraph',
      spans: [
        'Once the control point is inside your boundary, other things become straightforward that are awkward otherwise.',
      ],
    },
    {
      type: 'paragraph',
      spans: [
        { text: 'Keys stop being scattered. ', bold: true },
        'Provider credentials live on the gateway rather than on employee devices, so access can be granted per user or group and revoked in one place instead of being chased across laptops.',
      ],
    },
    {
      type: 'paragraph',
      spans: [
        { text: 'The audit trail is yours. ', bold: true },
        'A hash-chained record, where each entry incorporates a hash of the one before it so any later alteration breaks the chain, is evidence you hold and can verify — not an export you request from a vendor.',
      ],
    },
    {
      type: 'paragraph',
      spans: [
        { text: 'Policy fits your organisation. ', bold: true },
        'Standard identifier types are detected out of the box, but internal identifiers, project code names and other values specific to you are defined once as policy. That is a much easier conversation when the policy runs on your own machine.',
      ],
    },
    {
      type: 'paragraph',
      spans: [
        { text: 'One path for humans and machines. ', bold: true },
        'A chat interface for everyday use and issued API keys for IDEs, scripts and internal tools mean the same governance applies to the requests nobody is watching. The mechanics of those paths are covered in ',
        {
          text: 'How to Prevent PII Leaks When Your Team Uses ChatGPT and Other LLMs',
          href: '/blog/prevent-pii-leaks-to-llms',
        },
        '.',
      ],
    },

    { type: 'heading', level: 2, text: 'The summary' },
    {
      type: 'paragraph',
      spans: [
        'Privacy controls are only as good as their placement. Inspection downstream of your boundary is a control over what the model provider sees, which is worth something — but it is not a control over whether your personal data left your organisation, because by then it has. Inspection upstream of the boundary is the version where the sensitive value genuinely never leaves.',
      ],
    },
    {
      type: 'paragraph',
      spans: [
        'TorkQ is built for that placement: an on-premise AI governance gateway running on your own server or private cloud, masking before egress, holding your keys, and keeping a tamper-evident record on your side of the line. See how it works on the ',
        { text: 'TorkQ homepage', href: '/' },
        '.',
      ],
    },
  ],
};
