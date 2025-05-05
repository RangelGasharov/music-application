import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import styles from "./layout-admin-page.module.css"
import Providers from "@/components/Providers/Providers";
import NavigationHeader from "@/components/NavigationHeader/NavigationHeader";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Music Player",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <main className={styles["main-container"]}>
            <Suspense fallback={null}>
              <NavigationHeader />
            </Suspense>
            <div className={styles["children-container"]}>
              {children}
            </div>
          </main>
        </Providers>
      </body>
    </html>
  );
}