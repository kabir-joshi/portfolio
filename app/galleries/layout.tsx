import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Galleries — Kabir Joshi Photography",
  description: "Access your private photo gallery. Sports and event photography by Kabir Joshi.",
  openGraph: {
    title: "Client Galleries — Kabir Joshi Photography",
    description: "Access your private photo gallery. Sports and event photography by Kabir Joshi.",
    url: "https://kabirj.com/galleries",
  },
};

export default function GalleriesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
