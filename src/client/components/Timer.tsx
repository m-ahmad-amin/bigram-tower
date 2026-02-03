import { useStopwatch } from "react-timer-hook";
import { JSX, useEffect } from "react";

interface TimerProps {
  isRunning: boolean;
  onTimeUpdate?: (time: string) => void;
  reset?: boolean;
  onResetComplete?: () => void;
}

export default function Timer({ isRunning, onTimeUpdate, reset, onResetComplete }: TimerProps): JSX.Element {
  const { seconds, minutes, pause, start, reset: resetStopwatch } = useStopwatch({ autoStart: true });

  useEffect(() => {
    if (isRunning) {
      start();
    } else {
      pause();
    }
  }, [isRunning, pause, start]);

  useEffect(() => {
    if (reset) {
      resetStopwatch(undefined); 
      onResetComplete?.(); 
    }
  }, [reset, resetStopwatch, onResetComplete]);

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

  useEffect(() => {
    onTimeUpdate?.(`${minutes}:${seconds.toString().padStart(2, "0")}`);
  }, [minutes, seconds, onTimeUpdate]);

  return <div>{minutes}:{seconds.toString().padStart(2, "0")}</div>;
}