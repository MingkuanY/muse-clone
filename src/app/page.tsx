"use client";

import Icon from "@/components/Icon";
import styles from "../styles/home.module.scss";
import { useEffect, useRef, useState } from "react";
import classnames from "classnames";
import Spinner from "@/components/Spinner";

type Message = "DEFAULT" | "LISTENING" | "SUMMARY";

export default function Home() {
  const [message, setMessage] = useState<Message>("DEFAULT");
  const [summary, setSummary] = useState<string>("");
  const [emojis, setEmojis] = useState<string[]>([]);
  const [story, setStory] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleOnRecord = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    // Start recording
    setMessage("LISTENING");

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setLoading(true);
      const response = await fetch("/api/story", {
        method: "POST",
        body: JSON.stringify({
          input: transcript,
          type: "summary",
        }),
      }).then((r) => r.json());
      const [summaryText, emojis] = response.text.split(". ");
      setSummary(summaryText + ".");
      setEmojis(emojis.trim().split(","));
      setMessage("SUMMARY");
      setLoading(false);
    };

    recognition.start();
  };

  const storyRef = useRef<HTMLDivElement>(null);

  const handleOnGenerate = async () => {
    setLoading(true);
    const response = await fetch("/api/story", {
      method: "POST",
      body: JSON.stringify({
        input: summary,
        type: "story",
      }),
    }).then((r) => r.json());

    const formattedStory = response.text.split(". ").join(".\n\n");

    setStory(formattedStory);
    setLoading(false);
  };

  useEffect(() => {
    if (story && storyRef.current) {
      storyRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [story]);

  return (
    <>
      <div className={styles.main}>
        <div
          className={classnames(
            styles.generationContainer,
            message === "SUMMARY" && styles.bigger
          )}
        >
          <button className={styles.micBtn} onClick={handleOnRecord}>
            <Icon type="mic" fill="#FFF" />
          </button>
          {message === "DEFAULT" && (
            <p className={styles.text}>
              Tell me something you want to add to our story!
            </p>
          )}
          {message === "LISTENING" &&
            (loading ? (
              <Spinner />
            ) : (
              <p className={styles.text}>Go ahead, I'm listening...</p>
            ))}
          {message === "SUMMARY" && (
            <>
              {loading ? <Spinner /> : <p className={styles.text}>{summary}</p>}
              <div className={styles.emojis}>
                {emojis.map((emoji, index) => {
                  return (
                    <div className={styles.emoji} key={index}>
                      {emoji}
                    </div>
                  );
                })}
              </div>
              <button
                className={styles.genFullStoryBtn}
                onClick={handleOnGenerate}
              >
                Write this story!
              </button>
            </>
          )}
        </div>
      </div>
      <div className={styles.storyPage} ref={storyRef}>
        {story}
      </div>
    </>
  );
}
