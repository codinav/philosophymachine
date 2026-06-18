import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import '@/styles/globals.css';
import { Starfield } from '@/components/ui/Starfield';
import { MobileTabBar } from '@/components/layout/MobileTabBar';
import { MotionProvider } from '@/components/MotionProvider';

const display = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

const sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

// Set NEXT_PUBLIC_SITE_URL to your deployed domain so share/OG links resolve there.
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://philosophymachine.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: 'The Philosophy Machine — What do you actually believe?',
    template: '%s · The Philosophy Machine',
  },
  description:
    'Answer 18 dilemmas. Discover which philosophers and traditions your worldview matches — your blend, your tribe, and how rare you are.',
  keywords: ['philosophy test', 'philosophy quiz', 'which philosopher are you', 'worldview', 'personality'],
  openGraph: {
    title: 'The Philosophy Machine',
    description: 'Which philosophers match your worldview? Find your blend, your tribe, your rarity.',
    type: 'website',
    url: SITE,
  },
  twitter: { card: 'summary_large_image', title: 'The Philosophy Machine' },
  manifest: '/manifest.webmanifest',
  icons: { icon: '/icon.svg', shortcut: '/icon.svg', apple: '/apple-icon' },
  appleWebApp: {
    capable: true, // "Add to Home Screen" launches fullscreen, no Safari chrome
    title: 'Philosophy',
    statusBarStyle: 'black-translucent',
  },
  // Legacy iOS flag — modern Next emits `mobile-web-app-capable`, but older
  // iOS still keys standalone launch off this one. Keep both for compatibility.
  other: { 'apple-mobile-web-app-capable': 'yes' },
};

export const viewport: Viewport = {
  themeColor: '#070710',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover', // extend under the iOS notch/home indicator; safe-area insets handle padding
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // suppressHydrationWarning on BOTH <html> and <body>: browser extensions
  // (QuillBot's data-qb-installed, Grammarly, password managers, etc.) inject
  // attributes here before React loads. Without this, that mismatch aborts
  // hydration — which silently leaves the page non-interactive (dead buttons).
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="grain" suppressHydrationWarning>
        <MotionProvider>
          <Starfield />
          <div className="app-shell relative z-[2]">{children}</div>
          <MobileTabBar />
        </MotionProvider>
      </body>
    </html>
  );
}
