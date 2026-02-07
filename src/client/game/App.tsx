import React, { JSX, useState, useEffect } from 'react';
import TowerBlock from '../components/TowerBlock';
import bigramData from '../components/bigramData.json';
import correctSoundFile from '../assets/audio/correct.mp3';
import wrongSoundFile from '../assets/audio/wrong.mp3';
import winSoundFile from '../assets/audio/win.mp3';
import { useUser } from '../hooks/useUser';
import Header from '../components/Header';
import WordPool from '../components/WordPool';
import WinModal from '../components/WinModal';
import HelpModal from '../components/HelpModal';
import LeaderboardModal from '../components/LeaderBoard';
import ArchiveModal from '../components/ArchiveModal';

export default function App(): JSX.Element {
  // Audio variables
  const correctSound = new Audio(correctSoundFile);
  const wrongSound = new Audio(wrongSoundFile);
  const winSound = new Audio(winSoundFile);

  // Date State
  const [currentDate, setCurrentDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Data
  const todayEntry = bigramData.dailyBigramTower.find((entry) => entry.date === currentDate);
  const dayTheme = todayEntry?.theme ?? '';
  const startDate = new Date('2026-02-05');
  const dayNumber = currentDate
    ? Math.floor((new Date(currentDate).getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) +
      1
    : 0;

  // Other States
  const { username, loading } = useUser();
  const [isNewUser, setIsNewUser] = useState(false); // new user state
  const [resetTimer, setResetTimer] = useState(false); // timer state
  const [isRunning, setIsRunning] = useState(true); // play/pause
  const [towerBlocks, setTowerBlocks] = useState<string[]>([]); // tower state
  const [availableBlocks, setAvailableBlocks] = useState<string[]>( // blocks state
    todayEntry ? todayEntry.shuffled : []
  );
  const [solution, setSolution] = useState<string[]>(todayEntry ? todayEntry.solution : []); // solution
  const [hoverTop, setHoverTop] = useState(false); // placeholder
  const [completedTime, setCompletedTime] = useState<string | null>(null); // completion state
  const [showHelp, setShowHelp] = useState(false); // help modal state
  const [score, setScore] = useState(0); // score state
  const [userStatusChecked, setUserStatusChecked] = useState(false); // status state
  const [demoStep, setDemoStep] = useState(0); // demo state
  const [demoTower, setDemoTower] = useState<string[]>([]);
  const [demoUndo, setDemoUndo] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false); // leader board state
  const [showArchive, setShowArchive] = useState(false); // archive state
  const [isTowerShaking, setIsTowerShaking] = useState(false); // shake state
  const [penaltyTime, setPenaltyTime] = useState(0); // penalty state

  // Use refs
  const prevTowerLengthRef = React.useRef(0);
  const hasSavedRef = React.useRef(false);

  // Functions

  // Drag Function
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, block: string) => {
    e.dataTransfer.setData('text/plain', block);
  };

  // Drop Functions
  const handleDropAtTop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const block = e.dataTransfer.getData('text/plain');
    if (!block) return;

    setAvailableBlocks(availableBlocks.filter((b) => b !== block));
    setTowerBlocks([...towerBlocks, block]);
    setHoverTop(false);
  };

  // Send Data
  const saveCompletion = async (completedTime: string, finalScore: number) => {
    if (!username) return;

    try {
      const res = await fetch('/api/save-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          dayNumber,
          completedTime,
          score: finalScore,
        }),
      });

      const data = await res.json();
      if (data.status === 'success') {
        console.log('Completion data saved successfully');
      } else {
        console.warn('Failed to save completion data:', data.message);
      }
    } catch (err) {
      console.error('Error saving completion data:', err);
    }
  };

  // Undo Function
  const undoLastBlock = () => {
    if (towerBlocks.length === 0) return;

    const newTower = [...towerBlocks];
    const topBlock = newTower.pop()!;
    setTowerBlocks(newTower);
    setAvailableBlocks([topBlock, ...availableBlocks]);

    const index = newTower.length;
    let wasCorrect = false;

    if (index === 0) {
      wasCorrect = topBlock === solution[0];
    } else {
      const prevBlock = newTower[index - 1]!;
      const prevIndex = solution.indexOf(prevBlock);
      const expectedNext =
        prevIndex === -1 || prevIndex + 1 >= solution.length ? null : solution[prevIndex + 1];
      wasCorrect = topBlock === expectedNext;
    }

    if (wasCorrect) {
      setScore((prev) => Math.max(0, prev - 100));
    }
  };

  // Handle Blocks
  const handleBlockSelection = (word: string) => {
    setAvailableBlocks((prev) => prev.filter((b) => b !== word));
    setTowerBlocks((prev) => [...prev, word]);
  };

  // Handle Restart
  const handleRestart = () => {
    const entry = bigramData.dailyBigramTower.find((e) => e.date === currentDate);
    setTowerBlocks([]);
    setAvailableBlocks(entry ? entry.shuffled : []);
    setCompletedTime(null);
    setIsRunning(true);
    setResetTimer(true);
    setPenaltyTime(0);
    setScore(0);
    hasSavedRef.current = false;
  };

  // Use effect hooks

  // Date Hook
  useEffect(() => {
    const todayEntry = bigramData.dailyBigramTower.find((e) => e.date === currentDate);
    if (!todayEntry) return;

    setTowerBlocks([]);
    setAvailableBlocks(todayEntry.shuffled);
    setSolution(todayEntry.solution);
    setCompletedTime(null);
    setPenaltyTime(0);
    setScore(0);
    setIsRunning(true);
    setResetTimer(true);
  }, [currentDate]);

  // Help Modal Hook
  useEffect(() => {
    if (!username) return;

    const checkNewUser = async () => {
      try {
        const res = await fetch(`/api/check-new?username=${username}`);
        const data = await res.json();

        if (data.new === 'yes') {
          setIsNewUser(true);
          setShowHelp(true);
          setIsRunning(false);
        }
      } catch (err) {
        console.error('Error checking new user:', err);
      }
    };

    checkNewUser();
  }, [username]);

  // Check for completion
  useEffect(() => {
    if (
      solution.length > 0 &&
      towerBlocks.length === solution.length &&
      towerBlocks.every((block, i) => block === solution[i]) &&
      !completedTime
    ) {
      setIsRunning(false);
    }
  }, [towerBlocks, solution, completedTime, score]);

  // Check for correctness and score
  useEffect(() => {
    const prevLength = prevTowerLengthRef.current;

    if (towerBlocks.length > prevLength) {
      const newBlockIndex = towerBlocks.length - 1;
      const newBlock = towerBlocks[newBlockIndex];

      let isCorrect = false;

      if (newBlockIndex === 0) {
        isCorrect = newBlock === solution[0];
      } else {
        const prevBlock = towerBlocks[newBlockIndex - 1]!;
        const prevIndex = solution.indexOf(prevBlock);
        const expectedNext =
          prevIndex === -1 || prevIndex + 1 >= solution.length ? null : solution[prevIndex + 1];
        isCorrect = newBlock === expectedNext;
      }

      if (isCorrect) {
        correctSound.play().catch(() => {});
        setScore((prev) => prev + 100);
      } else {
        wrongSound.play().catch(() => {});
        setScore((prev) => prev - 25);
        setPenaltyTime((prev) => prev + 10);

        setIsTowerShaking(true);
        setTimeout(() => setIsTowerShaking(false), 500);
      }
    }

    prevTowerLengthRef.current = towerBlocks.length;
  }, [towerBlocks, solution]);

  // Check Status
  useEffect(() => {
    if (!username) return;

    const checkUserStatus = async () => {
      try {
        const newRes = await fetch(`/api/check-new?username=${username}`);
        const newData = await newRes.json();
        console.log(newData);
        if (newData.new === 'yes') {
          setIsNewUser(true);
          setShowHelp(true);
          setIsRunning(false);
          setUserStatusChecked(true);
          return;
        }

        const playedRes = await fetch(`/api/has-played?username=${username}&date=${currentDate}`);
        const playedData = await playedRes.json();
        console.log(playedData);
        if (playedData.played === 'yes') {
          setCompletedTime(playedData.bestTime || null);
          setPenaltyTime(0);
          setScore(playedData.bestTimeScore || 0);
          setIsRunning(false);
        }

        setUserStatusChecked(true);
      } catch (err) {
        console.error('Error checking user status:', err);
        setUserStatusChecked(true);
      }
    };

    checkUserStatus();
  }, [username, currentDate]);

  // Sae Completion
  useEffect(() => {
    if (!completedTime || !username) return;
    if (hasSavedRef.current) return;

    hasSavedRef.current = true;
    saveCompletion(completedTime, score);
  }, [completedTime, score, username]);

  // Demo Hook
  const demoBlocks = ['washing', 'machine', 'learning'];
  useEffect(() => {
    if (!showHelp) return;

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
  }, [showHelp, solution]);

  return (
    <div className="h-screen bg-[#4a4e69] relative">
      {/* If Loading */}
      {loading || !userStatusChecked ? (
        <div className="h-full w-full flex flex-col items-center justify-center text-white">
          <p className="text-xl font-semibold mb-2">Day {dayNumber}</p>
          <p className="text-md mb-6">{dayTheme}</p>
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-t-yellow-400 border-b-purple-500 animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-4 bg-yellow-400 rounded animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
          <p className="mt-6 text-lg font-medium animate-pulse">Loading tower...</p>
        </div>
      ) : (
        // If has loaded
        <>
          {/* Header */}
          <Header
            dayNumber={dayNumber}
            isRunning={isRunning}
            resetTimer={resetTimer}
            setResetTimer={setResetTimer}
            towerBlocks={towerBlocks}
            solution={solution}
            setCompletedTime={setCompletedTime}
            winSound={winSound}
            setShowHelp={setShowHelp}
            setIsRunning={setIsRunning}
            penaltyTime={penaltyTime}
          />
          {/* <div className="flex items-center justify-center my-2">
            <label className="text-white mr-2 font-medium">Select Date:</label>
            <input
              type="date"
              value={currentDate}
              min="2026-02-05"
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => {
                setCurrentDate(e.target.value);
                setUserStatusChecked(false);
              }}
              className="px-2 py-1 rounded-md border border-gray-300"
            />
          </div> */}

          {/* Pair */}
          <h1 className="text-gray-200 text-center text-md font-medium m-2">
            {/* {dayTheme}<br></br> */}
            {towerBlocks.length > 0
              ? towerBlocks[towerBlocks.length - 1] + ' ______'
              : `Hint: Starts with ${solution[0]}`}
          </h1>

          {/* Main */}
          <main className="flex w-full h-[80%] mt-2">
            {/* Word Pool */}
            <WordPool
              towerBlocks={towerBlocks}
              availableBlocks={availableBlocks}
              undoLastBlock={undoLastBlock}
              handleDragStart={handleDragStart}
              onSelectBlock={handleBlockSelection}
            />

            {/* Tower */}
            <div className="w-[60%] flex flex-col items-center px-6 pb-6">
              <div className="flex items-center mb-2">
                <h1 className="text-white text-xl font-bold mr-2">Tower</h1>
              </div>

              {/* Tower container */}
              <div
                className={`relative w-40 h-[95%] rounded-xl border border-[#c9ada7] overflow-hidden bg-gradient-to-b from-[#1a1a2e] to-[#22223b] shadow-[0_0_40px_rgba(255,200,100,0.15)]`}
              >
                {/* Particle layer */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="magic-particles" />
                </div>

                {/* Tower content */}
                <div className="relative z-10 flex flex-col-reverse h-full items-stretch overflow-hidden">
                  {/* Tower blocks */}
                  {towerBlocks.map((block, index) => {
                    let isCorrect = false;

                    if (index === 0) {
                      // first block
                      isCorrect = block === solution[0];
                    } else {
                      const prevBlock = towerBlocks[index - 1]!;
                      const prevIndex = solution.indexOf(prevBlock);
                      const expectedNext =
                        prevIndex === -1 || prevIndex + 1 >= solution.length
                          ? null
                          : solution[prevIndex + 1];
                      isCorrect = block === expectedNext;
                    }

                    return (
                      <div key={index} className={`h-[14.2857%] flex items-center justify-center`}>
                        <div
                          className={`h-full w-full flex items-center justify-center rounded-xl transition-all duration-300 ${
                            isCorrect
                              ? 'bg-slate-500 shadow-[0_0_0_rgba(0,255,150,0.6)]'
                              : 'bg-red-600 animate-pulse shadow-[0_0_20px_rgba(255,0,0,0.6)]'
                          }`}
                        >
                          <TowerBlock text={block} isTower />
                        </div>
                      </div>
                    );
                  })}

                  {/* Top drop zone */}
                  {towerBlocks.length < solution.length && (
                    <div
                      className={`h-[14.2857%] flex items-center justify-center relative transition-transform duration-500 ease-out`}
                      style={{
                        transform: hoverTop
                          ? 'translateY(-20%) scale(1.08)'
                          : 'translateY(0%) scale(1)',
                        boxShadow: hoverTop ? '0 0 30px rgba(255,215,100,0.8)' : '',
                      }}
                      onDrop={handleDropAtTop}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setHoverTop(true);
                      }}
                      onDragLeave={() => setHoverTop(false)}
                    >
                      <div className="h-full w-full flex items-center justify-center rounded-xl border-2 bg-yellow-400/10 backdrop-blur-sm animate-pulse">
                        <p className="text-gray-300 text-sm select-none tracking-widest">
                          Click on block
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Completed overlay */}
              {completedTime && (
                <WinModal
                  completedTime={completedTime}
                  score={score}
                  onRestart={handleRestart}
                  onOpenLeaderboard={() => setShowLeaderboard(true)}
                  onOpenArchive={() => setShowArchive(true)}
                />
              )}
            </div>
          </main>

          {showLeaderboard && (
            <LeaderboardModal
              dayNumber={dayNumber}
              username={username}
              onClose={() => setShowLeaderboard(false)}
            />
          )}

          {showArchive && (
            <ArchiveModal
              startDate="2026-02-05"
              currentDate={currentDate!}
              onClose={() => setShowArchive(false)}
              onSelectDate={(date) => {
                setCurrentDate(date);
                setUserStatusChecked(false);
                hasSavedRef.current = false;
              }}
            />
          )}

          {/* Help Modal */}
          {showHelp && (
            <HelpModal
              demoBlocks={demoBlocks}
              demoTower={demoTower}
              setShowHelp={setShowHelp}
              setIsRunning={setIsRunning}
            />
          )}

          {/* Style */}
          <style>
            {`
              @keyframes dropDemo {
                0% { transform: translateY(-20%) scale(1.05); }
                50% { transform: translateY(0%) scale(1); }
                100% { transform: translateY(-10%) scale(1.05); }
              }
            `}
          </style>
        </>
      )}
    </div>
  );
}
