import styles from "./page.module.css";
import PlayerBox from "../components/PlayerBox/PlayerBox";
import { MusicTrack } from "@/types/MusicTrack";

export default function Home() {
  const musicTracks: MusicTrack[] = [
    { id: 1, track_name: "Forest", track_length: 200, track_image_source: "assets/images/forest_image.jpg" },
    { id: 2, track_name: "Urban", track_length: 220, track_image_source: "assets/images/urban_landscape.jpg" },
    { id: 3, track_name: "Sky", track_length: 196, track_image_source: "assets/images/sky.jpg" },
    { id: 4, track_name: "Desert", track_length: 198, track_image_source: "assets/images/desert.jpg" }
  ]

  return (
    <div className={styles["outer-container"]}>
      <div className={styles["main-container"]}>
        <h1>Music Player</h1>
        <div className={styles["play-box-container"]}>
          <PlayerBox musicTracks={musicTracks} />
        </div>
      </div>
    </div>
  );
}