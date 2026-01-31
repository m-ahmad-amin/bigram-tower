import '../index.css';

import { context, requestExpandedMode } from '@devvit/web/client';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

export const Splash = () => {
  return (
    <button
      className="flex items-center justify-center bg-[#d93900] text-white w-auto h-10 rounded-full cursor-pointer transition-colors px-4"
      onClick={(e) => requestExpandedMode(e.nativeEvent, 'game')}
    >
      Tap to Start
    </button>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Splash />
  </StrictMode>
);
