import { useFetcherSWR } from '@/lib/fetcher';
import { GameState, Stats, useGameStore } from '@/stores/Wordle/gameStore';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export const useGameManager = () => {
  const { data: game, isLoading: gameIsLoading } = useFetcherSWR<GameState>(
    'GET',
    'api/wordle/game',
    undefined,
    {
      swrOptions: {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        keepPreviousData: true,
      },
    }
  );

  const { data: stats, isLoading: statsLoading } = useFetcherSWR<Stats>(
    'GET',
    'api/wordle/game/stats',
    undefined,
    {
      swrOptions: {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        keepPreviousData: true,
      },
    }
  );

  useEffect(() => {
    if (gameIsLoading || statsLoading) {
      toast.loading('Loading game...', { id: 'game-loading' });
      return;
    }

    if (game) useGameStore.getState().applyGameState({ ...game, stats });
    else if (stats) useGameStore.setState({ stats });

    toast.dismiss('game-loading');
  }, [game, gameIsLoading, stats, statsLoading]);
};
