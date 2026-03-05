import { Inter, JetBrains_Mono } from "next/font/google";
import "@/app/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata = {
  title: "Efficio - Your Smart Financial Command Center for Freelancers",
  description:
    "Know what you can safely spend — without thinking like an accountant.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className={inter.className} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
