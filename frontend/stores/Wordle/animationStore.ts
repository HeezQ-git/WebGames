import { create } from 'zustand';

interface AnimationData {
  duration?: number;
  row?: string | number;
  letterIndex?: number;
  continuous?: boolean;
  wholeRow?: boolean;
}

interface AnimationMapItem {
  row?: number | string;
  letterIndex?: number;
  animation?: string;
}

interface AnimationStore {
  animationMap: AnimationMapItem[];
  setAnimationMap: (animationMap: AnimationMapItem[]) => void;
  setAnimation: (animation: string, data?: AnimationData) => void;
}

const updateAnimationMap = (
  animationMap: AnimationMapItem[],
  row?: number | string,
  letterIndex?: number,
  animation?: string
): AnimationMapItem[] => {
  const index = animationMap.findIndex((a) => a.row === row && a.letterIndex === letterIndex);
  if (index === -1) {
    animationMap.push({ row, letterIndex, animation });
  } else {
    animationMap[index] = { row, letterIndex, animation };
  }
  return animationMap;
};

const removeAnimationFromMap = (
  animationMap: AnimationMapItem[],
  row?: number | string,
  letterIndex?: number
): AnimationMapItem[] => {
  if (letterIndex !== undefined) {
    const index = animationMap.findIndex((a) => a.row === row && a.letterIndex === letterIndex);
    if (index !== -1) animationMap.splice(index, 1);
  } else {
    // Remove all animations for the given row
    return animationMap.filter((a) => a.row !== row);
  }
  return animationMap;
};

export const useAnimationStore = create<AnimationStore>((set, get) => ({
  animationMap: [{ row: 0, letterIndex: 0, animation: 'idle' }],
  setAnimationMap: (animationMap) => set({ animationMap }),

  setAnimation: (animation: string, data?: AnimationData) => {
    const { duration, row, letterIndex, continuous, wholeRow } = data || {};
    let newAnimationMap = [...get().animationMap];

    if (wholeRow) {
      for (let i = 0; i < 5; i++) {
        newAnimationMap = updateAnimationMap(newAnimationMap, row, i, animation);
      }
      set({ animationMap: newAnimationMap });

      if (duration && !continuous) {
        setTimeout(() => {
          const updatedMap = removeAnimationFromMap([...get().animationMap], row);
          set({ animationMap: updatedMap });
        }, duration);
      }
    } else if (row !== undefined && letterIndex !== undefined) {
      newAnimationMap = updateAnimationMap(newAnimationMap, row, letterIndex, animation);
      set({ animationMap: newAnimationMap });

      if (duration && !continuous) {
        setTimeout(() => {
          const updatedMap = removeAnimationFromMap([...get().animationMap], row, letterIndex);
          set({ animationMap: updatedMap });
        }, duration);
      }
    }
  }
}));
