import React, { useEffect, useState } from 'react';

interface LeaderboardModalProps {
  dayNumber: number;
  username?: string | null;
  onClose: () => void;
}

interface LeaderboardEntry {
  rank: number;
  username: string;
  bestTime: string;
  bestTimeScore: number;
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ dayNumber, username, onClose }) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [myRank, setMyRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`/api/leaderboard?dayNumber=${dayNumber}`);
        const data = await res.json();

        if (data.status === 'success') {
          let entries: LeaderboardEntry[] = data.leaderboard;

          let top7 = entries.slice(0, 7);

          const isUserInTop7 = username ? top7.some((e) => e.username === username) : true;

          if (!isUserInTop7 && username && data.myRank) {
            const userEntry = entries.find((e) => e.username === username);
            if (userEntry) {
              top7 = [...top7, userEntry];
            }
          }

          setLeaderboard(top7);
          if (username) setMyRank(data.myRank ?? null);
        }
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [dayNumber, username]);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#22223b] rounded-xl p-6 w-[90%] max-w-md flex flex-col gap-4 relative h-[80vh]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white font-bold text-xl hover:cursor-pointer transition"
        >
          ✕
        </button>

        <h2 className="text-2xl text-white font-bold text-center mb-2">Leaderboard</h2>

        {loading ? (
          <p className="text-white text-center">Loading...</p>
        ) : leaderboard.length === 0 ? (
          <p className="text-white text-center">No entries yet.</p>
        ) : (
          <div className="overflow-y-auto max-h-96 flex flex-col gap-2">
            {leaderboard.map((entry) => (
              <div
                key={entry.rank}
                className={`border border-white flex justify-between px-3 py-2 rounded-xl items-center ${
                  entry.username === username ? 'bg-yellow-500/20' : ''
                }`}
              >
                <span className="text-white font-bold">{entry.rank}. Time: {entry.bestTime}</span>
                <div className="flex gap-3">
                  <span className="text-white">Score: {entry.bestTimeScore}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {myRank !== null && (
          <p className="text-white text-center mt-2">
            Your Rank: {myRank}
          </p>
        )}
      </div>
    </div>
  );
};

export default LeaderboardModal;