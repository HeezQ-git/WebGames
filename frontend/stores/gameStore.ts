import { create } from 'zustand';
import { fetcher } from '@/lib/fetcher';
import toast from 'react-hot-toast';
import { useInputStore } from './inputStore';
import { useConfettiStore } from './confettiStore';
import { useRankStore } from './rankStore';
import { useSessionStore } from './sessionStore';

export type CorrectWord = {
  word: string;
  isPangram: boolean;
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

interface GameStore {
  games: Game[];
  setGames: (games: Game[]) => void;
  currentGame: string;
  setCurrentGame: (currentGame: string, games?: Game[]) => void;
  fetchGames: (() => void) | null;
  setFetchGames: (fetcher: () => void) => void;
  resetGame: () => void;
  checkWord: () => void;
  foundWords: string[];
  setFoundWords: (wordList: string[]) => void;
  points: number;
  setPoints: (points: number) => void;
  maximumPoints: number;
  setMaximumPoints: (maximumPoints: number) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  games: [],
  setGames: (games) => set({ games }),
  currentGame: '',
  setCurrentGame: (currentGame, games) => {
    const foundGame = (games || get().games)?.find((game: Game) => game.id === currentGame);
    if (foundGame) {
      localStorage.setItem('lastPlayed', currentGame);
      set({ currentGame });
      useInputStore.setState({ keys: foundGame?.letters, centerLetter: foundGame?.centerLetter });
      set({ foundWords: foundGame?.enteredWords, points: foundGame?.score, maximumPoints: foundGame?.maximumScore });
    }
  },
  fetchGames: null,
  setFetchGames: (fetcher) => set({ fetchGames: fetcher }),
  resetGame: () => {
    set({ currentGame: '', foundWords: [], points: 0, maximumPoints: 0 });
    useInputStore.setState({ keys: [], centerLetter: '' });
  },
  foundWords: [],
  setFoundWords: (wordList) => set({ foundWords: wordList }),
  points: 0,
  setPoints: (points) => set({ points }),
  maximumPoints: 0,
  setMaximumPoints: (maximumPoints) => set({ maximumPoints }),
  checkWord: async () => {
    const currentGame = get().currentGame;
    const inputStore = useInputStore.getState();
    const sessionStore = useSessionStore.getState();
    const rankStore = useRankStore.getState();
    const confettiStore = useConfettiStore.getState();

    if (!currentGame) return toast.error('No game selected!', { id: 'no-game' });
    else toast.dismiss('no-game');

    toast.dismiss();
    if (inputStore.input.length <= 0) return toast.error('Enter a word dummy!');
    const word = inputStore.input.join('');

    if (word.length < 4) return toast.error('Too short!');
    else if (word.length > 19) return toast.error('Too long!');

    for (const letter of word) {
      if (!inputStore.keys.includes(letter)) return toast.error('Bad letters!');
    }

    if (!word.includes(inputStore.centerLetter)) return toast.error('Missing center letter!');

    if (get().foundWords.includes(word.toLowerCase())) return toast.error('Already found!');

    const foundGame = get().games.find((game: Game) => game.id === currentGame);

    const foundWord: CorrectWord | undefined = foundGame?.correctWords?.find((correctWord: CorrectWord) => correctWord.word === word.toLowerCase());

    if (foundWord?.isProfane && !sessionStore.profanesAllowed) return toast.error('Profane words are disallowed');

    if (foundWord) {
      let message = '';
      const score = foundWord.points;

      if (foundWord.isPangram) message = 'Pangram!';
      else if (score === 1) message = 'Good!';
      else if (score === 5 || score === 6) message = 'Great!';
      else if (score >= 7) message = 'Awesome!';

      toast.success(`${message} +${foundWord.points}pts`);

      set({
        points: get().points + foundWord.points,
        foundWords: [...get().foundWords, word.toLowerCase()],
      });

      const res = await fetcher('POST', { wholeResponse: true })('api/word/submit', { gameId: currentGame, word, points: foundWord.points });

      if (res?.status !== 200) {
        toast.error('Failed to submit word');
        set({ points: get().points - foundWord.points, foundWords: get().foundWords.filter((foundWord: string) => foundWord !== word.toLowerCase()) });
        return;
      }

      if (get().points >= rankStore.ranksPoints[0].points)
        confettiStore.dropConfetti();
    } else {
      toast.error('Word is incorrect');
    }
  }
}));
