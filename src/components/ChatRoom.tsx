'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Philosopher } from '@/types';
import { Portrait } from '@/components/ui/Portrait';
import { accentVars } from '@/components/ui/primitives';

interface Msg {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatRoom({ philosopher, resultCode }: { philosopher: Philosopher; resultCode?: string }) {
  const [messages, setMessages] = useState<Msg[]>([
    { role: 'assistant', content: `I am ${philosopher.name}. You have my attention. Ask me what you will.` },
  ]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, busy]);

  const send = async () => {
    const text = input.trim();
    if (!text || busy) return;
    const next = [...messages, { role: 'user' as const, content: text }];
    setMessages(next);
    setInput('');
    setBusy(true);
    setNotice(null);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          philosopher: philosopher.slug,
          resultCode,
          messages: next.filter((m) => m.role === 'user' || m.role === 'assistant'),
        }),
      });
      const data = await res.json();
      if (res.status === 429) {
        setNotice(data.message ?? 'Daily free messages reached.');
      } else if (data.reply) {
        setMessages((m) => [...m, { role: 'assistant', content: data.reply }]);
        if (data.mocked) setNotice('Demo voice — add a free Gemini key (aistudio.google.com) for full dialogue.');
      }
    } catch {
      setNotice('The connection faltered. Try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex h-[100dvh] flex-col" style={accentVars(philosopher.accent, philosopher.accentSoft)}>
      <header className="flex items-center gap-3 border-b border-white/10 px-5 py-4">
        <a href="/" className="text-muted hover:text-chalk">←</a>
        <Portrait sigil={philosopher.sigil} accent={philosopher.accent} accentSoft={philosopher.accentSoft} size="sm" />
        <div>
          <p className="font-display font-semibold" style={{ color: philosopher.accent }}>{philosopher.name}</p>
          <p className="text-xs text-muted">{philosopher.tradition}</p>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 overflow-y-auto px-5 py-6">
        {messages.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed ${
              m.role === 'user' ? 'self-end bg-chalk text-ink' : 'glass self-start whitespace-pre-wrap'
            }`}
          >
            {m.content}
          </motion.div>
        ))}
        {busy && (
          <div className="glass max-w-[60%] self-start rounded-2xl px-4 py-3 text-muted">
            <span className="animate-pulse">{philosopher.name} is considering…</span>
          </div>
        )}
        {notice && <p className="self-center text-center text-xs text-muted">{notice}</p>}
        <div ref={endRef} />
      </div>

      <div className="safe-bottom mx-auto w-full max-w-2xl px-5 pt-2">
        <div className="glass-strong flex items-end gap-2 rounded-3xl p-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={1}
            placeholder={`Ask ${philosopher.name} anything…`}
            className="max-h-32 flex-1 resize-none bg-transparent px-3 py-2 text-[15px] outline-none placeholder:text-muted"
          />
          <button
            onClick={send}
            disabled={busy || !input.trim()}
            className="rounded-full px-5 py-2.5 text-sm font-medium text-ink transition-all disabled:opacity-40"
            style={{ background: philosopher.accent }}
          >
            Send
          </button>
        </div>
        <p className="mt-2 text-center text-xs text-muted">✦ Unlimited messages · free during the Launch Festival</p>
      </div>
    </div>
  );
}
