/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the workspace root to this project (a stray parent lockfile exists).
  turbopack: { root: import.meta.dirname },
  // The core experience runs fully client-side; backend deps (Prisma, Anthropic,
  // NextAuth) are optional and lazy-loaded so the app builds/runs without them.
};

export default nextConfig;
