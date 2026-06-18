import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { decodeResult } from '@/lib/codec';
import { buildResultFromVector } from '@/lib/scoring';
import { PHILOSOPHER_BY_SLUG } from '@/lib/data/philosophers';
import { ResultView } from '@/components/result/ResultView';
import { cleanName } from '@/lib/name';

type Params = {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ n?: string; reveal?: string }>;
};

export async function generateMetadata({ params, searchParams }: Params): Promise<Metadata> {
  const { code } = await params;
  const name = cleanName((await searchParams).n);
  const decoded = decodeResult(code);
  if (!decoded) return { title: 'Result' };
  const r = buildResultFromVector(decoded.dimensions, decoded.aporiaCount, decoded.isDeep, 18);
  const p = PHILOSOPHER_BY_SLUG[r.primary];
  const title = name ? `${name} thinks like ${p.name}` : `I think like ${p.name}`;
  const top = r.blend.slice(0, 3).map((b) => `${b.pct}% ${PHILOSOPHER_BY_SLUG[b.slug].name}`).join(' · ');
  const description = `${top} — rarer than ${r.rarityPct}% of minds. What do you believe?`;
  const ogImage = `/api/og/${code}?fmt=og${name ? `&n=${encodeURIComponent(name)}` : ''}`;
  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: ogImage, width: 1200, height: 630 }] },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
  };
}

export default async function ResultPage({ params, searchParams }: Params) {
  const { code } = await params;
  const name = cleanName((await searchParams).n);
  const decoded = decodeResult(code);
  if (!decoded) notFound();
  const result = buildResultFromVector(decoded.dimensions, decoded.aporiaCount, decoded.isDeep, 18);
  return <ResultView result={result} code={code} name={name} />;
}
