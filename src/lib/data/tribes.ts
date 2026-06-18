import type { Tribe, TribeSlug } from '@/types';

// The 8 archetypal tribes sit ABOVE the 17 philosophers — a coarser, more
// tribal identity (Hogwarts-house energy) that's easier to rally around.
// See docs/01-viral-growth.md §4.
export const TRIBES: Record<TribeSlug, Tribe> = {
  rationalist: {
    slug: 'rationalist',
    name: 'Rationalist',
    essence: 'Reason is the surest path to truth. Think clearly and the world yields.',
    accent: '#6366f1',
    accentSoft: 'rgba(99,102,241,0.45)',
    sigil: '△',
    manifesto:
      'You trust the architecture of thought. Where others feel, you reason; where others guess, you derive. The mind, disciplined, is a lamp strong enough to light any cave.',
    anchors: ['kant', 'descartes', 'plato', 'aristotle', 'rawls'],
  },
  skeptic: {
    slug: 'skeptic',
    name: 'Skeptic',
    essence: 'Doubt everything. Follow the evidence. Suspend the rest.',
    accent: '#22d3ee',
    accentSoft: 'rgba(34,211,238,0.4)',
    sigil: '◌',
    manifesto:
      'You know that you know nothing — and that this is the beginning of wisdom, not the end. You prize the honest question over the comfortable answer.',
    anchors: ['hume', 'socrates'],
  },
  stoic: {
    slug: 'stoic',
    name: 'Stoic',
    essence: 'Master what is yours to master. Accept the rest with grace.',
    accent: '#b08d57',
    accentSoft: 'rgba(176,141,87,0.45)',
    sigil: '◇',
    manifesto:
      'You draw a clean line between what you control and what you do not, and you guard your inner citadel. Fortune is loud; your judgment is louder.',
    anchors: ['aristotle', 'kant'],
  },
  existentialist: {
    slug: 'existentialist',
    name: 'Existentialist',
    essence: 'Existence precedes essence. We are condemned to be free — so create.',
    accent: '#ef4444',
    accentSoft: 'rgba(239,68,68,0.42)',
    sigil: '✦',
    manifesto:
      'No god wrote your purpose; no nature fixed your fate. You meet the silence of the universe and answer it with meaning of your own making.',
    anchors: ['nietzsche', 'sartre', 'camus'],
  },
  idealist: {
    slug: 'idealist',
    name: 'Idealist',
    essence: 'Mind and spirit are fundamental; matter is the shadow they cast.',
    accent: '#a855f7',
    accentSoft: 'rgba(168,85,247,0.42)',
    sigil: '✧',
    manifesto:
      'You suspect the visible world is the surface of something deeper and more real. Behind appearance: Form, Spirit, Brahman — the eternal of which we are a spark.',
    anchors: ['plato', 'shankara', 'vivekananda'],
  },
  mystic: {
    slug: 'mystic',
    name: 'Mystic',
    essence: 'Truth is beyond concepts. It is not argued — it is realized.',
    accent: '#34d399',
    accentSoft: 'rgba(52,211,153,0.42)',
    sigil: '☯',
    manifesto:
      'The Tao that can be spoken is not the eternal Tao. You distrust the cage of words and seek the thing itself — in stillness, in emptiness, in the wordless.',
    anchors: ['lao-tzu', 'shankara', 'nagarjuna'],
  },
  hedonist: {
    slug: 'hedonist',
    name: 'Vitalist',
    essence: 'Life is the value. Say yes to it — its joy, its will, its abundance.',
    accent: '#f59e0b',
    accentSoft: 'rgba(245,158,11,0.42)',
    sigil: '☀',
    manifesto:
      'You refuse the religions of denial. To be alive — to desire, to strive, to feel — is not a problem to be solved but a gift to be spent fully.',
    anchors: ['nietzsche'],
  },
  dharma: {
    slug: 'dharma',
    name: 'Dharma Seeker',
    essence: 'There is a path. Walk it with duty, discipline, and the aim of liberation.',
    accent: '#fb923c',
    accentSoft: 'rgba(251,146,60,0.42)',
    sigil: '☸',
    manifesto:
      'You feel the weight and dignity of duty, and the pull of something beyond the self. Act rightly, act without grasping, and the path will carry you home.',
    anchors: ['buddha', 'krishna', 'confucius'],
  },
};

export const TRIBE_LIST: Tribe[] = Object.values(TRIBES);
