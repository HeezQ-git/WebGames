import { create } from 'zustand';

export interface FormValues {
  username?: string | null;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export type EditableElement = 'username' | 'password' | null;

export interface SettingsStore {
  editingElement: EditableElement;
  setEditingElement: (element: EditableElement) => void;

  checkingUsername: boolean;
  setCheckingUsername: (checking: boolean) => void;

  form: any;
  setForm: (form: any) => void;

  dangerAction: string;
  setDangerAction: (action: string) => void;
}

export const useSettingsStore = create<SettingsStore>((set: (o: object) => void) => ({
  editingElement: null,
  setEditingElement: (element: EditableElement) => set({ editingElement: element }),

  checkingUsername: false,
  setCheckingUsername: (checking: boolean) => set({ checkingUsername: checking }),

  form: null,
  setForm: (form: any) => set({ form }),

  dangerAction: '',
  setDangerAction: (action: string) => set({ dangerAction: action }),
}));