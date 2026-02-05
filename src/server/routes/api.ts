import { Router } from 'express';
import { redis } from '@devvit/web/server';

const router = Router();

// Check if user is new
router.get('/api/check-new', async (req, res) => {
  try {
    const { username } = req.query as { username?: string };
    if (!username)
      return res.status(400).json({ status: 'error', message: 'username is required' });

    const gamesPlayedKey = `user:${username}:gamesPlayed`;
    const exists = await redis.exists(gamesPlayedKey);

    if (!exists) return res.json({ new: 'yes' });

    const countStr = await redis.get(gamesPlayedKey);
    const count = countStr ? parseInt(countStr) : 0;

    return res.json({ new: count === 0 ? 'yes' : 'no' });
  } catch (err) {
    console.error('Check new user error:', err);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Save puzzle completion
router.post('/api/save-data', async (req, res) => {
  try {
    const { username, dayNumber, completedTime, score } = req.body as {
      username?: string;
      dayNumber?: number;
      completedTime?: string;
      score?: number;
    };

    if (!username || dayNumber === undefined || !completedTime || score === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'username, dayNumber, completedTime, and score are required',
      });
    }

    const puzzleKey = `puzzle:${dayNumber}:${username}`;
    const currentDataStr = await redis.get(puzzleKey);

    let data = currentDataStr
      ? JSON.parse(currentDataStr)
      : { bestTime: null, bestTimeScore: null, bestScore: null, bestScoreTime: null };

    const [minutes, seconds] = completedTime.split(':').map(Number) as [number, number];
    const newTimeMs = minutes * 60 * 1000 + seconds * 1000;

    const prevBestTimeMs = data.bestTime
      ? (() => {
          const [m, s] = data.bestTime.split(':').map(Number);
          return m * 60 * 1000 + s * 1000;
        })()
      : Infinity;

    if (newTimeMs < prevBestTimeMs) {
      data.bestTime = completedTime;
      data.bestTimeScore = score;
    }

    if (score > (data.bestScore ?? -Infinity)) {
      data.bestScore = score;
      data.bestScoreTime = completedTime;
    }

    await redis.set(puzzleKey, JSON.stringify(data));

    const gamesPlayedKey = `user:${username}:gamesPlayed`;
    if (!currentDataStr) {
      const currentCountStr = await redis.get(gamesPlayedKey);
      const currentCount = currentCountStr ? parseInt(currentCountStr) : 0;
      await redis.set(gamesPlayedKey, (currentCount + 1).toString());
    }

    const leaderboardKey = `leaderboard:${dayNumber}`;
    const lbStr = await redis.get(leaderboardKey);
    const leaderboard = lbStr ? JSON.parse(lbStr) : {};

    leaderboard[username] = {
      bestTime: data.bestTime,
      bestTimeScore: data.bestTimeScore,
    };

    await redis.set(leaderboardKey, JSON.stringify(leaderboard));

    res.json({ status: 'success', message: 'Puzzle data saved/updated successfully', data });
  } catch (err) {
    console.error('Save data error:', err);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Check if user has played
router.get('/api/has-played', async (req, res) => {
  try {
    const { username, date } = req.query as { username?: string; date?: string };
    if (!username)
      return res.status(400).json({ status: 'error', message: 'username is required' });

    const selectedDate = date ? new Date(date) : new Date();
    if (isNaN(selectedDate.getTime()))
      return res.status(400).json({ status: 'error', message: 'Invalid date' });

    const startDate = new Date('2026-01-31');
    const dayNumber =
      Math.floor((selectedDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const puzzleKey = `puzzle:${dayNumber}:${username}`;
    const dataStr = await redis.get(puzzleKey);

    if (!dataStr) return res.json({ played: 'no' });

    const data = JSON.parse(dataStr);

    res.json({
      played: 'yes',
      bestTime: data.bestTime,
      bestTimeScore: data.bestTimeScore,
      bestScore: data.bestScore,
      bestScoreTime: data.bestScoreTime,
    });
  } catch (err) {
    console.error('Has played error:', err);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

// Leaderboard
router.get('/api/leaderboard', async (req, res) => {
  try {
    const { dayNumber, username } = req.query as { dayNumber?: string; username?: string };

    if (!dayNumber) {
      return res.status(400).json({ status: 'error', message: 'dayNumber is required' });
    }

    const dayNum = parseInt(dayNumber);
    if (isNaN(dayNum) || dayNum <= 0) {
      return res.status(400).json({ status: 'error', message: 'Invalid dayNumber' });
    }

    const leaderboardKey = `leaderboard:${dayNum}`;
    const lbStr = await redis.get(leaderboardKey);

    if (!lbStr) {
      return res.json({ status: 'success', dayNumber: dayNum, leaderboard: [], myRank: null });
    }

    const obj = JSON.parse(lbStr);

    const entries = Object.entries(obj).map(([user, v]: [string, any]) => ({
      username: user,
      bestTime: v.bestTime,
      bestTimeScore: v.bestTimeScore ?? 0,
    }));

    const timeToMs = (t: string) => {
      const [m = 0, s = 0] = t.split(':').map(Number);
      return m * 60 * 1000 + s * 1000;
    };

    entries.sort((a, b) => {
      const timeDiff = timeToMs(a.bestTime) - timeToMs(b.bestTime);
      if (timeDiff !== 0) return timeDiff;
      return b.bestTimeScore - a.bestTimeScore;
    });

    const leaderboard = entries.map((entry, index) => ({
      rank: index + 1,
      username: entry.username,
      bestTime: entry.bestTime,
      bestTimeScore: entry.bestTimeScore,
    }));

    const myRank =
      username != null ? (leaderboard.find((e) => e.username === username)?.rank ?? null) : null;

    res.json({ status: 'success', dayNumber: dayNum, leaderboard, myRank });
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

export default router;