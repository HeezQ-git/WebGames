import { create } from 'zustand';

export type Modals = 'GAMES' | 'NEW_GAME' | 'RANKING' | 'SETTINGS' | 'DANGER' | 'HINTS' | 'STATS' | null;

interface ModalStore {
  openModal: Modals;
  setOpenModal: (openModal: Modals) => void;
}

export const useModalStore = create<ModalStore>((set: (o: object) => void) => ({
  openModal: null,
  setOpenModal: (openModal: Modals) => set({ openModal }),
}));