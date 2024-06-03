import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';

const SessionManager = () => {
  const { status, data } = useSession();

  const handleSignIn = async () => {
    await signIn('credentials', {
      isGuest: true,
      callbackUrl: '/',
      redirect: true,
    });
  };

  useEffect(() => {
    if (status === 'unauthenticated') handleSignIn();
  }, [status]);
  return null;
};

export default SessionManager;
