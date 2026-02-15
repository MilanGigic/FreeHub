import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";

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
    <html lang="en" className="min-h-screen">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased w-full min-h-screen`}
      >
        <div className="w-full min-h-screen flex flex-col background">
          <Header />
          <div className="w-full flex items-stretch">
            <div className="sticky top-16 h-full">
              <Sidebar />
            </div>
            <main className="w-full p-4">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
