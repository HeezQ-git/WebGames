import { ModalStore, Modals } from '@/types/modalStore';
import { create } from 'zustand';

export const useModalStore = create<ModalStore>((set: (o: object) => void) => ({
  openModal: null,
  setOpenModal: (openModal: Modals) => set({ openModal }),
}));