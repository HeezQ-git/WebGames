import { fetcher } from '@/lib/fetcher';
import { Game, GlobalStore } from '@/types/globalStore';
import toast from 'react-hot-toast';
import { create } from 'zustand';

export const useGlobalStore = create<GlobalStore>((set: (o: object) => void, get: () => any) => ({
  confetti: false,
  dropConfetti: () => {
    set({ confetti: true });
    setTimeout(() => set({ confetti: false }), 8000);
  },

  isLoading: false,
  setIsLoading: (isLoading: boolean) => set({ isLoading }),

  foundWords: [],
  setFoundWords: (wordList: string[]) => set({ wordList }),

  input: [],
  addLetter: (letter: string) => set((state: GlobalStore) => ({ input: [...state.input, letter] })),
  removeLetter: () => set((state: GlobalStore) => ({ input: state.input.slice(0, -1) })),
  resetInput: () => set({ input: [] }),

  keys: [],
  setKeys: (keys: string[]) => set({ keys }),
  shuffleKeys: () => set((state: GlobalStore) => ({ keys: state.keys.sort(() => Math.random() - 0.5) })),
  centerLetter: '',

  currentRank: 0,
  setCurrentRank: (currentRank: number) => set({ currentRank }),

  points: 0,
  setPoints: (points: number) => set({ points }),
  maximumPoints: 0,
  setMaximumPoints: (maximumPoints: number) => set({ maximumPoints }),

  ranks: [
    { name: 'Genius', percentage: 70, index: 8 },
    { name: 'Amazing', percentage: 50, index: 7 },
    { name: 'Great', percentage: 40, index: 6 },
    { name: 'Nice', percentage: 25, index: 5 },
    { name: 'Solid', percentage: 15, index: 4 },
    { name: 'Good', percentage: 8, index: 3 },
    { name: 'Moving Up', percentage: 5, index: 2 },
    { name: 'Good Start', percentage: 2, index: 1 },
    { name: 'Beginner', percentage: 0, index: 0 },
  ],
  ranksPoints: [],
  setRanksPoints: (ranksPoints: { points: number; index: number }[]) => set({ ranksPoints }),

  games: [],
  setGames: (games: Game[]) => set({ games }),
  currentGame: '',
  setCurrentGame: (currentGame: string) => {
    const foundGame = get().games.find((game: Game) => game.id === currentGame);
    if (foundGame) {
      localStorage.setItem('lastPlayed', currentGame);
      set({ currentGame, keys: foundGame?.letters, centerLetter: foundGame?.centerLetter, foundWords: foundGame?.enteredWords, points: foundGame?.score, maximumPoints: foundGame?.maximumScore })
    }
  },
  fetchGames: async () => {
    const games = await fetcher('GET')('api/game/all');
    set({ games });
  },
  resetGame: () => {
    set({ currentGame: '', keys: [], centerLetter: '', foundWords: [], points: 0, maximumPoints: 0 })
  },

  checkWord: async () => {
    toast.dismiss();
    if (get().input.length <= 0) return toast.error('Enter a word dummy!')
    const word = get().input.join('');

    if (word.length < 4) return toast.error('Too short!')
    else if (word.length > 19) return toast.error('Too long!');

    for (const letter of word) {
      if (!get().keys.includes(letter)) return toast.error('Bad letters!')
    }

    if (!word.includes(get().centerLetter)) return toast.error('Missing center letter!');

    if (get().foundWords.includes(word.toLowerCase())) return toast.error('Already found!');

    const id = toast.loading('Checking...');
    const response = await fetcher('POST')('api/word/check', { gameId: get().currentGame, word, profanesAllowed: true });

    if (response?.error) return toast.error(response.error, { id });
    else if (response?.message) {
      toast.success(`${response.message} +${response.wordScore}pts`, { id });

      if (response.newScore >= get().ranksPoints[0].points)
        get().dropConfetti();

      set({
        foundWords: response.wordList,
        points: response.newScore,
      });
    }
  },
}));