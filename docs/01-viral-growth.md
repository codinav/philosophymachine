# Viral Growth Strategy

The product *is* the growth engine. We don't bolt sharing on at the end — every step manufactures a reason and a moment to pull someone else in.

---

## 1. The viral equation we optimize

```
New users = Existing users × Share rate × Invites per share × Conversion of invitee
K-factor  = (invites sent per user) × (conversion per invite)
Growth is exponential when K > 1.
```

We attack each term:
- **Share rate ↑** — make the *result* the reward; the share card is beautiful and identity-affirming.
- **Invites per share ↑** — compare links and battles are inherently multi-person.
- **Invitee conversion ↑** — every shared artifact links to a *cold-open dilemma*, not a signup wall. The recipient is mid-quiz in one tap.
- **Cycle time ↓** — results in <3 minutes; the loop spins fast.

---

## 2. Share Cards (the hero artifact)

**Formats (auto-generated, server-side via `@vercel/og`):**
- **9:16 (1080×1920)** — Instagram/Snapchat/TikTok Stories, WhatsApp status.
- **1.91:1 (1200×630)** — OG image for link unfurls (X, LinkedIn, Facebook, iMessage, Discord).
- **1:1 (1080×1080)** — Instagram feed.

**Anatomy of the card:**
- Headline identity line: **"I think like Nietzsche."** (or "My worldview is 68% Buddha.")
- Blend bars: top 3 philosophers with %.
- A **signature quote** chosen to match the user's dominant stance.
- **Tribe sigil + name** and tribe color theme.
- **Rarity badge**: "Rarer than 94%."
- Subtle generative **constellation artwork** seeded from the user's answer vector (so two people's cards differ → "what's yours?").
- Footer: `philosophymachine.app` + a short result code (e.g. `/r/NZ7-BD2`) and a tiny QR.

**Why it spreads:** it's a flattering identity claim + a curiosity gap ("what would *I* get?") + visual quality worth posting. The result code in the URL means every unfurl is itself an ad.

**Share targets & deep links:**
- X: pre-filled tweet + OG card.
- WhatsApp / iMessage: text + link (this is where comparison forwards happen).
- Instagram Stories: download 9:16 + "copy caption."
- LinkedIn (the "intellectual flex" channel): 1.91:1 + thought-leadery caption.

---

## 3. Rarity System

Humans over-value scarcity. We compute rarity at **two granularities**:

1. **Primary rarity** — % of all users whose primary philosopher matches yours (common: Aristotle, Stoic-leaning; rare: Nagarjuna, Shankara).
2. **Blend rarity** — how unusual your *exact top-3 blend + intensities* are, via distance from the population centroid (z-score of your vector's local density). This is what lets us say "only 2.1% share your worldview" even for a common primary.

Displayed as: **"You are rarer than 94% of respondents."** Rare results get a visual treatment (glow, "RARE"/"MYTHIC" tag) → status → shares. See math in [05-scoring-algorithm.md](05-scoring-algorithm.md) §6.

**Anti-gaming / honesty:** rarity is recomputed nightly from real distributions (cached). Pre-launch we seed with a hand-tuned prior so early users still get believable numbers.

---

## 4. Philosophy Tribes

Eight archetypes sit *above* the 17 philosophers — a coarser, more tribal identity that's easier to rally around (like Hogwarts houses for worldviews).

| Tribe | Essence | Anchored philosophers | Color |
|---|---|---|---|
| **Rationalist** | Reason is the path to truth | Descartes, Kant, Plato | electric indigo |
| **Empiricist / Skeptic** | Doubt, evidence, suspend judgment | Hume, Socrates | slate cyan |
| **Stoic** | Master the self, accept fate | (Stoic lean of Aristotle/Kant duty) | bronze |
| **Existentialist** | We create our own meaning | Nietzsche, Sartre, Camus | crimson |
| **Idealist** | Mind/spirit is fundamental | Plato, Shankara, Vivekananda | violet |
| **Mystic** | Truth is beyond concepts, found within | Lao Tzu, Shankara, Nagarjuna | aurora green |
| **Hedonist / Vitalist** | Life, joy, and flourishing now | Nietzsche (yes-saying), Epicurean lean | amber |
| **Dharma Seeker** | Duty, liberation, the path | Buddha, Krishna, Confucius | saffron |

Each tribe gets `/tribe/[slug]`: manifesto, population %, famous members, "notable dilemmas where your tribe splits from the rest," and a leaderboard of the tribe's most-aligned philosopher this week. Tribes create **belonging** (retention) and **rivalry** (battles, sharing).

---

## 5. Comparison Mode (the 1:1 referral rocket)

`/compare/[resultA]/[resultB]`

- Headline: **"You and Maya agree on 81% of moral questions."**
- Agreement broken down by dimension (Ethics, Free Will, Meaning, Knowledge, The Divine…).
- "Where you clash hardest" — the single dilemma with the biggest gap, quoted.
- "Your shared philosopher" and "your bridge thinker."
- CTA for the friend who hasn't taken it: a `compare-invite` link that drops them straight into the quiz and auto-compares on completion.

**Why it's the best loop:** comparison is *only* valuable with a second person, so the share is intrinsically motivated and 1:1 (high-trust, high-conversion channels: WhatsApp, iMessage). Couples/best-friends/roommates spread it laterally through a friend graph.

---

## 6. Battle Mode + Gamification (retention engine)

**Battle Mode** — curated head-to-heads:
- "Nietzsche vs Buddha," "Kant vs Krishna," "Camus vs Sartre," "Free will: real or illusion?"
- Global live vote + leaderboard, your vote is colored by *your* result ("87% of Existentialists side with Nietzsche — do you?").
- New marquee battle weekly → recurring return + shareable ("I sided with Buddha, you?").

**Daily Dilemma** — the Wordle habit:
- One dilemma per day, same for everyone globally.
- After you answer: global breakdown + "philosophers who'd agree with you."
- **Streak** counter; missing a day breaks it (loss aversion). Streak milestones = badges.

**Levels & XP:** quiz (+100), daily (+15), battle vote (+5), first share (+50), referral signup (+150). Titles: Initiate → Seeker → Adept → Sage → Oracle.

**Badges (examples):** *First Light* (first result), *Aporia* (5× "I don't know"), *Devil's Advocate* (replay & flip ≥6 answers), *Polymath* (5 philosophers >10%), *Schism* (most-distant compare), *Daily x7 / x30 / x100*.

**Hidden unlocks & secret endings:** see [05-scoring-algorithm.md](05-scoring-algorithm.md) §7 and [06-philosopher-mapping.md](06-philosopher-mapping.md). Rare answer signatures unlock Nagarjuna / Shankara / a "Sphinx" ending. These exist *specifically* to drive replays and "how do I get X?" social search.

---

## 7. Growth Engine — explicit referral loops

| Loop | Trigger | Reward | Channel |
|---|---|---|---|
| **Reveal-share** | Finish quiz | Share card + identity flex | IG/X/LI/WA |
| **Compare-invite** | "Compare with a friend" | Mutual compatibility report | WA/iMessage |
| **Battle-recruit** | Vote in a battle | "Recruit your side" link | X/WA |
| **Unlock-by-referral** | 3 friends complete via your link | Unlock **Deep Dossier** + 1 hidden philosopher | any |
| **Unlock-by-share** | Share your card | Unlock your **shadow philosopher** section | any |
| **Daily-streak nudge** | Streak at risk | Push/email "your streak ends in 3h" | push/email |

**Referral mechanics:** every user gets a code (`/?ref=CODE`). Attribution stored on signup. The "unlock deeper analysis after 3 referrals" reward is intentionally *content* (not currency) — it costs us nothing and the unlocked content is itself shareable.

**Ethics guardrail:** rewards never require *spamming*; we cap nudges, never auto-post, and the rarity/stats are real. Dark patterns kill trust in a "know thyself" product.

---

## 8. Distribution playbook (go-to-market)

1. **Seed in deep communities first** (not mass): r/philosophy, r/Buddhism, r/Stoicism, philosophy X/Bluesky, Hacker News ("Show HN"), Product Hunt. These users *make content* about results.
2. **Creator seeding:** send personalized result breakdowns to philosophy/psychology YouTubers & BookTok/Threads intellectuals. "Battle Mode" is made-for-creator-polls.
3. **Topical SEO moat:** programmatic pages — `nietzsche-vs-buddha`, `am-i-a-stoic`, `philosophy-personality-test`, every philosopher + every battle + every tribe. Each result code is an indexable unfurl.
4. **The "Wrapped" seasonal beat:** "Your Philosophical Year" recap each December (data you already have) → predictable annual spike.
5. **Embeddable mini-dilemma** widget for blogs/Substacks → backlinks + funnel.

---

## 9. Analytics (PostHog) — events we must capture
`quiz_started`, `question_answered` (id, value, ms), `quiz_completed` (duration, dropoffs), `result_revealed` (primary, blend, rarity, tribe), `share_clicked` (channel, format), `share_card_rendered`, `compare_created`, `compare_viewed`, `battle_voted`, `daily_answered` (streak), `unlock_triggered` (type), `referral_signup`, `paywall_viewed`, `subscribe_clicked`, `ai_chat_message`. Funnels: cold-open→complete, complete→share, share→invitee-complete (K-factor), free→paid.
