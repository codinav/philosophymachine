import type { Question } from '@/types';

// ─────────────────────────────────────────────────────────────────────────
// QUESTION BANK — 110 dilemmas. (Deliverable #8: minimum 100.)
//
// Conventions (see docs/05 & docs/06):
//  • SLIDER: one `agree` option. Answer value v∈[-1,1]; contribution = v·weights·conf.
//    weights are the direction of AGREEING with the statement.
//  • BINARY: two options. options[0] = "no/left", options[1] = "yes/right".
//    The CHOSEN option's weights apply at full strength (they encode direction).
//  • Dimension signs:
//    metaphysics +idealism/-materialism · epistemology +rationalism/-empiricism
//    ethics +deontology·virtue/-consequentialist · freeWill +free/-determined
//    meaning +created·absent/-given·objective · theology +theist/-atheist
//    self +substantial/-no-self · politics +collectivist/-individualist
//    attachment +renounce/-embrace-world
//  • Tags: 'core' (default 18-Q run) · 'deep' (+7 extension) · 'daily' · 'battle'.
// ─────────────────────────────────────────────────────────────────────────

export const QUESTIONS: Question[] = [
  // ── CORE 18 — covers every dimension, includes the famous diagnostics ──
  {
    id: 'q-trolley',
    prompt:
      'A runaway trolley will kill five people. You can pull a lever to divert it onto a track where it will kill one. Do you pull it?',
    format: 'binary',
    tags: ['core', 'battle'],
    confidence: 1.4,
    options: [
      { id: 'no', label: "No — I won't kill anyone with my own hand", weights: { ethics: 0.8 } },
      { id: 'yes', label: 'Yes — five lives outweigh one', weights: { ethics: -0.85 } },
    ],
    reaction: 'A classic fork. The utilitarians and the Kantians are watching closely.',
  },
  {
    id: 'q-lie-save-life',
    prompt: 'It is acceptable to lie if doing so saves an innocent life.',
    format: 'slider',
    tags: ['core', 'daily'],
    confidence: 1.2,
    options: [{ id: 'agree', label: 'Agree', weights: { ethics: -0.7 } }],
    reaction: 'Kant would not approve. The consequentialists nod.',
  },
  {
    id: 'q-god-morality',
    prompt: 'Morality can exist fully without any God.',
    format: 'slider',
    tags: ['core', 'battle'],
    confidence: 1.2,
    options: [{ id: 'agree', label: 'Agree', weights: { theology: -0.8, ethics: -0.1 } }],
    reaction: 'A line that has divided philosophers for millennia.',
  },
  {
    id: 'q-free-will',
    prompt: 'I have genuine free will — my choices are truly mine, not just the output of prior causes.',
    format: 'slider',
    tags: ['core', 'battle'],
    confidence: 1.3,
    options: [{ id: 'agree', label: 'Agree', weights: { freeWill: 0.85 } }],
    reaction: 'The determinists raise an eyebrow.',
  },
  {
    id: 'q-consciousness-physical',
    prompt: 'Consciousness is ultimately nothing more than physical processes in the brain.',
    format: 'slider',
    tags: ['core'],
    confidence: 1.2,
    options: [{ id: 'agree', label: 'Agree', weights: { metaphysics: -0.8 } }],
    reaction: 'Materialists and idealists, take your corners.',
  },
  {
    id: 'q-experience-machine',
    prompt:
      'A machine can give you a lifetime of perfect, blissful experiences — but none of it is real. Would you plug in forever?',
    format: 'binary',
    tags: ['core', 'battle'],
    confidence: 1.3,
    options: [
      { id: 'no', label: 'No — I want reality, even if it hurts', weights: { meaning: -0.3, attachment: -0.2, metaphysics: 0.1 } },
      { id: 'yes', label: 'Yes — happiness is happiness', weights: { ethics: -0.5, meaning: 0.2, attachment: -0.3 } },
    ],
    reaction: 'Nozick designed this trap. Truth, or comfort?',
  },
  {
    id: 'q-meaning-created',
    prompt: 'Life has no built-in meaning; any meaning it has is meaning we create ourselves.',
    format: 'slider',
    tags: ['core', 'battle'],
    confidence: 1.3,
    options: [{ id: 'agree', label: 'Agree', weights: { meaning: 0.85, theology: -0.3 } }],
    reaction: 'The existentialists lean in.',
  },
  {
    id: 'q-self-illusion',
    prompt: 'The "self" is ultimately an illusion — there is no fixed, unchanging "you" underneath your changing experiences.',
    format: 'slider',
    tags: ['core'],
    confidence: 1.3,
    options: [{ id: 'agree', label: 'Agree', weights: { self: -0.85 } }],
    reaction: 'The Buddha smiles. Descartes objects.',
  },
  {
    id: 'q-suffering-growth',
    prompt: 'Suffering is necessary for genuine growth and depth.',
    format: 'slider',
    tags: ['core', 'daily'],
    confidence: 1.0,
    options: [{ id: 'agree', label: 'Agree', weights: { attachment: -0.2, meaning: 0.2, ethics: 0.1 } }],
    reaction: '"What does not kill me…" — but the Buddhists seek the end of suffering, not its glorification.',
  },
  {
    id: 'q-reason-over-feeling',
    prompt: 'When reason and emotion conflict, I should trust reason.',
    format: 'slider',
    tags: ['core'],
    confidence: 1.1,
    options: [{ id: 'agree', label: 'Agree', weights: { epistemology: 0.7 } }],
    reaction: 'Hume insisted reason is the slave of the passions.',
  },
  {
    id: 'q-truth-over-comfort',
    prompt: 'Truth should always be preferred over comfort.',
    format: 'slider',
    tags: ['core', 'daily'],
    confidence: 1.0,
    options: [{ id: 'agree', label: 'Agree', weights: { epistemology: 0.4, meaning: -0.1, attachment: 0.2 } }],
  },
  {
    id: 'q-sacrifice-self',
    prompt: 'Doing your duty matters more than achieving good outcomes.',
    format: 'slider',
    tags: ['core'],
    confidence: 1.2,
    options: [{ id: 'agree', label: 'Agree', weights: { ethics: 0.85 } }],
    reaction: 'Pure deontology. Kant is pleased.',
  },
  {
    id: 'q-desire-source-suffering',
    prompt: 'Most of our suffering comes from wanting things to be other than they are.',
    format: 'slider',
    tags: ['core'],
    confidence: 1.1,
    options: [{ id: 'agree', label: 'Agree', weights: { attachment: 0.8 } }],
    reaction: 'The First Noble Truth, more or less.',
  },
  {
    id: 'q-individual-vs-collective',
    prompt: 'The good of the community should take priority over individual freedom.',
    format: 'slider',
    tags: ['core', 'battle'],
    confidence: 1.1,
    options: [{ id: 'agree', label: 'Agree', weights: { politics: 0.8 } }],
    reaction: 'Confucius and the libertarians will never agree on this one.',
  },
  {
    id: 'q-divine-reality',
    prompt: 'There is a divine or sacred dimension to reality, beyond the purely physical.',
    format: 'slider',
    tags: ['core'],
    confidence: 1.2,
    options: [{ id: 'agree', label: 'Agree', weights: { theology: 0.85, metaphysics: 0.4 } }],
  },
  {
    id: 'q-innate-knowledge',
    prompt: 'Some truths can be known by pure reason alone, without relying on the senses.',
    format: 'slider',
    tags: ['core'],
    confidence: 1.1,
    options: [{ id: 'agree', label: 'Agree', weights: { epistemology: 0.8, metaphysics: 0.2 } }],
    reaction: 'Rationalists vs empiricists — the oldest grudge in the book.',
  },
  {
    id: 'q-act-without-attachment',
    prompt: 'The ideal is to act fully and wholeheartedly, while staying unattached to the results.',
    format: 'slider',
    tags: ['core'],
    confidence: 1.1,
    options: [{ id: 'agree', label: 'Agree', weights: { attachment: 0.6, ethics: 0.3, theology: 0.2 } }],
    reaction: 'Krishna’s counsel to Arjuna in the Gītā.',
  },
  {
    id: 'q-revolt-absurd',
    prompt:
      'The universe is silent and indifferent to us — and the right response is to live defiantly and fully anyway.',
    format: 'slider',
    tags: ['core', 'battle'],
    confidence: 1.2,
    options: [{ id: 'agree', label: 'Agree', weights: { meaning: 0.7, theology: -0.6, attachment: -0.4 } }],
    reaction: 'One must imagine Sisyphus happy.',
  },

  // ── DEEP +7 (and extras) — metaphysics / epistemology / self ──
  {
    id: 'q-evil-demon',
    prompt:
      'For all you can prove, an all-powerful deceiver could be feeding you a fake reality right now. Does that possibility genuinely unsettle your confidence in the world?',
    format: 'binary',
    tags: ['deep'],
    confidence: 1.0,
    options: [
      { id: 'no', label: 'No — I trust my experience', weights: { epistemology: -0.5, metaphysics: -0.2 } },
      { id: 'yes', label: 'Yes — certainty is harder than it looks', weights: { epistemology: 0.4, self: 0.3 } },
    ],
    reaction: 'Descartes’ demon. The cogito was his way out.',
  },
  {
    id: 'q-forms',
    prompt: 'Perfect circles, perfect justice, perfect beauty — these ideals are more real than any imperfect example we ever see.',
    format: 'slider',
    tags: ['deep'],
    confidence: 1.1,
    options: [{ id: 'agree', label: 'Agree', weights: { metaphysics: 0.8, epistemology: 0.5 } }],
    reaction: 'Straight from Plato’s cave.',
  },
  {
    id: 'q-mind-body',
    prompt: 'The mind is something distinct from the body — not just the brain in disguise.',
    format: 'slider',
    tags: ['deep'],
    confidence: 1.0,
    options: [{ id: 'agree', label: 'Agree', weights: { metaphysics: 0.6, self: 0.5 } }],
  },
  {
    id: 'q-emptiness',
    prompt: 'Nothing has a fixed, independent essence — things exist only in relation to everything else.',
    format: 'slider',
    tags: ['deep'],
    confidence: 1.2,
    options: [{ id: 'agree', label: 'Agree', weights: { metaphysics: -0.4, self: -0.6, epistemology: -0.4 } }],
    reaction: 'The doctrine of emptiness — Nāgārjuna’s razor.',
  },
  {
    id: 'q-all-is-one',
    prompt: 'At the deepest level, all things — including you — are expressions of a single underlying reality.',
    format: 'slider',
    tags: ['deep'],
    confidence: 1.2,
    options: [{ id: 'agree', label: 'Agree', weights: { metaphysics: 0.7, self: 0.6, theology: 0.4, attachment: 0.4 } }],
    reaction: 'Non-dualism. Atman is Brahman.',
  },
  {
    id: 'q-words-fail',
    prompt: 'The most important truths cannot be put into words — they can only be experienced.',
    format: 'slider',
    tags: ['deep'],
    confidence: 1.0,
    options: [{ id: 'agree', label: 'Agree', weights: { epistemology: -0.5, metaphysics: 0.3, attachment: 0.2 } }],
    reaction: 'The Tao that can be spoken is not the eternal Tao.',
  },
  {
    id: 'q-wu-wei',
    prompt: 'Often the wisest action is to stop forcing things and move with the natural flow of events.',
    format: 'slider',
    tags: ['deep'],
    confidence: 0.9,
    options: [{ id: 'agree', label: 'Agree', weights: { attachment: 0.4, self: -0.2, politics: -0.2 } }],
    reaction: 'Wu wei — effortless action.',
  },

  // ── ETHICS battery ──
  {
    id: 'q-ends-means',
    prompt: 'A good enough end can justify a normally wrong means.',
    format: 'slider',
    tags: ['daily', 'battle'],
    confidence: 1.1,
    options: [{ id: 'agree', label: 'Agree', weights: { ethics: -0.8 } }],
  },
  {
    id: 'q-fat-man',
    prompt:
      'You could stop the trolley and save five only by pushing one large stranger off a bridge to his death with your own hands. Do you push him?',
    format: 'binary',
    tags: ['deep', 'battle'],
    confidence: 1.2,
    options: [
      { id: 'no', label: 'No — I will not use him as a thing', weights: { ethics: 0.85 } },
      { id: 'yes', label: 'Yes — the math is the same as the lever', weights: { ethics: -0.8 } },
    ],
    reaction: 'Most people pull the lever but won’t push. Why? That gap is the whole of ethics.',
  },
  {
    id: 'q-promise-secret',
    prompt: 'You promised a dying friend to keep a secret. Keeping it now would harm no one but helps no one either. Do you keep it?',
    format: 'binary',
    tags: ['daily'],
    confidence: 0.9,
    options: [
      { id: 'no', label: 'No — a promise that helps no one can be released', weights: { ethics: -0.4 } },
      { id: 'yes', label: 'Yes — a promise is a promise', weights: { ethics: 0.7 } },
    ],
  },
  {
    id: 'q-virtue-character',
    prompt: 'What matters most in ethics is not rules or outcomes, but becoming a person of good character.',
    format: 'slider',
    tags: ['daily'],
    confidence: 1.0,
    options: [{ id: 'agree', label: 'Agree', weights: { ethics: 0.6 } }],
    reaction: 'Aristotle’s virtue ethics.',
  },
  {
    id: 'q-golden-mean',
    prompt: 'Virtue usually lies in the balanced middle between two extremes.',
    format: 'slider',
    tags: ['deep'],
    confidence: 0.8,
    options: [{ id: 'agree', label: 'Agree', weights: { ethics: 0.5 } }],
  },
  {
    id: 'q-moral-luck',
    prompt: 'Two reckless drivers are identical, but only one happens to hit a child. The one who hit the child is more blameworthy.',
    format: 'slider',
    tags: ['deep'],
    confidence: 0.9,
    options: [{ id: 'agree', label: 'Agree', weights: { ethics: -0.5 } }],
    reaction: 'Moral luck — does the outcome change the guilt?',
  },
  {
    id: 'q-compassion-base',
    prompt: 'Compassion for all living beings should be the foundation of how we live.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.9,
    options: [{ id: 'agree', label: 'Agree', weights: { attachment: 0.3, ethics: 0.3, politics: 0.3 } }],
  },
  {
    id: 'q-justice-veil',
    prompt: 'The fairest rules for society are the ones you would choose if you didn’t know whether you’d be born rich or poor, strong or weak.',
    format: 'slider',
    tags: ['deep', 'battle'],
    confidence: 1.0,
    options: [{ id: 'agree', label: 'Agree', weights: { politics: 0.6, ethics: 0.4, epistemology: 0.2 } }],
    reaction: 'Rawls’ veil of ignorance.',
  },
  {
    id: 'q-revenge',
    prompt: 'Some wrongs deserve punishment purely because justice demands it — not because punishment does any future good.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.9,
    options: [{ id: 'agree', label: 'Agree', weights: { ethics: 0.6 } }],
  },

  // ── FREE WILL / DETERMINISM ──
  {
    id: 'q-could-have-done-otherwise',
    prompt: 'If we rewound the universe to the exact moment of a choice, you genuinely could have chosen differently.',
    format: 'slider',
    tags: ['deep', 'battle'],
    confidence: 1.2,
    options: [{ id: 'agree', label: 'Agree', weights: { freeWill: 0.85 } }],
  },
  {
    id: 'q-blame-criminals',
    prompt: 'A criminal shaped entirely by genes and upbringing they never chose still fully deserves blame.',
    format: 'slider',
    tags: ['deep'],
    confidence: 1.0,
    options: [{ id: 'agree', label: 'Agree', weights: { freeWill: 0.6, ethics: 0.2 } }],
  },
  {
    id: 'q-fate',
    prompt: 'There is a sense in which the path of your life is, in the end, fated.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.9,
    options: [{ id: 'agree', label: 'Agree', weights: { freeWill: -0.6, theology: 0.2 } }],
  },
  {
    id: 'q-responsibility',
    prompt: 'You are fully and inescapably responsible for who you become.',
    format: 'slider',
    tags: ['core'],
    confidence: 1.0,
    options: [{ id: 'agree', label: 'Agree', weights: { freeWill: 0.7, meaning: 0.4 } }],
    reaction: 'Sartre: condemned to be free.',
  },

  // ── THEOLOGY / THE DIVINE ──
  {
    id: 'q-afterlife',
    prompt: 'Some part of us survives the death of the body.',
    format: 'slider',
    tags: ['daily'],
    confidence: 1.0,
    options: [{ id: 'agree', label: 'Agree', weights: { theology: 0.6, metaphysics: 0.5, self: 0.3 } }],
  },
  {
    id: 'q-prayer',
    prompt: 'Practices like prayer, meditation, or ritual connect us to something genuinely real and larger than ourselves.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.9,
    options: [{ id: 'agree', label: 'Agree', weights: { theology: 0.6, metaphysics: 0.3, attachment: 0.2 } }],
  },
  {
    id: 'q-god-dead',
    prompt: 'In the modern world, belief in God is no longer something a thinking person needs.',
    format: 'slider',
    tags: ['battle'],
    confidence: 1.1,
    options: [{ id: 'agree', label: 'Agree', weights: { theology: -0.8, meaning: 0.3 } }],
    reaction: '"God is dead, and we have killed him."',
  },
  {
    id: 'q-euthyphro',
    prompt: 'Something is good because a higher power commands it — not the other way around.',
    format: 'slider',
    tags: ['deep'],
    confidence: 1.0,
    options: [{ id: 'agree', label: 'Agree', weights: { theology: 0.6, ethics: 0.3 } }],
    reaction: 'Socrates cornered Euthyphro with exactly this.',
  },
  {
    id: 'q-problem-of-evil',
    prompt: 'The sheer amount of pointless suffering in the world is strong evidence against a good, all-powerful God.',
    format: 'slider',
    tags: ['deep', 'battle'],
    confidence: 1.0,
    options: [{ id: 'agree', label: 'Agree', weights: { theology: -0.6 } }],
  },

  // ── MEANING / DEATH ──
  {
    id: 'q-eternal-recurrence',
    prompt: 'If you had to live this exact life over and over for eternity, you could embrace that — and want nothing changed.',
    format: 'slider',
    tags: ['deep', 'battle'],
    confidence: 1.1,
    options: [{ id: 'agree', label: 'Agree', weights: { meaning: 0.6, attachment: -0.5, theology: -0.3 } }],
    reaction: 'Nietzsche’s heaviest thought: eternal recurrence.',
  },
  {
    id: 'q-death-bad',
    prompt: 'Death is genuinely bad for the one who dies — not merely for those left behind.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.8,
    options: [{ id: 'agree', label: 'Agree', weights: { attachment: -0.4, meaning: -0.1 } }],
    reaction: 'Epicurus said: where death is, I am not — so why fear it?',
  },
  {
    id: 'q-legacy',
    prompt: 'A life can be meaningful even if it is completely forgotten and leaves no trace.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.8,
    options: [{ id: 'agree', label: 'Agree', weights: { meaning: 0.3, attachment: 0.4 } }],
  },
  {
    id: 'q-pleasure-highest',
    prompt: 'A life rich in pleasure and joy is a better life than one rich in struggle and achievement.',
    format: 'slider',
    tags: ['battle'],
    confidence: 0.9,
    options: [{ id: 'agree', label: 'Agree', weights: { ethics: -0.4, attachment: -0.5, meaning: 0.1 } }],
  },
  {
    id: 'q-meaning-given-by-god',
    prompt: 'Without something eternal or divine, life can have no ultimate meaning at all.',
    format: 'slider',
    tags: ['battle'],
    confidence: 1.0,
    options: [{ id: 'agree', label: 'Agree', weights: { meaning: -0.6, theology: 0.6 } }],
  },

  // ── SELF / IDENTITY ──
  {
    id: 'q-ship-theseus',
    prompt: 'If every part of you were gradually replaced over time, you would still be the same person.',
    format: 'slider',
    tags: ['deep'],
    confidence: 0.8,
    options: [{ id: 'agree', label: 'Agree', weights: { self: 0.5 } }],
    reaction: 'The Ship of Theseus, applied to you.',
  },
  {
    id: 'q-no-self-comfort',
    prompt: 'Realizing there is no permanent self would be liberating, not terrifying.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.9,
    options: [{ id: 'agree', label: 'Agree', weights: { self: -0.6, attachment: 0.4 } }],
  },
  {
    id: 'q-authentic-self',
    prompt: 'There is a true, authentic "you" that you can betray or stay faithful to.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.8,
    options: [{ id: 'agree', label: 'Agree', weights: { self: 0.6, meaning: 0.2 } }],
  },

  // ── POLITICS / SOCIETY ──
  {
    id: 'q-liberty-vs-equality',
    prompt: 'If forced to choose, a just society should prioritize equality over individual liberty.',
    format: 'slider',
    tags: ['battle'],
    confidence: 1.0,
    options: [{ id: 'agree', label: 'Agree', weights: { politics: 0.7 } }],
  },
  {
    id: 'q-tradition',
    prompt: 'Long-standing traditions and social roles deserve real respect, even when we can’t fully justify them.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.9,
    options: [{ id: 'agree', label: 'Agree', weights: { politics: 0.5, ethics: 0.3 } }],
    reaction: 'Confucius would approve; Socrates would interrogate.',
  },
  {
    id: 'q-rebel',
    prompt: 'When society’s rules are unjust, the individual has a duty to defy them.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.9,
    options: [{ id: 'agree', label: 'Agree', weights: { politics: -0.4, freeWill: 0.3, ethics: 0.2 } }],
  },
  {
    id: 'q-great-man',
    prompt: 'Exceptional individuals should not be bound by the same rules and values as ordinary people.',
    format: 'slider',
    tags: ['battle'],
    confidence: 1.0,
    options: [{ id: 'agree', label: 'Agree', weights: { politics: -0.7, ethics: -0.5 } }],
    reaction: 'A dangerous idea Nietzsche flirted with — and tyrants abused.',
  },
  {
    id: 'q-self-cultivation',
    prompt: 'You improve the world most effectively by first perfecting yourself.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.8,
    options: [{ id: 'agree', label: 'Agree', weights: { politics: 0.3, self: 0.3, ethics: 0.3 } }],
  },

  // ── ATTACHMENT / DESIRE ──
  {
    id: 'q-renounce-desire',
    prompt: 'The path to peace lies in reducing our desires, not in satisfying them.',
    format: 'slider',
    tags: ['daily', 'battle'],
    confidence: 1.0,
    options: [{ id: 'agree', label: 'Agree', weights: { attachment: 0.8 } }],
    reaction: 'Buddhists and Stoics agree; Nietzsche calls it the morality of the tired.',
  },
  {
    id: 'q-ambition',
    prompt: 'A burning ambition to leave your mark on the world is something to celebrate.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.9,
    options: [{ id: 'agree', label: 'Agree', weights: { attachment: -0.6, meaning: 0.3 } }],
  },
  {
    id: 'q-detach-emotions',
    prompt: 'It is wise to train yourself not to be disturbed by things outside your control.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.9,
    options: [{ id: 'agree', label: 'Agree', weights: { attachment: 0.5, ethics: 0.2 } }],
    reaction: 'The Stoic citadel of the mind.',
  },
  {
    id: 'q-passion-life',
    prompt: 'A life lived with intense passion is better than a calm, untroubled one.',
    format: 'slider',
    tags: ['battle'],
    confidence: 0.9,
    options: [{ id: 'agree', label: 'Agree', weights: { attachment: -0.7, meaning: 0.3 } }],
  },

  // ── EPISTEMOLOGY ──
  {
    id: 'q-trust-senses',
    prompt: 'All real knowledge ultimately comes from sense experience.',
    format: 'slider',
    tags: ['daily'],
    confidence: 1.0,
    options: [{ id: 'agree', label: 'Agree', weights: { epistemology: -0.8, metaphysics: -0.3 } }],
  },
  {
    id: 'q-certainty-impossible',
    prompt: 'We can almost never be truly certain of anything; we should hold our beliefs loosely.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.9,
    options: [{ id: 'agree', label: 'Agree', weights: { epistemology: -0.5 } }],
    reaction: 'The skeptic’s humility.',
  },
  {
    id: 'q-question-everything',
    prompt: 'Admitting "I don’t know" is the beginning of wisdom.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.7,
    options: [{ id: 'agree', label: 'Agree', weights: { epistemology: -0.3, self: 0.1 } }],
    reaction: 'Socratic ignorance.',
  },
  {
    id: 'q-math-discovered',
    prompt: 'Mathematical truths are discovered, not invented — they would be true even if no one ever thought of them.',
    format: 'slider',
    tags: ['deep'],
    confidence: 0.9,
    options: [{ id: 'agree', label: 'Agree', weights: { metaphysics: 0.6, epistemology: 0.6 } }],
  },
  {
    id: 'q-intuition',
    prompt: 'Deep down, a strong gut intuition is often more reliable than a chain of reasoning.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.8,
    options: [{ id: 'agree', label: 'Agree', weights: { epistemology: -0.5 } }],
  },

  // ── More scenario / binary dilemmas (shareable, punchy) ──
  {
    id: 'q-immortality',
    prompt: 'You are offered the chance to live forever in good health. Do you take it?',
    format: 'binary',
    tags: ['daily', 'battle'],
    confidence: 0.8,
    options: [
      { id: 'no', label: 'No — a life without end loses its savor', weights: { attachment: 0.5, meaning: -0.2 } },
      { id: 'yes', label: 'Yes — give me all the time there is', weights: { attachment: -0.5, meaning: 0.2 } },
    ],
  },
  {
    id: 'q-know-death-date',
    prompt: 'You can learn the exact date of your death. Do you want to know?',
    format: 'binary',
    tags: ['daily'],
    confidence: 0.7,
    options: [
      { id: 'no', label: 'No — let it stay hidden', weights: { epistemology: -0.3, attachment: 0.2 } },
      { id: 'yes', label: 'Yes — I want the truth', weights: { epistemology: 0.4, attachment: 0.1 } },
    ],
  },
  {
    id: 'q-sacrifice-stranger',
    prompt: 'You can save the life of your beloved pet or a human stranger, but not both. Who do you save?',
    format: 'binary',
    tags: ['battle'],
    confidence: 0.8,
    options: [
      { id: 'pet', label: 'My pet — love is not a calculation', weights: { ethics: -0.2, attachment: -0.3 } },
      { id: 'stranger', label: 'The stranger — a human life weighs more', weights: { ethics: -0.4, politics: 0.2 } },
    ],
  },
  {
    id: 'q-utopia-one-child',
    prompt:
      'A perfect, joyful city exists — but only as long as one innocent child is kept in permanent misery. Do you stay and accept it?',
    format: 'binary',
    tags: ['deep', 'battle'],
    confidence: 1.1,
    options: [
      { id: 'walk', label: 'No — I walk away from such a bargain', weights: { ethics: 0.8 } },
      { id: 'stay', label: 'Yes — the happiness of millions is worth it', weights: { ethics: -0.8 } },
    ],
    reaction: 'Le Guin’s Omelas. Do you walk away?',
  },
  {
    id: 'q-truth-relationship',
    prompt: 'A comforting lie keeps your loved one happy; the truth would shatter them but is theirs to know. Do you tell the truth?',
    format: 'binary',
    tags: ['daily'],
    confidence: 0.9,
    options: [
      { id: 'lie', label: 'No — protect them with the kind lie', weights: { ethics: -0.5, attachment: -0.1 } },
      { id: 'truth', label: 'Yes — they deserve the truth', weights: { ethics: 0.6, epistemology: 0.3 } },
    ],
  },
  {
    id: 'q-erase-memory',
    prompt: 'You could erase your most painful memory forever. Do you?',
    format: 'binary',
    tags: ['daily'],
    confidence: 0.8,
    options: [
      { id: 'keep', label: 'No — even pain made me who I am', weights: { meaning: 0.3, attachment: -0.2, self: 0.3 } },
      { id: 'erase', label: 'Yes — free me from it', weights: { attachment: 0.3, self: -0.2 } },
    ],
  },
  {
    id: 'q-anonymous-good',
    prompt: 'Is a good deed worth less if you make sure everyone knows you did it?',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.7,
    options: [{ id: 'agree', label: 'Agree — the motive matters', weights: { ethics: 0.5, attachment: 0.2 } }],
  },
  {
    id: 'q-animal-rights',
    prompt: 'The interests of animals deserve the same moral weight as the comparable interests of humans.',
    format: 'slider',
    tags: ['battle'],
    confidence: 0.9,
    options: [{ id: 'agree', label: 'Agree', weights: { ethics: -0.3, attachment: 0.3, politics: 0.3 } }],
  },
  {
    id: 'q-future-generations',
    prompt: 'We owe as much moral consideration to people who will live centuries from now as to people alive today.',
    format: 'slider',
    tags: ['deep'],
    confidence: 0.8,
    options: [{ id: 'agree', label: 'Agree', weights: { ethics: -0.4, politics: 0.4 } }],
  },

  // ── DAILY rotation extras (lighter, universal) ──
  {
    id: 'q-fairness-children',
    prompt: 'It is better to treat everyone exactly equally than to give more to those who need more.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.7,
    options: [{ id: 'agree', label: 'Agree', weights: { ethics: 0.3, politics: -0.2 } }],
  },
  {
    id: 'q-happiness-goal',
    prompt: 'Happiness is the ultimate goal of human life.',
    format: 'slider',
    tags: ['daily', 'battle'],
    confidence: 0.9,
    options: [{ id: 'agree', label: 'Agree', weights: { ethics: -0.4, meaning: -0.1, attachment: -0.3 } }],
  },
  {
    id: 'q-nature-good',
    prompt: 'Human nature is basically good, and it is society that corrupts us.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.7,
    options: [{ id: 'agree', label: 'Agree', weights: { politics: -0.2, ethics: 0.2 } }],
  },
  {
    id: 'q-progress',
    prompt: 'Humanity is, on the whole, getting better over time.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.6,
    options: [{ id: 'agree', label: 'Agree', weights: { meaning: -0.2, epistemology: 0.2 } }],
  },
  {
    id: 'q-art-truth',
    prompt: 'Great art can reveal truths that arguments and science never could.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.7,
    options: [{ id: 'agree', label: 'Agree', weights: { epistemology: -0.3, metaphysics: 0.3, meaning: 0.2 } }],
  },
  {
    id: 'q-solitude',
    prompt: 'Real wisdom is found more in solitude and silence than in conversation and society.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.7,
    options: [{ id: 'agree', label: 'Agree', weights: { attachment: 0.4, politics: -0.3, metaphysics: 0.2 } }],
  },
  {
    id: 'q-forgiveness',
    prompt: 'Everyone, no matter what they have done, deserves the possibility of forgiveness.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.7,
    options: [{ id: 'agree', label: 'Agree', weights: { ethics: 0.2, attachment: 0.3, theology: 0.2 } }],
  },
  {
    id: 'q-money-corrupts',
    prompt: 'Wanting more than you need is the root of most human unhappiness.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.8,
    options: [{ id: 'agree', label: 'Agree', weights: { attachment: 0.6 } }],
  },
  {
    id: 'q-control-illusion',
    prompt: 'Most of our sense of being "in control" of our lives is an illusion.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.8,
    options: [{ id: 'agree', label: 'Agree', weights: { freeWill: -0.5, self: -0.2 } }],
  },
  {
    id: 'q-change-constant',
    prompt: 'Nothing in the world is permanent; everything is in constant flux.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.8,
    options: [{ id: 'agree', label: 'Agree', weights: { self: -0.4, metaphysics: -0.2, attachment: 0.2 } }],
    reaction: 'Heraclitus and the Buddha would shake hands.',
  },
  {
    id: 'q-mind-over-matter',
    prompt: 'Your mind shapes your reality more than your reality shapes your mind.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.8,
    options: [{ id: 'agree', label: 'Agree', weights: { metaphysics: 0.5, self: 0.3 } }],
  },
  {
    id: 'q-doubt-authority',
    prompt: 'You should never accept a claim just because an authority or expert says so.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.7,
    options: [{ id: 'agree', label: 'Agree', weights: { epistemology: -0.3, politics: -0.3 } }],
  },
  {
    id: 'q-cosmic-justice',
    prompt: 'In the long run, the universe tends to balance things out — good and bad come back around.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.9,
    options: [{ id: 'agree', label: 'Agree', weights: { theology: 0.5, meaning: -0.3, metaphysics: 0.3 } }],
    reaction: 'Karma, dharma, or wishful thinking?',
  },
  {
    id: 'q-faith-leap',
    prompt: 'Some of the most important things in life require a leap of faith beyond the evidence.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.8,
    options: [{ id: 'agree', label: 'Agree', weights: { theology: 0.4, epistemology: -0.2, meaning: 0.1 } }],
  },
  {
    id: 'q-love-rational',
    prompt: 'Love is something to be understood and managed wisely, not just surrendered to.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.7,
    options: [{ id: 'agree', label: 'Agree', weights: { epistemology: 0.3, attachment: 0.3 } }],
  },
  {
    id: 'q-work-meaning',
    prompt: 'Meaningful work is essential to a good life.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.6,
    options: [{ id: 'agree', label: 'Agree', weights: { meaning: 0.2, attachment: -0.3, ethics: 0.2 } }],
  },
  {
    id: 'q-technology-soul',
    prompt: 'Our growing dependence on technology is quietly eroding something essential in us.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.6,
    options: [{ id: 'agree', label: 'Agree', weights: { attachment: 0.3, metaphysics: 0.2, meaning: -0.1 } }],
  },
  {
    id: 'q-equanimity',
    prompt: 'The ideal state of mind is calm equanimity, undisturbed by fortune or misfortune.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.9,
    options: [{ id: 'agree', label: 'Agree', weights: { attachment: 0.7, self: -0.1 } }],
  },
  {
    id: 'q-nature-harmony',
    prompt: 'Living in harmony with nature matters more than mastering or improving it.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.7,
    options: [{ id: 'agree', label: 'Agree', weights: { attachment: 0.4, politics: 0.2, metaphysics: 0.2 } }],
  },
  {
    id: 'q-self-knowledge',
    prompt: 'Knowing yourself is harder, and more important, than knowing the world.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.7,
    options: [{ id: 'agree', label: 'Agree', weights: { self: 0.3, epistemology: -0.2, attachment: 0.2 } }],
  },
  {
    id: 'q-beauty-objective',
    prompt: 'Some things are objectively beautiful, regardless of who is looking.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.7,
    options: [{ id: 'agree', label: 'Agree', weights: { metaphysics: 0.5, meaning: -0.3 } }],
  },
  {
    id: 'q-moral-progress-real',
    prompt: 'There are real, objective moral facts — some things are just wrong, everywhere, always.',
    format: 'slider',
    tags: ['battle'],
    confidence: 1.0,
    options: [{ id: 'agree', label: 'Agree', weights: { ethics: 0.5, meaning: -0.4, metaphysics: 0.3 } }],
    reaction: 'Moral realism vs relativism.',
  },
  {
    id: 'q-relativism',
    prompt: 'What is right or wrong depends on your culture and time; there’s no view from nowhere.',
    format: 'slider',
    tags: ['battle'],
    confidence: 1.0,
    options: [{ id: 'agree', label: 'Agree', weights: { ethics: -0.4, meaning: 0.5, epistemology: -0.3 } }],
  },
  {
    id: 'q-purpose-universe',
    prompt: 'The universe exists for a reason or purpose.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.9,
    options: [{ id: 'agree', label: 'Agree', weights: { theology: 0.6, meaning: -0.6, metaphysics: 0.3 } }],
  },
  {
    id: 'q-human-special',
    prompt: 'Human beings hold a special place in the cosmos, above mere animals and matter.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.8,
    options: [{ id: 'agree', label: 'Agree', weights: { metaphysics: 0.4, theology: 0.4, self: 0.3 } }],
  },
  {
    id: 'q-emotions-wisdom',
    prompt: 'Our emotions are a form of wisdom we should listen to, not obstacles to overcome.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.8,
    options: [{ id: 'agree', label: 'Agree', weights: { epistemology: -0.6 } }],
    reaction: 'Hume vs the Stoics.',
  },
  {
    id: 'q-simplicity',
    prompt: 'A simple life with little is closer to the good life than a rich life with much.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.8,
    options: [{ id: 'agree', label: 'Agree', weights: { attachment: 0.6, politics: 0.1 } }],
  },
  {
    id: 'q-act-vs-contemplate',
    prompt: 'A life of quiet contemplation is higher than a life of action in the world.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.8,
    options: [{ id: 'agree', label: 'Agree', weights: { attachment: 0.5, metaphysics: 0.3, politics: -0.2 } }],
  },
  {
    id: 'q-will-to-power',
    prompt: 'At bottom, what drives all living things is the will to grow, overcome, and expand their power.',
    format: 'slider',
    tags: ['battle'],
    confidence: 1.0,
    options: [{ id: 'agree', label: 'Agree', weights: { attachment: -0.6, meaning: 0.5, theology: -0.3 } }],
    reaction: 'The will to power.',
  },
  {
    id: 'q-pity',
    prompt: 'Pity and self-sacrifice can be subtle forms of weakness, not virtue.',
    format: 'slider',
    tags: ['battle'],
    confidence: 1.0,
    options: [{ id: 'agree', label: 'Agree', weights: { ethics: -0.5, attachment: -0.4, meaning: 0.3 } }],
    reaction: 'Nietzsche’s critique of the morality of pity.',
  },
  {
    id: 'q-universal-love',
    prompt: 'We should extend the same care to a stranger across the world as to our own family.',
    format: 'slider',
    tags: ['battle'],
    confidence: 0.9,
    options: [{ id: 'agree', label: 'Agree', weights: { ethics: -0.3, politics: 0.5, attachment: 0.2 } }],
  },
  {
    id: 'q-duty-family',
    prompt: 'You owe special, stronger obligations to your family than to strangers.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.8,
    options: [{ id: 'agree', label: 'Agree', weights: { politics: 0.4, ethics: 0.3, attachment: -0.1 } }],
    reaction: 'Confucian filial piety.',
  },
  {
    id: 'q-silence-of-god',
    prompt: 'If there were a God, the world would look very different than it does.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.9,
    options: [{ id: 'agree', label: 'Agree', weights: { theology: -0.6 } }],
  },
  {
    id: 'q-mystical-experience',
    prompt: 'A profound experience of unity or transcendence reveals something true about reality.',
    format: 'slider',
    tags: ['deep'],
    confidence: 1.0,
    options: [{ id: 'agree', label: 'Agree', weights: { metaphysics: 0.6, theology: 0.4, self: 0.2, epistemology: -0.2 } }],
  },
  {
    id: 'q-i-am-body',
    prompt: 'You are fundamentally your physical body and brain — nothing more.',
    format: 'slider',
    tags: ['battle'],
    confidence: 1.0,
    options: [{ id: 'agree', label: 'Agree', weights: { metaphysics: -0.8, self: 0.1, theology: -0.4 } }],
  },
  {
    id: 'q-free-to-define',
    prompt: 'You are free to define your own essence; you are not born with a fixed purpose.',
    format: 'slider',
    tags: ['battle'],
    confidence: 1.0,
    options: [{ id: 'agree', label: 'Agree', weights: { freeWill: 0.6, meaning: 0.7, ethics: -0.2 } }],
    reaction: 'Existence precedes essence.',
  },
  {
    id: 'q-categorical',
    prompt: 'You should act only in ways you’d be willing for absolutely everyone to act, always.',
    format: 'slider',
    tags: ['battle'],
    confidence: 1.0,
    options: [{ id: 'agree', label: 'Agree', weights: { ethics: 0.8, epistemology: 0.3 } }],
    reaction: 'The categorical imperative.',
  },
  {
    id: 'q-people-as-ends',
    prompt: 'It is always wrong to use a person merely as a tool, even for a great good.',
    format: 'slider',
    tags: ['battle'],
    confidence: 1.0,
    options: [{ id: 'agree', label: 'Agree', weights: { ethics: 0.8 } }],
  },
  {
    id: 'q-greatest-good',
    prompt: 'The right action is always the one that produces the greatest good for the greatest number.',
    format: 'slider',
    tags: ['battle'],
    confidence: 1.0,
    options: [{ id: 'agree', label: 'Agree', weights: { ethics: -0.85 } }],
    reaction: 'Utilitarianism in one line.',
  },
  {
    id: 'q-doubt-self',
    prompt: 'The one thing you cannot doubt is that you, the doubter, exist.',
    format: 'slider',
    tags: ['deep'],
    confidence: 0.9,
    options: [{ id: 'agree', label: 'Agree', weights: { self: 0.7, epistemology: 0.5, metaphysics: 0.3 } }],
    reaction: 'Cogito, ergo sum.',
  },
  {
    id: 'q-world-illusion',
    prompt: 'The everyday world of separate things is, in some sense, an illusion (māyā).',
    format: 'slider',
    tags: ['deep'],
    confidence: 1.1,
    options: [{ id: 'agree', label: 'Agree', weights: { metaphysics: 0.8, self: 0.4, theology: 0.3, attachment: 0.4 } }],
  },
  {
    id: 'q-act-now',
    prompt: 'Knowing the right thing and failing to do it is as bad as not knowing at all.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.7,
    options: [{ id: 'agree', label: 'Agree', weights: { ethics: 0.4, self: 0.2 } }],
  },
  {
    id: 'q-virtue-is-knowledge',
    prompt: 'No one does wrong knowingly; people do wrong only out of ignorance.',
    format: 'slider',
    tags: ['deep'],
    confidence: 0.9,
    options: [{ id: 'agree', label: 'Agree', weights: { ethics: 0.4, epistemology: 0.3, freeWill: -0.2 } }],
    reaction: 'A striking Socratic claim.',
  },
  {
    id: 'q-meaning-in-struggle',
    prompt: 'It is the struggle toward a goal, not reaching it, that gives life meaning.',
    format: 'slider',
    tags: ['daily'],
    confidence: 0.8,
    options: [{ id: 'agree', label: 'Agree', weights: { meaning: 0.5, attachment: -0.3 } }],
    reaction: 'The struggle itself is enough to fill a heart.',
  },
];

