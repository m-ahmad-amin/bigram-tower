import React from 'react';

interface ArchiveModalProps {
  onClose: () => void;
  onSelectDate: (date: string) => void;
  startDate: string;
  currentDate: string;
}

const ArchiveModal: React.FC<ArchiveModalProps> = ({ onClose, onSelectDate, startDate, currentDate }) => {
  const start = new Date(startDate);
  const today = new Date();
  const days: { date: string; dayNum: number }[] = [];

  let current = new Date(start);
  let count = 1;
  while (current <= today) {
    days.push({
      date: current.toISOString().split('T')[0]!,
      dayNum: count,
    });
    current.setDate(current.getDate() + 1);
    count++;
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[60] p-4">
      <div className="bg-[#22223b] w-full max-w-md rounded-2xl border border-[#c9ada7] flex flex-col h-[80vh]">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-xl text-white font-bold">Archive</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white hover:cursor-pointer">
            ✕
          </button>
        </div>

        <div className="p-4 overflow-y-auto grid grid-cols-3 gap-3 scrollbar-hidden">
          {days.reverse().map((day) => (
            <button
              key={day.date}
              onClick={() => {
                if (day.date === currentDate) {
                  onClose();
                } else {
                  onSelectDate(day.date);
                  onClose();
                }
              }}
              className="flex flex-col items-center p-3 rounded-xl border border-gray-600 hover:bg-[#4a4e69] hover:cursor-pointer transition text-white active:scale-95"
            >
              <span className="text-xs text-gray-400">Day</span>
              <span className="text-lg font-bold">{day.dayNum}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ArchiveModal;