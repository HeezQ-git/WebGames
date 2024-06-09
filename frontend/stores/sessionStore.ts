import { Session } from 'next-auth';
import { create } from 'zustand';

type SessionElement = {
  update: any;
  data: Session;
  status: "authenticated";
} | {
  update: any;
  data: null;
  status: "loading" | "unauthenticated";
} | null;

interface SessionStore {
  session: SessionElement;
  setSession: (session: any) => void;
  profanesAllowed: boolean;
  setProfanesAllowed: (profanesAllowed: boolean) => void;
  invite: string | null;
  setInvite: (invite: string | null) => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
  profanesAllowed: false,
  setProfanesAllowed: (profanesAllowed) => set({ profanesAllowed }),
  invite: null,
  setInvite: (invite) => set({ invite }),
}));