// Convenience selectors used across the app.
export const QUESTION_BY_ID: Record<string, Question> = Object.fromEntries(
  QUESTIONS.map((q) => [q.id, q]),
);

export const CORE_QUESTIONS = QUESTIONS.filter((q) => q.tags.includes('core'));
export const DEEP_QUESTIONS = QUESTIONS.filter((q) => q.tags.includes('deep'));
export const DAILY_POOL = QUESTIONS.filter((q) => q.tags.includes('daily'));
export const BATTLE_POOL = QUESTIONS.filter((q) => q.tags.includes('battle'));

function dimsTouched(q: Question): string[] {
  const s = new Set<string>();
  for (const o of q.options) for (const k of Object.keys(o.weights)) s.add(k);
  return [...s];
}

/**
 * Pick a balanced subset of `count` core questions: first guarantee every
 * belief dimension is probed (greedy by question confidence), then fill the
 * rest with the most diagnostic remaining ones. Returned in original order for
 * a natural flow. Keeps short tests (10/15) just as meaningful as the full one.
 */
export function selectCore(count: number): Question[] {
  if (count >= CORE_QUESTIONS.length) return CORE_QUESTIONS;
  const byConfidence = [...CORE_QUESTIONS].sort((a, b) => b.confidence - a.confidence);
  const chosen = new Set<Question>();
  const covered = new Set<string>();

  for (const q of byConfidence) {
    if (chosen.size >= count) break;
    if (dimsTouched(q).some((d) => !covered.has(d))) {
      chosen.add(q);
      dimsTouched(q).forEach((d) => covered.add(d));
    }
  }
  for (const q of byConfidence) {
    if (chosen.size >= count) break;
    chosen.add(q);
  }
  return CORE_QUESTIONS.filter((q) => chosen.has(q));
}

export type QuizModeId = 'quick' | 'balanced' | 'deep';

export interface QuizMode {
  id: QuizModeId;
  len: number;
  label: string;
  time: string;
  blurb: string;
  sigil: string;
}

// The three journeys (docs/02). "Deep" is the original full test, untouched.
export const QUIZ_MODES: QuizMode[] = [
  { id: 'quick', len: 10, label: 'Quick Read', time: '~90 sec', blurb: 'Ten sharp dilemmas. A fast, surprisingly accurate first portrait.', sigil: '◐' },
  { id: 'balanced', len: 15, label: 'The Sitting', time: '~2 min', blurb: 'Fifteen dilemmas — the sweet spot of depth and momentum.', sigil: '◑' },
  { id: 'deep', len: CORE_QUESTIONS.length, label: 'Deep Dive', time: '~3 min', blurb: 'The complete set. For those who want the machine to truly know them.', sigil: '●' },
];

export function questionsForLen(len: number): Question[] {
  return selectCore(len);
}
