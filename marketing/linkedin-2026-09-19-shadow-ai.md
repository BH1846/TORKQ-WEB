# LinkedIn post — week of 2026-09-19

**Status:** ready to post. I can't publish to LinkedIn from here — paste this
into the company page composer, attach the images described below, and hit
post.

**Angle:** the problems Torkq solves, told from the inside of a working day
rather than from a product page. No stats, because we have none we can stand
behind, and a made-up percentage is the fastest way to lose a technical
audience.

---

## Post copy

> Somebody on your team pasted a customer's full record into a chatbot this
> week.
>
> Not maliciously. They had forty support tickets, a deadline, and a tool that
> turns an afternoon into twenty minutes. Name, phone number, Aadhaar, the lot
> — straight into a text box, because that was the fastest way to do the job
> they were asked to do.
>
> I've stopped calling that a training problem. Training is what you reach for
> when you believe people are making a mistake. They aren't. They're making a
> trade, and from where they're sitting it's a good one.
>
> The part that should worry you isn't the paste. It's what happens next:
>
> → You don't know it happened.
> → You can't say which provider received it, or when.
> → If that customer asks you next month what you did with their data, your
> honest answer is "we'll have to ask around."
>
> Three things we kept running into, over and over, talking to teams about
> this:
>
> **1. Banning the tools doesn't remove the tools.** It removes your view of
> them. The assistant is already inside the editor, the ticketing system and
> the browser. There's a phone on cellular in every pocket. Every door you
> close moves the usage one step further out of sight.
>
> **2. "We mask PII" doesn't mean what people assume.** If the masking runs on
> someone else's servers, the prompt reached them in the clear to get masked.
> The disclosure already happened — you just changed who it happened to.
>
> **3. A log isn't evidence.** An auditor asking what happened to one specific
> record doesn't want a filtered export you assembled yesterday. They want a
> record that can't have been quietly edited after the fact.
>
> So we built Torkq around a boring premise: make the governed path the
> *fastest* path, and the shadow route stops being worth taking.
>
> It sits on your own hardware, between your team and every model provider.
> Sensitive values get swapped for tokens before the prompt leaves your
> network, and restored in the reply on the way back — the model gets a
> usable prompt, never the real values. You decide who reaches which models
> from one dashboard. Every request leaves a hash-chained entry you can verify
> on demand.
>
> Nobody has to change how they work. That's the whole point. The moment
> governance adds a login or a copy-paste step, people route around it exactly
> the way they routed around the ban.
>
> We wrote up the longer argument — why prohibition fails and what actually
> replaces it — here: www.torkq.com/blog/shadow-ai-risk-management
>
> If your honest answer to "has this customer's data ever reached an LLM?" is
> "we'd have to ask around", I'd genuinely like to hear how you're thinking
> about it.
>
> #AIGovernance #DataPrivacy #ShadowAI #DPDPAct #EnterpriseAI #LLM

---

## Images

LinkedIn shows the first image at full width in feed; a carousel (PDF
document post) gets more dwell time than a single image but takes longer to
make. Either works — pick one.

**Option A — single image (fastest).**
A screenshot of the exposure scanner on torkq.com mid-result: the prompt on
the left with Aadhaar, email and phone highlighted, the exposure score
visible. It is a real screen of a real thing, which reads as far more honest
than stock art. Crop to 1200×627. Alt text: "Torkq scanning a support ticket
and flagging an Aadhaar number, an email address and a phone number before the
prompt reaches a model."

**Option B — four-slide carousel.**
1. The line "Somebody on your team pasted a customer record into a chatbot
   this week." White on black, Space Grotesk, the bird mark bottom-left.
2. The four doors shadow AI comes through — editor, ticketing system, phone on
   cellular, personal API key — as four labelled tiles.
3. The flow diagram from the homepage: prompt → endpoint → Torkq gateway →
   LLM, with the masked value called out on the leg that leaves the network.
4. Plain CTA slide: "See it run on your own traffic — www.torkq.com/contact".

**Do not use:** stock photography of padlocks, glowing brains, or a hooded
figure at a keyboard. That imagery signals "vendor post" before the first line
is read, which costs more reach than it buys.

## Notes for whoever posts it

- Post from a **personal profile** and reshare from the company page, not the
  other way round. Reach on personal posts is materially better, and the
  first-person voice above is written for a person, not a brand account.
- Best slots are Tuesday–Thursday morning, IST.
- Put nothing in the first two lines that reads as marketing — the hook is
  what decides whether the "see more" gets clicked.
- The blog link is in the body rather than the first comment on purpose. The
  "link in comments" tactic is well past its usefulness and now reads as a
  tell.
- Reply to every comment in the first hour. That is the single biggest lever
  on how far the post travels.
