import type { Post } from '../types';

/**
 * Target term: "prevent PII leaks" / "PII leaks to LLMs".
 *
 * The failure modes described here are mechanical properties of how prompts
 * and retention work, not survey findings. Nothing in this post is a measured
 * claim, because we have no measurements to stand behind.
 */
export const post: Post = {
  slug: 'prevent-pii-leaks-to-llms',
  title: 'How to Prevent PII Leaks When Your Team Uses ChatGPT and Other LLMs',
  description:
    'How to prevent PII leaks to LLMs: why prompts carry personal data out of your network, why blocking and training fail, and how detection and tokenisation at the egress point stop the leak without stopping the work.',
  keywords: [
    'prevent PII leaks',
    'PII leaks to LLMs',
    'ChatGPT data leak',
    'PII detection',
    'prompt data masking',
    'AI data loss prevention',
  ],
  datePublished: '2026-08-13',
  dateModified: '2026-08-13',
  author: 'TorkQ Team',
  readingTime: '7 min read',
  tags: ['PII', 'Data Protection', 'LLM Security'],
  body: [
    {
      type: 'paragraph',
      spans: [
        'To prevent PII leaks when your team uses ChatGPT and other LLMs, you have to accept an unpleasant premise first: the leak is not an attack. Nobody is exfiltrating anything. A support agent pastes a customer email to get help drafting a reply, and the customer\'s name, address and order history leave the building in the process. The mechanism is an employee doing their job well with a tool that happens to send text to someone else\'s servers.',
      ],
    },
    {
      type: 'paragraph',
      spans: [
        'That framing matters, because it rules out most of the responses that come to mind first.',
      ],
    },

    { type: 'heading', level: 2, text: 'How PII actually gets into a prompt' },
    {
      type: 'paragraph',
      spans: [
        'It helps to be concrete about the paths, because they are not the ones a security review usually looks at.',
      ],
    },
    {
      type: 'list',
      items: [
        [
          { text: 'Pasted context. ', bold: true },
          'The most common by a distance. A ticket, an email thread, a CV, a contract clause, a row from a spreadsheet — pasted in wholesale because trimming it first would defeat the point of asking.',
        ],
        [
          { text: 'Debugging payloads. ', bold: true },
          'A developer pastes a failing request or a stack trace. Production payloads contain production data, and often an API key or token in a header.',
        ],
        [
          { text: 'Documents and screenshots. ', bold: true },
          'File upload and vision features mean a scanned identity document or a screenshot of an admin panel goes across as easily as text.',
        ],
        [
          { text: 'Application integrations. ', bold: true },
          'An internal tool that calls a model API on the user\'s behalf. Nobody thinks of this as an AI tool, so nobody reviews what it puts in the prompt.',
        ],
        [
          { text: 'Agents and IDE assistants. ', bold: true },
          'Tooling that reads files or queries a database and includes what it finds as context. The person asking never sees what was attached to their question.',
        ],
      ],
    },
    {
      type: 'paragraph',
      spans: [
        'Only the first two involve a human deciding to include the data. The rest happen underneath the person, which is why an approach resting on individual judgement can only ever cover part of the problem.',
      ],
    },

    { type: 'heading', level: 2, text: 'Why the data does not come back' },
    {
      type: 'paragraph',
      spans: [
        'Once a prompt is submitted, what happens to it is governed by the provider\'s terms and your plan tier, not by your policy. Consumer and enterprise tiers differ, retention windows differ between providers, and terms change. Some providers retain prompts for a period for abuse monitoring even where they are not used for training.',
      ],
    },
    {
      type: 'paragraph',
      spans: [
        'The point is not that any particular provider handles data badly. It is that the decision has moved. Your obligations around that data did not move with it — under ',
        {
          text: "India's DPDP Act, 2023",
          href: '/blog/dpdp-act-compliance-for-ai',
        },
        ', engaging a processor does not transfer your accountability, and erasure duties extend to data you have handed on. Data sitting in a third party\'s prompt history is difficult to erase on request.',
      ],
    },

    { type: 'heading', level: 2, text: 'Why the obvious fixes do not hold' },
    { type: 'heading', level: 3, text: 'Blocking the domains' },
    {
      type: 'paragraph',
      spans: [
        'Blocking AI tools at the firewall is the fastest control to deploy and the fastest to route around. People move to a phone, a personal laptop, a different provider, or one of the many products that quietly embed a model. The traffic leaves your visibility rather than stopping, which is strictly worse than governing it: you now have the same disclosures and no record of them.',
      ],
    },
    { type: 'heading', level: 3, text: 'Training and policy' },
    {
      type: 'paragraph',
      spans: [
        'Necessary, and not sufficient. A policy that says "do not paste customer data into AI tools" asks a person under time pressure to notice that the paragraph they are pasting contains personal data, every time, correctly. It also does nothing about the paths where the data is attached automatically.',
      ],
    },
    { type: 'heading', level: 3, text: 'Traditional DLP' },
    {
      type: 'paragraph',
      spans: [
        'DLP tooling watches channels — email, endpoints, file transfer — and its lever is allow or block. It has no concept of a prompt, and blocking is the wrong shape of response here anyway: the agent still needs their reply drafted. A control that stops the work will be worked around.',
      ],
    },
    { type: 'heading', level: 3, text: 'An API proxy' },
    {
      type: 'paragraph',
      spans: [
        'A proxy centralises keys and routing, which is genuinely useful, but it treats the request body as opaque. It does not know that a string in the middle of a JSON field is an Aadhaar number.',
      ],
    },

    {
      type: 'heading',
      level: 2,
      text: 'What actually works to prevent PII leaks: mask at the egress point',
    },
    {
      type: 'paragraph',
      spans: [
        'The approach that holds up is to route AI traffic through one gateway you operate, and have that gateway rewrite the prompt before it is forwarded. Two properties make it work where the others fail: it applies to every request regardless of who sent it, and it lets the request through.',
      ],
    },
    { type: 'heading', level: 3, text: 'Detection in two tiers' },
    {
      type: 'paragraph',
      spans: [
        'Sensitive values split into two kinds, and they need different treatment. Values with a known structure — Aadhaar, PAN, GSTIN, IFSC, UPI IDs, Emirates ID, Iqama, QID, payment cards, IBANs, US Social Security numbers, email addresses, IP addresses — can be matched on their pattern, with checksum validation where the format provides one to keep false positives down. Credentials fall in the same tier: provider API keys, GitHub tokens, AWS access key IDs, Slack tokens, JWTs, PEM private keys, URLs with an embedded password, plus a high-entropy check for secrets with no fixed shape.',
      ],
    },
    {
      type: 'paragraph',
      spans: [
        'The second tier is what patterns cannot reach. A person\'s name has no format. Neither does an organisation, a salary discussion, a medical detail or a contractual clause. These need named-entity recognition, and they are the values most likely to be sitting in a pasted ticket.',
      ],
    },
    { type: 'heading', level: 3, text: 'Tokenisation, not redaction' },
    {
      type: 'paragraph',
      spans: [
        'This is the part that decides whether people keep using the control. If you strip the values out, the model loses the thread — it cannot write "Dear Ms Rao" if it never saw a name, and it cannot reason about a record whose fields are blanked. So instead of deleting values, replace each one with an opaque token, forward a prompt that is still coherent, and restore the real values in the reply on the way back.',
      ],
    },
    {
      type: 'paragraph',
      spans: [
        'The user gets a normal answer. The provider never held the personal data. Nobody had to choose between doing their job and following policy, which is the choice that breaks every control that tries to make it.',
      ],
    },
    {
      type: 'callout',
      title: 'Where the inspection runs',
      spans: [
        'Masking only helps if it happens before the data crosses your network boundary. A hosted service that inspects prompts on someone else\'s infrastructure has moved the disclosure rather than prevented it — the personal data still left, it just left to a different company. See ',
        {
          text: 'Why On-Premise AI Gateways Matter for Data Privacy',
          href: '/blog/on-premise-ai-gateway-data-privacy',
        },
        '.',
      ],
    },
    { type: 'heading', level: 3, text: 'Cover the non-interactive paths' },
    {
      type: 'paragraph',
      spans: [
        'The integrations and agents matter as much as the chat window. Issuing API keys for IDEs, scripts and internal tools that route through the same gateway means the same detection and masking apply where no human is present to exercise judgement — which is exactly where judgement was never going to be available.',
      ],
    },
    { type: 'heading', level: 3, text: 'Keep the record' },
    {
      type: 'paragraph',
      spans: [
        'You want to be able to answer "what did we send, and when" without qualification. A hash-chained audit trail, where each entry incorporates a hash of its predecessor so a later edit breaks the chain, gives an answer that holds up under questioning in a way an editable log does not.',
      ],
    },

    { type: 'heading', level: 2, text: 'Where to start' },
    {
      type: 'list',
      ordered: true,
      items: [
        ['Map the real paths — chat tools, embedded features, internal integrations, agent tooling.'],
        ['Give people one sanctioned route that is genuinely easier than the alternatives, or they will use the alternatives.'],
        ['Turn on detection for structured identifiers and credentials first; they are unambiguous and the checksums keep noise low.'],
        ['Add entity detection for names, organisations and the other unstructured categories.'],
        ['Add your own organisation-specific values — internal identifiers, project code names — as policy.'],
        ['Then narrow model access per user and group, once the traffic is visible enough to know what to narrow.'],
      ],
    },
    {
      type: 'paragraph',
      spans: [
        'TorkQ does this at the egress point, on your own infrastructure. The ',
        { text: 'homepage demo', href: '/#demo' },
        ' runs the detection on a prompt you type and shows what would have been masked before it left.',
      ],
    },
  ],
};
