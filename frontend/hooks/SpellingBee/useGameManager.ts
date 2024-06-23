import { useEffect, useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { useGlobalStore } from '@/stores/globalStore';
import { useGameStore, Game } from '@/stores/SpellingBee/gameStore';
import { useRankStore } from '@/stores/SpellingBee/rankStore';
import { fetcher, useFetcherSWR } from '@/lib/fetcher';
import { useRanks } from './useRanks';
import { useSessionStore } from '@/stores/sessionStore';

export const useGameManager = () => {
  const [retryCount, setRetryCount] = useState(0);
  const { isLoading: globalIsLoading, setIsLoading } = useGlobalStore();
  const { points, currentGame, fetchGames, setFetchGames, setGames, setCurrentGame } = useGameStore();
  const { setRanksPoints, setCurrentRank } = useRankStore();

  const { data: games, isLoading, mutate } = useFetcherSWR<Game[]>('GET', 'api/spelling-bee/game/all', undefined, {
    swrOptions: {
      revalidateOnReconnect: false,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      errorRetryInterval: 60000,
    },
  });

  const [pid, setPid] = useState<string | undefined>();
  const { session } = useSessionStore();
  const { ranksPoints, getCurrentRank } = useRanks();

  const getLastPlayedGame = useCallback(async () => {
    if (games?.length) {
      const lastPlayed = localStorage.getItem('sbLastPlayed');

      if (!currentGame && lastPlayed) {
        const foundGame = games.find((game) => game.id === lastPlayed);

        if (!foundGame) {
          localStorage.removeItem('sbLastPlayed');
          setCurrentGame(games[0].id, games);
        } else {
          setCurrentGame(lastPlayed, games);
        }
      } else if (!currentGame || !games.find((game) => game.id === currentGame)) {
        setCurrentGame(games[0].id, games);
      } else {
        setCurrentGame(currentGame, games);
      }
    }
  }, [currentGame, games, setCurrentGame, setIsLoading, mutate]);

  const createNewGame = useCallback(async () => {
    const toastId = toast.loading('Creating a new game...');
    setIsLoading(true);

    try {
      const game = await fetcher('POST')('api/spelling-bee/game/create');

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
      setIsLoading(false);
    }

    setIsLoading(false);
  }, [mutate, retryCount, setCurrentGame, setIsLoading]);

  const manageGames = useCallback(async () => {
    setGames(games || []);
    await getLastPlayedGame();

    if (!games?.length && !isLoading && !globalIsLoading && session?.status === 'authenticated') {
      await createNewGame();
    }

    if (!fetchGames) {
      setFetchGames(mutate);
    }
  }, [
    session?.status,
    games,
    isLoading,
    globalIsLoading,
    fetchGames,
    mutate,
    createNewGame,
    getLastPlayedGame,
  ]);

  // when user logs in, get their games and set the last played game
  useEffect(() => {
    (async () => {
      if (
        session?.status === 'authenticated' &&
        (pid !== session?.data?.user?.pid ||
          !pid) && !isLoading
      ) {
        setPid(session?.data?.user?.pid);
        await mutate();
        getLastPlayedGame();
      }
    })();
  }, [session?.status, session?.data, pid, mutate, getLastPlayedGame, isLoading]);

  useEffect(() => {
    setRanksPoints(ranksPoints);
    setCurrentRank(getCurrentRank(points));
  }, [points, ranksPoints, getCurrentRank, setRanksPoints, setCurrentRank]);

  useEffect(() => {
    manageGames();
  }, [manageGames]);
};
