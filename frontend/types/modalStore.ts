export type Modals = 'GAMES' | 'NEW_GAME' | 'RANKING' | 'SETTINGS' | 'DANGER' | 'HINTS' | null;

export interface ModalStore {
  openModal: Modals;
  setOpenModal: (openModal: Modals) => void;
}