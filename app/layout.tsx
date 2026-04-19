import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Intro from "@/components/Intro";
import { after } from "next/server";
import { headers } from "next/headers";
import { neon } from "@neondatabase/serverless";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kabir Joshi — Photography",
  description:
    "Sports photography portfolio specializing in track & field, cross country, and road racing. Available for event coverage, portrait sessions, and commercial work.",
  metadataBase: new URL("https://kabirj.com"),
  openGraph: {
    title: "Kabir Joshi — Photography",
    description:
      "Sports photography portfolio specializing in track & field, cross country, and road racing.",
    url: "https://kabirj.com",
    siteName: "Kabir Joshi Photography",
    images: [{ url: "/photos/IMG_3786.JPG", width: 1200, height: 1500 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kabir Joshi — Photography",
    description:
      "Sports photography portfolio specializing in track & field, cross country, and road racing.",
    images: ["/photos/IMG_3786.JPG"],
  },
  alternates: {
    canonical: "https://kabirj.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = (await headers()).get("x-pathname") ?? "/";

  if (!pathname.startsWith("/admin") && !pathname.startsWith("/api")) {
    after(async () => {
      try {
        const sql = neon(process.env.DATABASE_URL!);
        await sql`
          CREATE TABLE IF NOT EXISTS page_views (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            path VARCHAR(500) NOT NULL,
            referrer VARCHAR(1000),
            ua VARCHAR(500),
            ip VARCHAR(100),
            created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
          )
        `;
        const hdrs = await headers();
        await sql`
          INSERT INTO page_views (path, referrer, ua, ip)
          VALUES (
            ${pathname},
            ${hdrs.get("referer") ?? ""},
            ${hdrs.get("user-agent") ?? ""},
            ${(hdrs.get("x-forwarded-for") ?? "").split(",")[0].trim()}
          )
        `;
      } catch {}
    });
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>
        <Intro />
        <SmoothScroll>
        {/* Ambient glow orbs */}
        <div
          aria-hidden
          className="ambient-glow-a pointer-events-none fixed top-[-200px] left-[-200px] w-[700px] h-[700px] z-0"
          style={{ background: "radial-gradient(circle, var(--c-glow-a) 0%, transparent 70%)" }}
        />
        <div
          aria-hidden
          className="ambient-glow-b pointer-events-none fixed bottom-[-200px] right-[-200px] w-[600px] h-[600px] z-0"
          style={{ background: "radial-gradient(circle, var(--c-glow-b) 0%, transparent 70%)" }}
        />

        {children}

        </SmoothScroll>
        {/* Film grain overlay */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[998]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundSize: "180px 180px",
            opacity: 0.038,
          }}
        />
      </body>
    </html>
  );
}
