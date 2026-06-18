import type { ResultPayload, Dimension } from '@/types';
import { DIMENSIONS } from '@/types';
import { PHILOSOPHER_BY_SLUG } from './data/philosophers';
import { TRIBES, TRIBE_LIST } from './data/tribes';
import { readDimensions, coreTension, shadowPhilosopher, DIMENSION_META } from './dossier';

// The premium "Deep Psychological Report" + growth roadmap + compatibility
// (docs/00 §monetization). Fully generated from the belief vector — long-form,
// specific, deterministic. Unlocked for everyone during the Launch Festival.

export interface ReportSection {
  title: string;
  body: string;
}

export interface RoadmapStep {
  phase: string;
  focus: string;
  practice: string;
  reading: string;
}

export interface DeepReport {
  summary: string;
  sections: ReportSection[];
  strengths: string[];
  growthEdges: string[];
  roadmap: RoadmapStep[];
  compatibility: { bestTribe: string; hardestTribe: string; note: string };
}

const strength = (v: number) => Math.abs(v);
const lean = (v: number, hi: string, lo: string, mid: string) =>
  strength(v) < 0.2 ? mid : v > 0 ? hi : lo;

export function deepReport(result: ResultPayload): DeepReport {
  const v = result.dimensions;
  const primary = PHILOSOPHER_BY_SLUG[result.primary];
  const tribe = TRIBES[result.tribe];
  const dims = readDimensions(v);
  const tension = coreTension(v);
  const shadow = PHILOSOPHER_BY_SLUG[shadowPhilosopher(v)];
  const blendNames = result.blend.map((b) => PHILOSOPHER_BY_SLUG[b.slug]?.name).filter(Boolean);

  const summary =
    `Your worldview resolves most clearly into ${primary.name} — ${result.blend[0].pct}% of your signal — ` +
    `but you are not a copy of any one thinker. You carry ${blendNames.slice(0, 3).join(', ')} together, ` +
    `which places you in the ${tribe.name} tradition. ${tribe.essence} ` +
    `What follows is a reading of the architecture beneath that label: how you decide what is true, what is right, ` +
    `what matters, and who you take yourself to be. It is drawn entirely from the pattern of your own answers.`;

  const sections: ReportSection[] = [
    {
      title: 'How you decide what is true',
      body:
        `On knowledge you ${lean(v.epistemology, 'trust reason to reach truths the senses cannot', 'trust experience and evidence over abstraction', 'hold reason and experience in a working balance')}, ` +
        `and on the nature of reality you ${lean(v.metaphysics, 'sense something beyond the merely physical', 'take the world to be physical through and through', 'stay agnostic about what is ultimately real')}. ` +
        `${strength(v.epistemology) > 0.5 || strength(v.metaphysics) > 0.5 ? 'These are firm commitments — you are not easily moved off them.' : 'You hold these lightly, which makes you adaptable but can leave you without firm ground in an argument.'}`,
    },
    {
      title: 'Your moral architecture',
      body:
        `Ethically you ${lean(v.ethics, 'feel the pull of duties and principles that bind regardless of outcome', 'judge actions by their consequences', 'weigh duty and consequence case by case')}. ` +
        `On freedom and responsibility you ${lean(v.freeWill, 'insist your choices are genuinely your own', 'suspect we are shaped by causes we never chose', 'sit between fate and freedom')}. ` +
        `Together these shape how you assign blame, keep promises, and decide when a rule may be broken.`,
    },
    {
      title: 'How you make meaning',
      body:
        `You ${lean(v.meaning, 'hold that meaning is made, not found — authored by us', 'feel meaning is woven into the world, waiting to be discovered', 'are still negotiating whether meaning is found or made')}, ` +
        `and toward the sacred you ${lean(v.theology, 'sense a dimension beyond the physical', 'find nature sufficient, with no need for the divine', 'remain open but uncommitted')}. ` +
        `This is the engine of your sense of purpose — and, for many with your pattern, its quiet source of unease.`,
    },
    {
      title: 'The self and your desires',
      body:
        `You experience the self as ${lean(v.self, 'a real, continuous "you" beneath all change', 'more of a useful fiction over constant flux', 'something in between — real enough to act, fluid enough to question')}, ` +
        `and toward desire you ${lean(v.attachment, 'lean toward loosening craving and attachment', 'say yes to striving, appetite, and the fullness of life', 'try to hold appetite and detachment in balance')}. ` +
        `In society you ${lean(v.politics, 'value harmony and the good of the whole', 'guard individual freedom above the claims of the group', 'refuse to fully choose between the individual and the collective')}.`,
    },
    {
      title: 'Your central tension',
      body: `${tension.title} — ${tension.body}`,
    },
  ];

  // strengths & growth edges from the sharpest convictions
  const sorted = [...dims].sort((a, b) => b.strength - a.strength);
  const strengths = sorted.slice(0, 3).map((d) => {
    const m = DIMENSION_META[d.key];
    return `Clarity on ${m.label.toLowerCase()}: ${d.phrase}.`;
  });
  const weakest = [...dims].sort((a, b) => a.strength - b.strength).slice(0, 2);
  const growthEdges = [
    `Where you are furthest from yourself is ${shadow.name}. ${shadow.oneLiner} Reading them won't convert you — it will pressure-test the parts of your view you've never had to defend.`,
    ...weakest.map((d) => `You are undecided on ${DIMENSION_META[d.key].label.toLowerCase()} (${DIMENSION_META[d.key].negPole} vs ${DIMENSION_META[d.key].posPole}). This openness is a strength, but worth examining so it's a choice rather than an avoidance.`),
  ];

  const roadmap: RoadmapStep[] = [
    {
      phase: 'Week 1 — Meet your thinker',
      focus: `Get inside ${primary.name}'s actual argument, not the caricature.`,
      practice: `Read one primary text slowly. Each day, write the single sentence you most disagree with.`,
      reading: primary.reading[0] ?? '',
    },
    {
      phase: 'Week 2 — Sit with your tension',
      focus: tension.title,
      practice: `Spend the week noticing where this tension shows up in real decisions. Don't resolve it — document it.`,
      reading: result.blend[1] ? (PHILOSOPHER_BY_SLUG[result.blend[1].slug]?.reading[0] ?? '') : (primary.reading[1] ?? ''),
    },
    {
      phase: 'Week 3 — Steelman your shadow',
      focus: `Argue ${shadow.name}'s position as if it were your own.`,
      practice: `Write the strongest possible case for the view you scored furthest from. Then note what, if anything, moved.`,
      reading: shadow.reading[0] ?? '',
    },
    {
      phase: 'Week 4 — Author your creed',
      focus: 'Put it in your own words.',
      practice: `Write a one-page statement of what you actually believe and why. Retake the test; see what shifted.`,
      reading: 'Your own notes from weeks 1–3.',
    },
  ];

  // compatibility: nearest & furthest tribe centroids
  const tribeScore = TRIBE_LIST.map((t) => {
    let n = 0;
    const c: Record<string, number> = {};
    for (const slug of t.anchors) {
      const p = PHILOSOPHER_BY_SLUG[slug];
      if (!p) continue;
      for (const d of DIMENSIONS as readonly Dimension[]) c[d] = (c[d] ?? 0) + (p.vector[d] ?? 0);
      n++;
    }
    let dist = 0;
    for (const d of DIMENSIONS as readonly Dimension[]) {
      const diff = v[d] - (n ? c[d] / n : 0);
      dist += diff * diff;
    }
    return { slug: t.slug, name: t.name, dist: Math.sqrt(dist) };
  }).sort((a, b) => a.dist - b.dist);

  const best = tribeScore[0];
  const hardest = tribeScore[tribeScore.length - 1];
  const compatibility = {
    bestTribe: best.name,
    hardestTribe: hardest.name,
    note:
      `You'll feel most understood by the ${best.name} tribe — your instincts rhyme with theirs. ` +
      `The ${hardest.name} tribe is your hardest conversation: not an enemy, but the worldview that will challenge you most. ` +
      `Compare results with a partner or friend to see exactly where you align and where you'd clash hardest.`,
  };

  return { summary, sections, strengths, growthEdges, roadmap, compatibility };
}
