import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/site.config";

const noto = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.site.url),
  title: siteConfig.site.title,
  description: siteConfig.site.description,
  keywords: [...siteConfig.site.keywords],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    title: siteConfig.site.title,
    description: siteConfig.site.description,
    siteName: siteConfig.brand.name,
    url: siteConfig.site.url,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#e6007e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={noto.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
