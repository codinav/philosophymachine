import type { Dimension, FullVector } from '@/types';
import { DIMENSIONS } from '@/types';

// Self-contained result codes. A code encodes the full 9-dim belief vector
// (+ aporia count + deep flag) so /result/[code] and /compare can render with
// ZERO backend — critical for viral share/unfurl performance (docs/03 §state).
// Everything else (blend, tribe, rarity, unlocks) is recomputed deterministically.

const B64URL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

function bytesToB64url(bytes: number[]): string {
  let out = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i];
    const b1 = i + 1 < bytes.length ? bytes[i + 1] : 0;
    const b2 = i + 2 < bytes.length ? bytes[i + 2] : 0;
    out += B64URL[b0 >> 2];
    out += B64URL[((b0 & 3) << 4) | (b1 >> 4)];
    if (i + 1 < bytes.length) out += B64URL[((b1 & 15) << 2) | (b2 >> 6)];
    if (i + 2 < bytes.length) out += B64URL[b2 & 63];
  }
  return out;
}

function b64urlToBytes(str: string): number[] {
  const bytes: number[] = [];
  const lookup = (c: string) => B64URL.indexOf(c);
  for (let i = 0; i < str.length; i += 4) {
    const c0 = lookup(str[i]);
    const c1 = lookup(str[i + 1]);
    const c2 = i + 2 < str.length ? lookup(str[i + 2]) : -1;
    const c3 = i + 3 < str.length ? lookup(str[i + 3]) : -1;
    bytes.push((c0 << 2) | (c1 >> 4));
    if (c2 !== -1) bytes.push(((c1 & 15) << 4) | (c2 >> 2));
    if (c3 !== -1) bytes.push(((c2 & 3) << 6) | c3);
  }
  return bytes;
}

const quant = (v: number) => Math.max(0, Math.min(255, Math.round(((v + 1) / 2) * 255)));
const dequant = (b: number) => (b / 255) * 2 - 1;

export interface DecodedResult {
  dimensions: FullVector;
  aporiaCount: number;
  isDeep: boolean;
}

const VERSION = 1;

export function encodeResult(dims: FullVector, aporiaCount: number, isDeep: boolean): string {
  const bytes: number[] = [VERSION];
  for (const d of DIMENSIONS as readonly Dimension[]) bytes.push(quant(dims[d] ?? 0));
  bytes.push(Math.min(255, Math.max(0, Math.round(aporiaCount))));
  bytes.push(isDeep ? 1 : 0);
  return bytesToB64url(bytes);
}

export function decodeResult(code: string): DecodedResult | null {
  try {
    const bytes = b64urlToBytes(code);
    if (bytes.length < 1 + DIMENSIONS.length + 2 || bytes[0] !== VERSION) return null;
    const dimensions = {} as FullVector;
    DIMENSIONS.forEach((d, i) => {
      dimensions[d] = dequant(bytes[1 + i]);
    });
    const aporiaCount = bytes[1 + DIMENSIONS.length];
    const isDeep = bytes[2 + DIMENSIONS.length] === 1;
    return { dimensions, aporiaCount, isDeep };
  } catch {
    return null;
  }
}
