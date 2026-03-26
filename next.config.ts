import type { NextConfig } from "next";

// Set RUNIQ_URL in Vercel environment variables after deploying RunIQ.
// e.g. https://your-runiq-project.vercel.app
const RUNIQ_URL = process.env.RUNIQ_URL || "";

const nextConfig: NextConfig = {
  async rewrites() {
    if (!RUNIQ_URL) return [];
    return [
      {
        source: "/runiq",
        destination: `${RUNIQ_URL}/runiq`,
      },
      {
        source: "/runiq/:path*",
        destination: `${RUNIQ_URL}/runiq/:path*`,
      },
    ];
  },
};

export default nextConfig;
