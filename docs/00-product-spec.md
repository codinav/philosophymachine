# THE PHILOSOPHY MACHINE — Master Product Specification

> "Know thyself." — inscribed at the Temple of Apollo at Delphi

A viral, intellectually-serious web experience that tells you **which philosophers and spiritual traditions your worldview matches** — then turns that identity into something you want to share, defend, and explore.

---

## 1. Product Strategy

### 1.1 The one-line pitch
**16Personalities for your *worldview*, with the production value of Spotify Wrapped and the replay loops of Wordle.**

### 1.2 Why this wins
Three durable human drives power every viral self-discovery product:

| Drive | Used by | How we use it |
|---|---|---|
| **Identity** ("who am I?") | 16Personalities, Co-Star | A *result identity* ("I think like Nietzsche") that is flattering, complex, and tribal |
| **Curiosity** ("what's the answer?") | Akinator, Wordle | A "machine" that *reads your mind* and reveals a non-obvious truth |
| **Status / Rarity** ("I'm special") | Spotify Wrapped, GeoGuessr ranks | Percentile rarity + hidden unlocks + tribes |

Most "philosophy quizzes" fail on **production quality** (they look like SurveyMonkey) and **depth** (results are generic). We win by being *both* beautiful and genuinely rigorous — the analysis has to feel like it actually understood you.

### 1.3 Positioning
- **Not** a personality test (we don't reduce you to 4 letters).
- **Not** edutainment fluff. The mapping is built on real positions in epistemology, metaphysics, ethics, and theology.
- We are a **mirror**: the product's job is to make you feel *seen* and then give you language and a tribe for what you already half-believed.

### 1.4 Target audiences (concentric rings)
1. **Seed ring — "intellectually vain" sharers:** philosophy/psychology students, r/philosophy, X intellectuals, Stoicism & Buddhism communities, Notion/PKM crowd. They share because the result is a *flex*.
2. **Growth ring — self-discovery natives:** the 16Personalities / astrology / Enneagram audience (huge, female-skewing, highly shareable).
3. **Mass ring — "fun + deep" casuals:** people who'll never read Kant but love "Are you more Buddha or Nietzsche?" as a WhatsApp forward.

### 1.5 Core loop (the engine of everything)
```
Provoked (dilemma) → Reflect → Reveal identity → Feel rare/seen
        → Share (card) → Friend takes it → Compare → Replay/Unlock
```
Every feature in this doc exists to tighten one arrow in that loop.

### 1.6 Success metrics (North Star + guardrails)
- **North Star: Weekly Shared Results** (a result that gets at least one outbound share or comparison). It couples *value delivered* with *distribution*.
- Quiz **completion rate** ≥ 75% (Wordle-grade). Guardrail against length/abandonment.
- **K-factor** ≥ 0.5 at launch, target ≥ 1.0 (each user brings ~1 more).
- **D1 / D7 / D30 retention** via daily dilemma + streaks.
- **Share rate** (results that produce a share action) ≥ 35%.
- Free→paid conversion 2–4% (industry-normal freemium).

---

## 2. The Experience (high level)

1. **Cold open** — a single provocative dilemma on the landing page *before any signup*. You answer, the machine reacts, you're hooked. (This is the Akinator "it's already reading me" hook.)
2. **The Gauntlet** — 18 dilemmas (core set), each a cinematic full-screen card. Slider or binary + intensity. Live "the machine is thinking" feedback.
3. **The Reveal** — a Spotify-Wrapped-style animated sequence building suspense, ending on your **primary philosopher**, your blend ("73% Nietzsche, 18% Buddha, 9% Camus"), your **Tribe**, and your **Rarity**.
4. **The Dossier** — deep personality analysis: your stances per dimension, tensions/contradictions, "your shadow philosopher," recommended reading.
5. **The Spread** — share card, compare link, battle votes, AI chat with your philosopher, daily dilemma to come back.

See [02-user-journey.md](02-user-journey.md) for the full map.

---

## 3. Viral Mechanics (summary — full detail in [01-viral-growth.md](01-viral-growth.md))

- **Share Cards:** auto-generated, gorgeous, 1080×1920 (Stories) + 1200×630 (OG/Twitter) + square. Contain identity line, blend bars, signature quote, tribe sigil, rarity, and a QR/short link. Generated server-side with `@vercel/og` (Satori) so they render in link unfurls.
- **Rarity System:** "You are rarer than 94% of respondents." Computed from the rarity of your *exact blend*, not just primary. Drives status-sharing.
- **Tribes:** 8 archetypal tribes (Rationalist, Mystic, Stoic, Existentialist, Idealist, Skeptic, Hedonist, Dharma Seeker). Each has a page, color system, sigil, population %, and a manifesto.
- **Comparison Mode:** `/compare/[a]/[b]` — "You and Maya agree on 81% of moral questions," with a per-dimension diff. The single strongest 1:1 referral driver (WhatsApp/iMessage).
- **Battle Mode:** "Nietzsche vs Buddha" head-to-heads, global vote, live leaderboard. Evergreen content + low-effort sharing + recurring reason to return.
- **AI Philosopher Chat:** talk to Buddha/Nietzsche/Kant/etc., primed with *your* result. Retention + premium hook + screenshot-shareable.

---

## 4. Gamification (summary — see [01-viral-growth.md](01-viral-growth.md) §6)

- **Daily Dilemma** — one new dilemma/day, global stats ("62% chose to lie"), streak counter. The Wordle habit loop.
- **Streaks** — consecutive days answering the daily dilemma.
- **Philosophy Levels** — XP from quizzes, dailies, battles, chats → titles (Initiate → Seeker → Adept → Sage → Oracle).
- **Achievement Badges** — e.g. *Aporia* (answer "I don't know" 5×), *Devil's Advocate* (flip an answer on replay), *Polymath* (match 5+ philosophers above 10%).
- **Hidden Philosopher Unlocks** — rare/extreme answer signatures unlock secret results (e.g. **Nagarjuna** at <0.3% — extreme anti-essentialist + skeptic + non-dual pattern). Creates a "gotta-get-the-rare-one" replay drive.
- **Secret Endings** — fully consistent/contradictory answer patterns trigger special reveals ("The Sphinx" — you refused to commit on everything).

---

## 5. Monetization (Freemium — see §7 of [01-viral-growth.md](01-viral-growth.md))

**Free:** full quiz, primary result + blend, tribe, rarity, basic dossier, share cards, daily dilemma, 3 AI chat messages/day.

**Premium ("The Academy" — ~$6/mo or $39/yr):**
- **Deep Psychological Report** — long-form, per-dimension, with tensions and growth edges.
- **AI Philosopher Mentor** — unlimited chat, multiple philosophers, memory of your result.
- **Philosophical Growth Roadmap** — a guided reading + reflection path tailored to your shadow side.
- **Downloadable PDF Report** — beautiful, giftable.
- **Relationship Compatibility Analysis** — deep 2-person report (great gift / couples hook).
- **All hidden philosophers & past results history.**

One-time upsells: gift a report, "decode your partner."

---

## 6. Deliverables index
| # | Deliverable | Where |
|---|---|---|
| 1 | Product strategy | this doc |
| 2 | Viral growth strategy | [01-viral-growth.md](01-viral-growth.md) |
| 3 | User journey map | [02-user-journey.md](02-user-journey.md) |
| 4 | Information architecture | [03-information-architecture.md](03-information-architecture.md) |
| 5 | Database schema | [04-database-schema.md](04-database-schema.md) |
| 6 | Scoring algorithm | [05-scoring-algorithm.md](05-scoring-algorithm.md) |
| 7 | Philosopher mapping | [06-philosopher-mapping.md](06-philosopher-mapping.md) |
| 8 | Question bank (100+) | code: `lib/data/questions.ts` + [06-philosopher-mapping.md](06-philosopher-mapping.md) |
| 9 | UI/UX wireframes | [08-wireframes.md](08-wireframes.md) |
| 10 | Project folder structure | [07-roadmap.md](07-roadmap.md) §1 |
| 11 | Implementation roadmap | [07-roadmap.md](07-roadmap.md) |
| 12 | MVP | this repo (runnable) |
| 13 | V2 roadmap | [07-roadmap.md](07-roadmap.md) §4 |
| 14 | Production-ready code | this repo |

---

## 7. Design language (see [08-wireframes.md](08-wireframes.md) for full system)
- **Mood:** "a planetarium for the mind." Deep space charcoal/ink backgrounds, a single luminous accent per philosopher, glass surfaces, generous negative space.
- **Type:** a high-contrast serif display (Playfair/Fraunces vibe) for philosophy quotes + identity lines; a clean grotesk (Inter/Geist) for UI. Big, confident type.
- **Motion:** Framer Motion. Page transitions are *dissolves*, not slides. The reveal is a *constellation forming*. Nothing bounces gratuitously — it should feel like Arc/Linear, not a kids' quiz.
- **Glassmorphism:** used sparingly on cards over a subtle animated starfield/grain.
- **Dark mode is the default and the brand.** A light mode exists for share-card legibility.
- **Mobile-first:** the entire quiz is one-thumb operable.
