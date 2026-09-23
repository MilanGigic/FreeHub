import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import type { Metadata } from "next";
import Script from "next/script";
import { Inter, JetBrains_Mono } from "next/font/google";
import "@/app/[locale]/globals.css";
import { Suspense } from "react";

const themeScript = `(function(){var s=document.documentElement;var t=localStorage.getItem('theme');var d=!t&&window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||d)s.classList.add('dark');else if(t==='light')s.classList.remove('dark');})();`;

export function generateStaticParams() {
  return [{ locale: "sr-Latn" }, { locale: "en" }]; // your actual supported locales
}

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FREEHUB",
  description: "FREEHUB - Know your numbers without doing the math.",
  icons: {
    icon: "/freehub-symbol.png",
  },
};
async function Intl({ children }: { children: React.ReactNode }) {
  const messages = await getMessages();
  return (
    <NextIntlClientProvider messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}

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
        <Suspense fallback={null}>
          <Intl>{children}</Intl>
        </Suspense>
      </body>
    </html>
  );
}
