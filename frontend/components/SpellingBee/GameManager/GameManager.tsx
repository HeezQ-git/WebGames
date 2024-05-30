'use client';
import { fetcher, useFetcherSWR } from '@/lib/fetcher';
import { useGlobalStore } from '@/stores/global';
import { Game } from '@/types/globalStore';
import { useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';

const GameManager = () => {
  const {
    setIsLoading,
    fetchGames,
    setCurrentGame,
    ranks,
    maximumPoints,
    points,
    currentGame,
    isLoading: globalIsLoading,
  } = useGlobalStore();

  const {
    data: games,
    isLoading,
    mutate,
  } = useFetcherSWR<Game[]>('GET', 'api/game/all');

  // Calculate the points for each rank based on the percentage of the maximum points
  const ranksPoints = useMemo(
    () =>
      ranks.map((rank) => ({
        points: Math.floor((rank.percentage / 100) * maximumPoints),
        index: rank.index,
      })),
    [ranks, maximumPoints]
  );

  const getCurrentRank = (points: number) => {
    if (!ranksPoints) return 0;

    return ranksPoints.find((rank) => points >= rank.points)?.index || 0;
  };

  useEffect(() => {
    (async () => {
      if (!games?.length && !isLoading && !globalIsLoading) {
        const toastId = toast.loading('Creating a new game...');
        setIsLoading(true);

        const game = await fetcher('POST')('api/game/create');
        console.log(game);

        if (game?.id) {
          await mutate();
          setCurrentGame(game.id);
          setIsLoading(false);
          toast.success('Game created!', {
            id: toastId,
          });
        } else {
          toast.error('Failed to create a new game', {
            id: toastId,
          });
        }

        return;
      }

      if (games?.length) {
        const lastPlayed = localStorage.getItem('lastPlayed');

        if (!currentGame && lastPlayed) {
          if (!games.find((game) => game.id === lastPlayed)) {
            localStorage.removeItem('lastPlayed');
            setCurrentGame(games[0].id);
          } else {
            setCurrentGame(lastPlayed);
          }
        } else if (!currentGame) {
          setCurrentGame(games[0].id);
        }
      }
    })();
  }, [isLoading, globalIsLoading, games, ranksPoints, maximumPoints]);

  useEffect(() => {
    useGlobalStore.setState({
      currentRank: getCurrentRank(points),
      ranksPoints,
    });
  }, [points, ranksPoints, isLoading]);

  useEffect(() => {
    if (games?.length) {
      useGlobalStore.setState({ games });
    }
  }, [isLoading]);

  return null;
};

export default GameManager;
