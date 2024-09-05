"use client";

import Icon from "@/components/Icon";
import styles from "../styles/home.module.scss";
import { useState } from "react";

type Message = "DEFAULT" | "LISTENING" | "SUMMARY";

export default function Home() {
  const [message, setMessage] = useState<Message>("DEFAULT");
  const [input, setInput] = useState<string>();
  const [isRecording, setIsRecording] = useState(false);

  const handleOnRecord = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    if (!isRecording) {
      // Start recording
      setMessage("LISTENING");
      recognition.start();
      setIsRecording(true);

      recognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setMessage("SUMMARY");
        setIsRecording(false);
      };

      recognition.onend = () => {
        setMessage("SUMMARY");
        setIsRecording(false);
      };
    } else {
      // Stop recording
      recognition.stop();
      setMessage("SUMMARY");
      setIsRecording(false);
    }
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
        {message === "SUMMARY" && <p className={styles.text}>{input}</p>}
      </div>
    </div>
  );
}
