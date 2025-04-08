import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavigationDrawer from "../components/NavigationDrawer/NavigationDrawer";
import styles from "./layout-admin-page.module.css"
import Providers from "@/components/Providers/Providers";

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
          <main className={styles["navigation-drawer-container"]}>
            <NavigationDrawer />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}