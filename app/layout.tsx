import type { Metadata } from "next";
import { Inter, Roboto_Mono, Space_Grotesk, Noto_Sans_SC } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const notoSansSC = Noto_Sans_SC({
  variable: "--font-noto-sans-sc",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://coffers.tech"),
  title: "饭桶日志 - 技术博客与工具集合",
  description: "专注于前端开发、运维工具和 AI 技术的中文技术博客，提供实用的开发工具和技术分享。",
  keywords: "前端开发, Next.js, React, 开发工具, 技术博客, AI, 运维",
  authors: [{ name: "饭桶日志", url: "https://coffers.tech" }],
  openGraph: {
    title: "饭桶日志 - 技术博客与工具集合",
    description: "专注于前端开发、运维工具和 AI 技术的中文技术博客，提供实用的开发工具和技术分享。",
    url: "https://coffers.tech",
    siteName: "饭桶日志",
    locale: "zh_CN",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "饭桶日志",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "饭桶日志 - 技术博客与工具集合",
    description: "专注于前端开发、运维工具和 AI 技术的中文技术博客，提供实用的开发工具和技术分享。",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hans" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${inter.variable} ${robotoMono.variable} ${spaceGrotesk.variable} ${notoSansSC.variable} antialiased bg-background-light dark:bg-background-dark font-display text-white selection:bg-primary selection:text-black`}
      >
        {children}
      </body>
    </html>
  );
}
