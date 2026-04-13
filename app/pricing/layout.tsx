import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — Kabir Joshi Photography",
  description: "Photography pricing for event coverage, portrait sessions, and commercial work by Kabir Joshi.",
  openGraph: {
    title: "Pricing — Kabir Joshi Photography",
    description: "Photography pricing for event coverage, portrait sessions, and commercial work.",
    url: "https://kabirj.com/pricing",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
