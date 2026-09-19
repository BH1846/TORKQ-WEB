import type { Post } from '../types';

/**
 * Target term: "shadow AI".
 *
 * Deliberately the demand-side counterpart to the three posts already
 * published: they explain the leak, the architecture and the statute. This one
 * explains why the problem exists inside the organisation at all, which is the
 * question a reader searching "shadow AI" is actually asking.
 *
 * As with the others, no figures. Every claim here is a mechanical
 * consequence of how unmanaged tool adoption works, not a survey finding we
 * would be inventing.
 */
export const post: Post = {
  slug: 'shadow-ai-risk-management',
  title: 'Shadow AI: Why Blocking It Fails and What to Do Instead',
  description:
    'Shadow AI is the unapproved use of AI tools at work. Why bans push it further out of view, what it actually costs you in visibility and evidence, and how to replace prohibition with a governed path.',
  keywords: [
    'shadow AI',
    'shadow AI risk',
    'unapproved AI tools',
    'AI acceptable use policy',
    'AI governance',
    'enterprise AI security',
  ],
  datePublished: '2026-09-19',
  dateModified: '2026-09-19',
  author: 'Torkq Team',
  readingTime: '6 min read',
  tags: ['Shadow AI', 'Governance', 'Policy'],
  body: [
    {
      type: 'paragraph',
      spans: [
        'Shadow AI is what your organisation calls it when someone pastes a customer record into a chatbot you never approved. It is the same phenomenon as shadow IT, with one difference that matters: shadow IT moved files to places you had not sanctioned, while shadow AI moves ',
        { text: 'content', bold: true },
        ' — the text of a contract, a support ticket, a patient note, a block of proprietary code — into a third party\'s systems, one prompt at a time, leaving no artifact behind on your side.',
      ],
    },
    {
      type: 'paragraph',
      spans: [
        'The instinct is to ban it. Publish a policy, block the domains, remind everyone at the next all-hands. That reliably fails, and it is worth being precise about why, because the reason determines what works instead.',
      ],
    },

    { type: 'heading', level: 2, text: 'Why a ban does not hold' },
    {
      type: 'paragraph',
      spans: [
        'A ban assumes the behaviour is optional. It is not. Someone with an afternoon of work and a tool that turns it into twenty minutes will use the tool, and a policy changes only whether they tell you about it.',
      ],
    },
    {
      type: 'paragraph',
      spans: [
        'Domain blocking has the same shape of problem. You can block the obvious web apps, but the capability arrives through every other door at once:',
      ],
    },
    {
      type: 'list',
      items: [
        [
          'Assistants built into tools you already bought — the editor, the ticketing system, the office suite, the browser itself.',
        ],
        [
          'Phones on cellular, which are not on your network and never were.',
        ],
        [
          'API keys an engineer expensed personally, which look like ordinary HTTPS traffic to any egress filter.',
        ],
        [
          'Models running on a laptop, where there is no domain to block at all.',
        ],
      ],
    },
    {
      type: 'paragraph',
      spans: [
        'Each door you close raises the effort slightly and pushes the usage one step further out of view. What you end up with is not less AI use — it is the same use, minus your ability to see it.',
      ],
    },

    {
      type: 'heading',
      level: 2,
      text: 'The real cost is evidence, not the tool',
    },
    {
      type: 'paragraph',
      spans: [
        'Ask what you can actually answer today about a specific piece of personal data. Which employees sent it to a model? Which provider received it? On what date, in what prompt, under whose account? If the honest answer is that you would have to ask people and hope they remember, you do not have a tooling gap. You have an evidence gap.',
      ],
    },
    {
      type: 'paragraph',
      spans: [
        'That gap is what converts an ordinary incident into an unbounded one. When a regulator or a customer asks what happened to their data, "we have a policy prohibiting that" is not a response. Under India\'s Digital Personal Data Protection Act the obligations attach to you as the data fiduciary regardless of which employee used which tool — we go through what the statute actually asks of you in ',
        {
          text: 'DPDP Act compliance for AI',
          href: '/blog/dpdp-act-compliance-for-ai',
        },
        '.',
      ],
    },
    {
      type: 'callout',
      title: 'The test',
      spans: [
        'Pick one customer record. Try to establish, from records you hold today, whether any part of it has ever been sent to a large language model. However long that takes you is the size of the problem, and it does not shrink by writing another policy.',
      ],
    },

    {
      type: 'heading',
      level: 2,
      text: 'Replace prohibition with a better path',
    },
    {
      type: 'paragraph',
      spans: [
        'Shadow AI is a routing problem wearing a compliance costume. People go around you because going through you is slower, and nothing else. So the governed path has to be the fastest one available — not merely permitted, but easier than the alternative.',
      ],
    },
    {
      type: 'paragraph',
      spans: [
        'In practice that means four things, and the order matters:',
      ],
    },
    {
      type: 'list',
      ordered: true,
      items: [
        [
          { text: 'Give people the models they actually want.', bold: true },
          ' A sanctioned tool restricted to a weaker model is a sanctioned tool nobody uses. Route to the frontier providers, and add your own hosted models beside them.',
        ],
        [
          { text: 'Put the control at the egress point.', bold: true },
          ' Detection and masking have to run before the prompt crosses your boundary, or the disclosure has already happened — the argument in full is in ',
          {
            text: 'why on-premise AI gateways matter',
            href: '/blog/on-premise-ai-gateway-data-privacy',
          },
          '.',
        ],
        [
          { text: 'Make it invisible in daily use.', bold: true },
          ' If governance means an extra login, a copy-paste step or a browser extension that breaks weekly, people will route around it exactly as they routed around the ban.',
        ],
        [
          { text: 'Record everything it touches.', bold: true },
          ' Each governed request should leave a tamper-evident entry, so that the next time someone asks what happened to a piece of data, the answer is a record rather than a recollection.',
        ],
      ],
    },
    {
      type: 'paragraph',
      spans: [
        'Do those four and the incentive inverts. The approved route is the one with the good models, no setup and no friction, and the unapproved route is the one where you are on your own with your personal API key. Usage consolidates on the path you can see — not because you forbade the others, but because there is no longer any reason to take them.',
      ],
    },

    { type: 'heading', level: 2, text: 'What this looks like in practice' },
    {
      type: 'paragraph',
      spans: [
        'A control point sits between your teams and every model provider. Employees use a chat interface for everyday work; engineers get issued API keys pointed at the same endpoint. Sensitive values are detected and replaced with tokens on the way out and restored in the reply on the way back, so the work is unaffected and the provider never receives the real values. The mechanics of that exchange are covered in ',
        {
          text: 'how to prevent PII leaks to LLMs',
          href: '/blog/prevent-pii-leaks-to-llms',
        },
        '.',
      ],
    },
    {
      type: 'paragraph',
      spans: [
        'Access is granted per user and per model from one dashboard, provider keys never reach an employee device, and every governed request writes a hash-chained record you can verify on demand. Shadow AI does not get defeated. It gets made pointless.',
      ],
    },
    {
      type: 'paragraph',
      spans: [
        'If you want to see that running against your own traffic patterns, ',
        { text: 'get in touch', href: '/contact' },
        ' — or read the ',
        { text: 'FAQ', href: '/faq' },
        ' for how deployment and masking work.',
      ],
    },
  ],
};
