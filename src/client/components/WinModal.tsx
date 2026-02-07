import React from "react";
import { MdArchive, MdLeaderboard, MdRefresh } from "react-icons/md";

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
  onOpenArchive,
}) => {
  return (
    <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center z-50 overflow-hidden backdrop-blur-sm">
      <div className="absolute inset-0 pointer-events-none">
        <div className="magic-particles opacity-50" />
      </div>

      <div className="relative bg-gradient-to-b from-[#22223b] to-[#1a1a2e] p-8 rounded-2xl border border-white/10 flex flex-col items-center gap-6 w-[92%] max-w-sm shadow-[0_0_50px_rgba(0,0,0,0.5)]">
        <div className="text-center space-y-1">
          <h2 className="text-3xl text-white font-bold">TOWER BUILT!</h2>
        </div>

        <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-around items-center">
          <div className="text-center">
            <p className="text-gray-400 text-[10px] uppercase font-bold">
              Time
            </p>
            <p className="text-xl text-yellow-400 font-mono font-bold">
              {completedTime}
            </p>
          </div>
          <div className="h-8 w-[1px] bg-white/10" />
          <div className="text-center">
            <p className="text-gray-400 text-[10px] uppercase font-bold">
              Score
            </p>
            <p className="text-xl text-white font-mono font-bold">
              {score.toLocaleString()}
            </p>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="group w-full bg-white text-[#22223b] font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#a2a2ae] hover:cursor-pointer transition-all duration-200 active:scale-95 shadow-lg shadow-white/5"
        >
          <MdRefresh
            size={24}
            className="group-hover:rotate-180 transition-transform duration-500"
          />
          PLAY AGAIN
        </button>

        <div className="grid grid-cols-2 gap-3 w-full">
          <button
            onClick={onOpenLeaderboard}
            className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl border border-white/10 text-white hover:bg-white/5 hover:cursor-pointer transition active:scale-90"
            title="Leaderboard"
          >
            <MdLeaderboard size={24} />
            <span className="text-[10px] font-bold uppercase">Ranks</span>
          </button>

          <button
            onClick={onOpenArchive}
            className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl border border-white/10 text-white hover:bg-white/5 hover:cursor-pointer transition active:scale-90"
            title="Archive"
          >
            <MdArchive size={24} />
            <span className="text-[10px] font-bold uppercase">History</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WinModal;