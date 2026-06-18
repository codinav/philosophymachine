# THE PHILOSOPHY MACHINE

> "Know thyself." — answer 18 dilemmas; discover which philosophers and traditions your worldview matches.

A viral, intellectually-serious self-discovery web app. **16Personalities for your worldview**, with the production value of Spotify Wrapped and the replay loops of Wordle.

You get a result like **"You think like Nietzsche · 73% Nietzsche, 18% Buddha, 9% Camus"**, your **tribe**, your **rarity**, a beautiful **share card**, and the ability to **compare with friends**, **chat with your philosopher**, vote in **battles**, and return for a **daily dilemma**.

---

## Quick start

```bash
npm install
npm run dev            # http://localhost:3000
npm test               # scoring-engine fixtures (11 tests)
npm run build          # production build
```

**No environment variables are required** to run the full core experience — scoring, the quiz, results, share cards, tribes, philosophers, battles, daily dilemma, compare, and a mock AI chat all work out of the box. Add keys from [`.env.example`](.env.example) to enable real AI chat, a database, auth, analytics, and payments.

---

## What's here (MVP)

| Feature | Route | Notes |
|---|---|---|
| Landing + cold-open dilemma | `/` | The Akinator hook — answer before signup |
| The Gauntlet (quiz) | `/quiz` | 18 core dilemmas (`?deep=1` for +7) |
| Reveal + Dossier | `/result/[code]` | SSR for share unfurls; full analysis |
| Share cards | `/api/og/[code]` | 1200×630 / 1080×1920 / square (Satori) |
| Compare | `/compare/[a]/[b]`, `/compare/invite/[code]` | "You agree on 81%" + friend-invite loop |
| Tribes | `/tribes`, `/tribe/[slug]` | 8 archetypes, manifestos, populations |
| Philosophers | `/philosophers`, `/philosopher/[slug]` | 17 thinkers (+2 hidden) |
| Battle Mode | `/battles`, `/battle/[slug]` | Vote, live split, recruit your side |
| Daily Dilemma | `/daily` | Wordle-style streak habit |
| AI chat | `/chat/[philosopher]` | Speak as the philosopher (Anthropic, mock fallback) |
| Dashboard | `/me` | Level, XP, streak, badges, referrals |
| Academy (pricing) | `/academy` | Freemium tiers |
| Methodology | `/about` | The 9 dimensions, transparent scoring |

## Architecture

- **Next.js (App Router) + TypeScript + Tailwind + Framer Motion.** Dark, cinematic, glassmorphic, mobile-first.
- **The scoring engine is a pure, deterministic function** (`src/lib/scoring.ts`) that runs client-side — results appear instantly with zero backend. See [`docs/05`](docs/05-scoring-algorithm.md).
- **Result codes are self-contained** (`src/lib/codec.ts`): they encode the full belief vector, so `/result/[code]`, `/compare`, and share cards render from the URL alone — no DB read on the hot path. This is what lets share/unfurl scale to viral spikes at the CDN edge.
- **Backend is optional and lazy** — Prisma/Postgres ([`prisma/schema.prisma`](prisma/schema.prisma)), Anthropic chat, NextAuth, PostHog, Stripe all degrade gracefully when unconfigured.

```
src/
├─ app/            App Router pages + API routes (incl. /api/og share cards)
├─ components/     quiz/, result/, ui/ + ColdOpen, BattleVote, ChatRoom, DailyDilemma
├─ lib/
│  ├─ data/        questions.ts (118 dilemmas), philosophers.ts (17), tribes.ts (8), battles, priors
│  ├─ scoring.ts   the deterministic 9-dimension engine
│  ├─ rarity.ts · dossier.ts · compare.ts · unlocks.ts · codec.ts · ai.ts · session.ts
└─ types.ts        the shared 9-dimension belief-space contract
tests/             archetype fixtures guard the philosopher mapping
docs/              full product spec (00–08) — strategy, growth, schema, algorithm, roadmap
```

## The full specification

The complete product spec lives in [`docs/`](docs/):

0. [Master product spec & strategy](docs/00-product-spec.md)
1. [Viral growth strategy](docs/01-viral-growth.md)
2. [User journey map](docs/02-user-journey.md)
3. [Information architecture](docs/03-information-architecture.md)
4. [Database schema](docs/04-database-schema.md)
5. [Scoring algorithm](docs/05-scoring-algorithm.md)
6. [Philosopher mapping system](docs/06-philosopher-mapping.md)
7. [Project structure & implementation roadmap (+ V2)](docs/07-roadmap.md)
8. [UI/UX wireframes & design system](docs/08-wireframes.md)

## Roadmap

The MVP delivers the full viral loop (cold-open → quiz → reveal → share → compare/battle/daily/chat). Phase 3 (accounts, Postgres persistence, real rarity distributions, referral attribution) and Phase 4 (Stripe monetization) are specified and scaffolded — see [`docs/07`](docs/07-roadmap.md).

## Deploy

Vercel-native. Set env vars from `.env.example` (none required for the core experience), then `vercel deploy`. Result pages and OG images are immutable-by-code and cache at the edge.
