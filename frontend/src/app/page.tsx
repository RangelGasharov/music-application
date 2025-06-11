import styles from "./page.module.css";
import PlayerBox from "../components/PlayerBox/PlayerBox";
import { MusicTrack } from "@/types/MusicTrack";

export default async function Home() {
  const getMusicTracks = async (): Promise<MusicTrack[]> => {
    try {
      const API_URL = process.env.WEB_API_URL;
      const targetUrl = `${API_URL}/music-track`;
      const response = await fetch(targetUrl, {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Failed to fetch music tracks: ${errorText}`);
        return [];
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching music tracks:', error);
      return [];
    }
  };

  const musicTracks: MusicTrack[] = await getMusicTracks();

  return (
    <div className={styles["main-container"]}>
      {musicTracks.length > 0 ? (
        <PlayerBox musicTracks={musicTracks} />
      ) : (
        <p>No tracks found. Please check back later.</p>
      )}
    </div>
  );
}