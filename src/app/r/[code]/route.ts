import { NextRequest, NextResponse } from 'next/server';

// Short-link alias: /r/<code> → /result/<code>. The code in shared links is
// itself an ad (every unfurl markets the product — docs/01 §2).
export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return NextResponse.redirect(new URL(`/result/${code}`, req.url));
}
