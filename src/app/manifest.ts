import type { MetadataRoute } from 'next';

// PWA manifest — makes the app installable and launch fullscreen ("standalone"),
// with no browser chrome, so it feels native. Served at /manifest.webmanifest
// and auto-linked by Next.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'The Philosophy Machine',
    short_name: 'Philosophy',
    description: 'Discover which philosophers and traditions your worldview matches.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#070710',
    theme_color: '#070710',
    categories: ['education', 'lifestyle', 'entertainment'],
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
    ],
  };
}
