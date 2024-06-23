import { useSessionStore } from '@/stores/sessionStore';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

const SessionManager = () => {
  const { setSession, setProfanesAllowed } = useSessionStore();
  const session = useSession();

  const handleSignIn = async () => {
    await signIn('credentials', {
      isGuest: true,
      callbackUrl: '/games',
      redirect: true,
    });
  };

  useEffect(() => {
    setSession(session);

    if (
      session?.status === 'loading' ||
      session?.status === 'unauthenticated'
    ) {
      if (session?.status === 'unauthenticated') {
        handleSignIn();
        toast.loading('Creating guest account...', { id: 'guest' });
      }
      return;
    }
    toast.dismiss('guest');

    setProfanesAllowed(session?.data?.user?.settings?.profanesAllowed || false);
  }, [session]);

  return null;
};

export default SessionManager;
