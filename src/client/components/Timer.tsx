import { useStopwatch } from "react-timer-hook";
import { JSX, useEffect } from "react";

interface TimerProps {
  isRunning: boolean;
}

export default function Timer({ isRunning }: TimerProps): JSX.Element {
  const { seconds, minutes, pause, start } = useStopwatch({ autoStart: true });

  useEffect(() => {
    if (isRunning) {
      start();
    } else {
      pause();
    }
  }, [isRunning, pause, start]);

  useEffect(() => {
    const handleVisibilityChange = (): void => {
      if (document.hidden) {
        pause();
      } else if (isRunning) {
        start();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pause, start, isRunning]);

  return (
    <div>
      {minutes}:{seconds.toString().padStart(2, "0")}
    </div>
  );
}