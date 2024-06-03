import { ModalStore } from '@/types/modalStore';
import { create } from 'zustand';

export const useModalStore = create<ModalStore>((set: (o: object) => void) => ({
  isGamesModalOpen: false,
  setIsGamesModalOpen: (isGamesModalOpen: boolean) => set({ isGamesModalOpen }),

  isNewGameModalOpen: false,
  setIsNewGameModalOpen: (isNewGameModalOpen: boolean) => set({ isNewGameModalOpen }),

  isSettingsModalOpen: false,
  setIsSettingsModalOpen: (isSettingsModalOpen: boolean) => set({ isSettingsModalOpen }),
}));