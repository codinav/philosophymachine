# Scoring Algorithm

Goals: **deterministic** (same answers → same result, runs client-side instantly), **interpretable** (we can explain *why* you got Nietzsche), **stable** (no wild swings from one answer), and **expressive** (produces a believable blend + rarity).

## 1. The dimension space
Every belief is projected onto **9 philosophical dimensions**, each a signed scalar in `[-1, 1]`:

| key | axis (−1 … +1) |
|---|---|
| `metaphysics` | materialism … idealism/spirit |
| `epistemology` | empiricism/doubt … rationalism/innate truth |
| `ethics` | consequentialist … deontological/virtue |
| `freeWill` | determinism … libertarian free will |
| `meaning` | meaning is given/objective … meaning is created/absent |
| `theology` | athe/naturalist … theist/divine |
| `self` | self is illusion/flux … self is real/substantial |
| `politics` | individualist … collectivist/harmony |
| `attachment` | embrace desire/world … renounce/transcend |

These 9 dimensions are the lingua franca: **questions write to them, philosophers are points in this space, the dossier reads from them.**

## 2. Questions → dimension vector
Each answer option carries a sparse `weights` map over dimensions, e.g. an option might be `{ ethics: +0.8, freeWill: -0.3 }`.

A question is answered with a **value** `v ∈ [-1, 1]` (slider: strongly disagree → strongly agree) — binary questions just use ±1, and "I refuse / it's complicated" contributes **0** (and flags an `aporia` count).

For each answered question, contribution to dimension *d*:
```
contribution_d = v * weight_d * questionConfidence
```
`questionConfidence` (0.5–1.5) lets us up-weight sharp, diagnostic dilemmas (trolley, evil-demon) and down-weight soft ones.

Accumulate, then **normalize per dimension** by the total possible weight touched on that dimension so users who saw different question subsets are comparable:
```
userVector_d = clamp( Σ contribution_d / Σ|weight_d * conf| , -1, 1 )
```
Result: `userVector ∈ [-1,1]^9`.

## 3. Philosophers as points
Each philosopher has a hand-authored `dimensionVector ∈ [-1,1]^9` (see `lib/data/philosophers.ts`, justified in [06-philosopher-mapping.md](06-philosopher-mapping.md)). Example (Nietzsche): `metaphysics −0.7, epistemology −0.3, ethics −0.6 (anti-deontology), freeWill +0.4, meaning +0.9 (created), theology −0.95, self +0.2, politics −0.8, attachment +0.8`.

## 4. Matching → blend
Compute similarity of `userVector` to each philosopher. We use **cosine-shifted weighted distance** combining direction and magnitude:

```
raw_i  = w_cos * cosineSim(user, phil_i) + w_dist * (1 - normEuclid(user, phil_i))
```
- `cosineSim` rewards *agreeing on what matters* (direction in belief-space).
- `(1 - normEuclid)` rewards *intensity match* (a lukewarm user shouldn't max-match an extremist).
- Defaults `w_cos = 0.65`, `w_dist = 0.35`.
- **Dimension salience weighting:** dimensions where the user is far from 0 count more (you care about them), via multiplying each term by `(0.5 + |user_d|)`.

Shift raw scores to be non-negative, apply a **softmax with temperature τ≈0.55** to convert to a probability-like blend, then take the top components:
```
blend_i = softmax(raw / τ)   →   keep components ≥ 3%, renormalize, round to %.
```
This yields **"73% Nietzsche, 18% Buddha, 9% Camus."** Temperature controls how "decisive" results feel — lower τ = more lopsided (better for a punchy headline), tuned so the median primary lands ~55–75%.

## 5. Tribe assignment
Two-path, take the stronger signal:
1. **By primary:** the primary philosopher's `tribe`.
2. **By centroid:** nearest tribe centroid (mean of anchor philosophers' vectors) to `userVector`.
If they disagree, prefer the centroid when its margin is decisive, else the primary's tribe (keeps headline + tribe coherent). Store both `tribe` and `tribeConfidence`.

## 6. Rarity
- **Primary rarity** = `1 - popShare(primary)` → "your primary is shared by X%."
- **Blend rarity (the headline number)** = percentile of your vector's *atypicality*: distance from the population centroid normalized by population spread (a Mahalanobis-style z). Higher z = rarer.
  - `rarityPct = 100 * P(z_population < z_user)` → "rarer than 94%."
  - Pre-launch: population centroid/spread come from `lib/data/priors.ts` (hand-tuned from the philosopher cloud + expected human skew toward common positions). Post-launch: nightly job over real `results`.
- **Tier** thresholds: <60 common · 60–85 uncommon · 85–96 rare · ≥96 mythic. Tier drives card styling.

## 7. Hidden unlocks & secret endings (signatures)
Evaluated as boolean predicates over `userVector` + answer meta:
- **Nagarjuna** (mythic, ~0.3%): `metaphysics < -0.3 AND self < -0.6 AND epistemology < -0.4 AND attachment > 0.4` — radical anti-essentialism + emptiness + skepticism. Only surfaces if you'd otherwise be near Buddha/Skeptic.
- **Shankara** (rare): `metaphysics > 0.7 AND self > 0.6 AND theology > 0.3 AND attachment > 0.5` — non-dual idealism.
- **The Sphinx** (ending): `aporiaCount ≥ 6` (refused to commit) → "You answered the machine with riddles."
- **The Zealot** (ending): variance of |v| very low and all extreme → "Total conviction."
- **The Polymath** (badge): ≥5 philosophers >10% in blend.
Unlocks are appended to `result.unlocked` and can gate UI (e.g. show hidden portrait only if unlocked, else a locked silhouette → replay incentive).

## 8. Consistency / "the machine is thinking"
During the quiz we track running contradiction: if two answers push the *same* dimension hard in opposite directions, surface a live callout ("You just contradicted question 3…"). Purely UX flavor — it does **not** change scoring (which is order-independent and deterministic).

## 9. Determinism & testing
Pure function `score(answers, questions, philosophers, priors) → ResultPayload`. No randomness, no time dependence. Unit tests assert: (a) archetype answer sets map to expected primaries (a "pure Kantian" key → Kant), (b) blend sums ~100%, (c) monotonicity (pushing a dimension harder never decreases the matching philosopher's share), (d) symmetry/comparison agreement is commutative.
