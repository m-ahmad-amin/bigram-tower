import React from 'react';
import { MdClose } from 'react-icons/md';

interface HelpModalProps {
  demoBlocks: string[];
  demoTower: string[];
  setShowHelp: (val: boolean) => void;
  setIsRunning: (val: boolean) => void;
}

const HelpModal: React.FC<HelpModalProps> = ({
  demoBlocks,
  demoTower,
  setShowHelp,
  setIsRunning,
}) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#22223b] p-6 rounded-xl border w-[90%] max-w-lg flex flex-col gap-4 shadow-lg relative">
        <div className="flex">
          <MdClose
            className="w-[10%]"
            size={32}
            color="#fff"
            title="Close"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setShowHelp(false);
              setIsRunning(true);
            }}
          />
          <h2 className="text-2xl text-white font-bold text-center w-[80%]">
            How to Play
          </h2>
        </div>
        <ul className="text-white list-disc list-inside space-y-2">
          <li>
            A <strong>bigram</strong> is two words that go together. Example: "machine learning".
          </li>
          <li>
            Build a <strong>chain of bigrams</strong> by dragging words to the tower in correct order.
          </li>
          <li>
            Use the <strong>undo button</strong> to remove the last block if placed incorrectly.
          </li>
        </ul>

        <div className="mt-4 flex flex-col items-center">
          <h3 className="text-white font-bold mb-2 text-sm">Tower Demo</h3>
          <div className="flex gap-4">
            <div className="flex flex-col gap-2">
              {demoBlocks.slice(0, 3).map((block, i) => {
                const isPlaced = demoTower.includes(block);

                return (
                  <div
                    key={i}
                    className="bg-[#7b80a3] rounded-xl w-16 h-10 flex items-center justify-center text-xs font-bold text-black shadow-md transition-all duration-500"
                    style={{
                      opacity: isPlaced ? 0 : 1,
                      transform: isPlaced ? 'translateX(40px)' : 'translateY(0)',
                    }}
                  >
                    {block}
                  </div>
                );
              })}
            </div>

            <div
              style={{
                transform: demoTower.length === 3 ? 'translateX(-40px)' : undefined,
                transition: 'transform 0.5s ease-in-out',
              }}
              className="relative w-16 h-48 rounded-xl border-2 border-white bg-gradient-to-b from-[#1a1a2e] to-[#22223b] overflow-hidden"
            >
              {demoTower.map((block, i) => {
                const isCorrect = block === demoBlocks[i];

                return (
                  <div
                    key={i}
                    className={`absolute w-full h-[33.33%] flex items-center justify-center rounded-xl text-xs font-bold transition-all duration-500`}
                    style={{ bottom: `${i * 33.33}%` }}
                  >
                    <div
                      className={`w-full h-full flex items-center justify-center shadow-xl ${
                        isCorrect
                          ? 'bg-[#7b80a3] shadow-[0_0_15px_rgba(100,116,139,0.6)]'
                          : 'bg-red-500 animate-pulse shadow-[0_0_15px_rgba(255,0,0,0.7)]'
                      }`}
                    >
                      {block}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;