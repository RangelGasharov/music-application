import styles from "./page.module.css";
import PlayerBox from "../components/PlayerBox/PlayerBox";
import { MusicTrack } from "@/types/MusicTrack";

const getMusicTracks = async () => {
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
      throw new Error(`Failed to fetch music tracks: ${errorText}`);
    }
    const data = await response.json();
    return data;
  }
  catch (error) {
    console.error('Error fetching music tracks:', error);
  }
}

export default async function Home() {
  const musicTracks: MusicTrack[] = await getMusicTracks();

  return (
    <div className={styles["main-container"]}>
      <PlayerBox musicTracks={musicTracks} />
    </div>
  );
}