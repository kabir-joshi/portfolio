import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>
        {children}
        {/* Subtle film grain overlay */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-[998]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            opacity: 0.04,
          }}
        />
      </body>
    </html>
  );
}
