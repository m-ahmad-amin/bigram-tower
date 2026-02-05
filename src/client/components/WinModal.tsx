import React from 'react';
import { MdArchive, MdLeaderboard } from 'react-icons/md';

interface WinModalProps {
  completedTime: string;
  score: number;
  onRestart: () => void;
  onOpenLeaderboard?: () => void;
  onOpenArchive: () => void;
}

const WinModal: React.FC<WinModalProps> = ({ 
  completedTime, 
  score, 
  onRestart, 
  onOpenLeaderboard,
  onOpenArchive
}) => {
  return (
    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-50 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="magic-particles" />
      </div>

      <div className="relative bg-[#22223b] p-6 rounded-xl border flex flex-col items-center gap-4 w-[90%] max-w-sm shadow-2xl">
        <h2 className="text-2xl text-white font-bold">Tower Completed!</h2>
        
        <div className="space-y-1 text-center">
          <div className="border text-white font-bold px-6 py-2 rounded-xl transition active:scale-95 flex gap-3">
            <p>Time: {completedTime} | Score: {score}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-2">
          <button
            onClick={onRestart}
            className="border text-white font-bold px-6 py-2 rounded-xl hover:bg-[#2a2d43] transition cursor-pointer active:scale-95"
          >
            Play Again
          </button>
          
          <button
            onClick={onOpenLeaderboard}
            className="border text-white font-bold px-4 py-2 rounded-xl hover:bg-[#2a2d43] transition cursor-pointer active:scale-95"
          >
            <MdLeaderboard size={32} title="Leaderboard" />
          </button>

          <button
          onClick={onOpenArchive}
            className="border text-white font-bold px-4 py-2 rounded-xl hover:bg-[#2a2d43] transition cursor-pointer active:scale-95"
          >
            <MdArchive size={32} title="Archive" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinModal;