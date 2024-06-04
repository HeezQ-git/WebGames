export type CorrectWord = {
  word: string;
  isProfane: boolean;
  points: number;
}

export type Game = {
  id: string;
  centerLetter: string;
  letters: string[];
  enteredWords: string[];
  correctWords: CorrectWord[];
  maximumScore: number;
  score: number;
}

export interface GlobalStore {
  confetti: boolean;
  dropConfetti: () => void;

  invite: null | string;
  setInvite: (invite: null | string) => void;

  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;

  foundWords: string[];
  setFoundWords: (wordList: string[]) => void;

  input: string[];
  addLetter: (letter: string) => void;
  removeLetter: () => void;
  resetInput: () => void;

  keys: string[];
  setKeys: (keys: string[]) => void;
  shuffleKeys: () => void;

  currentRank: number;
  setCurrentRank: (currentRank: number) => void;
  centerLetter: string;

  points: number;
  setPoints: (points: number) => void;
  maximumPoints: number;
  setMaximumPoints: (maximumPoints: number) => void;

  ranks: { name: string; percentage: number; index: number }[];
  ranksPoints: { points: number; index: number }[];
  setRanksPoints: (ranksPoints: { points: number; index: number }[]) => void;

  games: Game[];
  setGames: (games: Game[]) => void;
  currentGame: string;
  setCurrentGame: (currentGame: string, games?: Game[]) => void;
  fetchGames: null | (() => void);
  setFetchGames: (fetcher: () => void) => void;
  resetGame: () => void;

  checkWord: () => void;
}