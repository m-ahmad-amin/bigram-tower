import { useEffect, useState } from 'react';

interface InitResponse {
  type: string;
  username: string | null;
  postId: string;
}

export const useUser = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch('/api/init');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: InitResponse = await res.json();
        setUsername(data.username);
      } catch (err) {
        console.error('Failed to fetch username', err);
      } finally {
        setLoading(false);
      }
    };
    void init();
  }, []);

  return { username, loading };
};