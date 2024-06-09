import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { fetcher } from '@/lib/fetcher';
import { useGameStore } from '@/stores/gameStore';

const refreshTimeLimit = 5000;

export const useGameActions = () => {
  const [lastUpdatedGames, setLastUpdatedGames] = useState<Date | null>(null);
  const { fetchGames, currentGame, resetGame } = useGameStore();

  const deleteGame = async (id: string) => {
    await toast.promise(
      fetcher('DELETE')(`api/game/${id}`),
      {
        loading: 'Deleting the game...',
        success: 'Game deleted!',
        error: 'Failed to delete the game',
      },
      { position: 'top-right' }
    );

    if (currentGame === id) resetGame();
    await fetchGames?.();
  };

  const refreshGames = async () => {
    if (lastUpdatedGames) return;

    toast.promise(
      fetchGames?.() as any,
      {
        loading: 'Refreshing games...',
        success: 'Games refreshed!',
        error: 'Failed to refresh games',
      },
      { position: 'top-right' }
    );
    setLastUpdatedGames(new Date());
  };

  useEffect(() => {
    if (!lastUpdatedGames) return;

    const timer = setTimeout(() => {
      setLastUpdatedGames(null);
    }, refreshTimeLimit);

    return () => clearTimeout(timer);
  }, [lastUpdatedGames]);

  return {
    lastUpdatedGames,
    deleteGame,
    refreshGames,
    setLastUpdatedGames,
  };
};
