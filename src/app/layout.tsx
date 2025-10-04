import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers/providers";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import React from "react";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "FinWise",
  description: "FinWise – Your Personal Finance Bridge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.variable
        )}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
