import { useCallback, useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useGlobalStore } from '@/stores/global';

export const useSessionManager = () => {
  const session = useSession();
  const [pid, setPid] = useState<string | undefined>();
  const { setSession, setProfanesAllowed } = useGlobalStore();

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
  }, [session, setSession, setProfanesAllowed]);

  return { session, pid, setPid, handleSession };
};
