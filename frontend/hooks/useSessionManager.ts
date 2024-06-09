import { useCallback, useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useSessionStore } from '@/stores/sessionStore';

export const useSessionManager = () => {
  const session = useSession();
  const [pid, setPid] = useState<string | undefined>();
  const { setSession, setProfanesAllowed } = useSessionStore();

  const handleSession = useCallback(() => {
    setSession(session);

    if (
      session?.status === 'loading' ||
      session?.status === 'unauthenticated'
    ) {
      if (session?.status === 'unauthenticated') {
        toast.loading('Creating guest account...', { id: 'guest' });
      }
      return;
    }
    toast.dismiss('guest');
    setProfanesAllowed(session?.data?.user?.settings?.profanesAllowed || false);
  }, [session]);

  return { session, pid, setPid, handleSession };
};
