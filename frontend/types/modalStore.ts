export interface ModalStore {
  isGamesModalOpen: boolean;
  setIsGamesModalOpen: (isGamesModalOpen: boolean) => void;

  isNewGameModalOpen: boolean;
  setIsNewGameModalOpen: (isNewGameModalOpen: boolean) => void;
}