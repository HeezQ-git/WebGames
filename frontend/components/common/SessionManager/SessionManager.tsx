import { useSessionStore } from '@/stores/sessionStore';
import { signIn } from 'next-auth/react';
import { useEffect } from 'react';

const SessionManager = () => {
  const { session } = useSessionStore();

  const handleSignIn = async () => {
    await signIn('credentials', {
      isGuest: true,
      callbackUrl: '/',
      redirect: true,
    });
  };

  useEffect(() => {
    if (session?.status === 'unauthenticated') handleSignIn();
  }, [session?.status]);
  return null;
};

export default SessionManager;
