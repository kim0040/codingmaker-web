import type { Metadata } from "next";
import { Inter, Material_Symbols_Outlined, Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

const materialSymbols = Material_Symbols_Outlined({
  variable: "--font-material-symbols",
  subsets: ["latin"],
  weight: "400",
  display: "block",
});

export const metadata: Metadata = {
  title: "코딩메이커 아카데미 허브",
  description: "미래를 코딩하다, 코딩메이커 아카데미",
};

export default function RootLayout({
  children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="ko" suppressHydrationWarning>
        <body
          className={`${inter.variable} ${notoSansKr.variable} ${materialSymbols.variable} antialiased font-sans bg-background text-foreground`}
        >
          <Providers>
            {children}
          </Providers>
        </body>
    </html>
  );
}
