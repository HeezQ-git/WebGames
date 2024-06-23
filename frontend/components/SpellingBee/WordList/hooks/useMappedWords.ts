/* eslint-disable indent */
import { useMemo } from 'react';
import { Word } from '../types';
import { useGameStore } from '@/stores/SpellingBee/gameStore';
import { useInputStore } from '@/stores/SpellingBee/inputStore';
import { useSessionStore } from '@/stores/sessionStore';

export const useMappedWords = (): Word[] => {
  const { foundWords } = useGameStore();
  const { keys } = useInputStore();
  const { session } = useSessionStore();

  const mappedWords = useMemo(
    () =>
      foundWords
        .map((word) => ({
          text: word,
          pangram: new Set(word.split('')).size === keys.length,
        }))
        .sort((a, b) => {
          const sortBy =
            session?.data?.user?.settings?.wordListSortBy || 'ALPHABETICAL';

          switch (sortBy) {
            case 'LATEST_FIRST':
              return foundWords.indexOf(b.text) - foundWords.indexOf(a.text);
            case 'OLDEST_FIRST':
              return foundWords.indexOf(a.text) - foundWords.indexOf(b.text);
            case 'ALPHABETICAL':
            default:
              return a.text.localeCompare(b.text);
          }
        }),
    [foundWords, keys, session?.data?.user?.settings?.wordListSortBy, session]
  );

  return mappedWords;
};
