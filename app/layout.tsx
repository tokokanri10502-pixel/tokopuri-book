import type { Metadata, Viewport } from "next";
import { Inter, Noto_Serif_JP, M_PLUS_Rounded_1c } from "next/font/google";
import "./globals.css";
import React from "react";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-noto-serif-jp",
  display: "swap",
});
const mplusRounded = M_PLUS_Rounded_1c({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-mplus-rounded",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#F5C842",
};

export const metadata: Metadata = {
  title: "とこぷりブック",
  description: "トコトコプリンと一緒に読んだ本を記録しよう！",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "とこぷりブック",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={`${inter.variable} ${notoSerifJP.variable} ${mplusRounded.variable}`}>
      <body className="bg-tokopuri-cream text-tokopuri-black min-h-[100dvh] flex flex-col items-center">
        <main className="w-full max-w-md bg-tokopuri-cream shadow-xl relative overflow-hidden">
          {children}
        </main>
      </body>
    </html>
  );
}
