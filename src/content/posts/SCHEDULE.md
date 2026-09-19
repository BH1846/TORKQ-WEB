# Blog publishing schedule

**Cadence: exactly one post per week. Published every Friday.**

One per week, not three in a burst and then a quiet month. Search engines
reward a site that keeps adding depth on one subject at a steady rate; they do
not reward a spike followed by silence, and a spike is what the first three
posts were — all three carry `datePublished: 2026-08-13`, then nothing for five
weeks. The queue below exists so that never happens again.

Friday is the slot. If a Friday is missed, the post goes out on the next
working day and the queue does **not** compress — the following week keeps its
own date. Two posts in one week breaks the cadence just as badly as zero.

## Published

| Date | Slug | Target term |
| --- | --- | --- |
| 2026-08-13 | `dpdp-act-compliance-for-ai` | DPDP Act compliance for AI |
| 2026-08-13 | `prevent-pii-leaks-to-llms` | prevent PII leaks to LLMs |
| 2026-08-13 | `on-premise-ai-gateway-data-privacy` | on-premise AI gateway |
| 2026-09-19 | `shadow-ai-risk-management` | shadow AI |

## Queue

Each row is one week. Write the post, set `datePublished` to the date in the
row, ship it, then move the row up into **Published**. Keep at least four weeks
of queue ahead of the current date — refill it when it drops below that, not
when it runs out.

| Date | Working title | Target term | Internal links out to |
| --- | --- | --- | --- |
| 2026-09-25 | Writing an AI acceptable use policy that people actually follow | AI acceptable use policy | shadow-ai, dpdp-act |
| 2026-10-02 | Tokenisation vs redaction vs encryption for LLM prompts | prompt tokenisation | prevent-pii-leaks, on-premise-gateway |
| 2026-10-09 | What a tamper-evident AI audit trail has to prove | AI audit trail | dpdp-act, on-premise-gateway |
| 2026-10-16 | Which PII types actually appear in prompts, and how each is detected | PII detection in prompts | prevent-pii-leaks |
| 2026-10-23 | DPDP Act: what a data fiduciary owes on a deletion request involving AI | DPDP data fiduciary obligations | dpdp-act, audit-trail |
| 2026-10-30 | Routing to multiple model providers without multiplying your risk | multi-provider LLM routing | on-premise-gateway |
| 2026-11-06 | Running an LLM gateway on one node: what the hardware actually needs | self-hosted LLM gateway hardware | on-premise-gateway |
| 2026-11-13 | Governing AI in code editors and CI, not just the chat window | AI governance for developers | shadow-ai, prevent-pii-leaks |

## How to publish one

1. Copy the nearest existing post in this directory as the shape to follow.
   Posts are typed data (`src/content/types.ts`), not JSX or HTML strings.
2. Set `slug`, `title`, `description` (~155 characters), `keywords`,
   `datePublished` and `dateModified` to the queue row's date, `readingTime`
   and `tags`.
3. Add the import and one registry entry in `src/content/posts/index.ts`. That
   single edit is what puts the post on `/blog`, gives it a pre-rendered
   `/blog/<slug>` page and adds it to `sitemap.xml` with the right `<lastmod>`.
4. Link out to at least two existing posts from inside the body, mid-sentence,
   using the `href` field on a span. Contextual internal links are the ones
   that carry weight; a related-posts strip at the foot is not a substitute.
5. `npm run build`. The build fails on a page whose title, canonical or OG tags
   are missing or duplicated, so a broken post cannot ship quietly.
6. Move the row from **Queue** to **Published** in this file.

## House rules

- **No invented numbers.** No survey percentages, no benchmark figures, no
  "companies report a 40% reduction". Nothing we cannot stand behind goes in,
  and there is nothing we have measured yet.
- **One target term per post**, in the title, the description and the first
  paragraph. Two terms in one post means neither ranks.
- Statements about a regulation describe duties that regulation actually
  creates. Statements about Torkq describe controls Torkq actually provides.
  Never say a control satisfies an obligation — only that it supports meeting
  one.
- `dateModified` moves when the substance changes. Not for a typo.
