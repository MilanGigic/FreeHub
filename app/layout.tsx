import type { Metadata } from "next";
import Script from "next/script";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

const themeScript = `(function(){var s=document.documentElement;var t=localStorage.getItem('theme');var d=!t&&window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||d)s.classList.add('dark');else if(t==='light')s.classList.remove('dark');})();`;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Efficio",
  description:
    "Efficio — Run your freelance work and finances without the chaos.",
  icons: {
    icon: "/efficio-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="min-h-screen" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased w-full min-h-screen h-full`}
        suppressHydrationWarning
      >
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeScript }}
        />
        <div className="w-full min-h-screen h-full flex flex-col background">
          <Header />
          <div className="w-full flex items-stretch flex-1">
            <div className="sticky top-16 h-[calc(100vh-4rem)] z-20">
              <Sidebar />
            </div>
            <main className="flex-1 p-4">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
