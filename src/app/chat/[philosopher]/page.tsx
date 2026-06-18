import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PHILOSOPHERS, PHILOSOPHER_BY_SLUG } from '@/lib/data/philosophers';
import { ChatRoom } from '@/components/ChatRoom';

export function generateStaticParams() {
  return PHILOSOPHERS.map((p) => ({ philosopher: p.slug }));
}

type Params = { params: Promise<{ philosopher: string }>; searchParams: Promise<{ r?: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { philosopher } = await params;
  const p = PHILOSOPHER_BY_SLUG[philosopher];
  if (!p) return { title: 'Chat' };
  return { title: `Chat with ${p.name}`, description: `Ask ${p.name} anything.` };
}

export default async function ChatPage({ params, searchParams }: Params) {
  const { philosopher } = await params;
  const { r } = await searchParams;
  const p = PHILOSOPHER_BY_SLUG[philosopher];
  if (!p) notFound();
  return <ChatRoom philosopher={p} resultCode={r} />;
}
