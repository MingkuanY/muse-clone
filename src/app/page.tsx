"use client";

import Icon from "@/components/Icon";
import styles from "../styles/home.module.scss";
import { useState } from "react";

type Message = "DEFAULT" | "LISTENING" | "SUMMARY";

export default function Home() {
  const [message, setMessage] = useState<Message>("DEFAULT");
  const [summary, setSummary] = useState<string>("");
  const [story, setStory] = useState<string>("");

  const handleOnRecord = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Start recording
    setMessage("LISTENING");

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      console.log("transcript:", transcript);
      const response = await fetch("/api/story", {
        method: "POST",
        body: JSON.stringify({
          input: transcript,
          type: "summary",
        }),
      }).then((r) => r.json());
      console.log("summary:", response.text);
      setSummary(response.text);
      setMessage("SUMMARY");
    };

    recognition.start();
  };

  const generateContent = async (input: string, type: "summary" | "story") => {
    const response = await fetch("/api/story", {
      method: "POST",
      body: JSON.stringify({ input, type }),
    });

    const data = await response.json();
    return data.result;
  };

  return (
    <div className={styles.main}>
      <div className={styles.generationContainer}>
        <button className={styles.micBtn} onClick={handleOnRecord}>
          <Icon type="mic" fill="#FFF" />
        </button>
        {message === "DEFAULT" && (
          <p className={styles.text}>
            Tell me something you want to add to our story!
          </p>
        )}
        {message === "LISTENING" && (
          <p className={styles.text}>Go ahead, I'm listening...</p>
        )}
        {message === "SUMMARY" && <p className={styles.text}>{summary}</p>}
      </div>
    </div>
  );
}
