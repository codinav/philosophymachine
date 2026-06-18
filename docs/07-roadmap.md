# Project Structure & Implementation Roadmap

## 1. Folder structure
```
the-philosophy-machine/
├─ docs/                         # this specification (00–08)
├─ prisma/
│  └─ schema.prisma              # Postgres schema (matches 04-database-schema.md)
├─ public/
│  ├─ fonts/                     # display + UI fonts for Satori share cards
│  └─ og/                        # static OG fallbacks
├─ src/
│  ├─ app/                       # Next.js App Router
│  │  ├─ layout.tsx              # fonts, theme, starfield, analytics
│  │  ├─ page.tsx                # landing + cold open
│  │  ├─ quiz/page.tsx           # the Gauntlet
│  │  ├─ result/[code]/page.tsx  # reveal + dossier (SSR for OG)
│  │  ├─ r/[code]/route.ts       # short-link redirect
│  │  ├─ compare/[a]/[b]/page.tsx
│  │  ├─ tribes/page.tsx · tribe/[slug]/page.tsx
│  │  ├─ philosophers/page.tsx · philosopher/[slug]/page.tsx
│  │  ├─ battles/page.tsx · battle/[slug]/page.tsx
│  │  ├─ daily/page.tsx
│  │  ├─ chat/[philosopher]/page.tsx
│  │  ├─ me/page.tsx · academy/page.tsx · about/page.tsx
│  │  └─ api/                    # route handlers (see 03-IA §API)
│  │     ├─ score/route.ts · result/route.ts · result/[code]/route.ts
│  │     ├─ compare/route.ts · battle/vote/route.ts · battle/[slug]/route.ts
│  │     ├─ daily/route.ts · chat/route.ts · stats/route.ts
│  │     └─ og/[code]/route.tsx  # Satori share-card image
│  ├─ components/
│  │  ├─ quiz/ (DilemmaCard, IntensitySlider, ConstellationProgress)
│  │  ├─ result/ (BlendBars, RarityBadge, TribeSigil, Dossier, ShareSheet)
│  │  ├─ ui/ (GlassCard, Button, Starfield, RevealSequence, Portrait)
│  │  └─ layout/ (Nav, BottomTabs)
│  ├─ lib/
│  │  ├─ data/  questions.ts · philosophers.ts · tribes.ts · battles.ts · priors.ts · quotes.ts
│  │  ├─ scoring.ts            # pure score() — the algorithm
│  │  ├─ rarity.ts · tribes.ts(assign) · unlocks.ts
│  │  ├─ codec.ts              # result-code encode/decode
│  │  ├─ analytics.ts          # PostHog wrapper
│  │  ├─ ai.ts                 # philosopher chat prompts (Anthropic)
│  │  └─ db.ts                 # Prisma client (lazy, optional in dev)
│  ├─ types.ts                 # shared TS types (Dimension, Question, Result…)
│  └─ styles/globals.css
├─ tests/  scoring.test.ts (archetype fixtures), codec.test.ts
├─ .env.example
├─ tailwind.config.ts · next.config.mjs · tsconfig.json · package.json
└─ README.md
```

## 2. Build phases (what "done" means at each)
**Phase 0 — Foundations (this MVP):** types, data (questions/philosophers/tribes/priors), pure `score()`, rarity, tribe assign, unlocks, codec + tests. *Done = `score()` passes archetype fixtures.*

**Phase 1 — Core loop UI (this MVP):** landing cold-open → quiz → reveal → dossier → share sheet, all client-side & deterministic, beautiful + animated, mobile-first. *Done = a user can go cold-open→shareable result with zero backend.*

**Phase 2 — Distribution (this MVP):** `/api/og` share cards (Satori), `/result/[code]` SSR + OG meta, compare page, tribes & philosopher pages, battles (local/seeded), daily dilemma + streak (localStorage), AI chat route (Anthropic, graceful mock fallback). *Done = every viral loop has a working surface.*

**Phase 3 — Backend (post-MVP, scaffolded here):** Prisma + Postgres, persist results, real distributions for rarity, Google OAuth (NextAuth), referral attribution, PostHog wired, rate limits. *Done = results/streaks/battles persist across devices.*

**Phase 4 — Monetization:** Stripe, paywall on Deep Report / unlimited chat / PDF / compatibility, referral unlocks. *Done = a user can subscribe and unlock.*

## 3. MVP scope (delivered in this repo)
- ✅ Full deterministic scoring engine + 100+ question bank + 17 philosophers + 8 tribes + rarity + tribe + hidden unlocks.
- ✅ Cinematic client flow: landing → quiz → reveal → dossier → share.
- ✅ Server-rendered shareable result pages with generated OG/Story cards.
- ✅ Compare, tribes, philosophers, battles, daily, AI-chat surfaces (chat & battles work locally; degrade gracefully without API keys/DB).
- ✅ Prisma schema, API routes, `.env.example`, analytics hooks, tests.

## 4. V2 roadmap (post-MVP)
1. **Accounts & cross-device** (OAuth) + results history + "have you changed?" retake diff.
2. **Real-time battles & global leaderboards** (websockets / edge KV), weekly marquee battle, tribe-vs-tribe wars.
3. **AI mentor with memory** (premium): philosopher remembers your result + past chats; "growth roadmap" generated and tracked over weeks.
4. **Relationship compatibility** deep report + couples gifting.
5. **PDF report** generation (server) + giftable links.
6. **Localization** (i18n) — huge for India/SEA/LatAm given the Dharma traditions; RTL.
7. **More traditions** (Spinoza, Simone Weil, de Beauvoir, Wittgenstein, Confucian neo-Confucians, Advaita depth, Sufi, Stoic canon) + a "modes/schools" mode beyond single thinkers.
8. **Philosophical Year (Wrapped)** seasonal campaign.
9. **Native share extensions / app** if web K-factor proves out.
10. **Trust & methodology page** with academic advisors; publish the mapping openly to earn credibility (and backlinks).

## 5. Engineering notes / scaling to 10M
- Scoring is **client-side & O(questions × philosophers)** — effectively free; no server bottleneck on the hot path.
- Result pages & OG images are **cacheable at the edge** by `code` (immutable) → CDN absorbs viral spikes.
- Writes (results, votes, daily) are append-mostly → fine for Postgres + read replicas; hot counters (battle tallies, daily splits) in Redis/edge-KV, flushed periodically.
- AI chat is the only expensive call → gated (3/day free), streamed, cached system prompts.
- Stateless API routes on Vercel scale horizontally; DB is the only stateful tier.
