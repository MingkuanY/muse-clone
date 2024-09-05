"use client";

import Icon from "@/components/Icon";
import styles from "../styles/home.module.scss";
import { useState } from "react";

export default function Home() {
  const [message, setMessage] = useState(
    "Tell me something you want to add to our story!"
  );

  return (
    <div className={styles.main}>
      <div className={styles.generationContainer}>
        <button className={styles.micBtn}>
          <Icon type="mic" fill="#FFF" />
        </button>
        <p className={styles.text}>{message}</p>
      </div>
    </div>
  );
}
