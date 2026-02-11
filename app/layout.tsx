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
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "饭桶日志",
  description: "",
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
