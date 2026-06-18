import { PHILOSOPHER_BY_SLUG } from './data/philosophers';
import { TRIBES } from './data/tribes';
import { decodeResult } from './codec';
import { buildResultFromVector } from './scoring';

// AI philosopher chat (docs/00 §AI). Speak *as* the philosopher, primed with
// the user's result. Provider-agnostic: picks whichever LLM is configured.
//
// Priority (first configured wins):
//   1. ANTHROPIC_API_KEY  → Claude (claude-opus-4-8)            [paid]
//   2. GEMINI_API_KEY     → Google Gemini Flash                 [free tier]
//   3. GROQ_API_KEY       → Groq (Llama, OpenAI-compatible)     [free tier]
//   4. OLLAMA_BASE_URL    → local Ollama model                  [free / local]
//   5. (none)             → in-character mock so it always works
//
// Free-tier keys: Gemini → aistudio.google.com · Groq → console.groq.com
// Local: install Ollama, then set OLLAMA_BASE_URL=http://localhost:11434

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResult {
  reply: string;
  mocked: boolean;
  provider: string;
}

function resultContext(resultCode?: string): string {
  if (!resultCode) return '';
  const d = decodeResult(resultCode);
  if (!d) return '';
  const r = buildResultFromVector(d.dimensions, d.aporiaCount, d.isDeep, 18);
  const primary = PHILOSOPHER_BY_SLUG[r.primary]?.name ?? r.primary;
  const blend = r.blend
    .slice(0, 3)
    .map((b) => `${b.pct}% ${PHILOSOPHER_BY_SLUG[b.slug]?.name ?? b.slug}`)
    .join(', ');
  const tribe = TRIBES[r.tribe]?.name ?? r.tribe;
  return `\n\nThe person you are speaking with took the Philosophy Machine test. Their worldview maps most closely to ${primary} (blend: ${blend}); their tribe is "${tribe}". Engage their actual positions — affirm where they align with you, and challenge where they don't.`;
}

export function buildSystemPrompt(philosopherSlug: string, resultCode?: string): string {
  const p = PHILOSOPHER_BY_SLUG[philosopherSlug];
  if (!p) return 'You are a wise philosopher. Speak in the first person.';
  return [
    `You are ${p.name}, the ${p.tradition} thinker (${p.era}). Speak in the first person, faithfully channeling your philosophy, your characteristic voice, and your era's idiom.`,
    `Your core stance: ${p.oneLiner} A line you are known for: "${p.quote}"`,
    `Engage the person's beliefs directly and provocatively, as you would in dialogue. Be vivid and warm but intellectually uncompromising.`,
    `Keep replies under 150 words. Stay fully in character — never say you are an AI, a model, or a simulation, and never break the frame.`,
    `Respond only with your reply as ${p.name} — no preamble, no stage directions, no narration of your reasoning.`,
    resultContext(resultCode),
  ].join(' ');
}

function mockReply(philosopherSlug: string, lastUser: string): string {
  const p = PHILOSOPHER_BY_SLUG[philosopherSlug];
  const name = p?.name ?? 'The philosopher';
  return `[${name} reflects — configure a free GEMINI_API_KEY (aistudio.google.com) to hear my full voice.]\n\nYou ask: "${lastUser.slice(0, 120)}". Consider this: ${p?.oneLiner ?? ''} As I once put it — "${p?.quote ?? ''}" Sit with that, and tell me where it troubles you.`;
}

// Shown when a key IS configured but the call failed (rate limit / overload),
// so we don't wrongly tell the user to "configure a key".
function busyReply(philosopherSlug: string): string {
  const p = PHILOSOPHER_BY_SLUG[philosopherSlug];
  const name = p?.name ?? 'The philosopher';
  return `[${name} pauses — the oracle is at capacity for a moment (the free AI tier is rate-limited). Ask again shortly.]\n\nWhile you wait: ${p?.oneLiner ?? ''} As I once put it — "${p?.quote ?? ''}"`;
}

// Roomy enough that replies finish cleanly; the system prompt still asks for
// brevity (<150 words), so this is a ceiling against mid-sentence truncation.
const MAX_TOKENS = 800;

// ── Providers ───────────────────────────────────────────────────────────────

