import styles from "./page.module.css";
import PlayerBox from "../components/PlayerBox/PlayerBox";
import Image from "next/image"
import ForestImage from "@/public/assets/images/forest_image.jpg";

export default function Home() {
  return (
    <div className={styles["main-container"]}>
      <Image
        src={ForestImage}
        alt='music track cover'
        fill
        draggable={false}
        className={styles["track-image"]}
      />
      <h1>Media Player</h1>
      <div className={styles["play-box-container"]}>
        <PlayerBox />
      </div>
    </div>
  );
}