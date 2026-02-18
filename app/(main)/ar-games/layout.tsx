import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "AR Games | Soul Sync",
  description: "Play interactive AR games in your environment",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#a855f7",
};

export default function ARGamesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
