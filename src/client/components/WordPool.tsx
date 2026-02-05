import React from 'react';
import TowerBlock from './TowerBlock';

interface WordPoolProps {
  towerBlocks: string[];
  availableBlocks: string[];
  undoLastBlock: () => void;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, block: string) => void;
  onSelectBlock: (word: string) => void;
}

const WordPool: React.FC<WordPoolProps> = ({
  towerBlocks,
  availableBlocks,
  undoLastBlock,
  handleDragStart,
  onSelectBlock,
}) => {
  return (
    <div className="w-[40%] flex flex-col items-center gap-2 overflow-y-auto p-2">
      <h1 className="text-gray-300 text-sm font-bold mr-2">(Click or Drag)</h1>
      
      {towerBlocks.length > 0 && (
        <div className="w-[7rem] h-[3rem] hover:cursor-pointer" onClick={undoLastBlock}>
          <TowerBlock text={'Undo Last'} isUndo />
        </div>
      )}

      {availableBlocks.length === 0 ? (
        <p className="text-[#c9ada7] text-sm text-center select-none"></p>
      ) : (
        availableBlocks.map((word, i) => (
          <div
            key={`${word}-${i}`}
            onClick={() => onSelectBlock(word)}
          >
            <TowerBlock
              text={word}
              onDragStart={(e) => handleDragStart(e, word)}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default WordPool;