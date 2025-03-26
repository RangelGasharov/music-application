import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div>
      <h1>Hello World!</h1>
      <div className={styles["links-container"]}>
        <Link href={"/settings"}>Go to settings</Link>
        <Link href={"/dashboard"}>Go to dashboard</Link>
      </div>
    </div>
  );
}