import { create } from 'zustand';

interface Rank {
  name: string;
  percentage: number;
  index: number;
}

interface RanksPoints {
  points: number;
  index: number;
}

interface RankStore {
  currentRank: number;
  setCurrentRank: (currentRank: number) => void;
  ranks: Rank[];
  ranksPoints: RanksPoints[];
  setRanksPoints: (ranksPoints: RanksPoints[]) => void;
}

export const useRankStore = create<RankStore>((set) => ({
  currentRank: 0,
  setCurrentRank: (currentRank) => set({ currentRank }),
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
  setRanksPoints: (ranksPoints) => set({ ranksPoints }),
}));
