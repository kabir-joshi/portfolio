import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Portfolio — Kabir Joshi Photography",
  description: "Sports photography portfolio — track & field, cross country, and road racing by Kabir Joshi.",
  openGraph: {
    title: "Portfolio — Kabir Joshi Photography",
    description: "Sports photography portfolio — track & field, cross country, and road racing.",
    url: "https://kabirj.com/portfolio",
  },
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
