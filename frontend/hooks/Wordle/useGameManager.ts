import { useFetcherSWR } from "@/lib/fetcher";
import { Stats, useGameStore } from "@/stores/Wordle/gameStore";
import { useEffect } from "react";
import toast from "react-hot-toast";

type Game = {
  wordToGuess: string;
  enteredWords: string[];
  hasWon?: boolean;
  hasEnded?: boolean;
}

export const useGameManager = () => {
  const { data: game, isLoading: gameIsLoading } = useFetcherSWR<Game>(
    'GET',
    'api/wordle/game',
    undefined,
    {
      swrOptions: {
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        keepPreviousData: true,
      }
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
      }
    }
  );

  useEffect(() => {
    if (!gameIsLoading && !statsLoading) {
      useGameStore.setState({
        wordToGuess: game?.wordToGuess!,
        enteredWords: game?.enteredWords || [],
        hasWon: game?.hasWon || false,
        hasEnded: game?.hasEnded || false,
        stats: stats,
      });
      toast.dismiss('game-loading');
    } else toast.loading('Loading game...', { id: 'game-loading' });
  }, [game, gameIsLoading, stats, statsLoading]);
}