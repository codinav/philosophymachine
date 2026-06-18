# Information Architecture

## Sitemap
```
/                         Landing + cold-open dilemma
/quiz                     The Gauntlet (core 18 + optional deep 7)
/result/[code]            The Reveal + Dossier (shareable, indexable)
/r/[code]                 Short alias → /result/[code]
/compare/[a]/[b]          Comparison report
/compare/invite/[a]       Friend lands here → quiz → auto-compare
/tribes                   All 8 tribes
/tribe/[slug]             Tribe page (manifesto, %, members, leaderboard)
/philosophers             All 17 philosophers
/philosopher/[slug]       Profile (positions, quotes, "match me")
/battles                  Battle list + leaderboard
/battle/[slug]            Single battle (vote, live results)
/daily                    Daily dilemma + streak
/chat/[philosopher]       AI chat (result-aware)
/me                        Dashboard: results history, streak, level, badges, referrals
/academy                  Premium landing (pricing)
/about                    Methodology & credibility (the philosophy is real)
/auth                      Google OAuth
api/...                    see below
```

## Primary navigation
Minimal during quiz (just progress + exit). Post-result, a bottom tab/segmented bar on mobile: **Result · Compare · Battles · Daily · Me**.

## API surface (Next.js Route Handlers)
```
POST /api/score            answers[] → { code, blend, primary, tribe, rarity, dimensions }
GET  /api/result/[code]    fetch a saved result (for share/compare/SSR OG)
POST /api/result           persist a result, return code
GET  /api/compare          ?a=&b= → comparison payload
POST /api/battle/vote      { battleSlug, side } (rate-limited, dedup by anon id)
GET  /api/battle/[slug]    live tallies
GET  /api/daily            today's dilemma + global stats
POST /api/daily/answer     record answer, update streak
POST /api/chat             { philosopher, messages, resultCode } → streamed reply
GET  /api/og/[code]        share-card image (Satori) — formats via ?fmt=story|og|square
GET  /api/stats            population distributions (for rarity), cached nightly
POST /api/referral         attribute ?ref= on signup
```

## State & data flow
- **Anonymous-first:** answers live in client state + `localStorage`; scoring can run 100% client-side (deterministic, see scoring doc) so the result appears instantly with zero backend dependency. Persisting (`POST /api/result`) is best-effort and enables share/compare/history.
- **Result code** is a stable, URL-safe encoding of the blend + a short id — lets us render share cards and `/result/[code]` even before DB write resolves.
- **Auth is lazy:** required only for chat history, comparison saving, premium, and referrals.

## Content model (logical, see schema doc for tables)
`Question` → `Option` → per-philosopher & per-dimension weights · `Philosopher` · `Tribe` · `Result` · `User` · `Battle`/`BattleVote` · `DailyDilemma`/`DailyAnswer` · `Comparison` · `Subscription` · `Referral` · `Badge`/`UserBadge`.
