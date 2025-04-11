import styles from "./page.module.css";
import PlayerBox from "../components/PlayerBox/PlayerBox";
import Image from "next/image"
import ForestImage from "@/public/assets/images/forest_image.jpg";
import { MusicTrack } from "@/types/MusicTrack";

export default function Home() {
  const musicTracks: MusicTrack[] = [
    { id: 1, track_name: "Nature", track_length: 200, track_image_source: "assets/images/forest_image.jpg" },
    { id: 2, track_name: "", track_length: 220, track_image_source: "assets/images/urban_landscape.jpg" },
  ]
  return (
    <div className={styles["outer-container"]}>
      <Image
        src={ForestImage}
        alt='music track cover'
        fill
        draggable={false}
        className={styles["track-image"]}
        priority
      />
      <div className={styles["main-container"]}>
        <h1>Music Player</h1>
        <div className={styles["play-box-container"]}>
          <PlayerBox musicTracks={musicTracks} />
        </div>
      </div>
    </div>
  );
}