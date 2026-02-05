import { useStopwatch } from 'react-timer-hook';
import { JSX, useEffect, useState } from 'react';

interface TimerProps {
  isRunning: boolean;
  onTimeUpdate?: (time: string) => void;
  reset?: boolean;
  onResetComplete?: () => void;
  penaltyTime?: number;
}

export default function Timer({
  isRunning,
  onTimeUpdate,
  reset,
  onResetComplete,
  penaltyTime,
}: TimerProps): JSX.Element {
  const [flash, setFlash] = useState(false);
  const {
    seconds,
    minutes,
    pause,
    start,
    reset: resetStopwatch,
  } = useStopwatch({ autoStart: true });

  useEffect(() => {
    if (penaltyTime && penaltyTime > 0) {
      setFlash(true);
      const timeout = setTimeout(() => setFlash(false), 500);
      return () => clearTimeout(timeout);
    }
  }, [penaltyTime]);

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

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [pause, start, isRunning]);

  useEffect(() => {
    const totalSeconds = minutes * 60 + seconds + (penaltyTime || 0);
    const displayMinutes = Math.floor(totalSeconds / 60);
    const displaySeconds = totalSeconds % 60;

    onTimeUpdate?.(`${displayMinutes}:${displaySeconds.toString().padStart(2, '0')}`);
  }, [minutes, seconds, onTimeUpdate, penaltyTime]);

  return (
    <div
      className={`transition-colors duration-300 ${flash ? 'text-red-500 animate-pulse' : 'text-white'}`}
    >
      {Math.floor((minutes * 60 + seconds + (penaltyTime || 0)) / 60)}:
      {((minutes * 60 + seconds + (penaltyTime || 0)) % 60).toString().padStart(2, '0')}
    </div>
  );
}