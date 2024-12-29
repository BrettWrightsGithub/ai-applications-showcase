import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/ui/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Applications Showcase",
  description: "A portfolio of practical AI applications demonstrating various use cases",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-gradient-to-b from-[rgb(250,250,252)] to-[rgb(245,245,248)]">
      <body className={`${inter.className} min-h-screen`}>
        <div className="min-h-screen">
          <Navigation />
          <main className="py-10">
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
