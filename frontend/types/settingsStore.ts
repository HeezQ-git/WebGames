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

  sessionStatus: string;
  setSessionStatus: (status: string) => void;

  checkingUsername: boolean;
  setCheckingUsername: (checking: boolean) => void;

  form: any;
  setForm: (form: any) => void;
}