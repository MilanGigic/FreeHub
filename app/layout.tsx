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
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased `}
      >
        <div className="w-full h-screen flex flex-col bg-[#0f131a]">
          <Header />
          <div className="w-full h-full flex">
            <Sidebar />
            <main className="w-full h-full p-4">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
