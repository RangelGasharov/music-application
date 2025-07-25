import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import styles from "./root-layout.module.css"
import Providers from "@/components/Providers/Providers";
import NavigationHeader from "@/components/NavigationHeader/NavigationHeader";
import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Queue } from "@/types/Queue";
import { QueueItemFull } from "@/types/QueueItem";
import PlayerInitializer from "@/components/PlayerBox/PlayerInitializer";

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

const getQueueByUserId = async (userId: string) => {
  try {
    const API_URL = process.env.WEB_API_URL;
    const targetUrl = `${API_URL}/queue/user-id/${userId}`;
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Failed to fetch queue: ${errorText}`);
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching the queue:', error);
    return [];
  }
}

const getQueueItemsWithMusicTracks = async (queueId: string) => {
  try {
    const API_URL = process.env.WEB_API_URL;
    const targetUrl = `${API_URL}/queue/queue-items-with-tracks/${queueId}`;
    const response = await fetch(targetUrl, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`Failed to fetch queue items: ${errorText}`);
      return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching the queue items:', error);
    return [];
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getServerSession(authOptions);
  const userId = session?.userId as string;

  let queue: Queue | null = null;
  let queueItems: QueueItemFull[] = [];

  if (userId) {
    queue = await getQueueByUserId(userId);
    if (queue) {
      queueItems = await getQueueItemsWithMusicTracks(queue.id);
    }
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <main className={styles["main-container"]}>
            {queue && (
              <PlayerInitializer userId={userId} queue={queue} queueItems={queueItems} />
            )}
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