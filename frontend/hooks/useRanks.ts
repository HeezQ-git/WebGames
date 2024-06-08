import { useMemo, useCallback } from 'react';
import { useGlobalStore } from '@/stores/global';

export const useRanks = () => {
  const { ranks, maximumPoints } = useGlobalStore();

  const ranksPoints = useMemo(() => {
    return ranks.map((rank) => ({
      points: Math.floor((rank.percentage / 100) * maximumPoints),
      index: rank.index,
    }));
  }, [ranks, maximumPoints]);

  const getCurrentRank = useCallback(
    (points: number) => {
      const arePointsZero = points === undefined || points === 0;
      const isSecondRankZero =
        ranksPoints.find((rank) => rank.index === 1)?.points !== 0;

      return arePointsZero && isSecondRankZero
        ? 0
        : ranksPoints.find((rank) => points >= rank.points)?.index || 0;
    },
    [ranksPoints]
  );

  return { ranksPoints, getCurrentRank };
};
