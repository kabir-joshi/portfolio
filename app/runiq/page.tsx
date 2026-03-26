// This route is handled by the Next.js rewrite in next.config.ts,
// which proxies /runiq/* to the RunIQ Vercel deployment.
// This file exists only to satisfy the App Router — it will never be rendered
// because the rewrite intercepts the request first.
export default function RunIQPage() {
  return null;
}
