import { useState, useMemo } from 'react';
import { useGameStore } from '@/stores/gameStore';

export const useHintData = () => {
  const [skipFound, setSkipFound] = useState(false);
  const { games, currentGame, foundWords } = useGameStore();
  const wordlist = games?.find((game) => game.id === currentGame)?.correctWords;

  const getTally = (amountOfLetters: number) =>
    wordlist
      ?.filter((word) => {
        if (skipFound && foundWords.includes(word?.word)) return false;
        return true;
      })
      ?.reduce((acc, word) => {
        const twoLetters = word?.word
          ?.slice(0, amountOfLetters)
          .toLocaleUpperCase();
        acc[twoLetters] = (acc[twoLetters] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

  const letterDistribution = getTally(1);

  const wordLengths = useMemo(() =>
    wordlist
      ?.map((word) => word?.word.length)
      .reduce((acc, length) => {
        acc[length] = (acc[length] || 0) + 1;
        return acc;
      }, {} as Record<number, number>) || {}, [wordlist]);

  const wordsLeft = (wordlist?.length || 0) - foundWords.length;

  const pangrams = wordlist?.filter((word) => word?.isPangram);
  const pangramsLeft = pangrams?.filter(
    (word) => !foundWords.includes(word?.word)
  );

  const perfectPangrams = wordlist?.filter(
    (word) => new Set(word?.word).size === 7
  );
  const perfectPangramsLeft = perfectPangrams?.filter(
    (word) => !foundWords.includes(word?.word)
  );

  const bingo = !Object.values(letterDistribution).some(
    (amount) => amount === 0
  );

  return {
    skipFound,
    setSkipFound,
    wordsLeft,
    wordlist,
    pangrams,
    pangramsLeft,
    perfectPangrams,
    perfectPangramsLeft,
    bingo,
    letterDistribution,
    wordLengths,
    getTally,
  };
};
