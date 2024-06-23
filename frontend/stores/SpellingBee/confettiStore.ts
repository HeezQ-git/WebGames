import { create } from 'zustand';

interface ConfettiStore {
  confetti: boolean;
  dropConfetti: () => void;
}

export const useConfettiStore = create<ConfettiStore>((set, get) => ({
  confetti: false,
  dropConfetti: () => {
    if (get().confetti) return;
    set({ confetti: true });
    setTimeout(() => set({ confetti: false }), 8000);
  },
}));
