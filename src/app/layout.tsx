import { inter } from "@/lib/fonts";
import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: `git commit -m "fame"`,
  description: `git commit -m "fame"`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className)}>{children}</body>
    </html>
  );
}
