import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — Kabir Joshi Photography",
  description: "Frequently asked questions about booking, delivery, and working with Kabir Joshi Photography.",
  openGraph: {
    title: "FAQ — Kabir Joshi Photography",
    description: "Frequently asked questions about booking, delivery, and working with Kabir Joshi Photography.",
    url: "https://kabirj.com/faq",
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
