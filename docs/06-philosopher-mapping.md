# Philosopher Mapping System

How each thinker is placed in the 9-dimension space, and the principles behind the question bank. Canonical vectors live in `lib/data/philosophers.ts`; questions in `lib/data/questions.ts`.

## 1. The 9 dimensions (recap)
`metaphysics` (materialism −1 … idealism +1) · `epistemology` (empiricism/doubt −1 … rationalism +1) · `ethics` (consequentialist −1 … deontology/virtue +1) · `freeWill` (determinism −1 … free will +1) · `meaning` (given/objective −1 … created/absent +1) · `theology` (naturalist −1 … theist +1) · `self` (no-self/flux −1 … substantial self +1) · `politics` (individualist −1 … collectivist +1) · `attachment` (embrace world −1 … renounce +1).

## 2. The 17 philosophers (+ vectors, summarized)
Values are −1..1; only the strong/diagnostic axes are listed (others ≈0). Full arrays in code.

| Philosopher | Tradition | Defining placement | Tribe |
|---|---|---|---|
| **Socrates** | Greek | epistemology −0.6 (know-nothing), ethics +0.5 (virtue), self +0.3, theology +0.2 | Skeptic |
| **Plato** | Greek | metaphysics +0.9 (Forms), epistemology +0.8 (rationalism), self +0.6, meaning −0.6 (objective) | Idealist |
| **Aristotle** | Greek | epistemology −0.2 (empirical-ish), ethics +0.7 (virtue), freeWill +0.4, meaning −0.5 (telos), politics +0.3 | Rationalist |
| **Buddha** | Dharma | self −0.95 (anatta), attachment +0.9 (renounce), metaphysics −0.2, theology −0.3 (non-theist), meaning −0.2 | Dharma Seeker |
| **Nagarjuna** *(hidden)* | Dharma/Mādhyamaka | metaphysics −0.5 (emptiness), self −0.95, epistemology −0.7 (anti-views), attachment +0.6 | Mystic |
| **Shankara** *(hidden)* | Vedānta | metaphysics +0.95 (Brahman), self +0.9 (Atman=Brahman), theology +0.6, attachment +0.7 | Idealist/Mystic |
| **Krishna (Gītā)** | Dharma | ethics +0.8 (duty/dharma), theology +0.8, freeWill +0.3, attachment +0.5 (act without attachment), self +0.5 | Dharma Seeker |
| **Vivekananda** | Vedānta | metaphysics +0.7, theology +0.6, politics +0.4 (service), self +0.6, meaning −0.3 | Idealist |
| **Nietzsche** | Existential | theology −0.95, meaning +0.9 (created), ethics −0.6, politics −0.8, attachment −0.8 (yes to life), metaphysics −0.6 | Existentialist |
| **Kant** | Enlightenment | ethics +0.95 (deontology), epistemology +0.7, freeWill +0.7, theology +0.3, self +0.5 | Rationalist |
| **Hume** | Empiricist | epistemology −0.9, freeWill −0.6 (compatibilist-ish), theology −0.6, self −0.7 (bundle), ethics −0.4 (sentiment) | Skeptic |
| **Descartes** | Rationalist | epistemology +0.85 (cogito), metaphysics +0.6 (dualism), self +0.8, theology +0.5 | Rationalist |
| **Camus** | Existential | meaning +0.8 (absurd, no inherent), theology −0.8, ethics −0.2, attachment −0.6 (revolt, live), freeWill +0.2 | Existentialist |
| **Sartre** | Existential | freeWill +0.95 (radical freedom), meaning +0.85 (create), theology −0.85, self −0.3 (no fixed essence), politics +0.1 | Existentialist |
| **Rawls** | Political | politics +0.7 (justice/fairness), ethics +0.4, freeWill +0.2, meaning −0.2 | Rationalist |
| **Confucius** | Chinese | politics +0.8 (harmony/role), ethics +0.6 (virtue/ritual), self +0.4, attachment −0.2 | Dharma Seeker |
| **Lao Tzu** | Daoist | attachment +0.5 (wu-wei), self −0.4, epistemology −0.5 (anti-conceptual), politics −0.3 (anti-control), metaphysics +0.2 | Mystic |

> The two **hidden** thinkers (Nagarjuna, Shankara) are reachable only via the signature predicates in [05-scoring-algorithm.md](05-scoring-algorithm.md) §7 — they are the "rare drops."

## 3. Authoring principle for vectors
Each placement is a *defensible reading*, not dogma. Rules we followed:
1. **Use the thinker's most diagnostic commitments** — the ones that distinguish them from neighbors (Kant = deontology+autonomy; not "was Kant theist" trivia).
2. **Keep neighbors separable** — Sartre vs Camus differ on `freeWill` & `meaning`-flavor; Buddha vs Nagarjuna on `metaphysics`/`epistemology` extremity; Plato vs Shankara on `theology`/`self`.
3. **Leave soft axes near 0** so the cosine term keys on what each thinker actually emphasized.
4. **Hidden ones are extreme** so they only trigger on strong, coherent signals (rarity feels earned).

## 4. Question bank principles (100+ questions in `lib/data/questions.ts`)
- **Coverage:** every dimension is probed by ≥6 questions; the trolley/evil-demon/experience-machine/Euthyphro-style classics are included because they're maximally diagnostic and shareable.
- **Each question = a dilemma**, phrased as a vivid first-person stake, not a textbook prompt. ("A runaway trolley…" → "Pull the lever to kill one and save five?")
- **Each option maps to a sparse weight vector** over dimensions with a `confidence`.
- **Format mix:** ~70% agree↔disagree sliders (rich signal), ~30% either/or scenarios (punchy, shareable). A few "I refuse / it's complicated" → contributes 0 + aporia flag.
- **18 "core"** questions cover all dimensions and run the default quiz; the remaining are tagged `deep`/`daily`/`battle` and feed the +7 extension, the Daily Dilemma rotation, and Battle prompts.
- **Calibration:** archetype "answer keys" (a pure Kantian, a pure Buddhist…) are committed as fixtures; CI asserts they still map to the intended philosopher whenever vectors/questions change.

## 5. Worked example
A user who: pulls the trolley lever (consequentialist, ethics −), says morality needs no God (theology −), insists *we* create meaning (meaning +), rejects objective purpose, embraces desire/ambition (attachment −), distrusts the herd (politics −) →
`userVector ≈ {ethics −0.5, theology −0.8, meaning +0.8, attachment −0.6, politics −0.6}` → cosine-closest to **Nietzsche**, with **Sartre/Camus** trailing (shared theology/meaning, differ on freeWill/attachment) → blend ≈ *71% Nietzsche, 16% Sartre, 8% Camus*; tribe **Existentialist**; rarity uncommon-rare (extreme on several axes).
