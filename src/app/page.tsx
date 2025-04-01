import styles from "./page.module.css";
import PlayerBox from "../../components/PlayerBox/PlayerBox";

export default function Home() {
  return (
    <div>
      <h1>Media Player</h1>
      <div className={styles["links-container"]}>
        <PlayerBox />
      </div>
    </div>
  );
}