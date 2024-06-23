import { useFetcherSWR } from '@/lib/fetcher';
import { useGameStore } from '@/stores/Wordle/gameStore';
import { useEffect } from 'react';
import { useSessionStore } from '@/stores/sessionStore';

const swrOptions = {
  revalidateOnReconnect: false,
  revalidateIfStale: false,
  revalidateOnFocus: false,
  errorRetryInterval: 60000,
};

export const useWordListManager = () => {
  const { setWordList } = useGameStore();
  const { session } = useSessionStore();

  const { data: words, isLoading: wordsIsLoading } = useFetcherSWR<string[]>(
    'GET',
    'api/wordle/word/list',
    undefined,
    { swrOptions }
  );

  const { data: profaneWords, isLoading: profaneWordsIsLoading } =
    useFetcherSWR<string[]>('GET', 'api/wordle/word/list/profane', undefined, {
      swrOptions,
    });

  useEffect(() => {
    if (!wordsIsLoading && !profaneWordsIsLoading) {
      if (
        words?.length &&
        profaneWords?.length &&
        session?.data?.user?.settings?.profanesAllowed
      ) {
        setWordList(new Set<string>(words.concat(profaneWords)));
      } else if (words?.length) setWordList(new Set<string>(words))
    }
  }, [
    words,
    wordsIsLoading,
    profaneWords,
    profaneWordsIsLoading,
    setWordList,
    session,
  ]);
};
