import React from 'react';
import Timer from './Timer';
import { FaQuestionCircle } from 'react-icons/fa';

interface HeaderProps {
  dayNumber: number;
  isRunning: boolean;
  resetTimer: boolean;
  setResetTimer: (val: boolean) => void;
  towerBlocks: string[];
  solution: string[];
  setCompletedTime: (time: string) => void;
  winSound: HTMLAudioElement;
  setShowHelp: (val: boolean) => void;
  setIsRunning: (val: boolean) => void;
  penaltyTime: number;
}

const Header: React.FC<HeaderProps> = ({
  dayNumber,
  isRunning,
  resetTimer,
  setResetTimer,
  towerBlocks,
  solution,
  setCompletedTime,
  winSound,
  setShowHelp,
  setIsRunning,
  penaltyTime
}) => {
  return (
    <header className="bg-[#22223b] h-[10%] flex justify-between items-center px-5">
      <div className="text-white font-extrabold font-poppins text-lg tracking-wide flex flex-col items-center">
        <h1>Day {dayNumber}</h1>
      </div>

      <div className="text-4xl font-extrabold font-mono text-white drop-shadow-lg tracking-wider">
        <Timer
          isRunning={isRunning}
          reset={resetTimer}
          onResetComplete={() => setResetTimer(false)}
          penaltyTime={penaltyTime}
          onTimeUpdate={(time) => {
            const isWin =
              !isRunning &&
              towerBlocks.length === solution.length &&
              towerBlocks.every((block, i) => block === solution[i]);

            if (isWin) {
              setCompletedTime(time);
              winSound.play().catch(() => {});
            }
          }}
        />
      </div>

      <div className="w-[20%] flex justify-end gap-2">
        <FaQuestionCircle
          size={25}
          color="#fff"
          className="cursor-pointer"
          title="How to Play"
          onClick={() => {
            setShowHelp(true);
            setIsRunning(false);
          }}
        />
      </div>
    </header>
  );
};

export default Header;