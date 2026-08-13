/**
 * The FAQ, as the single source for both the visible accordion and the
 * FAQPage JSON-LD.
 *
 * That sharing is the whole point of this file. Google requires the structured
 * data to match the on-page text; maintaining two copies guarantees they drift
 * and drift is a manual-action risk. The page renders `answer` and the JSON-LD
 * serialises the same array, so they cannot disagree.
 *
 * Answers are plain strings, not spans, for the same reason — a link inside an
 * answer would render as markup on the page but flatten in the JSON-LD, and
 * the two would no longer match character for character.
 *
 * Every answer is grounded in what TorkQ actually does (see the key-features
 * and comparison sections) or in the text of the DPDP Act. No metrics, no
 * certifications, no benchmark claims.
 */

export interface FaqItem {
  question: string;
  /** One or more paragraphs. Rendered in order; joined with a single space for JSON-LD. */
  answer: string[];
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is an AI governance gateway?',
    answer: [
      'An AI governance gateway is a control point that sits between the people and applications in your organisation and the large language models they use. Instead of each user or service calling a model provider directly, every request passes through one endpoint you operate.',
      'Because all traffic flows through a single place, that place can enforce policy: inspecting prompts for sensitive data before they leave the network, deciding which users are allowed to reach which models, holding provider credentials centrally instead of on employee devices, and recording what was asked. TorkQ is this kind of gateway. It runs no inference of its own — it governs the requests on their way to the models that do.',
    ],
  },
  {
    question: 'How does TorkQ stop sensitive data reaching ChatGPT or other LLMs?',
    answer: [
      'TorkQ inspects the prompt before it is forwarded to a provider. Detection runs in two tiers: pattern signatures for values with a known structure, such as identifiers, payment card numbers and API keys, and named-entity recognition for things that have no fixed format, such as person and organisation names.',
      'Values that are found are replaced with opaque tokens, so what leaves your network is a prompt with placeholders where the sensitive values were. The model receives a prompt it can still work with, but never receives the real values. When the reply comes back, TorkQ restores the original values in place of the tokens before the user sees it, so the answer reads normally.',
    ],
  },
  {
    question: 'What is the DPDP Act and how does TorkQ help with compliance?',
    answer: [
      "India's Digital Personal Data Protection Act, 2023 governs the processing of digital personal data. It places duties on the Data Fiduciary — the entity that determines the purpose and means of processing — including processing personal data only for a lawful purpose, implementing reasonable security safeguards to prevent personal data breaches, remaining accountable for personal data handed to a Data Processor, and notifying the Data Protection Board and affected Data Principals of a breach.",
      'Sending a prompt containing personal data to an external model provider is a disclosure of that data to another party, and it is the kind of processing those duties cover. TorkQ helps you meet specific obligations rather than discharging them for you: masking personal data before it leaves your network is a reasonable security safeguard, per-user model access control limits who can disclose data to which provider, and the tamper-evident audit trail gives you a record of what was sent that supports your accountability and breach-notification duties.',
      'TorkQ is not a certification and does not make you compliant on its own. Compliance depends on your lawful basis, your notices and consent flows, your retention practice and your wider security posture. TorkQ is a technical control that supports those obligations at the point where prompts leave your organisation.',
    ],
  },
  {
    question: 'Does TorkQ run on-premise? Where is my data processed?',
    answer: [
      'Yes. TorkQ is designed to run on your own infrastructure — on-premise on ordinary server hardware, or in your own private cloud. It is a single-node deployment with low storage and compute requirements, so it does not need a datacenter to stand up.',
      'Detection, masking and the audit trail all execute inside your environment, which means prompts are inspected before they cross your network boundary rather than after. Your provider keys are held by the gateway you control. Data still reaches an external model provider if you route a request to one, but it reaches them already masked, and you decide which providers are reachable at all.',
    ],
  },
  {
    question: 'What personal data types can TorkQ detect?',
    answer: [
      'Detection covers structured identifiers, credentials and unstructured entities. Structured identifiers include Indian Aadhaar, PAN, GSTIN, bank IFSC codes, UPI payment IDs and mobile numbers; Gulf identifiers including Emirates ID, Saudi Iqama and National ID and Qatar QID; payment card numbers, IBAN bank accounts, US Social Security numbers, email addresses and IP addresses.',
      'Credentials and secrets include provider API keys, GitHub access tokens, AWS access key IDs, Slack tokens, JSON Web Tokens, PEM private keys and URLs with embedded passwords, alongside a high-entropy check that catches secrets with no fixed format.',
      'Unstructured detection covers person and organisation names, compensation details, health and medical information and legal or contractual clauses. Anything specific to your organisation that these do not cover is defined once as policy and enforced from then on.',
    ],
  },
  {
    question: 'How is TorkQ different from a DLP tool or an API proxy?',
    answer: [
      'A traditional DLP tool watches channels like email, endpoints and file transfer, and generally decides whether to allow or block. It has no notion of a prompt, and blocking is its main lever, which for AI use means either stopping the work or letting the data through.',
      'An API proxy forwards requests and can handle routing, keys and rate limits, but it treats the prompt as an opaque payload. It does not know that a string inside a JSON body is an Aadhaar number.',
      'TorkQ works at the level of the prompt itself. It reads the content, tokenises the sensitive values, forwards a usable prompt and restores the values in the reply, so the work continues rather than being blocked. It also does the things a proxy does — multi-provider routing across cloud APIs and your own model servers, centrally held keys, per-user access — and adds a hash-chained audit record of every governed request.',
    ],
  },
  {
    question: 'What is a tamper-evident audit trail?',
    answer: [
      'A tamper-evident audit trail is a record built so that altering it after the fact is detectable. In TorkQ, each entry is hash-chained to the one before it: every record incorporates a hash of its predecessor, so changing or removing an earlier entry breaks the chain from that point onward.',
      'This is different from an ordinary log, which can be edited or truncated without leaving a trace. It does not prevent someone with sufficient access from modifying records, but it does mean the modification cannot be hidden — chain continuity can be verified on demand, and records are visible per user in the admin dashboard.',
    ],
  },
  {
    question: 'Can I use my own model provider keys?',
    answer: [
      'Yes. You register your own provider API keys with the gateway, and TorkQ uses them to forward requests. The keys are held centrally by the gateway rather than distributed to employee devices, which means access can be revoked in one place instead of chased across laptops.',
      'You can register your own model servers alongside cloud provider APIs and route requests across both. Users and applications reach them through TorkQ — a chat interface for everyday use, and issued API keys for IDEs, scripts and internal tools — and the same governance applies on both paths.',
    ],
  },
];
