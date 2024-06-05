import { fetcher, useFetcherSWR } from '@/lib/fetcher';
import { useGlobalStore } from '@/stores/global';
import { Game } from '@/types/globalStore';
import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useCallback, useState } from 'react';
import toast from 'react-hot-toast';

const useGameManager = () => {
  const [retryCount, setRetryCount] = useState(0);

  const {
    isLoading: globalIsLoading,
    setIsLoading,
    ranks,
    maximumPoints,
    points,
    currentGame,
    fetchGames,
    setFetchGames,
    setGames,
    setCurrentGame,
    setProfanesAllowed,
    setSession,
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

  const session = useSession();

  const ranksPoints = useMemo(
    () =>
      ranks.map((rank) => ({
        points: Math.floor((rank.percentage / 100) * maximumPoints),
        index: rank.index,
      })),
    [ranks, maximumPoints]
  );

  const getCurrentRank = useCallback(
    (points: number) => {
      const arePointsZero = points === undefined || points === 0;
      const isSecondRankZero =
        ranksPoints.find((rank) => rank.index === 1)?.points !== 0;

      return arePointsZero && isSecondRankZero
        ? 0
        : ranksPoints.find((rank) => points >= rank.points)?.index || 0;
    },
    [ranksPoints]
  );

  useEffect(() => {
    const manageGames = async () => {
      setIsLoading(true);
      if (session.status === 'loading') return;
      else if (session.status === 'unauthenticated')
        return toast.loading('Creating guest account...', { id: 'guest' });
      else toast.dismiss('guest');

      if (!fetchGames) setFetchGames(mutate);

      if (!games?.length && !isLoading && !globalIsLoading) {
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
          toast.error(`Failed to create a new game`, {
            id: toastId,
          });
        } finally {
          setIsLoading(false);
        }
      }

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
        } else if (!currentGame) {
          setCurrentGame(games[0].id, games);
        }
      }

      setGames(games || []);
    };

    manageGames();

    useGlobalStore.setState({
      currentRank: getCurrentRank(points),
      ranksPoints,
    });

    setIsLoading(false);
  }, [
    fetchGames,
    games,
    isLoading,
    globalIsLoading,
    mutate,
    setFetchGames,
    setIsLoading,
    setCurrentGame,
    setGames,
    getCurrentRank,
    points,
    ranksPoints,
    session.status,
    retryCount,
  ]);

  useEffect(() => {
    setSession(session);
    if (session?.status === 'loading' || session?.status === 'unauthenticated')
      return;

    setProfanesAllowed(session?.data?.user?.profanesAllowed || false);
  }, [setSession, session?.status, session?.data, setProfanesAllowed]);
};

export default useGameManager;
