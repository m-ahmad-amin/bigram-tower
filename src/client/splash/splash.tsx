import '../index.css';

import { context, requestExpandedMode } from '@devvit/web/client';
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

export const Splash = () => {
  const demoBlocks = ['washing', 'machine', 'learning'];
  const [demoTower, setDemoTower] = useState<string[]>([]);
  const [demoUndo, setDemoUndo] = useState(false);
  const [demoStep, setDemoStep] = useState(0);

  useEffect(() => {
      setDemoTower([]);
      setDemoUndo(false);
      setDemoStep(0);
  
      const steps = [
        () => setDemoTower([demoBlocks[0]!]),
        () => setDemoTower([demoBlocks[0]!, demoBlocks[2]!]),
        () => {
          setDemoUndo(true);
          setDemoTower([demoBlocks[0]!]);
        },
        () => {
          setDemoUndo(false);
          setDemoTower([demoBlocks[0]!, demoBlocks[1]!]);
        },
        () => {
          setDemoUndo(false);
          setDemoTower([demoBlocks[0]!, demoBlocks[1]!, demoBlocks[2]!]);
        },
      ];
  
      let i = 0;
      const interval = setInterval(() => {
        steps[i]?.();
        i++;
        if (i >= steps.length) clearInterval(interval);
      }, 1500);
  
      return () => clearInterval(interval);
    }, []);
    
  return (
    <div className="bg-[#22223b] h-screen w-screen flex flex-col justify-center items-center gap-3">
      <h1 className='text-center text-white text-2xl font-bold'>
        Bigram tower
      </h1>
      <div className="mt-4 flex flex-col items-center">
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
      <button className="bg-[#1a1a2e] text-white border border-[#7b80a3]
             rounded-xl px-6 py-4 font-semibold
             hover:shadow-[0_0_20px_rgba(123,128,163,0.6)]
             transition-all mt-2 hover:cursor-pointer"
      onClick={(e) => requestExpandedMode(e.nativeEvent, 'game')}>
        Build Today's Tower
      </button>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Splash />
  </StrictMode>
);