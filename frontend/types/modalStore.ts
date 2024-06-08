export interface ModalStore {
  openModal: string | null;
  setOpenModal: (openModal: string) => void;

  isGamesModalOpen: boolean;
  setIsGamesModalOpen: (isGamesModalOpen: boolean) => void;

  isNewGameModalOpen: boolean;
  setIsNewGameModalOpen: (isNewGameModalOpen: boolean) => void;

  isSettingsModalOpen: boolean;
  setIsSettingsModalOpen: (isSettingsModalOpen: boolean) => void;

  isDangerModalOpen: boolean;
  setIsDangerModalOpen: (isDangerModalOpen: boolean) => void;
}