import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { decodeResult } from '@/lib/codec';
import { buildResultFromVector } from '@/lib/scoring';
import { deepReport } from '@/lib/deepReport';
import { readDimensions } from '@/lib/dossier';
import { PHILOSOPHER_BY_SLUG } from '@/lib/data/philosophers';
import { TRIBES } from '@/lib/data/tribes';
import { TIER_LABEL } from '@/lib/rarity';
import { isPremium } from '@/lib/entitlements';
import { cleanName, possessive } from '@/lib/name';
import { PrintButton } from '@/components/result/PrintButton';

export const metadata: Metadata = { title: 'Your Report', robots: { index: false } };

type Params = { params: Promise<{ code: string }>; searchParams: Promise<{ n?: string }> };

export default async function ReportPage({ params, searchParams }: Params) {
  const { code } = await params;
  const name = cleanName((await searchParams).n);
  const decoded = decodeResult(code);
  if (!decoded) notFound();
  const result = buildResultFromVector(decoded.dimensions, decoded.aporiaCount, decoded.isDeep, 18);
  const r = deepReport(result);
  const p = PHILOSOPHER_BY_SLUG[result.primary];
  const tribe = TRIBES[result.tribe];
  const dims = readDimensions(result.dimensions);

  if (!isPremium()) {
    return (
      <main className="mx-auto max-w-xl px-6 py-20 text-center">
        <p className="font-display text-2xl">The PDF report is an Academy feature.</p>
        <Link href="/academy" className="mt-6 inline-flex rounded-full bg-chalk px-6 py-3 text-sm font-medium text-ink">Unlock it →</Link>
      </main>
    );
  }

  return (
    <>
      {/* Light "document" theme overriding the dark app, with print rules. */}
      <style>{`
        .report-doc { background:#fff; color:#1a1a22; }
        @page { margin: 18mm; }
        @media print {
          .no-print { display:none !important; }
          .report-doc { background:#fff !important; }
        }
      `}</style>
      <div className="report-doc min-h-screen" style={{ background: '#fff', color: '#1a1a22' }}>
        <div className="mx-auto max-w-3xl px-8 py-12">
          <div className="no-print mb-8 flex items-center justify-between">
            <Link href={`/result/${code}`} className="text-sm text-neutral-500 hover:text-neutral-800">← Back to result</Link>
            <PrintButton />
          </div>

          {/* Header */}
          <header className="border-b-2 pb-6" style={{ borderColor: '#1a1a22' }}>
            <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
              {name ? `${possessive(name)} Deep Report` : 'The Philosophy Machine · Deep Report'}
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold">{name ? `${name} thinks like ${p.name}` : `You think like ${p.name}`}</h1>
            <p className="mt-2 text-neutral-600">
              {result.blend.slice(0, 3).map((b) => `${b.pct}% ${PHILOSOPHER_BY_SLUG[b.slug].name}`).join(' · ')}
            </p>
            <p className="mt-1 text-sm text-neutral-500">
              {tribe.name} tribe · {TIER_LABEL[result.rarityTier]} · rarer than {result.rarityPct}% · code {code.slice(0, 8)}
            </p>
          </header>

          <section className="mt-8">
            <p className="leading-relaxed">{r.summary}</p>
          </section>

          {/* Dimension table */}
          <section className="mt-8">
            <h2 className="font-display text-xl font-semibold">Your nine dimensions</h2>
            <table className="mt-3 w-full text-sm">
              <tbody>
                {dims.map((d) => (
                  <tr key={d.key} className="border-b" style={{ borderColor: '#e5e5e5' }}>
                    <td className="py-2 pr-4 font-medium">{d.label}</td>
                    <td className="py-2 pr-4 text-neutral-500">{d.pole}</td>
                    <td className="py-2 text-neutral-700">{d.phrase}.</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {r.sections.map((s) => (
            <section key={s.title} className="mt-6">
              <h2 className="font-display text-xl font-semibold">{s.title}</h2>
              <p className="mt-1.5 leading-relaxed text-neutral-800">{s.body}</p>
            </section>
          ))}

          <section className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <h3 className="font-display text-lg font-semibold">Strengths</h3>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-neutral-800">
                {r.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold">Growth edges</h3>
              <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-neutral-800">
                {r.growthEdges.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          </section>

          <section className="mt-8" style={{ breakInside: 'avoid' }}>
            <h2 className="font-display text-xl font-semibold">Your 4-week growth roadmap</h2>
            {r.roadmap.map((step) => (
              <div key={step.phase} className="mt-3 border-l-2 pl-4" style={{ borderColor: '#1a1a22', breakInside: 'avoid' }}>
                <p className="font-semibold">{step.phase}</p>
                <p className="text-sm text-neutral-700">{step.focus}</p>
                <p className="mt-1 text-sm text-neutral-600"><em>Practice:</em> {step.practice}</p>
                {step.reading && <p className="text-sm text-neutral-600"><em>Read:</em> {step.reading}</p>}
              </div>
            ))}
          </section>

          <section className="mt-8" style={{ breakInside: 'avoid' }}>
            <h2 className="font-display text-xl font-semibold">Relationship compatibility</h2>
            <p className="mt-1.5 leading-relaxed text-neutral-800">{r.compatibility.note}</p>
          </section>

          <footer className="mt-12 border-t pt-6 text-center text-xs text-neutral-400" style={{ borderColor: '#e5e5e5' }}>
            <p>Generated by The Philosophy Machine · philosophymachine.app/result/{code.slice(0, 8)}</p>
            <p className="mt-1">Designed &amp; developed by Abhinav Saxena</p>
          </footer>
        </div>
      </div>
    </>
  );
}
