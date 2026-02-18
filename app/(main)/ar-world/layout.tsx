import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "AR World | Soul Sync",
  description: "Experience AR animals and nature in your environment",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0ea5e9",
};

export default function ARWorldLayout({ children }: { children: React.ReactNode }) {
  return children;
}
