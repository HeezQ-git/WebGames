import { EditableElement, SettingsStore } from '@/types/settingsStore';
import { create } from 'zustand';

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