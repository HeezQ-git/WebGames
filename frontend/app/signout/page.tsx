'use client';
import Loading from '@/components/common/Loading/Loading';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const page = () => {
  const { data, status } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    if (status !== 'authenticated' || !data) return router.push('/');

    await signOut();
  };

  useEffect(() => {
    handleSignOut();
  }, [data, status]);

  return <Loading label="Signing out" />;
};

export default page;
