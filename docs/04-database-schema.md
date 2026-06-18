# Database Schema (PostgreSQL)

Designed for: anonymous-first results, cheap reads of share/compare pages, and aggregate stats for rarity. The canonical machine-readable version is `prisma/schema.prisma`.

## Entity overview
```
User 1───* Result *───1 Tribe
User 1───* Referral (as referrer / as referred)
User 1───1 Subscription
User *───* Badge (via UserBadge)
Result *──1 (primaryPhilosopher) Philosopher   (philosophers/tribes are seeded reference data, can live in code or DB)
Battle 1──* BattleVote
DailyDilemma 1──* DailyAnswer
Comparison ──> resultA, resultB
```

## Tables

### users
| col | type | notes |
|---|---|---|
| id | uuid pk | |
| email | text unique nullable | null for anon |
| name | text | |
| image | text | OAuth avatar |
| anon_id | text index | cookie/device id, links pre-auth activity |
| referral_code | text unique | their share code |
| referred_by | uuid fk users nullable | attribution |
| level | int default 1 | |
| xp | int default 0 | |
| streak_count | int default 0 | |
| streak_last_day | date nullable | |
| created_at / updated_at | timestamptz | |

### results
| col | type | notes |
|---|---|---|
| id | uuid pk | |
| code | text unique index | URL-safe short code in share links |
| user_id | uuid fk nullable | null for anon |
| anon_id | text index | |
| answers | jsonb | `[{questionId, value, intensity, ms}]` (auditable, replayable) |
| blend | jsonb | `[{philosopherId, pct}]` sorted desc |
| primary_philosopher | text | slug |
| tribe | text | slug |
| dimensions | jsonb | `{ethics: -0.4, freeWill: 0.8, ...}` normalized −1..1 |
| rarity_pct | real | "rarer than X%" (0–100) |
| rarity_tier | text | common/uncommon/rare/mythic |
| unlocked | text[] | hidden philosophers / endings unlocked |
| is_deep | bool | took the +7 extension |
| created_at | timestamptz | |

Indexes: `(primary_philosopher)`, `(tribe)`, `(created_at)`, GIN on `blend` for distribution queries.

### philosophers  *(reference — also mirrored in `lib/data/philosophers.ts`)*
slug pk · name · tradition · era · color (hex) · sigil · short_bio · signature_quote · dimension_vector jsonb (−1..1 per dimension) · tribe (slug) · rarity_floor (for hidden ones) · reading[] .

### tribes *(reference)*
slug pk · name · essence · color · sigil · manifesto · anchor_philosophers[] .

### battles
slug pk · title · side_a (philosopher slug) · side_b · prompt · is_active · starts_at · ends_at · votes_a int · votes_b int (denormalized counters).

### battle_votes
id pk · battle_slug fk · side · voter_anon_id · voter_result_code nullable (so we can break votes down by tribe) · created_at. Unique `(battle_slug, voter_anon_id)`.

### daily_dilemmas
date pk (one per day) · question_id · published bool. Optionally denormalized `agg jsonb` of the running answer split.

### daily_answers
id pk · date fk · anon_id · user_id nullable · value · created_at. Unique `(date, anon_id)`.

### comparisons
id pk · code unique · result_a (code) · result_b (code) · agreement_pct · created_at. (Cache of computed comparisons for fast share pages.)

### subscriptions
id pk · user_id fk · plan (free/academy_monthly/academy_yearly) · status · provider (stripe) · current_period_end · created_at.

### referrals
id pk · referrer_user_id fk · referred_user_id fk nullable · referred_anon_id · code · status (clicked/completed) · created_at. Drives "3 referrals → unlock."

### badges / user_badges
badges: slug pk · name · description · icon · rarity.
user_badges: user_id · badge_slug · earned_at · unique `(user_id, badge_slug)`.

## Aggregate / stats (for rarity & global splits)
A materialized view or nightly job populates `philosopher_distribution(primary_philosopher, count, pct)` and a sampled centroid for blend-rarity. Cached in Redis/edge for `/api/stats`. Pre-launch seeded with a hand-tuned prior in `lib/data/priors.ts`.

## Privacy
- Anonymous by default; `answers` are pseudonymous (anon_id).
- Right-to-delete cascades from `users`; anon results expire after N days if never claimed.
- No raw answers in share payloads — only the derived blend/dimensions.