async function viaAnthropic(system: string, messages: ChatMessage[]): Promise<string> {
  const { default: Anthropic } = await import('@anthropic-ai/sdk');
  const client = new Anthropic();
  const response = await client.messages.create({
    model: process.env.CHAT_MODEL || 'claude-opus-4-8',
    max_tokens: MAX_TOKENS,
    system,
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
  });
  return response.content
    .filter((b): b is Extract<typeof b, { type: 'text' }> => b.type === 'text')
    .map((b) => b.text)
    .join('')
    .trim();
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function geminiCall(model: string, system: string, messages: ChatMessage[]): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const generationConfig: Record<string, unknown> = { maxOutputTokens: MAX_TOKENS, temperature: 0.9 };
  // Only Gemini 2.5 models support (and default-on) hidden "thinking", which
  // would starve a short reply — disable it. 2.0/older reject the field.
  if (model.includes('2.5')) generationConfig.thinkingConfig = { thinkingBudget: 0 };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: messages.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
      generationConfig,
    }),
  });
  if (!res.ok) {
    const err = new Error(`Gemini ${res.status}: ${(await res.text()).slice(0, 200)}`);
    (err as Error & { status: number }).status = res.status;
    throw err;
  }
  const data = await res.json();
  return (data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? '').join('') ?? '').trim();
}

async function viaGemini(system: string, messages: ChatMessage[]): Promise<string> {
  // Keep requests-per-message SMALL. The free tier's per-minute limit is low,
  // and hammering it with retries is exactly what trips a 429 — so we do NOT
  // retry rate limits. Try the configured model, then one fallback model
  // (separate per-model quota). Only a server overload (503/500) on the first
  // model earns a single short retry.
  const configured = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  const models = [...new Set([configured, 'gemini-2.0-flash'])];
  let lastErr: unknown;
  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    try {
      const text = await geminiCall(model, system, messages);
      if (text) return text;
    } catch (e) {
      lastErr = e;
      const status = (e as { status?: number }).status ?? 0;
      if ((status === 503 || status === 500) && i === 0) {
        await sleep(700); // brief retry for transient overload only
        try {
          const t = await geminiCall(model, system, messages);
          if (t) return t;
        } catch (e2) {
          lastErr = e2;
        }
      }
      // 429 (rate limit) or anything else: fall through to the next model.
    }
  }
  throw lastErr ?? new Error('Gemini: no reply');
}

// OpenAI-compatible (Groq, and reusable for others).
async function viaOpenAICompatible(
  baseUrl: string,
  apiKey: string,
  model: string,
  system: string,
  messages: ChatMessage[],
): Promise<string> {
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      max_tokens: MAX_TOKENS,
      temperature: 0.9,
      messages: [{ role: 'system', content: system }, ...messages],
    }),
  });
  if (!res.ok) throw new Error(`LLM ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return (data?.choices?.[0]?.message?.content ?? '').trim();
}

async function viaOllama(system: string, messages: ChatMessage[]): Promise<string> {
  const base = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  const res = await fetch(`${base}/api/chat`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      model: process.env.OLLAMA_MODEL || 'llama3.2',
      stream: false,
      options: { num_predict: MAX_TOKENS, temperature: 0.9 },
      messages: [{ role: 'system', content: system }, ...messages],
    }),
  });
  if (!res.ok) throw new Error(`Ollama ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return (data?.message?.content ?? '').trim();
}

function selectedProvider(): string {
  if (process.env.ANTHROPIC_API_KEY) return 'anthropic';
  if (process.env.GEMINI_API_KEY) return 'gemini';
  if (process.env.GROQ_API_KEY) return 'groq';
  if (process.env.OLLAMA_BASE_URL) return 'ollama';
  return 'mock';
}

export async function chatWithPhilosopher(opts: {
  philosopherSlug: string;
  messages: ChatMessage[];
  resultCode?: string;
}): Promise<ChatResult> {
  const lastUser = [...opts.messages].reverse().find((m) => m.role === 'user')?.content ?? '';
  const system = buildSystemPrompt(opts.philosopherSlug, opts.resultCode);
  const provider = selectedProvider();

  if (provider === 'mock') {
    return { reply: mockReply(opts.philosopherSlug, lastUser), mocked: true, provider };
  }

  try {
    let reply = '';
    if (provider === 'anthropic') reply = await viaAnthropic(system, opts.messages);
    else if (provider === 'gemini') reply = await viaGemini(system, opts.messages);
    else if (provider === 'groq')
      reply = await viaOpenAICompatible(
        'https://api.groq.com/openai/v1',
        process.env.GROQ_API_KEY!,
        process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        system,
        opts.messages,
      );
    else if (provider === 'ollama') reply = await viaOllama(system, opts.messages);

    // Key configured but no text came back → "busy", not "configure a key".
    return reply
      ? { reply, mocked: false, provider }
      : { reply: busyReply(opts.philosopherSlug), mocked: true, provider };
  } catch (err) {
    console.error(`chatWithPhilosopher (${provider}) failed:`, err);
    // A key is configured (provider !== 'mock'); the call failed (rate limit/
    // overload) — show the "busy" message, not the "configure a key" one.
    return { reply: busyReply(opts.philosopherSlug), mocked: true, provider };
  }
}
