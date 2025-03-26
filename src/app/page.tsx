import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      Hello World!
      <Link href={"/settings"}>Go to settings</Link>
      <Link href={"/dashboard"}>Go to dashboard</Link>
    </div>
  );
}