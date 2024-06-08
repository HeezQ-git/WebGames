import { useEffect, useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { useGlobalStore } from '@/stores/global';
import { Game } from '@/types/globalStore';
import { fetcher, useFetcherSWR } from '@/lib/fetcher';
import { useSessionManager } from './useSessionManager';
import { useRanks } from './useRanks';

export const useGameManager = () => {
  const [retryCount, setRetryCount] = useState(0);
  const {
    isLoading: globalIsLoading,
    setIsLoading,
    points,
    currentGame,
    fetchGames,
    setFetchGames,
    setGames,
    setCurrentGame,
  } = useGlobalStore();

  const {
    data: games,
    isLoading,
    mutate,
  } = useFetcherSWR<Game[]>('GET', 'api/game/all', undefined, {
    swrOptions: {
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      errorRetryInterval: 60000,
    },
  });

  const { session, pid, setPid, handleSession } = useSessionManager();
  const { ranksPoints, getCurrentRank } = useRanks();

  const getLastPlayedGame = useCallback(() => {
    if (games?.length) {
      const lastPlayed = localStorage.getItem('lastPlayed');

      if (!currentGame && lastPlayed) {
        const foundGame = games.find((game) => game.id === lastPlayed);

        if (!foundGame) {
          localStorage.removeItem('lastPlayed');
          setCurrentGame(games[0].id, games);
        } else {
          setCurrentGame(lastPlayed, games);
        }
      } else if (!currentGame || !games.find((game) => game.id === currentGame)) {
        setCurrentGame(games[0].id, games);
      }
    }
  }, [currentGame, games, setCurrentGame]);

  const createNewGame = useCallback(async () => {
    const toastId = toast.loading('Creating a new game...');
    setIsLoading(true);

    try {
      const game = await fetcher('POST')('api/game/create');

      if (game?.id) {
        if (retryCount < 4) {
          await mutate();
          setCurrentGame(game.id);
          toast.success('Game created!', { id: toastId });
          setRetryCount((prev) => prev + 1);
        }
      } else {
        throw new Error('Failed to create a new game');
      }
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to create a new game', {
        id: toastId,
      });
    }

    setIsLoading(false);
  }, [mutate, retryCount, setCurrentGame, setIsLoading]);

  const manageGames = useCallback(async () => {
    if (session.status === 'loading') {
      await mutate();
      return;
    }

    if (!games?.length && !isLoading && !globalIsLoading && session.status === 'authenticated') {
      await createNewGame();
    }

    if (!fetchGames) {
      setFetchGames(mutate);
    }

    getLastPlayedGame();
    setGames(games || []);
  }, [
    session.status,
    games,
    isLoading,
    globalIsLoading,
    fetchGames,
    mutate,
    createNewGame,
    getLastPlayedGame,
    setFetchGames,
    setGames,
  ]);

  useEffect(() => {
    manageGames();
  }, [manageGames]);

  useEffect(() => {
    handleSession();
  }, [handleSession]);

  useEffect(() => {
    if (
      (session?.status === 'authenticated' &&
        pid !== session?.data?.user?.pid) ||
      !pid
    ) {
      setPid(session?.data?.user?.pid);
      mutate();
      getLastPlayedGame();
    }
  }, [session?.status, session?.data, pid, mutate, getLastPlayedGame]);

  useEffect(() => {
    useGlobalStore.setState({
      currentRank: getCurrentRank(points),
      ranksPoints,
    });
  }, [points, ranksPoints, getCurrentRank]);
};
