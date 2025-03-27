import Link from "next/link";
import styles from "./page.module.css";
import PlayerBox from "../../components/PlayerBox/PlayerBox";

export default function Home() {
  return (
    <div>
      <h1>Hello World!</h1>
      <div className={styles["links-container"]}>
        <Link href={"/settings"}>Go to settings</Link>
        <Link href={"/dashboard"}>Go to dashboard</Link>
        <PlayerBox />
      </div>
    </div>
  );
}