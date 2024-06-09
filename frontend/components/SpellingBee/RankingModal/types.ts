import { Modals } from "@/stores/modalStore";

export interface Rank {
  index: number;
  name: string;
}

export interface RanksPoints {
  index: number;
  points: number;
}

export interface RankingModalProps {
  open: boolean;
  setOpen: (open: Modals) => void;
}

export interface CurrentRankItemProps {
  rank: Rank;
  points: number;
  nextRankPoints: number;
  geniusPoints: number;
  currentRankPoints: number;
}

export interface RankItemProps {
  rank: Rank;
  points: number;
  currentRankPoints: number;
}
