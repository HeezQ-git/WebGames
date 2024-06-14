import { create } from 'zustand';

interface AnimationStore {
  animation: string;
  setAnimation: (newAnimation: string) => void;
}

export const useAnimationStore = create<AnimationStore>((set, get) => ({
  animation: 'idle',
  setAnimation: (newAnimation) => set({ animation: newAnimation }),
}));
